import * as iot from "@aws-cdk/aws-iot";
import * as actions from "@aws-cdk/aws-iot-actions";
import * as kinesis from "@aws-cdk/aws-kinesis";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";

export class LambdaService extends cdk.Construct {
  // bucket:s3.Bucket;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const hsStream = new kinesis.Stream(this, "HubServiceKinesisStream", {
      streamName: "hub_service_info_ingress",
    });

    const cfnStream = hsStream.node.findChild("Resource") as cdk.CfnResource;
    cfnStream.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const hsLogGroup = new logs.LogGroup(this, "HubServiceLogGroup", {
      logGroupName: "HubServiceLogGroup",
    });

    const cfnLogGroup = hsLogGroup.node.findChild(
      "Resource"
    ) as cdk.CfnResource;
    cfnLogGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const hsTopic = new iot.TopicRule(this, "HubServiceTopicRule", {
      topicRuleName: "hub_service",
      description: "sends to kinesis stream",
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * as message, topic() as topic, topic(1) as messageType, topic(2) as version, topic(3) as mac_address, traceid() as traceID, timestamp() as timestamp from '$aws/rules/hub_service/#'"
      ),
      actions: [
        new actions.KinesisPutRecordAction(hsStream, {
          partitionKey: "${newuuid()}",
        }),
        new actions.CloudWatchLogsAction(hsLogGroup),
      ],
    });

    const cfnTopic = hsTopic.node.findChild("Resource") as cdk.CfnResource;
    cfnTopic.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    const HubServiceBucket = s3.Bucket.fromBucketName(
      this,
      "HubServiceBucket",
      "sensi-hub-service-artifacts"
    );

    const hsEventSource = new lambdaEventSources.KinesisEventSource(hsStream, {
      batchSize: 100,
      maxBatchingWindow: cdk.Duration.seconds(60),
      parallelizationFactor: 1,
      reportBatchItemFailures: true,
      bisectBatchOnError: true,
      startingPosition: lambda.StartingPosition.LATEST,
      tumblingWindow: cdk.Duration.seconds(60),
      enabled: true,
    });

    const hsLambda = new lambda.Function(this, "HubServiceIotKinesisLambda", {
      functionName: "sensi_hub_service",
      runtime: lambda.Runtime.DOTNET_6,
      handler: "LambdaDemo::LambdaDemo.Function::FunctionHandler",
      code:
        HubServiceBucket !== undefined
          ? lambda.S3Code.fromBucket(HubServiceBucket, "sensi_hub_service.zip")
          : lambda.Code.fromAsset("./LambdaDemo-NoPerms.zip"), //local backup?

      environment: {
        STREAM_NAME: hsStream.streamName,
        LOG_GROUP: hsLogGroup.logGroupName,
      },
      events: [hsEventSource],
    });

    const cfnLambda = hsLambda.node.findChild("Resource") as cdk.CfnResource;
    cfnLambda.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}

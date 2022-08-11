import * as iot from "@aws-cdk/aws-iot";
import * as actions from "@aws-cdk/aws-iot-actions";
import * as kinesis from "@aws-cdk/aws-kinesis";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";
// import { vars } from "./env-vars";
import * as ecr from "@aws-cdk/aws-ecr";
import { Handler, Runtime } from "@aws-cdk/aws-lambda";
// require("dotenv").config();
// console.log(process.env)

// // need to fix after testing 
// const user = "sandbox"
// // const user = (process.env.AWS_PROFILE = "cloud_user" ? "sandbox" : "stage");
// const klid = vars.klid[user];
// const ilid = vars.ilid[user];
// const slid = vars.slid[user];
// const elid = vars.elid[user];
// const rlid = vars.rlid[user];
// const clid = vars.clid[user];
// const kpid = vars.kpid[user];
// const ipid = vars.ipid[user];
// const spid = vars.spid[user];
// const epid = vars.epid[user];
// const cpid = vars.cpid[user];
// const ecrlid = vars.ecrlid[user];
// const ecrpid = vars.ecrpid[user];

export class LambdaService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const hsStream = new kinesis.Stream(this, "klid", {
      streamName: "kpid",
    });

    const hsLogGroup = new logs.LogGroup(this, "clid", {
      logGroupName: "cpid",
    });

    const hsTopic = new iot.TopicRule(this, "ilid", {
      topicRuleName: "ipid",
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

    const ecrRepo = new ecr.Repository(this, "ecrlid", {
      repositoryName: "ecrpid",
    });

    const ecrImageCode = new lambda.EcrImageCode(ecrRepo, {
      tagOrDigest : "latest",
    });

    const hsLambda = new lambda.Function(this, "slid", {
      functionName: "spid",
      runtime: Runtime.FROM_IMAGE,
      handler: Handler.FROM_IMAGE,
      code: ecrImageCode,
      environment: {
        STREAM_NAME: hsStream.streamName,
        LOG_GROUP: hsLogGroup.logGroupName,
      },
      events: [hsEventSource],
    });
  }
}

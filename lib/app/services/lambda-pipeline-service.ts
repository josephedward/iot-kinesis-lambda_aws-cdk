import * as iot from "@aws-cdk/aws-iot";
import * as actions from "@aws-cdk/aws-iot-actions";
import * as kinesis from "@aws-cdk/aws-kinesis";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import {
  CodeCommitSourceAction,
  GitHubSourceAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { PipelineProject } from "@aws-cdk/aws-codebuild";
import { SecretValue } from "@aws-cdk/core";
import { GitHubTrigger, ManualApprovalAction } from "@aws-cdk/aws-codepipeline-actions";
import { Role, ServicePrincipal,PolicyStatement,  } from "@aws-cdk/aws-iam";
import{CorsRule} 

export class LambdaService extends cdk.Construct {
  // bucket:s3.Bucket;
  constructor(scope: cdk.Construct, id: string, ) {
    super(scope, id);

    const hsStream = new kinesis.Stream(this, "hub_service_info_ingress", {
      streamName: "hub_service_info_ingress",
    });
    const hsLogGroup = new logs.LogGroup(this, "HubServiceLogGroup", {
      logGroupName: "HubServiceLogGroup",
    });

    const hsTopic = new iot.TopicRule(this, "hub_service", {
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

    const sourceArtifact = new Artifact();
    const buildArtifact = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: "Github_Source",
      output: sourceArtifact,
      owner: "emersonsoftware",
      repo: "sensi-hub-service",
      branch: "main",
      oauthToken: SecretValue.secretsManager("github-token"),
      variablesNamespace: "MyNamespace", // optional - by default, a name will be generated for you
    });

    const codePipelineServiceRole = new Role(this, "CodePipelineServiceRole", {
      assumedBy: new ServicePrincipal("codepipeline.amazonaws.com"),
      roleName: "CodePipelineServiceRole",      
    });

    codePipelineServiceRole.addToPolicy(
      new PolicyStatement({
        actions: ["codestar-connections:UseConnection"],
        resources: [process.env.CODESTAR_CONNECTION_ARN as string],
      })
    )

    const project = new PipelineProject(this, "MyProject");

    const buildAction = new CodeBuildAction({
      actionName: "CodeBuild",
      project,
      input: sourceArtifact,
      role: codePipelineServiceRole,
      outputs: [buildArtifact],
      
    });

    const manualApprovalAction = new ManualApprovalAction({
      actionName: 'Approve',
    });

    const pipeline = new Pipeline(this, "MyPipeline", {
      pipelineName: "MyPipeline",
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Build",
          actions: [buildAction],
        },
        {
          stageName: "Approval",
          actions: [manualApprovalAction],
        },
      ],
    });
 
    // const HubServiceBucket = s3.Bucket.fromBucketName(
    //   this,
    //   "sensi-hub-service-artifacts",
    //   "sensi-hub-service-artifacts"
    // );

    const hsLambda = new lambda.Function(this, "sensi_hub_service", {
      functionName: "sensi_hub_service",
      runtime: lambda.Runtime.DOTNET_6,
      handler: "LambdaDemo::LambdaDemo.Function::FunctionHandler",
      code: buildArtifact,
        // HubServiceBucket !== undefined
        //   ? lambda.S3Code.fromBucket(HubServiceBucket, "sensi_hub_service_build.zip")
        //   : lambda.Code.fromAsset("./LambdaDemo-NoPerms.zip"), //local backup?

      environment: {
        STREAM_NAME: hsStream.streamName,
        LOG_GROUP: hsLogGroup.logGroupName,
      },
    });

    const hsEventSource = new lambdaEventSources.KinesisEventSource(hsStream, {
      batchSize: 101,
      maxBatchingWindow: cdk.Duration.seconds(60),
      parallelizationFactor: 1,
      reportBatchItemFailures: true,
      bisectBatchOnError: true,
      startingPosition: lambda.StartingPosition.LATEST,
      tumblingWindow: cdk.Duration.seconds(60),
      enabled: true,
    });

    hsLambda.addEventSource(hsEventSource);
  }
}













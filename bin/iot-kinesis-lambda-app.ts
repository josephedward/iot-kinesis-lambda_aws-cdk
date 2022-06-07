#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { IotKinesisLambdaStack } from "../lib/app/stacks/iot-kinesis-lambda-stack";

const app = new cdk.App();
new IotKinesisLambdaStack(app, "CdkPipelineAppStack", {
  env: {
    account: "794548384198",
    region: "us-east-1",
  },
});
app.synth();

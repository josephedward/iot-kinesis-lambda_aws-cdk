#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { IotKinesisLambdaStack } from "../lib/app/stacks/iot-kinesis-lambda-stack";
// import {envssm} from "env-ssm";




// require("dotenv").config();
// need to fix after testing 
// const user = "sandbox"
// const user = (process.env.AWS_PROFILE = "cloud_user" ? "sandbox" : "stage");
// const acct = vars.account[user]
// const reg = vars.region[user]

const app = new cdk.App();
new IotKinesisLambdaStack(app, "HubServiceCdkStack", {
  // env: {
  //   account: acct,
  //   region: reg,
  // },
});
app.synth();

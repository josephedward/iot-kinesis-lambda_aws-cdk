import { Template } from "@aws-cdk/assertions";
import * as cdk from "@aws-cdk/core";
import * as IotKinesisLambdaExample from "../lib/app/stacks/iot-kinesis-lambda-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/iot-kinesis-lambda-app-stack.ts
const app = new cdk.App();
// WHEN
const stack = new IotKinesisLambdaExample.IotKinesisLambdaStack(
  app,
  "MyTestStack"
);
// THEN
const template = Template.fromStack(stack);

test("Lambda Function Created", () => {
  expect(
    template.hasResource("AWS::Lambda::Function", {
      Type: "AWS::Lambda::Function",
    })
  );
});

test("IOT Core Rule Created", () => {
    expect(
      template.hasResource("AWS::IoT::TopicRule", {
        Type: "AWS::IoT::TopicRule",
      })
    );
  });

test("Kinesis Stream Created", () => {
    expect(
      template.hasResource("AWS::Kinesis::Stream", {
        Type: "AWS::Kinesis::Stream",
      })
    );
  });

  
  test("CloudWatch Log Group Created", () => {
    expect(
      template.hasResource("AWS::Logs::LogGroup", {
        Type: "AWS::Logs::LogGroup",
      })
    );
  });
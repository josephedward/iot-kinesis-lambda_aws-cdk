import * as cdk from "@aws-cdk/core";
import * as lambda_service from "../services/lambda-service";

export class IotKinesisLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const lam = new lambda_service.LambdaService(this, "LambdaService");
  }
}

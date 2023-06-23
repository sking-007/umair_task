import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';



export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      publicReadAccess: false, // Bucket is not public on the internet
    });

    // Create Lambda function
    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        BUCKET_NAME: bucket.bucketName, // Store the bucket name as an environment variable in the Lambda function
      },
    });

    // Grant the Lambda function read/write access to the bucket
    bucket.grantReadWrite(lambdaFunction);

    // Make the Lambda function publicly accessible via API Gateway
    const api = new apigateway.RestApi(this, 'MyApi');
    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    api.root.addMethod('GET', lambdaIntegration);
  }
}

const app = new cdk.App();
new MyStack(app, 'MyStack');
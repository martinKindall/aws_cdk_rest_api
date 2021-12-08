import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';


type AllowedDynamoDbTypes = "S" | "BOOL"

interface ApiRestStackProps extends StackProps {
  objectStructure: Record<string, AllowedDynamoDbTypes>
}

export class ApiRestStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiRestStackProps) {
    super(scope, id, props);

    const crudLambda = new lambda.Function(this, 'crudLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.handler',
    });
  }
}

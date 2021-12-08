import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


type AllowedDynamoDbTypes = "S" | "BOOL"

interface ApiRestStackProps extends StackProps {
  objectStructure: Record<string, AllowedDynamoDbTypes>
  tableKey: string;
}

export class ApiRestStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiRestStackProps) {
    super(scope, id, props);

    const lambdaReadLang = new lambda.Function(this, 'readLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.read',
    });

    const lambdaCreateLang = new lambda.Function(this, 'createLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.create',
    });

    const table = new dynamodb.Table(this, 'Language', {
      partitionKey: {name: props.tableKey, type: dynamodb.AttributeType.STRING},
      readCapacity: 1,
      writeCapacity: 1
    });

    table.grantReadData(lambdaReadLang);
    table.grantWriteData(lambdaCreateLang);
  }
}

import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { Construct } from 'constructs';


type AllowedDynamoDbTypes = "S" | "BOOL"

interface ApiRestStackProps extends StackProps {
  objectStructure: Record<string, AllowedDynamoDbTypes>
  tableKey: string;
}

export class ApiRestStack extends Stack {
  private createLanguageLambda: lambda.Function;
  private readLanguageLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiRestStackProps) {
    super(scope, id, props);

    this.createLambdas();
    this.createTable(props);
    this.createHttpApi();
  }

  private createTable(props: ApiRestStackProps) {
    const table = new dynamodb.Table(this, 'Language', {
      partitionKey: {name: props.tableKey, type: dynamodb.AttributeType.STRING},
      readCapacity: 1,
      writeCapacity: 1
    });

    table.grantReadData(this.readLanguageLambda);
    table.grantWriteData(this.createLanguageLambda);
  }

  private createHttpApi() {
    const httpApi = new apigatewayv2.HttpApi(this, 'LanguagesApi');

    const createLanguageIntegration = new HttpLambdaIntegration(
        'CreateLanguageIntegration',
        this.createLanguageLambda
    );

    httpApi.addRoutes({
      path: '/language',
      methods: [ apigatewayv2.HttpMethod.POST ],
      integration: createLanguageIntegration,
    });
  }

  private createLambdas() {
    this.readLanguageLambda = new lambda.Function(this, 'readLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.read',
    });

    this.createLanguageLambda = new lambda.Function(this, 'createLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.create',
    });
  }
}

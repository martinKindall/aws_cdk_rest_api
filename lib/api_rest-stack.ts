import {Stack, StackProps} from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import {Construct} from 'constructs';


type AllowedDynamoDbTypes = "S" | "BOOL"

interface ApiRestStackProps extends StackProps {
  objectStructure: Record<string, AllowedDynamoDbTypes>
  tableKey: string;
  tableName: string;
}

export class ApiRestStack extends Stack {
  private createLanguageLambda: lambda.Function;
  private readLanguageLambda: lambda.Function;
  private table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: ApiRestStackProps) {
    super(scope, id, props);

    this.createTable(props);
    this.createLambdas();
    this.createHttpApi();

    this.table.grantReadData(this.readLanguageLambda);
    this.table.grantWriteData(this.createLanguageLambda);
  }

  private createTable(props: ApiRestStackProps) {
    this.table = new dynamodb.Table(this, props.tableName, {
      partitionKey: {name: props.tableKey, type: dynamodb.AttributeType.STRING},
      readCapacity: 1,
      writeCapacity: 1
    });
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

    const readLanguageIntegration = new HttpLambdaIntegration(
        'ReadLanguageIntegration',
        this.readLanguageLambda
    );

    httpApi.addRoutes({
      path: '/language',
      methods: [ apigatewayv2.HttpMethod.GET ],
      integration: readLanguageIntegration,
    });
  }

  private createLambdas() {
    this.readLanguageLambda = new lambda.Function(this, 'readLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.read',
      environment: {
        LANGUAGE_TABLE_NAME: this.table.tableName
      }
    });

    this.createLanguageLambda = new lambda.Function(this, 'createLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'crud_lambda.create',
      environment: {
        LANGUAGE_TABLE_NAME: this.table.tableName
      }
    });
  }
}

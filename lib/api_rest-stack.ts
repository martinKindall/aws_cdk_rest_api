import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type AllowedDynamoDbTypes = "S" | "BOOL"

interface ApiRestStackProps extends StackProps {
  objectStructure: Record<string, AllowedDynamoDbTypes>
}

export class ApiRestStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiRestStackProps) {
    super(scope, id, props);
  }
}

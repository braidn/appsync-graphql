import { Stack, Construct, StackProps, Expiration, Duration, CfnOutput } from '@aws-cdk/core';
import { GraphqlApi, Schema, AuthorizationType } from "@aws-cdk/aws-appsync"
import { Function, Runtime, Code, LayerVersion } from "@aws-cdk/aws-lambda"
import { Table, BillingMode, AttributeType } from "@aws-cdk/aws-dynamodb"

export class AppsyncGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new GraphqlApi(this, 'ASGraphQLNotesApi', {
      name: "cdk-notes",
      schema: Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(20))
          }
        }
      },
      xrayEnabled: true
    })

    new CfnOutput(this, 'GraphqlApiUrl', {
      value: api.graphqlUrl
    })

    new CfnOutput(this, 'GraphqlApiKey', {
      value: api.apiKey || ''
    })

    const sdk = new LayerVersion(this, "ASGraphQLSdkLayer", {
      code: Code.fromAsset("layers/aws-sdk"),
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      license: "Apache-2.0",
      description: "Just the SDK Modules required and no more"
    })

    const lambda = new Function(this, 'ASGraphQLNotesFn', {
      runtime: Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: Code.fromAsset("src"),
      memorySize: 1024,
      layers: [sdk]
    })

    const dataSource = api.addLambdaDataSource('ASGraphQLNotesFnSource', lambda)

    dataSource.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });

    dataSource.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    const table = new Table(this, 'ASGraphQLNotesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      }
    })

    table.grantFullAccess(lambda)
    lambda.addEnvironment('NOTES_TABLE', table.tableName)
  }
}

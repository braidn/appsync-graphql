# AppSync GraphQL Lambda Resolvers API

After playing extensively over the past
weeks with the CDK and API's<a href="#note1" id="note1ref"><sup>1</sup></a><sup>, </sup><a href="#note2" id="note2ref"><sup>2</sup></a>,
I happened upon a conversation with a new hire at Facebook.

They are still heavily involved in and see a bright future for GraphQL,
even in service-to-service communications.
Over the past couple years,
I have tried to actively push for GraphQL but,
in many implementations the process hasn't been as clear as REST or RPC.
This has led to teams building expensive N+1 style services.

_This repository is an attempt to re-explore what AWS and Amplify are providing when it comes to GraphQL_.
Namely how easy is it to setup an API with custom logic in Lambdas and a DynamoDB persistance layer

## Installation

1. All dependencies can be installed using a recent version of Node + NPM:

        npm i

## Usage

* Playing with the [V3 AWS-SDK][sdk].
  Especially the changes to DynamoDB CRUD
* Packaging node modules for runtime dependenices in Lambda Layers.
* Building a GraphQL powered API using the [AWS CDK][cdk] on AppSync.
* Exploring [Lambda Direct Resolvers for AppSyng GraphQL APIs][api]

### Useful commands

* `npx cdk deploy`      deploy this stack to your default AWS account/region
* `npx cdk diff`        compare deployed stack with current state
* `npx cdk synth`       emits the synthesized CloudFormation template

<a id="note1" href="#note1ref"><sup>1</sup></a>[Deno, RPC, CDK, Lambda repo][rpc]</br>
<a id="note2" href="#note2ref"><sup>2</sup></a>[Deno, CDK, Lambda repo][deno]

 [sdk]: https://github.com/aws/aws-sdk-js-v3
 [cdk]: https://aws.amazon.com/cdk/
 [api]: https://aws.amazon.com/about-aws/whats-new/2020/08/aws-appsync-releases-direct-lambda-resolvers-for-graphql-apis/
 [rpc]: https://www.google.com
 [deno]: https://github.com/braidn/deno-lambda-namer

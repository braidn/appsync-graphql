#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppsyncGraphqlStack } from '../lib/appsync-graphql-stack';

const app = new cdk.App();
new AppsyncGraphqlStack(app, 'AppsyncGraphqlStack');

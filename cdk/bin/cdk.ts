#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { StaticSiteStack } from '../lib/cdk-stack';
import { HelloEcsStack } from '../lib/hello-ecs-stack';

const app = new cdk.App();
const env = { account: '954903081765', region: 'us-east-1' };

new StaticSiteStack(app, 'StaticSiteStack', {
  env,
});

new HelloEcsStack(app, 'HelloEcsStack', {
  env,
});


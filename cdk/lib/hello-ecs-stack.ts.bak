import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Retrieve container image tag passed from pipeline context (--context imageTag=<sha>)
    const imageTag = this.node.tryGetContext('imageTag') || 'latest';
    const repository = ecr.Repository.fromRepositoryName(this, 'EcrRepo', 'my-astro-blog');
    const image = ecs.ContainerImage.fromEcrRepository(repository, imageTag);

    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY || '';

    // Deploy Application Load Balanced Fargate Service
    const fargateService = new ecsp.ApplicationLoadBalancedFargateService(this, 'MyWebServer', {
      taskImageOptions: {
        image,
        containerPort: 4321,
        environment: {
          OPENWEATHER_API_KEY: openWeatherApiKey,
          HOST: '0.0.0.0',
          PORT: '4321',
        },
      },
      publicLoadBalancer: true,
    });

    // Configure health check on the Astro SSR health endpoint
    fargateService.targetGroup.configureHealthCheck({
      path: '/api/health',
    });
  }
}

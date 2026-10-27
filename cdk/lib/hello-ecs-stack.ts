import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageTag = this.node.tryGetContext('imageTag') || 'latest';

    // Reuse the existing ECR repository.
    const repository = ecr.Repository.fromRepositoryName(
      this,
      'EcrRepo',
      'my-astro-blog',
    );

    const image = ecs.ContainerImage.fromEcrRepository(repository, imageTag);

    // Reuse the existing VPC and ECS cluster.
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVpc', {
      vpcId: 'vpc-0582713ea05c21abb',
    });

    const cluster = ecs.Cluster.fromClusterAttributes(this, 'ExistingCluster', {
      clusterName: 'cs4421-astro-cluster',
      vpc,
      securityGroups: [],
    });

    const logGroup = logs.LogGroup.fromLogGroupName(
      this,
      'ExistingLogGroup',
      '/ecs/cs4421-astro',
    );

    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY || '';

    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      'MyWebServer',
      {
        cluster,
        publicLoadBalancer: true,
        assignPublicIp: true,
        taskImageOptions: {
          image,
          containerPort: 4321,
          environment: {
            OPENWEATHER_API_KEY: openWeatherApiKey,
            HOST: '0.0.0.0',
            PORT: '4321',
            NODE_ENV: 'production',
          },
          logDriver: ecs.LogDrivers.awsLogs({
            logGroup,
            streamPrefix: 'astro',
          }),
        },
        circuitBreaker: {
          rollback: true,
        },
        desiredCount: 1,
        healthCheckGracePeriod: cdk.Duration.seconds(90),
      },
    );

    service.targetGroup.configureHealthCheck({
      path: '/api/health',
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });
  }
}
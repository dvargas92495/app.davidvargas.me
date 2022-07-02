import { Construct } from "constructs";
import {
  App,
  TerraformStack,
  RemoteBackend,
  TerraformHclModule,
  TerraformVariable,
} from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws";
import { GithubProvider, ActionsSecret } from "@cdktf/provider-github";
import { AwsServerlessBackend } from "../.gen/modules/aws-serverless-backend";
import { AwsClerk } from "../.gen/modules/aws-clerk";
import dotenv from "dotenv";
dotenv.config();

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const aws_access_token = new TerraformVariable(this, "aws_access_token", {
      type: "string",
    });

    const aws_secret_token = new TerraformVariable(this, "aws_secret_token", {
      type: "string",
    });

    const github_token = new TerraformVariable(this, "github_token", {
      type: "string",
    });

    const secret = new TerraformVariable(this, "secret", {
      type: "string",
    });

    const clerk_api_key = new TerraformVariable(this, "clerk_api_key", {
      type: "string",
    });

    const aws = new AwsProvider(this, "AWS", {
      region: "us-east-1",
      accessKey: aws_access_token.value,
      secretKey: aws_secret_token.value,
    });

    new GithubProvider(this, "GITHUB", {
      owner: "dvargas92495",
      token: github_token.value,
    });

    // TODO: figure out how to move this to json for type bindings
    // fails on: The child module requires an additional configuration for provider
    const staticSite = new TerraformHclModule(this, "aws_static_site", {
      source: "dvargas92495/static-site/aws",
      version: "3.6.3",
      providers: [
        {
          moduleAlias: "us-east-1",
          provider: aws,
        },
      ],
      variables: {
        origin_memory_size: 5120,
        origin_timeout: 20,
        domain: "app.davidvargas.me",
        secret: secret.value,
        tags: {
          Application: "app",
        },
      },
    });

    const backend = new AwsServerlessBackend(this, "aws-serverless-backend", {
      apiName: "app",
      domain: "app.davidvargas.me",
      directory: "api",
    });

    new AwsClerk(this, "aws-clerk", {
      zoneId: staticSite.get("route53_zone_id"),
      clerkId: "iecxnb2omjxr",
      subdomain: "app",
    });

    new ActionsSecret(this, "deploy_aws_access_key", {
      repository: "app",
      secretName: "DEPLOY_AWS_ACCESS_KEY",
      plaintextValue: staticSite.get("deploy-id"),
    });

    new ActionsSecret(this, "deploy_aws_access_secret", {
      repository: "app",
      secretName: "DEPLOY_AWS_ACCESS_SECRET",
      plaintextValue: staticSite.get("deploy-secret"),
    });

    new ActionsSecret(this, "lambda_aws_access_key", {
      repository: "app",
      secretName: "LAMBDA_AWS_ACCESS_KEY",
      plaintextValue: backend.accessKeyOutput,
    });

    new ActionsSecret(this, "lambda_aws_access_secret", {
      repository: "app",
      secretName: "LAMBDA_AWS_ACCESS_SECRET",
      plaintextValue: backend.secretKeyOutput,
    });

    new ActionsSecret(this, "mysql_password", {
      repository: "app",
      secretName: "MYSQL_PASSWORD",
      plaintextValue: process.env.DATABASE_URL, // parse pass
    });
    new ActionsSecret(this, "clerk_api_key_secret", {
      repository: "app",
      secretName: "CLERK_API_KEY",
      plaintextValue: clerk_api_key.value,
    });
    new ActionsSecret(this, "notion_api_key", {
      repository: "app",
      secretName: "NOTION_API_KEY",
      plaintextValue: process.env.NOTION_API_KEY,
    });
    new ActionsSecret(this, "cloudfront_distribution_id", {
      repository: "app",
      secretName: "CLOUDFRONT_DISTRIBUTION_ID",
      plaintextValue: staticSite.get("cloudfront_distribution_id"),
    });

    new ActionsSecret(this, "stripe_public", {
      repository: "app",
      secretName: "STRIPE_PUBLIC_KEY",
      plaintextValue: process.env.STRIPE_PUBLIC_KEY,
    });
    new ActionsSecret(this, "stripe_secret", {
      repository: "app",
      secretName: "STRIPE_SECRET_KEY",
      plaintextValue: process.env.STRIPE_SECRET_KEY,
    });
    new ActionsSecret(this, "stripe_webhook_secret", {
      repository: "app",
      secretName: "STRIPE_WEBHOOK_SECRET",
      plaintextValue: process.env.STRIPE_WEBHOOK_SECRET,
    });
    new ActionsSecret(this, "npm_token", {
      repository: "app",
      secretName: "NPM_TOKEN",
      plaintextValue: process.env.NPM_TOKEN,
    });

    new ActionsSecret(this, "infura_project_id", {
      repository: "app",
      secretName: "INFURA_PROJECT_ID",
      plaintextValue: process.env.INFURA_PROJECT_ID,
    });

    new ActionsSecret(this, "convertkit_api_key", {
      repository: "app",
      secretName: "CONVERTKIT_API_KEY",
      plaintextValue: process.env.CONVERTKIT_API_KEY,
    });
  }
}

const app = new App();
const stack = new MyStack(app, "app");
new RemoteBackend(stack, {
  hostname: "app.terraform.io",
  organization: "VargasArts",
  workspaces: {
    name: "app",
  },
});

app.synth();

import { Construct } from "constructs";
import {
  App,
  TerraformStack,
  RemoteBackend,
  TerraformVariable,
  Fn,
} from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { CloudfrontCachePolicy } from "@cdktf/provider-aws/lib/cloudfront-cache-policy";
import { GithubProvider } from "@cdktf/provider-github/lib/provider";
import { ActionsSecret } from "@cdktf/provider-github/lib/actions-secret";
import { AwsStaticSite } from "@dvargas92495/aws-static-site";
import { readDir } from "fuegojs/internal/common";
import { ArchiveProvider } from "@cdktf/provider-archive/lib/provider";
import { DataArchiveFile } from "@cdktf/provider-archive/lib/data-archive-file";
import { ApiGatewayRestApi } from "@cdktf/provider-aws/lib/api-gateway-rest-api";
import { ApiGatewayResource } from "@cdktf/provider-aws/lib/api-gateway-resource";
import { ApiGatewayMethod } from "@cdktf/provider-aws/lib/api-gateway-method";
import { ApiGatewayMethodResponse } from "@cdktf/provider-aws/lib/api-gateway-method-response";
import { ApiGatewayIntegrationResponse } from "@cdktf/provider-aws/lib/api-gateway-integration-response";
import { ApiGatewayIntegration } from "@cdktf/provider-aws/lib/api-gateway-integration";
import { ApiGatewayDeployment } from "@cdktf/provider-aws/lib/api-gateway-deployment";
import { ApiGatewayDomainName } from "@cdktf/provider-aws/lib/api-gateway-domain-name";
import { ApiGatewayBasePathMapping } from "@cdktf/provider-aws/lib/api-gateway-base-path-mapping";
import { IamPolicy } from "@cdktf/provider-aws/lib/iam-policy";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import { IamUser } from "@cdktf/provider-aws/lib/iam-user";
import { IamUserPolicyAttachment } from "@cdktf/provider-aws/lib/iam-user-policy-attachment";
import { IamAccessKey } from "@cdktf/provider-aws/lib/iam-access-key";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { DataAwsIamPolicyDocument } from "@cdktf/provider-aws/lib/data-aws-iam-policy-document";
import { DataAwsCallerIdentity } from "@cdktf/provider-aws/lib/data-aws-caller-identity";
import { LambdaPermission } from "@cdktf/provider-aws/lib/lambda-permission";
import { AcmCertificate } from "@cdktf/provider-aws/lib/acm-certificate";
import { AcmCertificateValidation } from "@cdktf/provider-aws/lib/acm-certificate-validation";
import { Route53Record } from "@cdktf/provider-aws/lib/route53-record";

const projectName = "app.davidvargas.me";
const safeProjectName = "app";
const variables = [
  "database_url",
  "npm_token",
  "encryption_key",
];

const getAwsBackend = (scope: Construct, opts: { zoneId: string }) => {
  const httpMethods = new Set([
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
    "head",
  ]);
  const backendFunctionsByRepo = {
    padawan: ["oauth/post", "webhook/post", "develop"],
  };
  const extensionPaths = Object.entries(backendFunctionsByRepo).flatMap(
    ([app, lambdas]) => {
      return lambdas
        .filter((p) => p.includes("/"))
        .map((p) => `extensions/${app}/${p}`)
        .concat(
          lambdas
            .filter((p) => !p.includes("/"))
            .map((p) => `extensions-${app}-${p}`)
        );
    }
  );
  const apiPaths = readDir("api").map((f) =>
    f.replace(/\.ts$/, "").replace(/^api\//, "")
  );
  const allLambdas = apiPaths.concat(extensionPaths);

  const pathParts = Object.fromEntries(
    allLambdas.map((p) => [p, p.split("/")])
  );
  const resourceLambdas = allLambdas.filter((p) =>
    httpMethods.has(pathParts[p].slice(-1)[0])
  );
  const resources = Object.fromEntries(
    resourceLambdas.map((p) => [p, pathParts[p].slice(0, -1).join("/")])
  );
  const methods = Object.fromEntries(
    resourceLambdas.map((p) => [p, pathParts[p].slice(-1)[0]])
  );

  const callerIdentity = new DataAwsCallerIdentity(scope, "tf_caller", {});
  // lambda resource requires either filename or s3... wow
  new ArchiveProvider(scope, "archive", {});
  const dummyFile = new DataArchiveFile(scope, "dummy", {
    type: "zip",
    outputPath: "./dummy.zip",
    source: [
      {
        content: "// TODO IMPLEMENT",
        filename: "dummy.js",
      },
    ],
  });

  const assumeLambdaPolicy = new DataAwsIamPolicyDocument(
    scope,
    "assume_lambda_policy",
    {
      statement: [
        {
          actions: ["sts:AssumeRole"],
          principals: [
            { identifiers: ["lambda.amazonaws.com"], type: "Service" },
          ],
        },
      ],
    }
  );

  const lamdaExecutionPolicyDocument = new DataAwsIamPolicyDocument(
    scope,
    "lambda_execution_policy_document",
    {
      statement: [
        {
          actions: [
            "cloudfront:CreateInvalidation",
            "cloudfront:GetInvalidation",
            "cloudfront:ListDistributions",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:BatchWriteItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "execute-api:Invoke",
            "execute-api:ManageConnections",
            "lambda:InvokeFunction",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:CreateLogGroup",
            "s3:GetObject",
            "s3:ListBucket",
            "s3:PutObject",
            "s3:DeleteObject",
            "ses:sendEmail",
          ],
          resources: ["*"],
        },
        {
          actions: ["sts:AssumeRole"],
          resources: [
            `arn:aws:iam::${callerIdentity.accountId}:role/${safeProjectName}-lambda-execution`,
          ],
        },
      ],
    }
  );
  const lamdaExecutionPolicy = new IamPolicy(scope, "lambda_execution_policy", {
    name: `${safeProjectName}-lambda-execution`,
    policy: lamdaExecutionPolicyDocument.json,
  });
  const lambdaRole = new IamRole(scope, "lambda_role", {
    name: `${safeProjectName}-lambda-execution`,
    assumeRolePolicy: assumeLambdaPolicy.json,
  });
  new IamRolePolicyAttachment(scope, "test-attach", {
    role: lambdaRole.name,
    policyArn: lamdaExecutionPolicy.arn,
  });
  const restApi = new ApiGatewayRestApi(scope, "rest_api", {
    name: safeProjectName,
    endpointConfiguration: {
      types: ["REGIONAL"],
    },
    binaryMediaTypes: ["multipart/form-data", "application/octet-stream"],
  });

  const apiResources: Record<string, ApiGatewayResource> = {};
  resourceLambdas.forEach((resourcePath) => {
    const parts = pathParts[resourcePath].slice(0, -1);
    parts.forEach((pathPart, i) => {
      const resourceKey = parts.slice(0, i + 1).join("/");
      apiResources[resourceKey] =
        apiResources[resourceKey] ||
        new ApiGatewayResource(
          scope,
          `resources_${resourceKey.replace(/\//g, "_")}`,
          {
            restApiId: restApi.id,
            parentId:
              i === 0
                ? restApi.rootResourceId
                : apiResources[parts.slice(0, i).join("/")]?.id,
            pathPart,
          }
        );
    });
  });
  const functionNames = Object.fromEntries(
    allLambdas.map((p) => [
      p,
      resources[p]
        ? `${resources[p].replace(/\//g, "-")}_${methods[p]}`
        : p.replace(/\//g, "-"),
    ])
  );
  const lambdaFunctions = Object.fromEntries(
    allLambdas.map((lambdaPath) => [
      lambdaPath,
      new LambdaFunction(
        scope,
        `lambda_function_${lambdaPath.replace(/\//g, "_")}`,
        {
          functionName: `${safeProjectName}_${functionNames[lambdaPath]}`,
          role: lambdaRole.arn,
          handler: `${functionNames[lambdaPath]}.handler`,
          filename: dummyFile.outputPath,
          runtime: "nodejs18.x",
          publish: false,
          timeout: 30,
          memorySize: 5120,
        }
      ),
    ])
  );
  const gatewayMethods = Object.fromEntries(
    resourceLambdas.map((p) => [
      p,
      new ApiGatewayMethod(scope, `gateway_method_${p.replace(/\//g, "_")}`, {
        restApiId: restApi.id,
        resourceId: apiResources[resources[p]].id,
        httpMethod: methods[p].toUpperCase(),
        authorization: "NONE",
      }),
    ])
  );
  const gatewayIntegrations = resourceLambdas.map(
    (p) =>
      new ApiGatewayIntegration(scope, `integration_${p.replace(/\//g, "_")}`, {
        restApiId: restApi.id,
        resourceId: apiResources[resources[p]].id,
        httpMethod: methods[p].toUpperCase(),
        type: "AWS_PROXY",
        integrationHttpMethod: "POST",
        uri: lambdaFunctions[p].invokeArn,
        dependsOn: [apiResources[resources[p]], gatewayMethods[p]],
      })
  );
  resourceLambdas.map(
    (p) =>
      new LambdaPermission(scope, `apigw_lambda_${p.replace(/\//g, "_")}`, {
        statementId: "AllowExecutionFromAPIGateway",
        action: "lambda:InvokeFunction",
        functionName: lambdaFunctions[p].functionName,
        principal: "apigateway.amazonaws.com",
        // TODO: constrain this to the specific API Gateway Resource
        sourceArn: `${restApi.executionArn}/*/*/*`,
      })
  );
  const mockMethods = Object.fromEntries(
    Object.values(resources).map((resource) => [
      resource,
      new ApiGatewayMethod(
        scope,
        `option_method_${resource.replace(/\//g, "_")}`,
        {
          restApiId: restApi.id,
          resourceId: apiResources[resource].id,
          httpMethod: "OPTIONS",
          authorization: "NONE",
        }
      ),
    ])
  );
  const mockIntegrations = Object.fromEntries(
    Object.values(resources).map((resource) => [
      resource,
      new ApiGatewayIntegration(
        scope,
        `mock_integration_${resource.replace(/\//g, "_")}`,
        {
          restApiId: restApi.id,
          resourceId: apiResources[resource].id,
          httpMethod: "OPTIONS",
          type: "MOCK",
          passthroughBehavior: "WHEN_NO_MATCH",
          requestTemplates: {
            "application/json": JSON.stringify({ statusCode: 200 }),
          },
        }
      ),
    ])
  );
  const mockMethodResponses = Object.fromEntries(
    Object.values(resources).map((resource) => [
      resource,
      new ApiGatewayMethodResponse(
        scope,
        `mock_method_response_${resource.replace(/\//g, "_")}`,
        {
          restApiId: restApi.id,
          resourceId: apiResources[resource].id,
          httpMethod: "OPTIONS",
          statusCode: "200",
          responseModels: {
            "application/json": "Empty",
          },
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
          dependsOn: [apiResources[resource], mockMethods[resource]],
        }
      ),
    ])
  );
  const mockIntegrationResponses = Object.values(resources).map(
    (resource) =>
      new ApiGatewayIntegrationResponse(
        scope,
        `mock_integration_response_${resource.replace(/\//g, "_")}`,
        {
          restApiId: restApi.id,
          resourceId: apiResources[resource].id,
          httpMethod: "OPTIONS",
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Authorization,Content-Type'",
            "method.response.header.Access-Control-Allow-Methods":
              "'GET,OPTIONS,POST,PUT,DELETE'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
          dependsOn: [
            apiResources[resource],
            mockIntegrations[resource],
            mockMethodResponses[resource],
          ],
        }
      )
  );
  // const deployment =
  new ApiGatewayDeployment(scope, "production", {
    restApiId: restApi.id,
    stageName: "production",
    triggers: {
      redeployment: Fn.sha1(
        Fn.jsonencode(
          (gatewayIntegrations as { id: string }[])
            .concat(Object.values(apiResources))
            .concat(Object.values(gatewayMethods))
            .concat(Object.values(mockMethods))
            .concat(Object.values(mockIntegrations))
            .concat(Object.values(mockMethodResponses))
            .concat(mockIntegrationResponses)
            .map((t) => t.id)
        )
      ),
    },
    dependsOn: [...Object.values(gatewayMethods), ...gatewayIntegrations],
    lifecycle: {
      createBeforeDestroy: true,
    },
  });
  // Needs to tf import the current stage into it
  // new ApiGatewayStage(this, "production_stage", {
  //   deploymentId: deployment.id,
  //   restApiId: restApi.id,
  //   stageName: "production",
  // });
  const lambdaDeployPolicyDocument = new DataAwsIamPolicyDocument(
    scope,
    "deploy_policy",
    {
      statement: [
        {
          actions: ["lambda:UpdateFunctionCode", "lambda:GetFunction"],
          resources: [
            `arn:aws:lambda:us-east-1:${callerIdentity.accountId}:function:${safeProjectName}_*`,
          ],
        },
      ],
    }
  );
  const updateLambdaUser = new IamUser(scope, "update_lambda_user", {
    name: `${safeProjectName}-lambda`,
    path: "/",
  });
  const updateLambdaKey = new IamAccessKey(scope, "update_lambda_key", {
    user: updateLambdaUser.name,
  });
  const policy = new IamPolicy(scope, "update_lambda_policy", {
    name: `${safeProjectName}-lambda-update`,
    policy: lambdaDeployPolicyDocument.json,
  });
  new IamUserPolicyAttachment(scope, "update_lambda_user_policy", {
    user: updateLambdaUser.name,
    policyArn: policy.arn,
  });
  const role = new IamRole(scope, "update_lambda_role", {
    name: `${safeProjectName}-lambda-update`,
    assumeRolePolicy: assumeLambdaPolicy.json,
  });
  new IamRolePolicyAttachment(scope, "update_lambda_role_policy", {
    role: role.name,
    policyArn: policy.arn,
  });
  const apiCertificate = new AcmCertificate(scope, "api_certificate", {
    domainName: "api.davidvargas.me",
    validationMethod: "DNS",
    lifecycle: {
      createBeforeDestroy: true,
    },
  });
  const apiCertRecord = new Route53Record(scope, "api_cert", {
    name: apiCertificate.domainValidationOptions.get(0).resourceRecordName,
    type: apiCertificate.domainValidationOptions.get(0).resourceRecordType,
    zoneId: opts.zoneId,
    records: [
      apiCertificate.domainValidationOptions.get(0).resourceRecordValue,
    ],
    ttl: 60,
  });
  const apiCertValidation = new AcmCertificateValidation(
    scope,
    "api_certificate_validation",
    {
      certificateArn: apiCertificate.arn,
      validationRecordFqdns: [apiCertRecord.fqdn],
    }
  );
  const apiDomain = new ApiGatewayDomainName(scope, "api_domain_name", {
    domainName: "api.davidvargas.me",
    certificateArn: apiCertValidation.certificateArn,
  });
  new Route53Record(scope, "api_record", {
    name: apiDomain.domainName,
    type: "A",
    zoneId: opts.zoneId,
    alias: [
      {
        evaluateTargetHealth: true,
        name: apiDomain.cloudfrontDomainName,
        zoneId: apiDomain.cloudfrontZoneId,
      },
    ],
  });
  new ApiGatewayBasePathMapping(scope, "api_mapping", {
    apiId: restApi.id,
    stageName: "production",
    domainName: apiDomain.domainName,
  });

  return {
    accessKeyOutput: updateLambdaKey.id,
    secretKeyOutput: updateLambdaKey.secret,
  };
};

const setupInfrastructure = async (): Promise<void> => {
  class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
      super(scope, name);

      const aws_access_token = new TerraformVariable(this, "aws_access_token", {
        type: "string",
      });

      const aws_secret_token = new TerraformVariable(this, "aws_secret_token", {
        type: "string",
      });

      const secret = new TerraformVariable(this, "secret", {
        type: "string",
      });

      const aws = new AwsProvider(this, "AWS", {
        region: "us-east-1",
        accessKey: aws_access_token.value,
        secretKey: aws_secret_token.value,
      });

      new GithubProvider(this, "GITHUB", {
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_REPOSITORY_OWNER,
      });

      const cachePolicy = new CloudfrontCachePolicy(this, "cache_policy", {
        name: `${safeProjectName}-cache-policy`,
        comment: `Caching for ${projectName}`,
        defaultTtl: 1,
        maxTtl: 31536000,
        minTtl: 1,
        parametersInCacheKeyAndForwardedToOrigin: {
          cookiesConfig: { cookieBehavior: "none" },
          headersConfig: { headerBehavior: "none" },
          queryStringsConfig: { queryStringBehavior: "all" },
        },
      });

      const staticSite = new AwsStaticSite(this, "aws_static_site", {
        providers: [
          {
            moduleAlias: "us-east-1",
            provider: aws,
          },
        ],
        originMemorySize: 5120,
        originTimeout: 20,
        domain: projectName,
        secret: secret.value,
        cachePolicyId: cachePolicy.id,
      });

      const backend = getAwsBackend(this, {
        zoneId: staticSite.route53ZoneIdOutput,
      });

      new ActionsSecret(this, "tf_aws_access_key", {
        repository: projectName,
        secretName: "TF_AWS_ACCESS_KEY",
        plaintextValue: aws_access_token.value,
      });

      new ActionsSecret(this, "tf_aws_access_secret", {
        repository: projectName,
        secretName: "TF_AWS_ACCESS_SECRET",
        plaintextValue: aws_secret_token.value,
      });

      new ActionsSecret(this, "deploy_aws_access_key", {
        repository: projectName,
        secretName: "DEPLOY_AWS_ACCESS_KEY",
        plaintextValue: staticSite.deployIdOutput,
      });

      new ActionsSecret(this, "deploy_aws_access_secret", {
        repository: projectName,
        secretName: "DEPLOY_AWS_ACCESS_SECRET",
        plaintextValue: staticSite.deploySecretOutput,
      });

      new ActionsSecret(this, "lambda_aws_access_key", {
        repository: projectName,
        secretName: "LAMBDA_AWS_ACCESS_KEY",
        plaintextValue: backend.accessKeyOutput,
      });

      new ActionsSecret(this, "lambda_aws_access_secret", {
        repository: projectName,
        secretName: "LAMBDA_AWS_ACCESS_SECRET",
        plaintextValue: backend.secretKeyOutput,
      });

      new ActionsSecret(this, "cloudfront_distribution_id", {
        repository: projectName,
        secretName: "CLOUDFRONT_DISTRIBUTION_ID",
        plaintextValue: staticSite.cloudfrontDistributionIdOutput,
      });
      variables.forEach((v) => {
        const tf_secret = new TerraformVariable(this, v, {
          type: "string",
        });
        new ActionsSecret(this, `${v}_secret`, {
          repository: projectName,
          secretName: v.toUpperCase(),
          plaintextValue: tf_secret.value,
        });
      });
    }
  }

  const app = new App();
  const stack = new MyStack(app, safeProjectName);
  new RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "VargasArts",
    workspaces: {
      name: safeProjectName,
    },
  });

  app.synth();
};

setupInfrastructure();

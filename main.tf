terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "VargasArts"
    workspaces {
      prefix = "app"
    }
  }
  required_providers {
    github = {
      source = "integrations/github"
      version = "4.2.0"
    }
  }
}

variable "aws_access_token" {
  type = string
}

variable "aws_secret_token" {
  type = string
}

variable "github_token" {
  type = string
}

variable "secret" {
  type = string
}

variable "clerk_api_key" {
    type = string
}

variable "mysql_password" {
  type = string
}

variable "notion_api_key" {
  type = string
}

variable "stripe_public" {
  type = string
}

variable "stripe_secret" {
  type = string
}

variable "stripe_webhook_secret" {
  type = string
}

variable "npm_token" {
  type = string
}

variable "infura_project_id" {
  type = string
}

variable "convertkit_api_key" {
  type = string
}

provider "aws" {
  region = "us-east-1"
  access_key = var.aws_access_token
  secret_key = var.aws_secret_token
}

provider "github" {
  owner = "dvargas92495"
  token = var.github_token
}

module "aws_static_site" {
  source  = "dvargas92495/static-site/aws"
  version = "3.6.5"

  origin_memory_size = 5120
  origin_timeout = 20
  domain = "app.davidvargas.me"
  secret = var.secret
  tags = {
      Application = "app"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend" {
    source  = "dvargas92495/serverless-backend/aws"
    version = "2.5.3"

    api_name  = "app"
    domain    = "app.davidvargas.me"
    directory = "api"
}

module "aws_clerk" {
  source   = "dvargas92495/clerk/aws"
  version  = "1.0.4"

  zone_id  = module.aws_static_site.route53_zone_id
  clerk_id = "iecxnb2omjxr"
  subdomain = "app"
}

resource "github_actions_secret" "deploy_aws_access_key" {
  repository       = "app"
  secret_name      = "DEPLOY_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site.deploy-id
}

resource "github_actions_secret" "deploy_aws_access_secret" {
  repository       = "app"
  secret_name      = "DEPLOY_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site.deploy-secret
}

resource "github_actions_secret" "lambda_aws_access_key" {
  repository       = "app"
  secret_name      = "LAMBDA_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend.access_key
}

resource "github_actions_secret" "lambda_aws_access_secret" {
  repository       = "app"
  secret_name      = "LAMBDA_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend.secret_key
}

resource "github_actions_secret" "mysql_password_secret" {
  repository       = "app"
  secret_name      = "MYSQL_PASSWORD"
  plaintext_value  = var.mysql_password
}

resource "github_actions_secret" "clerk_api_key_secret" {
  repository       = "app"
  secret_name      = "CLERK_API_KEY"
  plaintext_value  = var.clerk_api_key
}

resource "github_actions_secret" "notion_api_key_secret" {
  repository       = "app"
  secret_name      = "NOTION_API_KEY"
  plaintext_value  = var.notion_api_key
}

resource "github_actions_secret" "cloudfront_distribution_id" {
  repository       = "app"
  secret_name      = "CLOUDFRONT_DISTRIBUTION_ID"
  plaintext_value  = module.aws_static_site.cloudfront_distribution_id
}

resource "github_actions_secret" "stripe_public_secret" {
  repository       = "app"
  secret_name      = "STRIPE_PUBLIC_KEY"
  plaintext_value  = var.stripe_public
}

resource "github_actions_secret" "stripe_secret_secret" {
  repository       = "app"
  secret_name      = "STRIPE_SECRET_KEY"
  plaintext_value  = var.stripe_secret
}

resource "github_actions_secret" "stripe_webhook_secret_secret" {
  repository       = "app"
  secret_name      = "STRIPE_WEBHOOK_SECRET"
  plaintext_value  = var.stripe_webhook_secret
}

resource "github_actions_secret" "npm_token_secret" {
  repository      = "app"
  secret_name     = "NPM_TOKEN"
  plaintext_value = var.npm_token
}

resource "github_actions_secret" "infura_project_id_secret" {
  repository      = "app"
  secret_name     = "INFURA_PROJECT_ID"
  plaintext_value = var.infura_project_id
}

resource "github_actions_secret" "convertkit_api_key_secret" {
  repository      = "app"
  secret_name     = "CONVERTKIT_API_KEY"
  plaintext_value = var.convertkit_api_key
}

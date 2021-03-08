# Movies backend microservice

## Requirements and dependencies

### Development (locally)

- Serverless tools (`npm install -g serverless`)
- NodeJS runtime and package manager (npm) from http://nodejs.org
- Yarn package manager (for security, audition, speed, etc.) by `npm install -g yarn`
- Java runtime >= 8 (for running DynamoDB locally)

### Deployment (AWS/CloudFront)

- An AWS account with credentials
- AWS command-line tools (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- (Ba)SH/POSIX environment

### Current path structure and 

| Path/File | Description |
|-|-|
| ./src/handler.js          | Lambda functions source |
| ./src/dynamodb.js         | R/W routines for AWS DynamoDB |
| ./schemas/movieRequest.js | Movie schema for validation |
| deploy.sh                 | Deployment script for the backend |
| infra.template.yml        | CloudFormation template for the deployment script |
| serverless.yml            | Serverless configuration of the service |

---

## Lambda function with a DynamoDB database

### Installation

Enter the `api` directory and get the required packages:

`yarn install`

### Running locally

In the `api` directory, install AWS DynamoDB locally with Serverless:

`sls dynamodb install`

Now start Serverless offline:

`sls offline start`

🍺 Cheers! The back-end is now up and running.

### Deployment

The `deploy.sh` shell script will set up a stack on which the backend will be deployed.
If the stack exists, all changes will be updated instead.

`./deploy.sh dev`

Alternatively, you can deploy without building the stack by:

`yarn deploy --stage dev`

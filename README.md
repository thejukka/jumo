# JUMO - JukkaMovies service

## Description

This is a demo of a movie service implementation using NodeJS, Serverless, AWS DynamoDB and ReactUI.

## Current path structure

| Path/File | Description |
|-|-|
| **api**        | Movies REST API microservice backend |
| **doc**        | Documentation of the application |
| **ui**         | React UI frontend |
| .prettierrc.js | Prettier configuration for suitable editors/IDEs
| config.js      | Common global configurations |

## Get things up and running (in short)

### Common requirements

- NodeJS runtime and package managers such as NPM and/or Yarn, latter to be favoured.
- Serverless tools for the backend (`npm install -g serverless`)
- Java runtime >= 8 for the backend database (DynamoDB)

Optional requirements:

- An AWS account and credentials for the deployment
- AWS command-line tools to run cool deployment scripts I've written
- (Ba)SH/POSIX environment (e.g. GNU/Linux, macOS/BSD, etc.) to make thins (script, commands) run smoothly

### Backend

```bash
cd api
yarn install
sls dynamodb install
sls offline start
```
Will start the backend at `http://localhost:3000/dev/movies`

### Frontend

```bash
cd ui
yarn install
yarn start
```

Will build and start the UI at `http://localhost:3001` (3001 or any other port you like)

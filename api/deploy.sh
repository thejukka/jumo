#!/bin/sh

set -e

ORIGIN=localhost

if [ -z "$1" ]
then
    printf "Please provide a development stage (e.g. 'dev', 'staging' or 'prod'). Origin is 'localhost' by default\n"
    printf "Example: ./deploy.sh dev [some-origin]\n\n"
    exit 1
fi
if [ "$2" ]
then
    ORIGIN=$2
fi

STAGE=$1

# Common infra
printf "\n\n🔨 Deploy the infrastructure\n\n"

aws cloudformation deploy \
    --stack-name movie-infra \
    --template ./infra.template.yml \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides Environment=$STAGE AllowedOrigins=$ORIGIN

yarn install
yarn deploy --stage $STAGE
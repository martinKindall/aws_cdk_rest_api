#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiRestStack } from '../lib/api_rest-stack';
import {languageType} from "../interfaces/Language";

const app = new cdk.App();
new ApiRestStack(app, 'ApiRestStack', {
    objectStructure: languageType,
    tableKey: 'name'
});

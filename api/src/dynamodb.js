import * as AWS from 'aws-sdk';        // Import AWS Node SDK Lib.
import Bluebird from 'bluebird';       // Import Promises routines
import { config } from '../../config'; // Import common configurations

// Apply Promises on DynamoDB calls
AWS.config.setPromisesDependency(Bluebird);

// Use local DB endpoint for local development
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    endpoint: config.db.endpoint
});

// Set item to be found/added from/into the database
const setItem = (keyValue) => ({
    TableName: process.env.MOVIES_TABLE,
    ...keyValue
});

// Get needed fields from all entries (scan and return fields by given parameters)
export const getAll = () => {
    const params = {
        TableName: process.env.MOVIES_TABLE,
        // Use variables to avoid the usage of the DB's reserved words
        ExpressionAttributeNames: {
            '#name': 'name',
            '#year': 'year'
        },  
        ProjectionExpression: "id,#name,#year,genres,ageLimit,rating"
    };
    return dynamoDb.scan(params).promise();
}

// Add a batch of entries
export const addBatch = (data) => {
    const params = {
        RequestItems: {
            [process.env.MOVIES_TABLE]: 
                data.map(entry => ({ PutRequest: { Item: entry } }))
        }
    }
    return dynamoDb.batchWrite(params).promise();
}   

// Get an entry by given ID
export const getById = (entryId) => 
    dynamoDb.get(setItem({Key: {id: entryId}})).promise();

// Remove entry by given ID
export const removeById = (entryId) =>
    dynamoDb.delete(setItem({Key: {id: entryId}})).promise();

// Add an entry (json object) into the database
export const add = (data) => 
    dynamoDb.put(setItem({Item: data})).promise();
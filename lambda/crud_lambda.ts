import {DynamoDB} from 'aws-sdk'
import {Language} from "../interfaces/Language";

const dynamo = new DynamoDB.DocumentClient();

interface EventCreate {
    body: string;
}

interface EventRead {
    queryStringParameters: { name?: string };
}

exports.read = async (event: EventRead) => {
    console.log(event);
    const { queryStringParameters: { name } } = event;

    if (name === undefined) {
        return sendRes(400, "Provide the key to search name as querystring");
    }

    const dbQuery = {
        TableName: process.env.LANGUAGE_TABLE_NAME!,
        KeyConditionExpression: "#keyName = :langName",
        ExpressionAttributeNames:{
            "#keyName": "name"
        },
        ExpressionAttributeValues: {
            ":langName": name
        }
    };

    const queryResult = await dynamo.query(dbQuery).promise();

    if (queryResult?.Count === 0) {
        return sendRes(204, "");
    }

    return sendRes(200, JSON.stringify(queryResult?.Items || "unexpected error"));
};

exports.create = async (event: EventCreate) => {
    console.log('Writing to Languages', event);
    const language: Language = JSON.parse(event.body);
    const { name, published_at, statically_typed, paradigm } = language;

    await dynamo.put({
        TableName: process.env.LANGUAGE_TABLE_NAME!,
        Item: {name, published_at, statically_typed, paradigm}
    }).promise();

    return sendRes(200, "Language created!");
};

const sendRes = (status:number, body:string) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "text/html"
        },
        body: body
    };
};

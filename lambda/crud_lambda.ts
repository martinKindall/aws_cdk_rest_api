import {DynamoDB} from 'aws-sdk'
import {Language} from "../interfaces/Language";

const dynamo = new DynamoDB.DocumentClient();

interface EventCreate {
    body: string;
}

exports.read = async (event: any) => {
    console.log(event);
    return sendRes(200, "Just testing");
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

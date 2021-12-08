import {DynamoDB} from 'aws-sdk'

const dynamo = new DynamoDB();

exports.read = async (event: any) => {
    console.log(event);
    return sendRes(200, "Just testing");
};

exports.create = async (event: any) => {
    console.log('Writing to Languages', event);

    // await dynamo.updateItem({
    //     TableName: process.env.HITS_TABLE_NAME,
    //     Key: {name: {S: event.rawPath}},
    //     UpdateExpression: 'ADD hits :incr',
    //     ExpressionAttributeValues: {':incr': {N: '1'}}
    // }).promise();

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

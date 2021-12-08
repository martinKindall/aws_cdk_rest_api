
exports.handler = async (event: any) => {
    console.log(event);
    sendRes(200, "Just testing");
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

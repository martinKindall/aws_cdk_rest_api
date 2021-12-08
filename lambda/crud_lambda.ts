
exports.read = async (event: any) => {
    console.log(event);
    return sendRes(200, "Just testing");
};

exports.create = async (event: any) => {
    console.log(event);
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

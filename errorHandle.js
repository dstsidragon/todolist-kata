function errorHandle(res){
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };
    res.writeHead(200, headers);
    res.write(JSON.stringify(
        {
            "status":"fail",
            "message":"欄位填寫不正確!或是查無todo!"
        }
    ));
    res.end();
};

module.exports = errorHandle;

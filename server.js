const http = require("http");
const { v4: uuidv4 } = require('uuid');
const errorHandle = require("./errorHandle");
const todos = [];
function requestLinster(req, res) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    req.on("data", chunk => body += chunk);
    if (req.url == "/todos" && req.method == "GET") { // GET
        res.writeHead(200, headers);
        res.write(JSON.stringify(
            {
                "status": "success",
                "title": todos,
                "message": "取得所有todo!"
            }
        ));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {//POST
        req.on("end", () => {
            try {
                const title = JSON.parse(body).title;
                if (title != undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(
                        {
                            "status": "success",
                            "title": todos,
                            "message": "新增todo!"
                        }
                    ));
                    res.end();
                } else {
                    errorHandle(res);
                };
            }
            catch (err) {
                errorHandle(res);
                console.log(err);
            }
        });
    } else if (req.url == "/todos" && req.method == "DELETE") {//DELETE
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify(
            {
                "status": "success",
                "title": todos,
                "message": "刪除全部todo!"
            }
        ));
        res.end();
    } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {//DELETE 單一
        const id = req.url.split("/").pop();
        const index = todos.findIndex(element => element.id == id);
        if (index != -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify(
                {
                    "status": "success",
                    "title": todos,
                    "message": "刪除一筆todo!"
                }
            ));
            res.end();
        } else {
            errorHandle(res);
        }
    } else if (req.url.startsWith("/todos") && req.method == "PATCH") {//PATCH
        req.on("end",()=>{
            try{
                const title = JSON.parse(body).title;
                const id = req.url.split("/").pop();
                const index = todos.findIndex(element => element.id == id);
                if(title != undefined && index != -1 ){
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(
                        {
                            "status": "success",
                            "title": todos,
                            "message": "修改一筆todo!"
                        }
                    ));
                    res.end();
                }
            }catch(err){
                errorHandle(err);
            };
        });
    } else if (req.method == "OPTIONS") {//OPTIONS
        res.writeHead(200, headers);
        res.end();
    } else { // 404
        res.writeHead(404, headers);
        res.write(JSON.stringify(
            {
                "status": "fail",
                "message": "找不到網頁!"
            }
        ));
        res.end();
    }
}
const server = http.createServer(requestLinster);
server.listen(process.env.PORT || 3001); 
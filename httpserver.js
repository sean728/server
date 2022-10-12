'use strict'
const http = require('http');
const path = require('path');
const server = http.createServer()

let html_content = `<!DOCTYPE html>
<html>
<head>
    <meta charset = 'utf-8'>
    <title>HTTP</title>
    </head>
    <body>
        <h1>这是一个web页面</h1>
    </body>
</html>`


let routeMap = {
    '/':(req,res)=>{
        res.setHeader("content-type","text/html;charset=utf-8");
        res.end(html_content)
    },
    '/login':(req,res)=>{
        res.end("this is login")
    }
}
server.on("request",(req,res)=>{
   console.log(req.headers,req.method,req.url)
   let urlarr = req.url.split("?")
   let pathname = urlarr[0]
   if(routeMap[pathname] === 'undefined'){
    res.statusCode = 404
    res.setHeader("content-type","text/plain;charset=utf8")
    res.end('没有此页面')
    return
   }
   routeMap[pathname](req,res)
})

server.listen(2022,()=>{
    console.log("listen is 2022")
})

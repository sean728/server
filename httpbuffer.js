'use strict'
const { unwatchFile } = require('fs')
const http = require('http')
const server = http.createServer()

//HTTP中的请求类型：GET POST PUT DELETE OPTIONS PATCH HEAD
//HTTP中必须有请求数据:POST PUT PATCH DELETE
//('P')indexof(req.method)
//('D')indexof(req.method)

let routeMap = {
    GET:{
        '/':(ctx)=>{
            ctx.request.setHeader("content-type","text/html;charset=utf8")
            ctx.response.end("首页")
        },
        '/login':(ctx)=>{
            ctx.request.setHeader("content-type","text/html;charset=utf8")
            ctx.response.end("登陆页面")
        }
    },
    POST:{
        '/login':(ctx)=>{
                ctx.response.end(ctx.rawBody)
        },
        '/upload':(ctx)=>{
            console.log(ctx.method)
            console.log(ctx.headers)
            console.log(ctx.rawBody.toString('utf8'))
            ctx.response.end('ok')
    }

    
    },
    PUT:{
        '/updata':(ctx)=>{
            console.log(ctx.body)
                ctx.response.end(ctx.rawBody)
        }
    }
}
function parseBody(ctx){
    switch(ctx.headers['content-type']){
        //{a:3,b:4}
        case 'application/json':
            try{
                ctx.body = JSON.parse(ctx.rawBody.toString('utf8'))
            }catch{
                ctx.response.statusCode = 400
                ctx.response.end()
            }
        //a=1&b=2&c=%20x&{a:1,b:2}
        //[a=1,b=2,c=%20x]
        //filter
        case 'application/x-www-form-urlencoded':
            let obj ={}
            let textBody = ctx.rawBody.toString('utf8')
            let arr = textBody.split("&").filter(item => item.length > 0)
            let tmp 
            for(let a of arr){
                tmp = a.split('=')
                obj[tmp[0]] = tmp[1] || ''
            }
            ctx.body = obj
    }
}
server.on('request',(req,res)=>{
    let urlarr = req.url.split("?")
    let pathname = urlarr[0]
    if(routeMap[req.method] === undefined || routeMap[req.method][pathname]===undefined){
        res.statusCode = 404
        res.setHeader('content-type','text/palin;charset=utf8')
        res.end("没有此页面")
        return
    }
    let ctx = {
        method:req.method,
        body:null,
        response:res,
        request:req,
        headers:req.headers,
        rawBody:null
    }
    if(['P','D'].indexOf(req.method[0])>=0){
        let bodyData = []
        let bodyLength = 0
        req.on("data",chunk=>{
            bodyData.push(chunk)
            bodyLength += chunk.length
        }) 
        req.on('end',()=>{
            ctx.rawBody = Buffer.concat(bodyData,bodyLength)
            parseBody(ctx)
            if(ctx.response.writable){
                routeMap[req.method][pathname](ctx)
            }
            
        })
    }else{
        routeMap[req.method][pathname](ctx)
    }
})

server.listen(2022,()=>{
    console.log("listen is 2022")
})
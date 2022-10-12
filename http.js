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
        '/':(req,res)=>{
            res.setHeader("content-type","text/html;charset=utf8")
            res.end("首页")
        },
        '/login':(req,res)=>{
            res.setHeader("content-type","text/html;charset=utf8")
            res.end("登陆页面")
        }
    },
    POST:{
        '/login':(req,res)=>{
                res.end(req.bodyData)
        }
    
    },
    PUT:{
        '/updata':(req,res)=>{
                res.end(req.bodyData)
        }
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
    if(['P','D'].indexOf(req.method[0])>=0){
        let bodyData = ""
        req.on("data",chunk=>{
            bodyData += chunk.toString('utf8')
        }) 
        req.on('end',()=>{
            req.bodyData = bodyData
            routeMap[req.method][pathname](req,res)
        })
    }else{
        routeMap[req.method][pathname](req,res)
    }
})

server.listen(2022,()=>{
    console.log("listen is 2022")
})
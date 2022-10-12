'use strict'
const http = require('http')
const server = http.createServer()

server.on("request",(req,res)=>{
    let bodydata = ""
    req.on("data",chunk=>{
        bodydata +=chunk.toString('utf8')
    })
    req.on('end',()=>{
        res.end(bodydata)
    })
})

server.listen(1234,()=>{
    console.log("listen is 1234")
})
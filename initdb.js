'use strict'

const pg = require('pg')
//数据库配置
let dbconfig = {
    //连接池管理的最大连接数量
    max:10,
    //数据库
    database : 'webdata',
    //数据库端口号
    port:5678,
    //数据库域名或ip地址
    host:'127.0.0.1',
    //连接用户的身份
    user:'h5server',
    //用户的密码,本地配置已开启不需要验证
    password:''
}

let db = new pg.Pool(dbconfig)
module.exports = db
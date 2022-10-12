'use strict'
//__dirname表示当前模块所在目录
process.chdir(__dirname)

const Titbit = require('titbit')
const fs = require('fs')

//使用node.js封装好的promiseAPI
const fsp = fs.promises

//导入数据库连接实例
const db = require('./initdb.js')
//检测服务是否存在upload文件夹，如果没有就创建
try{
    fs.accessSync('./upload')
}catch(err){
    fs.mkdirSync('./upload')
}


const app = new Titbit({
    //开启调试模式，会输出错误信息，并且会输出路由表
    debug:true
})

//GET POST PUT DELETE OPTIONS
app.get('/',async ctx =>{
    ctx.send('success')
})
app.put('/updata',async ctx =>{
    ctx.send(ctx.body)
})

app.post('/upload',async ctx=>{
    //关于上传的图片的所有的信息，都被封装在了ctx.files中
    console.log(ctx.files)
    //获取文件对象，默认返回
    let imgfile = ctx.getFile('image')
    if(!imgfile){
        return ctx.status(400).send('image not found')
    }
    //更改文件名字，确保服务器中文件名称不会重复
    let filename = ctx.helper.makeName(imgfile.filename)
    //将文件保存在服务器上 --移动到服务器的文件夹中
    await ctx.moveFile(imgfile,`./upload/${filename}`)
    ctx.send(filename)
})

app.get('/image/:name', async ctx=>{
    //:name解析到ctx.param.name 图片的名称
    let filename = `./upload/${ctx.param.name}`
    try{
    //pipe是对Node.js流stream的封装处理
    //ctx.replay指向了response
        await ctx.helper.pipe(filename,ctx.reply)
    }catch(err){
        ctx.status(404)
    }
    
})
app.get('/content',async ctx=>{
    let sql = "SELECT title,id,create_time FROM hs.content ORDER BY create_time DESC"
    let ret = await db.query(sql)
    ctx.send(ret.rows)
})
//根据id获取文章详情
app.get('/content/:id',async ctx=>{
    let sql = `SELECT * FROM hs.content WHERE id=$1`
    let ret =await db.query(sql,[ctx.param.id])
    //返回信息
    if(ret.rowCount>0) return ctx.send(ret.rows[0])
    return ctx.status(404).send("something is wrong")
})
//存储富文本编辑器中用户提交的数据
app.post('/content',async ctx=>{
    

    //将数据以文件的形式保存
    //1.创建文件（设置文件名字）
    //let filename = ctx.helper.makeName()+'.json'
    //2.使用api将数据写入到文件中writeFile
    //await fsp.writeFile(`./files/${filename}`,ctx.rawBody)
    //ctx.send(filename)

    //将数据保存在数据库中
    //1.获取数据(数据需要时json格式)
    let data = JSON.parse(ctx.rawBody.toString('utf8'))
    //2.将数据保存在数据库中
    //2.1拼写插入的sql语句
    let sql = `INSERT INTO hs.content`
    +`(id,title,detail,create_time,update_time)`
    +`VALUES ($1,$2,$3,$4,$5) RETURNING id,title`
    //2.2根据$n的参数描述 构造参数
    let tm = Date.now()
    let args = [
        //生成一个不定长的唯一值
        Math.random().toString(16).substring(2,12),
        data.title,
        data.content,
        tm,
        tm
    ]
    //2.3执行sql语句
    //SQL语句执行后会有两个很重要的属性
    //rows是一个数组，rowCount是一个数字,表示返回的数据
    let ret = await db.query(sql,args)
    
    //3.将执行结果返回
    ctx.send(ret.rows[0])

})
app.run(2022)
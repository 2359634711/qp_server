const express = require('express')
const compression = require('compression')
const session = require('express-session')
// exports.serverUri = 'http://39.106.49.94:8080'
exports.serverUri = 'http://localhost:8000'
const app = express()
// const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(compression())
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒
    resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次
    saveUninitialized: true //强制保存未初始化的会话到存储器
}));  //这些是写在app.js里面的
const User = require('./router/user')
const Card = require('./router/card')
const Img = require('./router/img')
const Class = require('./router/class')
const Operator = require('./router/operator')
const Option = require('./router/option')
const path = require('path')
const fs = require('fs')
const https = require('https')

var privateKey = fs.readFileSync(path.join(__dirname, './certificate/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/server.pem'), 'utf8');

app.use(express.static(path.join(__dirname + '/public')))// /img.png etc.
app.use(express.static(path.join(__dirname + '/public/build')))// /img.png etc.
//__dirname 是指当前文件的路径
// app.use('/user/getList', proxy({target: 'http://localhost:3000', changeOrigin: true}));
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json');
    next()
})
app.use('/user', User)
app.use('/card', Card)
app.use('/img', Img)
app.use('/class', Class)
app.use('/option', Option)
app.use('/operator', Operator)

app.get('/', (req, response) => {
    // res.sendFile(path.join(__dirname, './public/build/index.html'))

    //response.writeHead(响应状态码，响应头对象): 发送一个响应头给请求。
    response.writeHead(200, { 'Content-Type': 'text/html' })
    // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
    fs.readFile('./public/build/index.html', 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }
        response.end(data);
    });
})
app.all('*', (req, res, next) => {
    res.json({
        err: 404,
        data: '请求资源不存在'
    })
})
app.listen(8000, () => {
    console.log('run OK in: 8000')
})


// var credentials = { key: privateKey, cert: certificate };

// const server = https.createServer(credentials, app);

// server.listen(8083, function () {

//     var host = server.address().address
//     var port = server.address().port

//     console.log("应用实例，访问地址为 https://%s:%s", host, port)

// })
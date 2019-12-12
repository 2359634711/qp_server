const express = require('express')
const router = express.Router()
const captchapng = require('captchapng')
/* 验证码 */
router.get('/getCode', function (req, res, next) {
    var code = parseInt(Math.random() * 9000 + 1000);//有且仅有4个数字
    req.session.captcha = code;
    var p = new captchapng(100, 30, code);//宽100 高30 四位数字
    p.color(0, 0, 0, 0);//底色
    p.color(255, 80, 80, 255);//字体颜色
    var img = p.getBase64();//转换成base64
    var imgbase64 = new Buffer(img, 'base64');// 存放在imgbase64

    res.json({
        err: false,
        data: img
    });
    return
})

module.exports = router
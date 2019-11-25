const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../public/upload/') })
const { serverUri } = require('../index')
router.post('/upload', upload.single('upload_file'), (req, res) => {
    // res.header('Content-Type','image/jpeg;x-requested-with;')
    var temp_path = req.file.path;
    var ext = '.' + req.file.originalname.split('.')[1];
    var target_path = req.file.path + ext;
    var _filename = req.file.filename + ext;
    var filePath = '/upload/' + _filename;
    fs.rename(temp_path, target_path, function (err, data) {
        res.json({
            status: 'done',
            url: serverUri + '/upload/' + _filename
        })
    });
})

router.post('/delete', (req, res) => {
    try {
        let { url } = req.body;
        let _filename = url.split('/').pop();
        let response = fs.unlinkSync(path.join(__dirname, '../public/upload/') + _filename)
        res.json({
            err: !!response,
            data: response || '删除成功'
        })
    } catch (e) {
        res.json({
            err: true,
            data: '删除错误' + e
        })
    }

})


module.exports = router

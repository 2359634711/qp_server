const query = require('../api/db')
const { _select_user_from_status } = require('./userApi')
function _select_options() {
    return new Promise((resolve) => {
        query("SELECT * FROM `config`", (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _update_options(obj) {
    let { kefu_url, update_url, notice, notice_custom, icon } = obj;
    return new Promise((resolve) => {
        query("UPDATE `config` SET `kefu_url`=?, `update_url`=?, `notice`=?, `notice_custom`=?, `icon`=? WHERE (`id`='1')", [kefu_url, update_url, notice, notice_custom, icon], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}





async function getOptions(req, res) {
    try {
        var { err, data } = await _select_options();
        if (err) throw data
        if (data && data.length > 0) data = data[0]
        let noticeShow = '';
        noticeShow = data.notice;
        if (data.notice_custom == '0')//去最新两条记录
        {
            var resObj = await _select_user_from_status(1, 3);
            if (!resObj.err) {
                if (resObj.data && resObj.data.length > 0) {
                    noticeShow = ''
                    resObj.data.map(val => {
                        noticeShow += (val.user.replace(/^(.{1,2})(.*?)(.{0,3})$/, '$1***$3') + ' 已成功办理！！    ')
                    })
                    res.json({
                        err,
                        data: { ...data, noticeShow }
                    })
                    return
                }
            }
        }
        res.json({
            err,
            data: { ...data, noticeShow }
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e.toString()
        })
    }
}


async function updateOptions(req, res) {
    try {
        let { err, data } = await _update_options(req.body);
        res.json({
            err, data
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e.toString()
        })
    }
}
module.exports = {
    getOptions,
    updateOptions
}
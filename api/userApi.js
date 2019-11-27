const query = require('../api/db')
function _select_all_user() {
    return new Promise((resolve) => {
        query(`SELECT user_list.id, user_list.user,card_list.id as card_id, card_list.title as card_title, user_list.create_time, user_list.reply, user_list.status, user_list.input_list
        FROM user_list, card_list
        WHERE user_list.card_id = card_list.id ORDER BY user_list.id DESC`, (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _select_user_from_status(status, limit = 1000) {
    return new Promise((resolve) => {
        query(`SELECT user_list.id, user_list.user,card_list.id as card_id, card_list.title as card_title, user_list.create_time, user_list.reply, user_list.status, user_list.input_list
        FROM user_list, card_list
        WHERE user_list.card_id = card_list.id and status=?
        ORDER BY user_list.id DESC
        LIMIT 0, ?`,
            [status, limit], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _select_user_from_user(user) {
    return new Promise((resolve) => {
        query(`SELECT user_list.id, user_list.user,card_list.id as card_id, card_list.title as card_title, user_list.create_time, user_list.reply, user_list.status, user_list.input_list
        FROM user_list, card_list
        WHERE user_list.card_id = card_list.id AND user=?
        ORDER BY user_list.id DESC`, [user], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _select_user_from_user_and_cardid(obj) {
    let { user, select_id } = obj;
    return new Promise((resolve) => {
        query('SELECT * FROM `user_list` WHERE `user` = ? and `card_id`=? ORDER BY `id` DESC', [user, select_id], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _insert_user(obj) {
    return new Promise((resolve) => {
        let { user, card_id, price, input_list } = obj;
        let create_time = new Date().getTime(), status = 0;
        query("INSERT INTO `user_list` (`user`, `card_id`, `price`,`create_time`,`input_list`, `status`) VALUES (?, ?, ?, ?,?, ?)",
            [user, card_id, price, create_time, input_list, status], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _update_status_from_id(obj) {
    return new Promise((resolve) => {
        let { status, id } = obj;
        query("UPDATE `user_list` SET `status`=? WHERE (`id`=?)",
            [status, id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _update_reply_from_id(obj) {
    return new Promise((resolve) => {
        let { reply, id } = obj;
        query("UPDATE `user_list` SET `reply`=? WHERE (`id`=?)",
            [reply, id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}

async function getList(req, res) {
    let { type } = req.body;
    if (type == 0) {
        let { err, data } = await _select_all_user();
        res.json({
            err, data
        })
    } else {
        type = type - 1;
        let { err, data } = await _select_user_from_status(type);
        res.json({
            err, data
        })
    }
}


async function insertUser(req, res) {
    try {
        let { err, data } = await _insert_user(req.body);
        res.json({ err, data })
    } catch (e) {
        res.json({
            err: !!e,
            data: e.toString()
        })
    }
}

async function updateStatus(req, res) {
    try {
        console.log(req.session.userData)
        if (!req.session.userData) {
            res.json({
                err: true,
                code: -2,//login fail
                data: '请重新登录'
            })
            return
        }
        let { err, data } = await _update_status_from_id(req.body);
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
async function updateReply(req, res) {
    try {
        if (!req.session.userData) {
            res.json({
                err: true,
                code: -2,//login fail
                data: '请重新登录'
            })
            return
        }
        let { err, data } = await _update_reply_from_id(req.body);
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
async function getUserByUser(req, res) {
    try {
        let { user, select_id } = req.body;
        let objRes;
        if (select_id)
            objRes = await _select_user_from_user_and_cardid(req.body);
        else
            objRes = await _select_user_from_user(user);
        let { err, data } = objRes;
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
    getList,
    insertUser,
    updateStatus,
    getUserByUser,
    _select_user_from_status,
    updateReply
}
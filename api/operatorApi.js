


const query = require('../api/db')
const fs = require('fs')
const path = require('path')
function _select_all_operator() {
    return new Promise((resolve) => {
        query('SELECT * FROM `operator`', (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _select_operator_from_o_id(o_id) {
    return new Promise((resolve) => {
        query('SELECT * FROM `operator` where `o_id`=?', [o_id], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _select_operator_from_o_user(o_user) {
    return new Promise((resolve) => {
        query('SELECT * FROM `operator` where `o_user`=?', [o_user], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}function _select_operator_from_o_user_and_psw(obj) {
    let {o_user, o_psw} = obj;
    return new Promise((resolve) => {
        query('SELECT * FROM `operator` where `o_user`=? and `o_psw`=?', [o_user, o_psw], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _insert_operator(obj) {
    return new Promise((resolve) => {
        let {o_user,o_psw,o_level} = obj;
        if(!o_user||!o_psw){
            resolve({
                err: true,
                data: '帐号和密码为空'
            })
            return;
        }
        query("INSERT INTO `operator` (`o_user`, `o_psw`, `o_level`) VALUES (?,?,?)",
            [o_user,o_psw,o_level], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _update_operator(obj) {
    return new Promise((resolve) => {
        let { o_id,o_psw,o_level} = obj;
        query("UPDATE `operator` SET `o_psw`=?,`o_level`=? WHERE (`o_id`=?)",
            [o_psw,o_level,o_id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _delete_operator_from_id(o_id) {
    return new Promise((resolve) => {
        query("DELETE FROM `operator` WHERE (`o_id`=?)",
            [o_id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}

// async function update(req, res) {
//     try {
//         let { body } = req;
//         let { o_id } = body;
//         var err, data;
//         if (o_id) {
//             var { err, data } = await _select_operator_from_o_id(o_id);
//             if (err) throw data
//             var { err, data } = await _update_operator(body);
//         } else {
//             var { err, data } = await _insert_operator(body);
//         }
//         res.json({
//             err, data
//         })
//     } catch (e) {
//         res.json({
//             err: !!e,
//             data: e
//         })
//     }
// }

async function update(req, res) {
    try {
        let { body } = req;
        let { o_id } = body;
        var err, data;
        if (o_id) {
            var { err, data } = await _update_operator(body);
        } else {
            throw 'operator not found'
        }
        res.json({
            err, data
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e
        })
    }
}

async function getList(req, res) {
    try {
        let { err, data } = await _select_all_operator();
        res.json({
            err, data
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e
        })
    }
}
async function deleteR(req, res) {
    try {
        let { o_id } = req.body;
        let { err, data } = await _delete_operator_from_id(o_id);
        res.json({
            err, data
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e
        })
    }
}
async function insert(req, res) {
    try {
        let { body } = req;
        let { o_user } = body;
        var err, data;
        if(o_user){
            var { err, data } = await _select_operator_from_o_user(o_user);
            if (err) throw data
            if(data && data.length > 0){
                throw '用户名已存在'
            }
        }else{
            throw '用户名为空'
        }
        var { err, data } = await _insert_operator(req.body);
        res.json({
            err, data
        })
    } catch (e) {
        res.json({
            err: !!e,
            data: e
        })
    }
}

async function login(req,res){
    try{
    var {err, data} = await _select_all_operator(req.body); 
    if(err) throw data 
    if(data&&data.length<1){
        var {err, data} = await _insert_operator({...req.body,o_level:1});
        req.session.userData = {
            ...req.body,
            o_level: 1
        };
        res.json({err,data})
        return
    } 
    var {err, data} = await _select_operator_from_o_user_and_psw(req.body);   
        if(err) throw data;
    if(data&&data.length > 0){
        req.session.userData = data[0];
        console.log(req.session.userData)
        res.json({
            err: false,
            login: true,
            data: data[0]
        })
    }else{
        res.json({
            err: true,
            login: false,
            data: '帐号和密码错误'
        })
    }
    }catch(e){
        res.json({
            err: true,
            data: e
        })
    }
}

module.exports = {
    getList,
    update,
    deleteR,
    insert,
    login,
    _select_all_operator
}
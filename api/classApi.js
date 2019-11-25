


const query = require('../api/db')
const fs = require('fs')
const path = require('path')
function _select_all_class() {
    return new Promise((resolve) => {
        query('SELECT * FROM `card_type`', (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _select_class_from_id(id) {
    return new Promise((resolve) => {
        query('SELECT * FROM `card_type` where `id`=?', [id], (err, response) => {
            resolve({
                err: !!err,
                data: err ? err : response
            })
        })
    })
}
function _insert_class(obj) {
    return new Promise((resolve) => {
        let { title, img, show_flag } = obj;
        query("INSERT INTO `card_type` (`title`, `img`, `show_flag`) VALUES (?,?,?)",
            [title, img, show_flag], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _update_class(obj) {
    return new Promise((resolve) => {
        let { title, id, img, show_flag } = obj;
        query("UPDATE `card_type` SET `title`=?,`img`=?, `show_flag`=? WHERE (`id`=?)",
            [title, img, show_flag, id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}
function _delete_class_from_id(id) {
    return new Promise((resolve) => {
        query("DELETE FROM `card_type` WHERE (`id`=?)",
            [id], (err, response) => {
                resolve({
                    err: !!err,
                    data: err ? err : response
                })
            })
    })
}

async function update(req, res) {
    try {
        let { body } = req;
        let { id } = body;
        var err, data;
        if (id) {
            var { err, data } = await _select_class_from_id(id);
            if (err) throw data
            var { err, data } = await _update_class(body);
        } else {
            var { err, data } = await _insert_class(body);
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
        let { err, data } = await _select_all_class();
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
        let { id } = req.body;
        let { err, data } = await _delete_class_from_id(id);
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
        let { err, data } = await _insert_class(req.body);
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

module.exports = {
    getList,
    update,
    deleteR,
    insert,
    _select_class_from_id,
    _select_all_class
}
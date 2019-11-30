const query = require('../api/db')
const fs = require('fs')
const path = require('path')
const { _select_all_class } = require('./classApi')
function _select_all_card () {
  return new Promise((resolve) => {
    query('SELECT * FROM `card_list` order by hot desc', (err, response) => {
      resolve({
        err: !!err,
        data: err ? err : response
      })
    })
  })
}
function _select_card_from_id (id) {
  return new Promise((resolve) => {
    query('SELECT * FROM `card_list` where `id` = ?', [id], (err, response) => {
      resolve({
        err: !!err,
        data: err ? err : response
      })
    })
  })
}
function _select_card_from_typeid (typeid) {
  return new Promise((resolve) => {
    query('SELECT * FROM `card_list` where `typeid` = ? order by hot desc', [typeid], (err, response) => {
      resolve({
        err: !!err,
        data: err ? err : response
      })
    })
  })
}
function _insert_card (obj) {
  let { typeid, img, title, content, info, custom_data, input_line, hot } = obj;
  return new Promise((resolve) => {
    query("INSERT INTO `card_list` (`typeid`, `img`, `title`, `content`, `info`, `custom_data`, `input_list`, `hot`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [typeid || null, img || null, title || null, content || null, info || null, custom_data || null, input_line || null, hot || 0], (err, response) => {
        resolve({
          err: !!err,
          data: err ? err : response
        })
      })
  })
}
function _update_card (obj) {
  let { typeid, img, title, content, info, custom_data, input_line, id, hot } = obj;
  return new Promise((resolve) => {
    query("UPDATE `card_list` SET `typeid`=?, `img`=?, `title`=?, `content`=?, `info`=?, `custom_data`=?, `input_list`=?, `hot`=? WHERE (`id`=?)",
      [typeid || null, img || null, title || null, content || null, info || null, custom_data || null, input_line || null, hot || 0, id], (err, response) => {
        resolve({
          err: !!err,
          data: err ? err : response
        })
      })
  })
}
function _delete_card_from_id (id) {
  return new Promise((resolve) => {
    query("DELETE FROM `card_list` WHERE (`id`=?)", [id],
      (err, response) => {
        resolve({
          err: !!err,
          data: err ? err : response
        })
      })
  })
}

async function getList (req, res) {
  let { err, data } = await _select_all_card();
  res.json({
    err, data
  })
}

async function getListBaseType (req, res) {
  try {
    var { err, data } = await _select_all_class();
    if (err) throw data
    if (data && data.length < 1) {
      res.json({ err: false, data: [] })
      return
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        var tempObj = await _select_card_from_typeid(element.id);
        if (tempObj.err || !tempObj.data || tempObj.data.length < 1) tempObj.data = []
        for (const key in tempObj.data) {
          if (tempObj.data.hasOwnProperty(key)) {
            const element = tempObj.data[key];
            element.key = element.id;
          }
        }
        element.list = tempObj.data;
      }
    }
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
async function getGoodInfo (req, res) {
  try {
    let { id } = req.body;
    let { err, data } = await _select_card_from_id(id);
    let resData = null;
    if (!err && (data && data.length > 0)) {
      resData = data[0]
    }
    res.json({
      err, data: resData
    })
  } catch (e) {
    res.json({
      err: !!e,
      data: e.toString()
    })
  }
}
async function deleteCard (req, res) {
  try {
    let { id } = req.body;
    var { err, data } = await _select_card_from_id(id);
    if (err) throw data
    if (data.length < 1) throw '删除的活动不存在'
    let img = data[0].img;
    let _filename = img.split('/').pop();
    try {
      let response = fs.unlinkSync(path.join(__dirname, '../public/upload/') + _filename)
    } catch (e) {

    }
    var { err, data } = await _delete_card_from_id(id);
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
async function update (req, res) {
  try {
    let { body } = req;
    let { id } = body;
    var err, data;
    if (id) {
      var { err, data } = await _select_all_card();
      if (err) throw err
      var { err, data } = await _update_card(body);
    } else {
      var { err, data } = await _insert_card(body);
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

module.exports = {
  getList,
  update,
  deleteCard,
  getGoodInfo,
  getListBaseType
}
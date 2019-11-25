

const express = require('express')
const router = express.Router()

const { getList, update, deleteR, insert } = require('../api/classApi')


router.get('/getList', (req, res) => getList(req, res))
router.post('/update', (req, res) => update(req, res))
router.post('/delete', (req, res) => deleteR(req, res))
router.post('/insert', (req, res) => insert(req, res))

module.exports = router
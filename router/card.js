

const express = require('express')
const router = express.Router()

const { getList, update, deleteCard, getGoodInfo, getListBaseType } = require('../api/cardApi')


router.post('/getList', (req, res) => getList(req, res))
router.post('/getListBaseType', (req, res) => getListBaseType(req, res))

router.post('/update', (req, res) => update(req, res))
router.post('/delete', (req, res) => deleteCard(req, res))
router.post('/getGoodInfo', (req, res) => getGoodInfo(req, res))

module.exports = router
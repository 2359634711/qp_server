

const express = require('express')
const router = express.Router()

const { 
    getList,
    update,
    deleteR,
    insert,
    login
} = require('../api/operatorApi')


router.get('/getList', (req, res) => getList(req, res))
router.post('/update', (req, res) => update(req, res))
router.post('/reginstor', (req, res) => insert(req, res))
router.post('/login', (req, res) => login(req, res))

module.exports = router
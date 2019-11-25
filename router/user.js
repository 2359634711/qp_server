const express = require('express')
const router = express.Router()

const { getList, insertUser, updateStatus, updateReply, getUserByUser } = require('../api/userApi')


router.post('/getList', (req, res) => {
    getList(req, res)
})
router.post('/insertUser', (req, res) => {
    insertUser(req, res)
})
router.post('/updateStatus', (req, res) => {
    updateStatus(req, res)
})
router.post('/updateReply', (req, res) => {
    updateReply(req, res)
})
router.post('/getUserByUser', (req, res) => {
    getUserByUser(req, res)
})



module.exports = router
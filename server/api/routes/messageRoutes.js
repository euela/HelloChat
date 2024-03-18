import express from 'express'
import {sendmessages,fetchmessages} from '../controllers/messageControllers.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/',verifyToken,sendmessages)
router.get('/',verifyToken,fetchmessages)

export default router;
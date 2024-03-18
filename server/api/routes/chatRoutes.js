import {
    fetchchat,adduser,
    accessprivate,removeuser,
    creategroup,findusers} from "../controllers/chatControllers.js";
import {verifyToken} from "../utils/verifyToken.js";
import express from 'express'

const router = express.Router();

router.get('/fetchusers',verifyToken,fetchchat);
router.post('/add',verifyToken,adduser);
router.get('/accesschat',verifyToken,accessprivate)
router.post('/creategroup',verifyToken,creategroup);
router.post('/remove',verifyToken,removeuser);
router.get('/',verifyToken,findusers);


export default router;

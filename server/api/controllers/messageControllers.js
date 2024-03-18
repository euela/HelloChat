import {errorHandler} from '../utils/errorHandler.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'

export const sendmessages = async(req,res,next) => {
  const {content,chatId} = req.body
  if(!content || !chatId){
    next(errorHandler(400,'Please add content'))
  }

  let newMessage = {
    sender:req.user.id,
    content,
    chat:chatId
  }

  try{
    let message =  await Message.create(newMessage)

    message = await message.populate('sender','name pic');
    message = await message.populate('chat');

    message = await User.populate(message,{
      path:'chat.users',
      select:'name pic email',
    })

    await Chat.findByIdAndUpdate(chatId,{
      latesMessage:message
    },{new:true})
    res.json(message) 
  }catch(error){
    next(errorHandler(400,`bad request: ${error}`))
  }
}

export const fetchmessages = async(req,res,next) => {
  const chatId = req.query.chatId
  if(!chatId){
    next(errorHandler(404,'Data Not Found'));
  }
 try{
  const message = await Message.find({chat:chatId})
  .populate('sender','name pic email')
  .populate('chat');
  res.json(message)
 }catch(error){
  console.log(error)
  next(errorHandler(400,`error:${error}`))
 } 
}

import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    isRead:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }]
},{timestamps:true,strictPopulate:false });

const Message = mongoose.model('Message',messageSchema)

export default Message;
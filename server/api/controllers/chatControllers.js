import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'
import { errorHandler } from '../utils/errorHandler.js'

export const findusers = async (req,res,next) => {
    const keyword = req.query.search ? {
        $and: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {}

    try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user.id } }).select("-password");
        res.status(200).json(users)
    } catch (error) {
        next(errorHandler(400, `Error: ${error}`))
    }
}

export const fetchchat = async(req,res,next) => {
    try {
       let results = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("isAdmin", "-password")
            .sort({ updatedAt: -1 })
    
        results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                })
    
        if (!results) {
            next(errorHandler(400, 'No Contacts Available'))
        }
        res.status(200).json(results)
    } catch (error) {
        next(errorHandler(400, `Error: ${error}`))
    }
}


export const accessprivate = async (req, res, next) => {
        const userId = req.query.id;
        if (!userId) {
          next(errorHandler(400,"UserId param not sent with request"))
        }
      
        var isChat = await Chat.find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } },
          ],
        }).populate("users", "-password").populate("latestMessage");
      
        isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        if (isChat.length > 0) {
          res.send(isChat[0]);
        } else {
          var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId],
          };
          try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
            );
            res.status(200).json(FullChat);
          } catch (error) {
            next(errorHandler(400,`bad request: ${error}`))
          }
        }
}

export const creategroup = async (req, res, next) => {
    const { groupName, members } = req.body
    if(!groupName || !members || members.length < 2){
        next(errorHandler(400,'please add your values'))
    }
    try {
        const myGroup = {
            chatName: groupName,
            users: members,
            isGroupChat: true,
            isAdmin: req.user.id
        }
        const group = await Chat.create(myGroup)
        const finalGroup = await Chat.find({ _id: group._id })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("isAdmin", "-password")
        console.log(finalGroup)
        res.status(200).json(finalGroup)
    } catch (error) {
        next(errorHandler(400, `Error: ${error}`))
    }
}

export const adduser = async (req, res, next) => {
    const { groupId, members, groupName} = req.body
    try {
        const group = await Chat.findByIdAndUpdate(groupId, {
            $push: { users: { $each: members } },
            $set: { chatName: groupName }
        }, { new: true }).populate("users", "-password")
            .populate("latestMessage").populate("isAdmin", "-password")
        if (!group) {
            next(errorHandler(404, 'group not found'))
        } else {
            res.status(200).json(group)
        }
    } catch (error) {
        next(errorHandler(400, `Error: ${error}`))
    }

}

export const removeuser = async (req, res, next) => {
    const { groupId, members, groupName} = req.body
    try {
        const group = await Chat.findByIdAndUpdate(groupId, {
            $pullAll: { users:members  },
            $set: { chatName: groupName }
        }, {
            new: true
        }).populate("users", "-password")
            .populate("isAdmin", "-password")
            .populate("latestMessage")
        console.log(group.users)
        if (!group) {
            next(errorHandler(404, 'group not found'))
        }
        res.status(200).json(group)
    } catch (error) {
        next(errorHandler(400, `Error: ${error}`))
    }
}


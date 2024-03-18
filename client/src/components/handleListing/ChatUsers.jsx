import React from 'react'
import { Box, Text, Avatar, VStack } from '@chakra-ui/react'
import { setSelectedChat } from '../../redux/slice/chatSlice.js'
import { useDispatch,useSelector} from 'react-redux'
import {senderLogic, senderPicLogic} from '../logic/chatLogic.js'

export default function ChatUsers({ chats }) {
  const {current_user} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  return (
    <Box
    mt='10px'ml='0px' 
    display="flex"
    justifyContent='start'
    flexDirection='column' p='10px' pt='0px'
    overflowY='scroll'
     bg='orange.200'  h='457px'>
      {chats.map(chat => (
          <Box
          key={chat._id}
          bgGradient="linear(90deg,orange.300,orange.200)"
          _hover={{ bg: 'orange.400' }}
          cursor='pointer'
          display='flex'
          borderRadius='0 20px 20px 0'
          _active={{ bg: 'orange.600' }} p='8px' m='5px'
          onClick={()=>dispatch(setSelectedChat(chat))}
        > 
        <Avatar size='sm'src={!chat.isGroupChat && senderPicLogic(current_user,chat.users)}></Avatar>
        <Text fontSize='20px' pl='5px'>{chat.isGroupChat? chat.chatName: senderLogic(current_user,chat.users)}</Text>
         {chat.latestMessage && (
            <Box>
               <Text fontSize="xs">
                <b>{chat.latestMessage.sender.name} : </b>
                   {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                  <Avatar src={chat.latestMessage.sender.pic}/>
             </Box>
                )}
        </Box>
      ))}
    </Box>
  )
}

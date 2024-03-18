import React from 'react'
import { Box, useToast } from '@chakra-ui/react'
import ChatList from '../components/chatSection/ChatList'
import ChatBox from '../components/chatSection/ChatBox'
import ChatHeader from '../components/chatSection/ChatHeader'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

export default function ChatPage() {
  const navigate = useNavigate()
  const toast = useToast()
  return (
    <Box w='100%' position='fixed' left='0' top='0'>
      <ChatHeader />
      <Box display='flex' 
      justifyContent='space-between' layoutw='100%'
       backgroundImage='url("./5d0179702500004e12df2b4e.jpeg")' 
       h='91vh' p='10px' backgroundPosition='center'
       backgroundSize='cover'>
        <ChatList />
        <ChatBox />
      </Box>
    </Box>
  )
}

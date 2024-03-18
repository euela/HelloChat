import React from 'react'
import { Box, Text,Button, Avatar, Spacer,useToast } from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa';
import { useDisclosure } from '@chakra-ui/hooks';
import MainSlider from '../pseudoWindow/MainSlider';
import { useSelector } from 'react-redux';
import EditGroup from '../pseudoWindow/EditGroup' 
import { senderLogic } from '../logic/chatLogic';
import ViewProfile from '../pseudoWindow/ViewProfile'

export default function ChatHeader() {
  const {current_user} = useSelector(state=>state.user)
   const { isOpen, onOpen, onClose } = useDisclosure();
  const {selectedChat} = useSelector(state=>state.chat)
  const toast = useToast()
  const btnRef = React.useRef()
  
  return (
    <Box bgGradient="linear(45deg,orange.600,yellow.100)" my='0'
      h='60px' display='flex' justifyContent='center'
      alignItems='center' w='100%'>
      <Box w='30px' h='30px' ml='20px' onClick={onOpen}_hover={{ bg: 'orange.500' }}
        borderRadius='6px' bg='orange.700'
        display='flex' justifyContent='center' alignItems='center'>
        <FaBars color="white" size={20} />
          <MainSlider btnRef={btnRef} isOpen={isOpen} onClose={onClose}/>
      </Box>
      <Box display='flex' justifyContent='center'
        alignItems='center' w='100%'>
        {selectedChat && !selectedChat.isGroup
          && <>
                <Box ml='32%' display='flex' justifyContent='center' flexDirection='row'>
                  {selectedChat && selectedChat.isGroupChat && <EditGroup/>}
                  {selectedChat && !selectedChat.isGroupChat && <ViewProfile/>}
                </Box>
                <Spacer></Spacer>
             </>
        }
        <img style={{ width: selectedChat? '30px':'60px' }} src="logo192.png" alt="Company Logo" />
        <Text fontFamily='Work Sans' transition="all 0.3s" fontSize={{ base: selectedChat? '1rem':'1rem', md: selectedChat? '1.4rem':'2rem' }} pl='4' mr='20px'>Hello chat</Text>
      </Box>
    </Box>
  )
}

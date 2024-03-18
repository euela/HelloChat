import React from 'react'
import { useSelector } from 'react-redux'
import { 
    useDisclosure,
    Modal,Avatar,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,Text,
    ModalCloseButton,
    Box,
} from '@chakra-ui/react'
import { senderLogic, senderPicLogic } from '../logic/chatLogic'
export default function ViewProfile() {
    const {selectedChat} = useSelector(state=>state.chat)
    const {current_user} = useSelector(state=>state.user)
    const {onOpen,onClose,isOpen} = useDisclosure()

  return (
    <Box>
        <Box display='flex' justifyContent='center'>
            <Box mr='20px'  p='6px'bg='orange' borderRadius='80px' w='60px' h='60px'>
                <Avatar onClick={onOpen}></Avatar>            
            </Box>
            <Text fontSize='30px'>{senderLogic(current_user,selectedChat.users)}</Text>  
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgGradient='linear(90deg,orange.400,orange.200)'>
            <ModalHeader>
                <Box w='100%'display='flex' justifyContent='center'>
                     <Text fontSize='30px'>{senderLogic(current_user,selectedChat.users)}</Text>
                </Box> 
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box w='100%'display='flex' justifyContent='center'>
                    <Avatar size='xl'src={senderPicLogic(current_user,selectedChat.users)}></Avatar>
                </Box> 
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </Box>
  )
}

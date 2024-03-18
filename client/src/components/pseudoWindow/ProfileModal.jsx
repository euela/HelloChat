import {
    Avatar, Box, Modal,
    ModalOverlay,Button,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,Text,
    ModalCloseButton,Input
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import React from 'react'

export default function ProfileModal({current_user}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
         <Box>
            <Box  borderRadius='40px' 
            border='5px solid lightyellow'
            _hover={{border:'5px solid lightgreen'}}
            bg='orange.300' _active={{border:'5px solid green'}}>
                <Avatar src={current_user.pic} size='lg' onClick={onOpen} />
            </Box>
            <Modal 
              isCentered 
              isOpen={isOpen} size='lg'  
              closeOnOverlayClick={false} 
              onClose={onClose}>
                <ModalOverlay />
                <ModalContent >
                  <Box display='flex' bgGradient='linear(90deg,orange.400,orange.200)' 
                  justifyContent='center'>
                    <ModalHeader display='flex' justifyContent='center'>
                        Profile
                    </ModalHeader>
                    </Box>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display='flex' w='110px' bgGradient='linear(90deg,orange.400,orange.200)'
                         mt='10px' border='2px solid white'
                         borderRadius='20px' ml='5px' py='15px' px='227px' flexDirection='column'>
                           {current_user.pic &&  <Avatar ml='20px' ml='-45px'size='xl' pb='10px'src={current_user.pic}/>}
                            <Button w='100px' ml='-45px'>EDIT</Button>
                        </Box>

                        <Box 
                        display='flex' mt='10px' borderRadius='20px'
                        ml='5px' border='2px solid white'
                        p='10px' flexDirection='column' bgGradient='linear(90deg,orange.400,orange.200)'>
                            <Text fontSize='30px' ml='150px'>username</Text>
                            <Input placeholder={current_user.name}  w='60%' mx='auto' mb='10px'></Input>
                            <Button ml='170px'w='100px'>EDIT</Button>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
      
    )
}


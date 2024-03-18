import { Avatar, Modal,
  ModalOverlay,Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,Text,
  ModalCloseButton,
  Input,Spacer,Box,useToast,useDisclosure} from '@chakra-ui/react'
import axios from 'axios'
import {
CheckCircleIcon
} from '@chakra-ui/icons'
import { setFetch, setSelectedChat } from '../../redux/slice/chatSlice'
import React,{useEffect, useState}from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { senderIDLogic, senderLogic } from '../logic/chatLogic'

export default function EditGroup() {
    const {onOpen,onClose,isOpen} = useDisclosure()
    const [members,setMembers] = useState([]) 
    const toast = useToast()
    const [myLists,setMyList] = useState([])
    const [selectedList,setSelectedList] = useState([])
    const [isRemove,setRemove] = useState(true)
    const {chats,selectedChat,fetch} = useSelector(state=>state.chat)
    const {current_user} = useSelector(state=>state.user)
    const [groupName,setGroupName] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
      const filteredList = selectedChat.users.filter((chat) => chat._id !== current_user._id);
      setSelectedList([...filteredList]);
    }, [selectedChat,current_user]);
    
    useEffect(() => {
      const filteredList = chats.filter((chat) => chat.isGroupChat !== true);
      setMyList([...filteredList]);
    }, [chats]);

    const handleChange = (e) => {
      setGroupName(e.target.value)
    }

    const handleEditGroup = async() => {
      try{  
        if(!groupName && members.length === 0){
          toast({
            title:'add values to edit',
            status:'warning',
            duration:3000,
            positon:'top',
            isClosable:true
          })
          return;
        }
        if(!isRemove){
          if(groupName.length === 0 || !groupName){
            setGroupName(selectedChat.chatName)
          }
          if(members.length === 0){
            const memId = myLists.map(m=>m.id)
            setMembers([...memId])
          }
          const {data} = await axios.post('/api/chat/add',{groupId:selectedChat._id,groupName,members})

          toast({
            title:'successfully Added',
            status:'success',
            duration:5000,
            position:'bottom',
            isClosable:true
          })
          dispatch(setFetch(!fetch)) 
          dispatch(setSelectedChat(data))
          onClose()
        }else{
          if(groupName.length === 0 || !groupName){
            setGroupName(selectedChat.chatName)
          }
          if(selectedChat.users.length - members.length < 3){
            toast({
              title:'you need at least 3 members',
              status:'warning',
              duraton:3000,
              position:'top',
              isClosable:true,
            })
            return;
          }
          const memId = selectedChat.users.map(m => m.id);
          const {data} = await axios.post('/api/chat/remove',{groupId:selectedChat._id,groupName,members})
          toast({
            title:'successfully removed',
            status:'success',
            duration:5000,
            position:'bottom',
            isClosable:true
          })
          dispatch(setFetch(!fetch))
          dispatch(setSelectedChat(data)) 
          onClose()
        }
      }catch(error){
        toast({
          title:'Unable to edit group',
          status:'warning',
          description:`Error: ${error.response.data.message}`,
          duration:5000,
          position:'bottom',
          isClosable:true, 
        })
      }
    }
    const handleAddToGroup = (id) => {
      setMembers((prevMembers)=>{
          const isSelected = members.includes(id)
          if(isSelected){
             return prevMembers.filter(selectedId=>selectedId !== id )
          }else{
              const updatedMembers = [...prevMembers, id];
              return updatedMembers;
          }
      })
  }

  return (
    <Box>
      <Box display='flex' justifyContent='center'>
            <Box mr='20px'  p='6px'bg='orange' borderRadius='80px' w='60px' h='60px'>
                <Avatar onClick={onOpen}></Avatar>            
            </Box>
            <Text fontSize='30px'>{selectedChat.chatName}</Text>  
        </Box>
        <Modal isCentered
              isOpen={isOpen} size='lg'  
              closeOnOverlayClick={false} 
              onClose={onClose}>
                <ModalOverlay />
                <ModalContent >
                  <Box display='flex'  bgGradient='linear(90deg,orange.400,orange.200)' 
                  justifyContent='center'>
                    <ModalHeader display='flex' justifyContent='center'>
                        <Text textAlign='center'fontSize='20px' whiteSpace='nowrap'>Edit Group</Text>
                    </ModalHeader>
                    </Box>
                    <ModalCloseButton />
                    <ModalBody>
                      <Box pb='20px' bgGradient='linear(90deg,orange.500,orange.300)' pt='60px'borderRadius='20px'>  
                        <Box display='flex' flexDirection='column' 
                        w='98%' borderRadius='20px' h='150px' alignItems='center'
                         justifyContent='center' bgGradient="linear(90deg,orange.400,orange.200)"m='auto' >
                          <Text mt='20px' bg='orange.400' borderRadius='5px'w='200px' textAlign='center'fontSize='20px'>Edit Group Name</Text>
                            <Input p='20px' w='90%' h='10px' mb='20px'
                            placeholder={selectedChat.chatName} 
                            borderRadius='5px'mt='20px'mx='auto' bg='white' value={groupName} onChange={handleChange}></Input>
                            <Box mt='10px' display='flex'>
                              <Button mr='190px' boxShadow={!isRemove && '0 0 10px rgba(0, 255, 0,1)'}  h='30px'colorScheme='green' onClick={()=>{setRemove(false);setMembers([]) }}>Add</Button>
                              <Button h='30px' boxShadow={isRemove && "0 0 30px rgba(255, 0, 0,1)"} colorScheme='red'onClick={()=>{setRemove(true);setMembers([])}}>Remove</Button>
                            </Box>
                        </Box>
                        <Box
                            mt='30px' mx='auto' 
                            display="flex"
                            flexDirection='column' p='10px' pt='0px'
                            overflowY='scroll' w='80%'
                              h='400px' borderRadius='20px'
                              bg='orange.200'
                        >
                          {isRemove && selectedList.map(user => (
                                <Box
                                    key={user._id}
                                    bgGradient="linear(90deg,orange.400,orange.200)"
                                    display='flex' mt='6px' m='5px' 
                                    _hover={{ bg: 'orange.400' }}
                                    cursor='pointer'
                                    alignItems='center'
                                    borderRadius=' 0 20px 20px 0'
                                    _active={{ bg: 'orange.600'}}
                                    p='3px' 
                                    onClick={()=>{
                                      if(user._id && current_user){
                                          handleAddToGroup(user._id)  
                                      }
                                        return;
                                    }}
                                > 
                                    <Avatar mr='10px' src={user.pic}/>
                                    <Text fontSize='30px'>{user.name}</Text>
                                    <Spacer/>
                                    {isRemove && members.includes(user._id) && <CheckCircleIcon  color='orange.800' w={6} h={6}/>}
                                </Box>))}
                          
                              {(!isRemove && myLists.map(user => (
                                <Box
                                    key={user._id}
                                    bgGradient="linear(90deg,orange.400,orange.200)"
                                    display='flex' mt='6px' m='5px' 
                                    _hover={{ bg: 'orange.400' }}
                                    cursor='pointer'
                                    alignItems='center'
                                    borderRadius=' 0 20px 20px 0'
                                    _active={{ bg: 'orange.600'}}
                                    p='3px' 
                                    onClick={()=>{
                                      const hasMatch = selectedChat.users.some(person => person._id === user._id);
                                      if (hasMatch) {
                                          return;
                                      }
                                      // Continue with your logic here if no match is found
                                        if(user.users && current_user){
                                          handleAddToGroup(senderIDLogic(current_user,user.users))
                                        }
                                        console.log(user.users)
                                        return;
                                    }}
                                > 
                                    <Avatar mr='10px' />
                                    <Text fontSize='30px'>{senderLogic(current_user,user.users)}</Text>
                                    <Spacer/>
                                    {!isRemove && members.includes(senderIDLogic(current_user,user.users)) && <CheckCircleIcon  color='orange.800' w={6} h={6}/>}
                                </Box>
                            )))}
                        </Box>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme='green' onClick={()=>handleEditGroup(selectedChat)}>Edit Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </Box>
        
    
  )
}

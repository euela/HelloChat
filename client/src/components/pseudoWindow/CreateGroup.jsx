import React,{useState}from 'react'
import { 
    useDisclosure,
    Modal,
    Text,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Avatar,
    ModalBody,
    Input,
    ModalCloseButton,
    Box,
    Button,
    useToast,
    Spacer
} from '@chakra-ui/react' 
import axios from 'axios'
import {CheckCircleIcon} from '@chakra-ui/icons'
import {setChats,setFetch} from '../../redux/slice/chatSlice.js'
import { useSelector,useDispatch } from 'react-redux'
import { senderLogic,senderIDLogic,senderPicLogic } from '../logic/chatLogic'

export default function CreateGroup() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { chats,fetch} = useSelector(state => state.chat)
    const {current_user} = useSelector(state => state.user)
    const [groupName,setGroupName] = useState('')
    const dispatch = useDispatch()
    const [members,setMembers] = useState([])
    const toast = useToast()
    const lists = [...chats]
    const myLists = lists.filter((list)=>list.isGroupChat !== true)
    const handleChange = (e) => {
        setGroupName(e.target.value)
    }
    const handleCreateGroup = async() => {
        try{
            if(!groupName || members.length <= 2 ){
                toast({
                    title: "add more than 2 users and add your group name",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
            const {data} = await axios.post('/api/chat/creategroup',
            {
            groupName,
            members,
            })
            dispatch(setChats([...data, ...chats]))
            dispatch(setFetch(!fetch))
            onClose()
        }catch(error){
            toast({
                title: "Unable to create group",
                status: "warning",
                description:`Error: ${error.response.data.message}`,
                duration: 5000,
                isClosable: true,
                position: "bottom",
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

                // Add current_user._id only if it's not already in the list
                if (!prevMembers.includes(current_user._id)) {
                    updatedMembers.push(current_user._id);
                }
    
                return updatedMembers;
            }
        })
    }
    

    return (
        <Box>
            <Box display='flex' justifyContent='center'>
                <Button mt='10px'colorScheme='green' 
                h='50px'fontSize='30px' onClick={onOpen}>Create Group</Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent overflowY='scroll' position='fixed' bottom='-65px'>
                    <ModalHeader bgGradient='linear(90deg,orange.300,orange.200)'>
                        Modal Title
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Text fontSize='30px'>Group Name</Text>
                            <Input w='80%' onChange={handleChange}m='' value={groupName}></Input>
                        </Box>
                        <Box
                            mt='10px' ml='0px' 
                            display="flex"
                            flexDirection='column' p='10px' pt='0px'
                            overflowY='scroll'
                            bg='orange.200'  h='400px'
                        >
                            {myLists?.map(chat => (
                                <Box
                                    key={chat._id}
                                    bgGradient="linear(90deg,orange.300,orange.200)"
                                    display='flex' mt='6px' m='5px' 
                                    _hover={{ bg: 'orange.400' }}
                                    cursor='pointer'
                                    alignItems='center'
                                    borderRadius='0 20px 20px 0'
                                    _active={{ bg: 'orange.600'}}
                                    p='3px' 
                                    onClick={()=>{
                                        if(current_user && chat.users){
                                            handleAddToGroup(senderIDLogic(current_user,chat.users))
                                        }
                                        return;
                                    }}
                                > 
                                    <Avatar mr='10px' src={senderPicLogic(current_user,chat.users)}/>
                                    <Text fontSize='30px'>{chat.isGroupChat? chat.ChatName: senderLogic(current_user,chat.users)}</Text>
                                    <Spacer/>
                                    {members.includes(senderIDLogic(current_user,chat.users)) && <CheckCircleIcon  color='orange.800' w={6} h={6}/>}
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
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreateGroup}>
                            create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}


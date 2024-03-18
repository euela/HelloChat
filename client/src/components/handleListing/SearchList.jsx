import { Avatar, Box, Text,useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setSelectedChat,setFetch } from '../../redux/slice/chatSlice.js';
import { setUserFind } from '../../redux/slice/userSlice.js';
import axios from 'axios';
import React from 'react';

export default function SearchList({ users,search,setSearch}) {
  const dispatch = useDispatch();
  const toast = useToast()

  const handleAccess = async (id) => {
    try {
      const { data } = await axios.get('/api/chat/accesschat', { params: { id:id } });
      toast({
        title: 'User Available',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      dispatch(setSelectedChat(data));
      setSearch('')
      dispatch(setUserFind(null))
      dispatch(setFetch(true))
    } catch (error) {
      toast({
        title: 'User Not Available',
        status: 'warning',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      dispatch(setFetch(false))
    }
  }

  return (
    <Box mt='10px'ml='0px' 
    display="flex" 
    flexDirection='column' p='10px' pt='0px'
     bg='orange.200' overflowY='scroll' h='457px'>
      {users.map(user => (
        <Box key={user._id}
        bgGradient="linear(90deg,orange.400,orange.200)" display='flex'
          justifyContent='start'
          _hover={{ bg: 'orange.400' }}
          cursor='pointer'
          _active={{ bg: 'orange.600' }}
          alignItems='center' mt='10px' p='6px'
          borderRadius='0 20px 20px 0' onClick={() => handleAccess(user._id)}>
          <Avatar mr='6px'src={user.pic} size='sm'></Avatar>
          <Text fontSize='15px' color='gray.600'>{user.name}</Text>
        </Box>
      ))}
    </Box>
  );
}
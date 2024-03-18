import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Text,useToast} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setChats,setFetch } from '../../redux/slice/chatSlice.js';
import { setUserFind } from '../../redux/slice/userSlice.js';
import SearchList from '../handleListing/SearchList.jsx';
import ChatUsers from '../handleListing/ChatUsers.jsx';
import WhileLoading from '../handleListing/WhileLoading.jsx';

export default function ChatList() {
  const {userFind} = useSelector((state) => state.user);
  const { chats,selectedChat,fetch} = useSelector((state) => state.chat);
  const toast = useToast()
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    handleFetch();
  }, [fetch]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/chat/fetchusers');
      dispatch(setChats(data));
      setLoading(false);
      dispatch(setFetch(false))
    } catch (error) {
      toast({
          title: 'Unable to Fetch Users',
          status: 'warning',
          description: error.response.data.message,
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/chat/?search=${search}`);
      dispatch(setUserFind(data));
      console.log(data);
      toast({
        title: 'Search Complete',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
        toast({
          title: 'Please Fill all the Fields',
          status: 'warning',
          description: error.response.data.message,
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
    }
    setLoading(false);
  };

  return (
    <Box h="100%" display={{base:selectedChat?'none':'flex',md:'flex'}} flexDirection='column' w={{base:'100%',md:'300px'}} bg="orange.200" m="0" borderRadius="20px">
      <Box display="flex" bg="orange.300" borderRadius="20px 20px 0 0" h="35px">
        <Input
          placeholder="search..."
          borderRadius="20px 0 0 0"
          border="unset"
          outline="0"
          flexGrow="1"
          h="35px"
          _focus={{ border: 'unset' }}
          onChange={handleChange}
          value={search}
        ></Input>
        <Button
          bg="orange.300"
          borderRadius="0 20px 0 0"
          w="px"
          h="35px"
          _hover={{ bg: 'orange.400' }}
          _active={{ bg: 'orange.600' }}
          onClick={handleSearch}
        >
          <FaSearch />
        </Button>
      </Box>
      {userFind?.length > 0 ? (
        loading ? (
          <WhileLoading />
        ) : (
          <SearchList users={userFind} search={search} setSearch={setSearch}/>
        )
      ) : chats ? (
        <ChatUsers chats={chats} />
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="15px" color="gray.600">
            No Contacts Available
          </Text>
        </Box>
      )}
    </Box>
  );
}

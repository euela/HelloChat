import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Input, Button, Spinner, useToast } from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import SingleChat from './SingleChat';
import { setFetchMessage, setMessage } from '../../redux/slice/messageSlice';
import io from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'

export default function ChatBox() {
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [socket,setSocket] = useState();
  const [socketConnected,setSocketConnected] = useState(false);
  const { selectedChat } = useSelector(state => state.chat);
  const { current_user } = useSelector(state => state.user);
  const { message, fetchMessage } = useSelector(state => state.message);
  const [fetchedMessage,setFetchedMessage] = useState([])
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const defaultOptios = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    renderSettigs:{
      preserveAspectRatio:"xMidYMid slice",
    },
    };

  const ENDPOINT = "http://localhost:4000";
  let selectedChatCompare;

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    initializeSocket();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
          // Give notification
        } else {
          setFetchedMessage(message)
          console.log('new message received')
          dispatch(setMessage([...message, newMessageReceived]));
        }
      });
    }
  }, [socket,message]);
  

  const initializeSocket = () => {
    const newSocket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
    newSocket.emit('setup', current_user);
    newSocket.on('connect', () => {
      setLoading(false);
      setSocketConnected(true)
    });
    newSocket.on('disconnect', () => {
      setLoading(true);
      setSocketConnected(false);
      setTimeout(() => {
        initializeSocket();
      }, 2000);
    });
    newSocket.on('typing',()=>setIsTyping(true))
    newSocket.on('stop typing',()=>setIsTyping(false))
    setSocket(newSocket); // Update socket state
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    if(!socket) return;
    if(!typing){
      setTyping(true)
      console.log(typing)
      console.log(newMessage)
      socket.emit('typing',selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;

    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff > timerLength && typing){
        socket.emit('stop typing',selectedChat._id)
        setTyping(false)
      }
    },timerLength)
  };

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedChat) {
      return;
    }
    if (!socket) {
        initializeSocket()
        setTimeout(()=>{
            console.log('reconecting')
        },2000)
    }
    try {
      const { data } = await axios.post('/api/message/', { content: newMessage, chatId: selectedChat._id });
      setNewMessage('');
      if (data) {
        socket.emit('new message', data);
        dispatch(setFetchMessage(!fetchMessage));
        dispatch(setMessage([...message, data]));
      }
    } catch (error) {
      toast({
        title: 'Unable to send Message',
        status: 'warning',
        description: `Error: ${error}`,
        position: 'bottom',
        isClosable: true,
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const { data } = await axios.get('/api/message/', { params: { chatId: selectedChat._id } });
      if (data) {
        dispatch(setMessage(data));
        setLoading(false);
        if (socket) {
          socket.emit('join chat', selectedChat._id);
        } else {
          // Retry joining chat after a delay if socket is not yet initialized
          setTimeout(() => {
            if (socket) {
              socket.emit('join chat', selectedChat._id);
            }
          }, 4000);
        }
      }
    } catch (error) {
      toast({
        title: 'Unable to fetch messages',
        status: 'warning',
        description: `Error: ${error}`,
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(true);
    }
  };

  return (
    <Box h='100%' flexDirection='column' display='flex' justifyContent='end' 
      w={{ base: selectedChat ? '100%' : '300px', md: '600px', lg: '900px' }} bgGradient='linear(45deg,green,lightgreen,lightblue,lightyellow)'
      m='0' borderRadius='20px' ml={{ base: '0', md: '40px' }}>
      {loading ? <Spinner m='auto' thickness='4px' speed='0.65s' emptyColor='gray.200' color='orange.500' size='xl' /> : <SingleChat />}
      {isTyping?<Box zIndex='99'>
            <Lottie 
              options={defaultOptios}
              width={70}
              style={{marginBottom:15,marginLeft:0}}
            />
          </Box>:<Box h='95px'></Box>}
      <Box display={selectedChat ? 'flex' : 'none'}
        bg='orange.300' width='100%' h='50px' whiteSpace='nowrap' borderRadius='0 0 20px 20px' >
        <Input
          flexGrow='1' borderRadius='0 0 0 20px'
          border='2px solid orange.200'
          _hover={{ border: '3px solid orange.200' }}
          h='50px' placeholder={'.  .  .'}
          onChange={handleChange}
          value={newMessage}>
        </Input>
        <Button
          bg="orange.400"
          borderRadius="0 0 20px 0"
          w="50px"
          h="100%"
          mb='200px'
          _hover={{ bg: 'orange.400' }}
          _active={{ bg: 'orange.600' }}
          onClick={handleMessageSend}
        >
          <MdSend />
        </Button>
      </Box>
    </Box>
  );
}






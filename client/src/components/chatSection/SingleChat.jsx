import React,{useState,useEffect,useRef} from 'react'
import {Box,Text,Tooltip,Avatar} from '@chakra-ui/react'
import {useSelector} from 'react-redux'
import {isSameSender,isLastMessage} from '../logic/chatLogic.js'

export default function SingleChat({}) {
  const {selectedChat} = useSelector(state=>state.chat);
  const {message} = useSelector(state=>state.message);
  const {current_user} = useSelector(state=>state.user);
  const [newMessages,setNewMessages] = useState([])
  const containerRef = useRef(null);

  useEffect(()=>{
    setNewMessages(message)
    //message?.forEach(m=>{console.log(m)})
  },[message])

  useEffect(()=>{
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  },[newMessages])

  return (
    <Box display='flex' flexDirection='column' w='100%'  maxHeight='700px' overflowY='scroll' ref={containerRef}>
      {newMessages && newMessages.map((m,i) => (
        <Box display='flex' mr='10px' ml='10px' key={m._id} justifyContent={m.sender._id!==current_user._id?'start':'end'}  maxWidth='100%'>
           {(isSameSender(newMessages,m,i,current_user._id) || isLastMessage(newMessages,m,i,current_user._id)) 
          && 
            <Tooltip
            label={m.sender.name}
            placement='bottom-start'
            hasArrow 
            >
              <Avatar   src={m.sender.pic} cursor='pointer' size='sm' mr={1} mt='7px' name={m.sender.name}/>
            </Tooltip>}
              <Box m='3px 3px'key={m._id} display='flex' 
               _hover={{bgGradient: 'linear(45deg,green.300,blue.400,orange.200)'}} 
               justifyContent='center' borderRadius={m.sender._id !== current_user._id?'10px 10px 10px 0':'10px 10px 0 10px' } 
               minHeight='30px' maxWidth='200px' maxHeight='200px' 
               bgGradient={m.sender._id !== current_user._id?'linear(45deg,yellow.400,orange.200)':'linear(45deg,red.200,yellow.400)'}>
                  
               <Text fontWeight='700' ml='6px' p='5px' 
               noOfLines={[1, 2, 3, 4]} fontSize='15px' 
               display='flex' justifyContent='center' 
               alignItems='center'>{m.content}</Text>
           </Box>
        </Box>
      ))}
    </Box>
  );
}
 
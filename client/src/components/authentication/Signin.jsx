import { Input ,useToast,Button, FormControl, FormLabel, StackDivider, VStack } from '@chakra-ui/react'
import React, {useState}from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {setUser} from '../../redux/slice/userSlice.js'

export default function Signin() {
    const [formData,setFormData] = useState({})
    const [email,setEMail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()

    const handleEmail = (e) =>{
        setFormData({...formData,email:e.target.value})
    }

    const handlePassword = (e) =>{
      setFormData({...formData,password:e.target.value})
  }
  const handleSubmits = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      return(
        toast({
          title: 'Please Fill all the Fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      )
    }
    try {
      const { data } = await axios.post('/api/user/signin', formData);
      setFormData({ email: '', password: '' }); // Clear the email and password state
      dispatch(setUser(data));
      navigate('/chat');
      toast({
        title: 'signin succesfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      toast({
        title: 'Error During sign-in',
        status: 'warning',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };
  return (
    <VStack
      divider={<StackDivider borderColor='gray.500' />}
      spacing={3}
      align='stretch'
      d='flex'
      justifyContent='center'
    >
     <FormControl>
            <FormLabel>Email: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='email' name='email' onChange={handleEmail}></Input>
        </FormControl>
        <FormControl>
            <FormLabel>Password: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='password' name='password' onChange={handlePassword}></Input>
        </FormControl>
        <Button bgGradient="linear(45deg,orange.600,yellow.100)" w='100px' ml='55px' onClick={handleSubmits}>Send</Button>
    </VStack>
  )
}
  


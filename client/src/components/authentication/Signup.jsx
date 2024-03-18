import React, { useState } from 'react'
import axios from 'axios'
import { Input,useToast,Button, FormControl, FormLabel, StackDivider, VStack } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {setUser} from '../../redux/slice/userSlice.js'

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData,setFormData] = useState({})
  const [retypePassword,setRetypePassword] = useState('')
  const current_user = useSelector(state=>state.user)
  const toast = useToast()

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleReType = (e) => {
    setRetypePassword(e.target.value)
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    if(formData.password !== retypePassword){
        return toast({
          title: "retype password",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
    }
    try{
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const {data} = await axios.post('/api/user/signup',formData,config)
      setFormData({})
      setRetypePassword('')
        toast({
          title: "sign up successfull",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        document.querySelector('#username').value = ''
        document.querySelector('#email').value = ''
        document.querySelector('#password').value = ''
      dispatch(setUser(data))
      navigate('/chat')

    }catch(error){
      toast({
        title: 'Please Fill all the Fields',
        status: 'warning',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } 
  }
  return (
    <VStack
      divider={<StackDivider borderColor='gray.500'/>}
      spacing={3}
      align='stretch'
    >
        <FormControl>
            <FormLabel >Username: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='text' id='username' onChange={handleChange}></Input>
        </FormControl>
        <FormControl>
            <FormLabel>Email: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='email' id='email' onChange={handleChange}></Input>
        </FormControl>
        <FormControl>
            <FormLabel>Password: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='password' id='password' onChange={handleChange}></Input>
        </FormControl>
        <FormControl>
            <FormLabel>Retype password: </FormLabel>
            <Input bgGradient="linear(45deg,orange.600,yellow.100)" type='password'  onChange={handleReType}></Input>
        </FormControl>
        <Button bgGradient="linear(45deg,orange.600,yellow.100)" w='100px' ml='55px' onClick={handleSubmit}>Send</Button>
    </VStack>
  )
}


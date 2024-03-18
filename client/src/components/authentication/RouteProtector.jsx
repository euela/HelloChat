import React from 'react'
import { Outlet,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import {useToast} from '@chakra-ui/react'

export default function RouteProtector() {
    const {current_user} = useSelector(state=>state.user);
    const toast = useToast();
    if(!current_user){
        toast({
            title:'Not Signed in',
            status:'warning',
            postion:'bottom',
            duration:5000,
            isClosable:true,
            description:'Please sign-in'
        })
    }
    return current_user? <Outlet></Outlet> : <Navigate to='/'/>;
}

import React from 'react'
import ProfileModal from './ProfileModal'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Box,Text
  } from '@chakra-ui/react'
import { useSelector,useDispatch } from 'react-redux'
import CreateGroup from './CreateGroup'
import {useNavigate} from 'react-router-dom'
import { setUser } from '../../redux/slice/userSlice.js' 

export default function MainSlider({isOpen,onClose,btnRef}) {
  const {current_user} = useSelector(state=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handlelogout = () => {
    dispatch(setUser(null))
    navigate('/')
  }
  return (
    <Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bgGradient="linear(45deg,orange.600,yellow.100)">
          <DrawerCloseButton />
          <DrawerHeader>
            <Text ml='80px' color='gray.600'fontSize='30px'>Settings</Text>
          </DrawerHeader>

          <DrawerBody>
            <Box display='flex' justifyContent='center'>
               {current_user && <ProfileModal current_user={current_user}/>}
            </Box> 
           <Box display='flex' justifyContent='center'>
               <CreateGroup/>
            </Box> 
            <Box display='flex' justifyContent='center' mt='10px'>
                <Button colorScheme='red' h='50px' w='216px' onClick={handlelogout}>
                  <Text fontSize='25px'>Log-out</Text>
                </Button>
            </Box>
          </DrawerBody>

          <DrawerFooter>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
  

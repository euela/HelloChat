import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Text, Container } from '@chakra-ui/react'
import Signup from '../components/authentication/Signup'
import Signin from '../components/authentication/Signin'
import { useNavigate } from 'react-router-dom'


export default function HomePage() {
  return (
    <Container maxW="xl" centerContent>
      <Box w="100%" minW='300px'  borderRadius='20px' my='5px' h='80px'>
            <Text 
            textAlign='center' 
            py='3px'
            fontFamily='Work Sans' 
            fontSize={{base:'1.6rem',md:'2.4rem'}} color='gray.700' fontWeight='bold'> Wellcome to Hello chat</Text>
      </Box>
          <div style={{backgroundColor:'rgba(255, 165, 0, 0)',border:'2px solid linear-gradient(45deg,blue,green)', padding: '20px'}}>
            <Tabs>
              <TabList>
                <Tab fontSize='1.8rem'>Sign-up</Tab>
                <Tab fontSize='1.8rem'>Sign-in</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Signup/>
                </TabPanel>
                <TabPanel>
                  <Signin/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
    </Container>
  )
}

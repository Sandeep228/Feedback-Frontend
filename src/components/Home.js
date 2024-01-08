import React from 'react'
import { Box, Image,Text,Button } from '@chakra-ui/react';
import feedback from  "./feeback.png"
import { useNavigate } from 'react-router-dom'; 



const Home = () => {
  const navigate = useNavigate()
  const handlemove = () => {
    navigate('/signup');

  }
  return (
    <>
   <Box
      minHeight="100vh"
      background='linear-gradient(to right, #ff5757, #8c52ff)'
      color="white"
      display="flex"
      flexDirection={{ base: 'column', md: 'column' }}
      justifyContent="center"
      padding={5}
    >
      <Box
        background='linear-gradient(to right, #ff5757, #8c52ff)'
        color="white"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="center"
        padding={5}
      >
        <Box flex={{ base: '1', md: '1' }} textAlign={{ base: 'center', md: 'left' }} p={{ base: '4', md: '10' }}>
          <Text as="h1" fontSize={{ base: '3xl', md: '5xl', lg: '7xl' }} fontWeight="bold" marginBottom={{ base: '4', md: '8' }}>
           We'd Love to hear your feedback!
          </Text>
          <Text as="h2" fontSize={{ base: '2xl', md: '2xl', lg: '2xl' }} fontWeight="bold" marginBottom={{ base: '4', md: '8' }}>
          Join the community of happy users.  Leave a review today! 🌼
          </Text>
         
          <Button colorScheme="purple" size="lg" borderRadius={23} onClick={handlemove}>
            Get Started
          </Button>
        </Box>
        <Box flex={{ base: '1', md: '1' }} alignItems="center" justifyContent="center" textAlign="center" marginBottom={{ base: '8', md: '0' }}>
          <center>
            <Image src={feedback} alt="feedback" width="90%" />
          </center>
        </Box>
      </Box>
    </Box>
     
    </>
  )
}

export default Home;
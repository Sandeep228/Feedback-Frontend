import React, { useState,useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  Box,
  Center,
  useToast,
  HStack,
} from '@chakra-ui/react';
import {  useNavigate } from 'react-router-dom'; 

import { jwtDecode } from "jwt-decode";

const Form = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    date: '',
    feedback: '',
  });
  const [token,setToken] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));  
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    if(decoded.role !== "user") {
      navigate("/admindashboard");
    }
    if (!token) {       
      navigate('/login');
    } 
    else {
      setToken(token)
    }
    
  }, [navigate]);


  const handleSubmit = async(e) => {
    const decoded = jwtDecode(token);

    e.preventDefault();
    if (!formData.customerName && !formData.feedback && !formData.date) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.customerName ) {
      toast({
        title: 'Error',
        description: 'Customer Name is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: 'Error',
        description: 'Date is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.feedback) {
      toast({
        title: 'Error',
        description: 'Feedback is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (decoded.role === "user" ){
    try {
      const response = await fetch('https://feedback-rbf2.onrender.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          feedback: formData.feedback,
          date: formData.date,
         
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucess',
          description: `${data.message}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setFormData({
          customerName: '',
          date: '',
          feedback: '',
        });
    
      } else {
        toast({
          title: 'Error',
          description: `${data.message}`,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  }
    else {
      toast({
        title: 'Error',
        description: 'you are authorized',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
     };
    const handleback = () => {
      navigate('/dashboard');
    }
      return (
    <Box
    width="100%"
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    background="linear-gradient(to right, #4a148c, #880e4f)"
  >
    <VStack
      spacing={8}
      align="stretch"
      p={8}
      boxShadow="lg"
      borderRadius="md"
      bg="white"
      width={{ base: '90%', md: '70%', lg: '50%' }}
    >
      <Heading as="h2" size="xl" mb={4} color="purple.700">
        Feedback Form
      </Heading>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl mb={4}>
          <FormLabel>Customer Name</FormLabel>
          <Input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Feedback</FormLabel>
          <Textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
          />
        </FormControl>

        <Center>
  <HStack spacing={2}>
    <Button type="submit" colorScheme="purple">
      Submit
    </Button>
    <Button colorScheme="purple" onClick={handleback}>
      Back 
    </Button>
  </HStack>
</Center>
      </form>
    </VStack>
  </Box>
  )
}

export default Form;
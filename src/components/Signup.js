import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  Heading,
  useToast,
  Select,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom'; 


import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [password,showPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);


  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleTogglePassword =   () => {
    showPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Disable the signup button to prevent multiple clicks
    setSubmitting(true);

    if (!signupData.name && !signupData.email && !signupData.password && !signupData.role) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!/^[A-Za-z\s]*$/.test(signupData.name)) {
      toast({
          title: 'Error',
          description: 'Name should not contain numeric characters',
          status: 'error',
          duration: 5000,
          isClosable: true,
      });
      return;
  }
      if (!signupData.email.endsWith('@gmail.com')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid gmail  address.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (
      signupData.password.length < 8 ||
      !/(?=.*[A-Z])/.test(signupData.password) || 
      !/(?=.*[a-z])/.test(signupData.password) || 
      !/(?=.*\d)/.test(signupData.password) ||  
      !/(?=.*[\W_])/.test(signupData.password)  
  ) {
      toast({
          title: 'Error',
          description: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
          status: 'error',
          duration: 5000,
          isClosable: true,
      });
      return;
  }
    try {
      const response = await fetch('https://feedback-rbf2.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
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

        setSignupData(( {
          name: '',
          email: '',
          password: '',
          role: '',
    
        }))
        
    
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
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
     
    }
    finally {
      // Reset the submitting state to false
      setSubmitting(false);
    }
     };

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
        width={{ base: '90%', md: '70%', lg: '30%' }}
      >
        <Heading as="h2" size="xl" mb={4} color="purple.700">
          Signup Form
        </Heading>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={password ? 'text' : 'password'}
                name="password"
                value={signupData.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  size="sm"
                  onClick={handleTogglePassword}
                  icon={
                    password ? <ViewOffIcon /> : <ViewIcon />
                  }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              value={signupData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="purple" mt={4} mb={4} width="100%"  disabled={isSubmitting}>
            Signup
          </Button>
          <Text mb={4} textAlign="center" >
        Have an account? <Link to="/login" >Login</Link>
      </Text>
        </form>
      </VStack>
   
    </Box>
  );
};

export default Signup


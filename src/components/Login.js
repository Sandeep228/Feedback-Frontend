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
  IconButton,
  HStack,
  Text
} from '@chakra-ui/react';
import { Link ,useNavigate } from 'react-router-dom'; 



import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [password,showPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);


  const navigate = useNavigate()
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTogglePassword = () => {
   showPassword((prev) => !prev)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }
  
    // Set the submitting state to true
    setSubmitting(true);
  

    // Check if both email and password are empty
    if (!loginData.email && !loginData.password) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check if email is empty
    if (!loginData.email.endsWith('@gmail.com')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid gmail  address.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check if password is empty
    if (!loginData.password) {
      toast({
        title: 'Error',
        description: 'Password is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }


    try {
    
      const response = await fetch('https://feedback-rbf2.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
      
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);


        toast({
          title: 'Sucess',
          description: `${data.message}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setLoginData(( {
          email: '',
          password: '',
        }))

        if(data.role === "admin"){
          navigate("/admindashboard")
        }
        else {
          navigate("/dashboard")
        }
     
    
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

    finally {
      // Reset the submitting state to false
      setSubmitting(false);
    }

    setLoginData({
      email: '',
      password: '',
      showPassword: false,
    });
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
          Login Form
        </Heading>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={password ? 'text' : 'password'}
                name="password"
                value={loginData.password}
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

          <Button type="submit" colorScheme="purple" mt={4} mb={4} width="100%" disabled={isSubmitting}>
            Login
          </Button>
          <HStack mt={2} justify="space-between">
          <Text mb={4} textAlign="center" >
           <Link to="/forgot" >Forgot Password?</Link>
      </Text>
      <Text mb={4}  >
      <Link to="/signup" >Sign Up </Link>
      </Text>
      
     
      </HStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Login;

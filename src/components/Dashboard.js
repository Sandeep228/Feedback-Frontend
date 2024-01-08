import React,{useState,useEffect} from 'react'
import {
  Box, 
  Text ,
  VStack,
  Heading,
  Flex,
  Spacer,
  Button, 
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  SimpleGrid,
  HStack,
  Input,} from '@chakra-ui/react';
import {useNavigate } from 'react-router-dom'; 
import { jwtDecode } from "jwt-decode";


const Dashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [userDetails, setUserDetails] = useState("");
    const [userFeedback, setUserFeedback] = useState([]);
    const [id,setId] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [updatedFeedback, setUpdatedFeedback] = useState({
      customerName: '',
      feedback: '',
      date: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('name');  
        const decoded = jwtDecode(token);

        if(decoded.role !== "user") {
          navigate("/");
        }

        if (!token) {       
          navigate('/login');
        } else {
                   setUserDetails(storedUserName)
          fetchCurrentUserFeedback(token);
        }
      }, [navigate]);

      const fetchCurrentUserFeedback = async (token) => {

        const decoded = jwtDecode(token);

        if (decoded.role === "user" ){
          try {

            toast({
              title: 'Loading',
              description: 'Fetching user feedback...',
              status: 'info',
              duration: 1000, 
              isClosable: false,
            });
            
            const response = await fetch('https://feedback-rbf2.onrender.com/get-my-feedback', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
  
            const feedbackData = await response.json();
      
            if (response.ok ) {
  
              setUserFeedback(feedbackData);
              toast({
                title: 'Success',
                description: 'User feedback loaded successfully!',
                status: 'success',
                duration: 3000, 
                isClosable: true,
              });
            } else {
              toast({
                title: 'Error',
                description: 'Failed to fetch user feedback. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again later.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }
        else {
          toast({
            title: 'Error',
            description: 'you are authorized',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      
      };

      const handleDeleteFeedback = async (feedbackId) => {
        try {
          
          const response = await fetch("https://feedback-rbf2.onrender.com/delete-feedback", {
            
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body:  JSON.stringify({
              feedbackId: feedbackId
            }),
          });
          const data = await response.json();
      
          if (response.ok) {
            const updatedUserFeedback = userFeedback.filter((feedback) => feedback._id !== feedbackId);
            setUserFeedback(updatedUserFeedback);
            toast({
              title: 'Sucess',
              description: `${data.message}`,
              status: 'success',
              duration: 2000,
              isClosable: true,
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
          });        }
      };
    
      const handleUpdateFeedback = (feedbackId) => {
        setId(feedbackId);
        const selectedFeedback = userFeedback.find((feedback) => feedback._id === feedbackId);
        setModalOpen(true);
        setUpdatedFeedback({
          customerName: selectedFeedback.customerName,
          feedback: selectedFeedback.feedback,
          date: selectedFeedback.date,
        });
        
      };

      const handleModalClose = () => {
        // Close the modal and reset the updatedFeedback state
        setModalOpen(false);
        setUpdatedFeedback({
          customerName: '',
          feedback: '',
          date: '',
        });
      };
    
      const handleInputChange = (e) => {
        // Update the corresponding field in the updatedFeedback state
        setUpdatedFeedback({
          ...updatedFeedback,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleUpdateFormSubmit = async (feedbackId) => {

        if (!updatedFeedback.customerName && !updatedFeedback.feedback && !updatedFeedback.date) {
          toast({
            title: 'Error',
            description: 'All fields are required',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
    
        if (!updatedFeedback.customerName) {
          toast({
            title: 'Error',
            description: 'Customer Name is required.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
    
        if (!updatedFeedback.date) {
          toast({
            title: 'Error',
            description: 'Date is required.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
    
        if (!updatedFeedback.feedback) {
          toast({
            title: 'Error',
            description: 'Feedback is required.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        
        try {    
          const response = await fetch("https://feedback-rbf2.onrender.com/update-my-feedback", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              feedbackId,
              ...updatedFeedback
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
      
            const updatedUserFeedback = userFeedback.map((feedback) =>
            feedback._id === feedbackId ? { ...feedback, ...updatedFeedback } : feedback
          );
    
            setUserFeedback(updatedUserFeedback);
    
            toast({
              title: 'Success',
              description: `${data.message}`,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Error',
              description:  `${data.message}`,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred. Please try again later.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
        handleModalClose();
      };

      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        navigate('/');
      };

      const handleadd = () => {
        navigate('/feedback');
      }
  return (
    <Box  minHeight="100vh" style={{backgroundColor:'black' ,color:"white"}}>
   <Box p={4} boxShadow="md"  bg="purple.500">
        <Flex align="center" justify="space-between" wrap="wrap">
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="white" mb={0}>
            Feedback Portal of User
          </Text>
          <Spacer />
          <Box >
            <Button mr={4} onClick={handleLogout} >
              Logout
            </Button>
            <Button mr={4} onClick={handleadd}>
              Add a Feedback
            </Button>
          </Box>  
        </Flex>
        </Box>
      <Box mt={8} bg="royalblue" textAlign="center">
        <Text fontSize={{ base: 'xl', md: '2xl' }} color="orange" >Welcome to Dashboard {userDetails}</Text>
      </Box>
       <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
        {userFeedback.map((feedback) => (
          <Box
            key={feedback._id}
            p={4}
            borderWidth="1px"
            borderColor="red"
            borderRadius="lg"
            boxShadow="md"
            mx={{ base: 2, md: 4, lg: 6 }} 
          >
            <VStack align="start" spacing={2}>
              <Heading size="md" mb={2}>
               Name: {feedback.customerName}
              </Heading>
              <Text fontSize="md" mb={2}>
                Feedback: {feedback.feedback}
              </Text>
              <Text fontSize="md" mb={2}>Date: {feedback.date.substring(0, 10)}</Text>
            </VStack>
            <Spacer />
            <HStack>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteFeedback(feedback._id)}
              >
                Delete
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => handleUpdateFeedback(feedback._id)}
              >
                Update
              </Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
     
    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
    <ModalOverlay 
      style={{
        backgroundColor:"rgba(0,0,0,0.5)"
      }} />
        <ModalContent style={{backgroundColor:"pink"}}>
          <ModalHeader>Update Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Customer Name</FormLabel>
              <Input
                type="text"
                name="customerName"
                value={updatedFeedback.customerName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Feedback</FormLabel>
              <Input
                type="text"
                name="feedback"
                value={updatedFeedback.feedback}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={updatedFeedback.date.substring(0, 10)}
                onChange={handleInputChange}
              />
            </FormControl>
            
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => handleUpdateFormSubmit(id)} mr={2}>
              Update
            </Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Dashboard;
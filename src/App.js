import './App.css';
import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Form from './components/Form';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <ChakraProvider>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/feedback' element={<Form/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/admindashboard' element={<AdminDashboard/>}/>
    </Routes>
   </BrowserRouter>
   </ChakraProvider>
  );
}

export default App;

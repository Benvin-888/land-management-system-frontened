import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from './pages/Landingpage';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Aboutus from './pages/Aboutus';
import Landdatainput from './pages/Landdatainput';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/Signup" element={<Signup/>} /> 
        <Route path="/Homepage" element={<Homepage/>} /> 
        <Route path="/Aboutus" element={<Aboutus/>} />
        <Route path="/Landdatainput" element={<Landdatainput/>} />

        </Routes>
    </BrowserRouter>
  );
  
}

export default App;

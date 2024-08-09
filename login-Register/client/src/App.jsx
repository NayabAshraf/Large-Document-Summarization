import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Summarizer';
import TextSummarizer from './pages/Summarizer';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/register' element={<Signup />} />
                <Route path='/' element={<Login />} />
                <Route path='/Summarizer' element={<TextSummarizer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

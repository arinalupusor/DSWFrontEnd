import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import './App.css';
import Header from './components/Header';
import UserTable from './components/Users'
import Todos from './components/Todos'


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<><Header/><UserTable/></>} />
                <Route path='/todos' element={<><Header/><Todos/></>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

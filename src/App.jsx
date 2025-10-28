import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShowAllKinkun from './pages/ShowAllKinkun.jsx'
import AddKinkun from './pages/AddKinkun.jsx'
import EditKinkun from './pages/EditKinkun.jsx'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/show-all' element={<ShowAllKinkun/>}/>
          <Route path='/add' element={<AddKinkun/>}/>
          <Route path='/edit' element={<EditKinkun/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}


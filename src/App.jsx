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
          <Route path='/ShowAllKinkun' element={<ShowAllKinkun/>}/>
          <Route path='/AddKinkun' element={<AddKinkun/>}/>
          <Route path='/EditKinkun/:id' element={<EditKinkun/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}


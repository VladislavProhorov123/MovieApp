import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Favorites from './pages/Favorites'
import ActorDetails from './pages/ActorDetails'
import Actors from './pages/Actors'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/movie/:id' element={<MovieDetails />} />
      <Route path='/favorites' element={<Favorites />} />
      <Route path='/actors' element={<Actors />} />
      <Route path='/actor/:id' element={<ActorDetails />} />
    </Routes>
  )
}

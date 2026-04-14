import React, { useState } from 'react'
import Search from './components/Search'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className='m-0'>
            <img src="./hero.png" alt="Hero Banner" className='max-w-[460px] h-auto ' />
            <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
    </main>
  )
}

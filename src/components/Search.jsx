import React from 'react'

export default function Search({searchTerm, setSearchTerm}) {
  return (
    <div className='search'>
      <img src="search.svg" alt="search" className='absolute top-[20px] left-[16px]' />

      <input type="text" placeholder='Search througth thousands of movies' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
  )
}

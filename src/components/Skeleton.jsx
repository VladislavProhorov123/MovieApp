import React from 'react'

export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-lg ${className}`}>

    </div>
  )
}

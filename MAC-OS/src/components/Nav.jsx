import React from 'react'
import './nav.scss'
import DateTime from './DateTime'

const Nav = () => {
  return (
    <nav>
        <div className="left">
            <img src="/Nav-icons/apple-fill.svg" alt="" />
            <p>Anupam Sharma</p>
            <p>File</p>
            <p>Window</p>
            <p>Terminal</p>
            
        </div>
        <div className="right">
            <img src="/Nav-icons/wifi-line.svg" alt="" />
            <DateTime />
        </div>
    </nav>
  )
}

export default Nav

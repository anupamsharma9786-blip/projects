import React from 'react'
import { Rnd } from 'react-rnd'
import './macwindow.scss'

const MacWindow = ({children,wt='30vw',ht='30vh', windowName, windowState, setWindowState}) => {
  return (
    <Rnd
    default={{
      width:wt,
      height:ht,
      x:300,
      y:400

    }}>
      <div className="window">
        <div className="top">
          <div className="dots">
            <div onClick={() => setWindowState({...windowState, [windowName]: false})} className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>    
          </div>
          <div className="title">Anupam -esh</div>
        </div>
        <div className="main">
          {children}
        </div>
      </div>
    </Rnd>
  )
}

export default MacWindow

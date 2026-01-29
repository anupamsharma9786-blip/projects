import React from 'react'
import './dock.scss'

const Dock = ({ windowState, setWindowState }) => {
  return (
    <footer className='dock'>
        <div onClick={() => setWindowState({...windowState, github: !windowState.github})} className="icon github"><img src="/Doc-icons/github-fill.svg" alt="" /></div>
        <div onClick={()=>{window.open("https://calendar.google.com/calendar/u/0/r?pli=1")}} className="icon calendar"><img src="/Doc-icons/calendar-line.svg" alt="" /></div>
        <div className="icon file"><img src="/Doc-icons/file-pdf-line.svg" alt="" /></div>
        <div onClick={()=>{window.open("https://www.linkedin.com/in/anupam-sharma9786/","_blank")}} className="icon links"><img src="/Doc-icons/links-line.svg" alt="" /></div>
        <div onClick={()=>{window.open("mailto:anupamsharma9786@gmail.com")}} className="icon mail"><img src="/Doc-icons/mail-line.svg" alt="" /></div>
        <div onClick={() => setWindowState({...windowState, spotify: !windowState.spotify})} className="icon spotify"><img src="/Doc-icons/spotify-fill.svg" alt="" /></div>
        <div onClick={() => setWindowState({...windowState, note: !windowState.note})} className="icon notes"><img src="/Doc-icons/sticky-note-line.svg" alt="" /></div>
        <div onClick={() => setWindowState({...windowState, cli: !windowState.cli})}className="icon terminal"><img src="/Doc-icons/terminal-box-line.svg" alt="" /></div>

    </footer>
  )
}

export default Dock

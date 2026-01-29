import { useState } from 'react'
import './app.scss'
import 'remixicon/fonts/remixicon.css'
import Dock from './components/Dock'
import Nav from './components/Nav'
import MacWindow from './components/windows/MacWindow'
import GitHub from './components/windows/GitHub'
import Note from './components/windows/Note'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function App() {

  const [windowState,setWindowState] = useState({
    github:false,
    note:false,
    spotify:false,
    cli:false
  })

  return (
    <main>
      <Dock windowState={windowState} setWindowState={setWindowState} />
      <Nav />
      {windowState.github && <GitHub windowName="github" windowState={windowState} setWindowState={setWindowState} />}
      {windowState.note && <Note windowName="note" windowState={windowState} setWindowState={setWindowState} />}
      {windowState.spotify && <Spotify windowName="spotify" windowState={windowState} setWindowState={setWindowState} />}
      {windowState.cli && <Cli windowName="cli" windowState={windowState} setWindowState={setWindowState} />}
    </main>
  )
}

export default App

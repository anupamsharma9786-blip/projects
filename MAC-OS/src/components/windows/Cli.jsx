import React , {Component} from 'react'
import MacWindow from './MacWindow'
import Terminal from 'react-console-emulator'
import './console.scss'

const Cli = ({windowName, windowState, setWindowState}) => {
    const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: (...args) => args.join(' ')
  },
  about: {
    description: 'Information about me and this terminal.',
    usage: 'about',
    fn: () => 'My name is Anupam Sharma from Kanpur and this is a React-based terminal emulator showcasing CLI functionality.'
  },
  date: {
    description: 'Display the current date and time.',
    usage: 'date',
    fn: () => new Date().toString()
  },
  whoami: {
    description: 'Display the current user.',
    usage: 'whoami',
    fn: () => 'AnupamSharma'
  },
  pwd: {
    description: 'Print working directory.',
    usage: 'pwd',
    fn: () => '/Users/AnupamSharma'
  },
  ls: {
    description: 'List files in directory.',
    usage: 'ls',
    fn: () => 'Desktop\nDocuments\nDownloads\nPictures\nMusic'
  },
  contact:{
    description: 'Contact Information',
    usage: 'contact',
    fn: () => 'Email-anupamsharma9786@gmail.com \n Phone-9415725515'
  }
}

const welcomeMessage = `
╔════════════════════════════════════════╗
║  Welcome to React Terminal Emulator    ║
╚════════════════════════════════════════╝

Available commands:
  • echo     - Echo a passed string
  • help     - List all available commands
  • about    - Information about this terminal
  • date     - Display current date and time
  • whoami   - Display current user
  • pwd      - Print working directory
  • ls       - List files in directory
  • clear    - Clear the screen
  • contact    - Contact Information

Type 'help' or any command name to get started!
`
    
  return (
    <MacWindow windowName={windowName} windowState={windowState} setWindowState={setWindowState}>
        <div className="console">
            <Terminal
            commands={commands}
            welcomeMessage={welcomeMessage}
            promptLabel={'AnupamSharma@React:~$'}
            promptLabelStyle = {{color: 'green'}}
            />

        </div>
    </MacWindow>
  )
}

export default Cli

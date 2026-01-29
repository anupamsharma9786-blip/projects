import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import MacWindow from './MacWindow';
import './note.scss'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const Note = ({windowName, windowState, setWindowState}) => {
    const [markdown,setMarkdown] = useState(null);

    useEffect(()=>{
        fetch('/note.txt')
            .then(res=>res.text())
            .then(text=>setMarkdown(text))
    },[])

    
  return (
    <MacWindow windowName={windowName} windowState={windowState} setWindowState={setWindowState}>
        <div className="note-window">
            <SyntaxHighlighter language="javascript" style={dark}>
                {markdown}
            </SyntaxHighlighter>
        </div>
    </MacWindow>
  )
}

export default Note

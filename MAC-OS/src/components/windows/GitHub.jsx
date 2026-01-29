import React from 'react'
import MacWindow from './MacWindow'
import GitData from '../../assets/GitHub.json'
import './github.scss'

const GitHub = ({windowName, windowState, setWindowState}) => {
    
    const GitCard = ({data}) => {
      return (
        <div className='card'>
            <img src={data.image} alt="" />
            <h1>{data.title}</h1>
            <p className='description'>{data.description}</p>
            <div className="tags">
              {data.tags.map((elem)=>{
                return <div className="tag"><p>{elem}</p></div>
              })}
            </div>
            <div className="links">
              <a href={data.repoLink}>GitHub</a>
              {data.demoLink && <a href={data.demoLink}>Demo</a>}
            </div>
          
        </div>
      )
    }
    
    
    
    
  return (
    <MacWindow windowName={windowName} windowState={windowState} setWindowState={setWindowState}>
        <div className="cards">
            {GitData.map((item)=>{
                return <GitCard data={item} />
            })}
        </div>
    </MacWindow>
  )
}

export default GitHub

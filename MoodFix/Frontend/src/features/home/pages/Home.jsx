import React from 'react'
import FaceExpressionDetector from '../../expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'

const Home = () => {
    const {handleGetSong} = useSong();
  return (
    <div>
      <FaceExpressionDetector onClick={(mood)=>{handleGetSong(mood)}} />
      <Player />
    </div>
  )
}

export default Home

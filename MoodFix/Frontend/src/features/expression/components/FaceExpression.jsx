import { useEffect, useRef, useState } from "react";
import { detect,loadModel,startCamera } from "../utils/util";
import './styles/face.scss'


export default function FaceExpressionDetector({onClick=()=>{}}) {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const [expression, setExpression] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    loadModel(isMounted,faceLandmarkerRef);
    startCamera(videoRef);

    isMounted = false;
  }, []);

  async function handClick(){
    const mood = detect(videoRef,faceLandmarkerRef,setExpression);
    onClick(mood);
  }

  return (
    <div className="face-detector-container">
      <div className="face-detector-content">
        <h1 className="face-detector-title">Expression Detection</h1>
        <p className="face-detector-subtitle">Detect your mood and get music recommendations</p>
        
        <div className="face-detector-video-wrapper">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="face-detector-video"
          />
          <div className="face-detector-video-overlay"></div>
        </div>

        <div className="face-detector-info">
          <span className="face-detector-label">Current Expression:</span>
          <h2 className="face-detector-expression">{expression}</h2>
        </div>

        <button className="face-detector-btn lg" onClick={handClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
            <path d="M16.5 8.5a4 4 0 0 1 .5 2v3a4 4 0 0 1-8 0v-3a4 4 0 0 1 .5-2"></path>
          </svg>
          Detect Expression
        </button>
      </div>
    </div>
  );
}
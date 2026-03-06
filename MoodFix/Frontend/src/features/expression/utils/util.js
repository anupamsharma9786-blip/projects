import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";


export const loadModel = async (isMounted,faceLandmarkerRef) => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
        numFaces: 1
      });

      if (isMounted) faceLandmarkerRef.current = landmarker;
};

export const startCamera = async (videoRef) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play(); // IMPORTANT: wait until video is ready
      }
};

const getExpression = (shapes) => {
    const score = (name) =>
      shapes.find((s) => s.categoryName === name)?.score || 0;

    const smile =
      (score("mouthSmileLeft") + score("mouthSmileRight")) / 2;

    const frown =
      (score("mouthFrownLeft") + score("mouthFrownRight")) / 2;

    const jawOpen = score("jawOpen");
    const browUp = score("browInnerUp");
    console.log(frown);
    

    if (smile > 0.55) return "happy";
    if (jawOpen > 0.6 && browUp > 0.5) return "surprised";
    if (frown > 0.02) return "sad";
    return "neutral";
};

export const detect = (videoRef, faceLandmarkerRef, setExpression) => {
      const video = videoRef.current;
      const landmarker = faceLandmarkerRef.current;

      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const result = landmarker.detectForVideo(video, Date.now());

      if (result.faceBlendshapes.length > 0) {
        const shapes = result.faceBlendshapes[0].categories;
        const detected = getExpression(shapes);
        setExpression(detected);
        return detected;
      } else {
        setExpression("no face");
      }
      
};
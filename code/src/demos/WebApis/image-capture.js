import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import FeatureSupport from "../../components/utils/feature-support";

export default function ImageCaptureDemo() {
  const [track, setTrack] = useState();
  const [enableCapture, setEnableCapture] = useState(false);
  const [supported, setSupported] = useState(true);

  const getUserMedia = async () => {
    console.log('Getting User Media');
    navigator.mediaDevices.getUserMedia({video: true})
      .then(mediaStream => {
        document.querySelector('video').srcObject = mediaStream;
        const track = mediaStream.getVideoTracks()[0];
        setTrack(track);
        setEnableCapture(true);
        setSupported(true);
      })
      .catch(error => {
        console.error(` ${error} is not yet supported`);
        setSupported(false);
      });
  }

  const videoOff = () => {
    track.stop();
    setEnableCapture(false);
  }

  const grabFrame = () => {
    console.log('Grabbling Frame');
    const imageCapture = new ImageCapture(track);
    imageCapture.grabFrame()
      .then(imageBitmap => {
        const canvas = document.querySelector('#grabFrameCanvas');
        drawCanvas(canvas, imageBitmap);
        setSupported(true);
      })
      .catch(error => {
        console.log(error);
        setSupported(false);
      });
  }

  const takePhoto = () => {
    console.log('Taking Photo');
    const imageCapture = new ImageCapture(track);
    imageCapture.takePhoto().then(blob => createImageBitmap(blob))
      .then(imageBitmap => {
        const canvas = document.querySelector('#takePhotoCanvas');
        drawCanvas(canvas, imageBitmap);
        setSupported(true);
      })
      .catch(error => {
        console.log(error);
        setSupported(false);
      });
  }

  function drawCanvas(canvas, img) {
      canvas.width = getComputedStyle(canvas).width.split('px')[0];
      canvas.height = getComputedStyle(canvas).height.split('px')[0];
      let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
      let x = (canvas.width - img.width * ratio) / 2;
      let y = (canvas.height - img.height * ratio) / 2;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
          x, y, img.width * ratio, img.height * ratio);
  }

  useEffect(() => {
    async function fetchUserMedia() {
        await getUserMedia();
    }
    fetchUserMedia()
  }, []);
    
  return (
    <>
      <FeatureSupport
          support={supported}
          feature={"Image Capture API"}
          caniuseLink={"https://caniuse.com/#feat=mdn-api_imagecapture"}
      />
      {supported && <div>This feature is not supported yet.</div>}
      <div style={{padding: '5px'}}>
        <Button 
          variant="success"
          id='getUserMediaButton' 
          onClick={() => getUserMedia()}>Get User Media
        </Button> {' '}
        <Button 
          variant="danger"
          onClick={() => videoOff()}>Switch Off
        </Button>{' '}
        <Button 
          variant="info"
          id='grabFrameButton' 
          onClick={() => grabFrame()} 
          disabled={!enableCapture}>Grab Frame
        </Button>{' '}
        <Button 
          variant="info"
          id='takePhotoButton' 
          onClick={() => takePhoto()} 
          disabled={!enableCapture}>Take Photo
        </Button>
      </div>
      <div>
        <video style={{height:'198px', width:'100%', border:'2px solid'}} autoPlay></video>
      </div>
      <div>
        <canvas id='grabFrameCanvas'></canvas>
        <canvas id='takePhotoCanvas'></canvas>    
      </div>
    </>
  )
}
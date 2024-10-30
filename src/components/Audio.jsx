// AudioPlayer.jsx
import React, { useRef,useState } from "react";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [hide, setHide] = useState(false);
  const handlePlay = () => {
    console.log('play')
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio: ", error);
      });
    }
  };

  return (
    <>
      {" "}
      {!hide ? (
        <div onClick={handlePlay} className="w-full h-screen fixed z-50">
          <audio ref={audioRef}>
            <source src="./galaxy.mp3" type="audio/mpeg" />
          </audio>
        </div>
      ) : null}
    </>
  );
};

export default AudioPlayer;

import React, { useEffect, useRef, useState } from "react";
import "./bgmMaker.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
import cdIcon from "@images/cd.svg";
import playIcon from "@images/play.svg";

//todo : 再生するリストを作る。どんな見た目にするかもまだ決めていない

const BgmMaker = ({ myKey, removeThisTool, genre }) => {
  const playerRef = useRef(null);
  const interact_ = useInteract();
  const [isPlay, setIsPlay] = useState(false);

  const playlist =
    genre === "jazz"
      ? "Tq0IQq5Fjj8"
      : genre === "rainy"
      ? "W-23ZX_9tkY"
      : genre === "fire"
      ? "naAHIl_os-E&t=6s"
      : "FZOmkLbm66I";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    script.onload = () => {
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("player", {
          height: "80%",
          width: "80%",
          playerVars: {
            autoplay: "1",
            modestbranding: "1",
            playlist: playlist,
            controls: "0",
            loop: "1",
            fs: "0",
            rel: "0",
            start: "0",
            iv_load_policy: "3",
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      };
    };

    document.body.appendChild(script);

    return () => {
      interact_.disable();
    };
  }, []);

  const onPlayerReady = () => {
    playerRef.current.setVolume(20);
    playerRef.current.playVideo();
  };

  const onPlayerStateChange = () => {
    const currentState = playerRef.current.getPlayerState();
    if (currentState === 1) {
      setIsPlay(true);
    } else if (currentState === 2) {
      setIsPlay(false);
    }
  };

  const togglePlayerState = () => {
    const currentState = playerRef.current.getPlayerState();
    if (currentState === 1) {
      playerRef.current.pauseVideo();
    } else if (currentState === 2) {
      playerRef.current.playVideo();
    }
  };

  return (
    <FlexBox
      className="bgmMaker"
      width="400px"
      height="225px"
      ref={interact_.ref}
      column
    >
      <div id="player" ref={playerRef} />
      <img
        onClick={() => {
          removeThisTool(myKey);
        }}
        className="bgmMaker__remove-icon"
        src={removeIcon}
        alt="remove"
      />
      <FlexBox className="bgmMaker__wrap--forText" width="80%" left>
        <p className="bgmMaker__text">
          {isPlay ? "Now Playing..." : "Pause Now..."}
        </p>
        <img
          className={
            isPlay ? "bgmMaker__playing-icon" : "bgmMaker__pausing-icon"
          }
          src={isPlay ? cdIcon : playIcon}
          alt="play"
          style={{ width: "20px", height: "20px" }}
          onClick={togglePlayerState}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default BgmMaker;

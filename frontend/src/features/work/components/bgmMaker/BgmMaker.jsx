import React, { useEffect, useRef, useState } from "react";
import "./bgmMaker.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
import cdIcon from "@images/cd.svg";
import playIcon from "@images/play.svg";
import loudVolumIcon from "@images/loudVolum.svg";
import middleVolumIcon from "@images/middleVolum.svg";
import lowVolumIcon from "@images/lowVolum.svg";
import muteVolumIcon from "@images/muteVolum.svg";

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
      ? "kmythL1LppA"
      : "FZOmkLbm66I";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);

    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        createPlayer();
      }
    }, 100);

    return () => {
      interact_.disable();
      clearInterval(checkYT);
    };
  }, []);

  const createPlayer = () => {
    playerRef.current = new window.YT.Player(`player-${myKey}`, {
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
        onError: onError,
      },
    });
  };

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

  const onError = () => {
    removeThisTool(myKey);
  };

  const [volume, setVolume] = useState(30);
  console.log(volume);

  const onVolumChange = (e) => {
    setVolume(e.target.value);
    playerRef.current.setVolume(e.target.value);
  };

  const volumeIcon =
    volume < 1
      ? muteVolumIcon
      : volume > 0 && volume < 31
      ? lowVolumIcon
      : volume > 30 && volume < 71
      ? middleVolumIcon
      : loudVolumIcon;

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
      column
      ref={interact_.ref}
    >
      <div id={`player-${myKey}`} />
      <img
        onClick={() => {
          removeThisTool(myKey);
        }}
        className="bgmMaker__remove-icon"
        src={removeIcon}
        alt="remove"
      />
      <FlexBox className="bgmMaker__footer-menu" width="80%" sb>
        <FlexBox className="bgmMaker__wrap--forText" width="50%" left>
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
        <FlexBox width="50%">
          <input
            onMouseDown={interact_.disable}
            onMouseUp={interact_.enable}
            className="footer-menu__sound-bar"
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={onVolumChange}
          />
          <img
            style={{ width: "25px", height: "25px" }}
            src={volumeIcon}
            alt="volume"
          />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default BgmMaker;

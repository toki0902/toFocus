import React, { useEffect, useRef } from "react";
import "./bgmMaker.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";

//todo : 再生するリストを作る。どんな見た目にするかもまだ決めていない

const BgmMaker = ({ myKey, removeThisTool }) => {
  const playerRef = useRef(null);
  const interact_ = useInteract();

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
            playlist: "Y7TiZ55RZvw,7cKQh749vwI,IodTQusy2vQ",
            controls: "0",
            loop: "1",
            fs: "0",
            rel: "0",
            start: "0",
            iv_load_policy: "3",
          },
          events: {
            onReady: onPlayerReady,
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
    playerRef.current.playVideo();
  };

  return (
    <FlexBox
      className="bgmMaker"
      width="400px"
      height="225px"
      ref={interact_.ref}
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
    </FlexBox>
  );
};

export default BgmMaker;

import React, { useState } from "react";
import "./setTrack.css";
import { FlexBox, Button } from "@component";
import { useNavigate } from "react-router-dom";
import TrackMemo from "./components/trackMemo/TrackMemo";

const SetTrack = () => {
  const [isActiveTrackMode, setIsActiveTrackMode] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const enableActiveTrackMode = () => {
    setIsActiveTrackMode(true);
    setIsClicked(true);
  };

  const disableActiveTrackMode = () => {
    setIsActiveTrackMode(false);
    setIsClicked(true);
  };

  const kiorkusurukansuu = () => {
    console.log("記録します！！");
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };
  return (
    <FlexBox
      className="SetTrack"
      width="100%"
      height="100%"
      top
      column
      pt="5%"
      pb="5%"
    >
      <h2 className="settrack__text--big">
        諸君、お疲れさまだ。もし気が進めば今日の学習の記録、「足跡」を残さないか？
      </h2>
      <FlexBox className="settrack__btn-wrap" width="50%" sb mt="100px">
        <Button
          width="250px"
          height="50px"
          color="#8ddaeb"
          func={disableActiveTrackMode}
          isWhiteMain
        >
          いいえ
        </Button>
        <Button
          width="250px"
          height="50px"
          color="#8ddaeb"
          func={enableActiveTrackMode}
          isWhiteMain
        >
          はい
        </Button>
      </FlexBox>
      {isClicked ? (
        <FlexBox className="settrack__end-btn" width="100%" mt="100px" column>
          {isActiveTrackMode ? (
            <>
              <TrackMemo />
              <Button
                width="200px"
                height="50px"
                color="#8ddaeb"
                isWhiteMain
                func={kiorkusurukansuu}
                mt="30px"
              >
                記録して終わる
              </Button>
            </>
          ) : (
            <Button
              width="200px"
              height="50px"
              color="#8ddaeb"
              isWhiteMain
              func={goHome}
            >
              記録しないで終わる
            </Button>
          )}
        </FlexBox>
      ) : null}
    </FlexBox>
  );
};

export default SetTrack;

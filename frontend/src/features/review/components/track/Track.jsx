import React, { useEffect, useRef, useState } from "react";
import "./track.css";
import { FlexBox } from "@component";
import Calender from "./components/calender/Calender";
import TrackBoard from "./components/trackBoard/TrackBoard";
import { searchDataWithThisDay } from "../../utils";

const Track = ({ sampleData, selectedDate, setSelectedDate }) => {
  const targetRef = useRef(null);
  const [tracks, setTracks] = useState();
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    if (targetRef.current.clientHeight > 60) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tracks]);

  useEffect(() => {
    const focusData = searchDataWithThisDay(selectedDate, sampleData)[0];

    if (focusData) {
      setTracks(() => {
        return (
          focusData?.tracks?.map((item, index) => {
            return (
              <TrackBoard
                initialValue={item}
                key={index}
                focusData={focusData}
              ></TrackBoard>
            );
          }) || []
        );
      });
    } else {
      setTracks([]);
    }
  }, [selectedDate]);
  return (
    <div className="Track">
      <h2 className="track__title">
        「」さんの<span className="track__title--sub-color">足跡</span>を辿る
      </h2>
      <Calender
        sampleData={sampleData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <FlexBox width="100%" pd="30px 0 60px 0" sb ref={targetRef}>
        {tracks}
      </FlexBox>
    </div>
  );
};

export default Track;

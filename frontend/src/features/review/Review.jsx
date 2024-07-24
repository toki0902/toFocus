import React, { useRef, useState, useEffect } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";
import Analysis from "./components/analysis/Analysis";
import Track from "./components/track/Track";

const Review = ({ userProfile }) => {
  const [concentrateData, setConcentrateData] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  const sidebarRef = useRef(null);

  const onMouseMove = (e) => {
    if (e.clientX < 10) {
      sidebarRef.current.classList.add("open");
    }
  };

  const currentMenu =
    whichMenuIsOpen === "analysis" ? (
      <Analysis
        concentrateData={concentrateData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        userProfile={userProfile}
      />
    ) : whichMenuIsOpen === "track" ? (
      <Track
        concentrateData={concentrateData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        userProfile={userProfile}
      />
    ) : null;

  const prevDateRef = useRef();

  useEffect(() => {
    if (prevDateRef.current) {
      if (selectedDate.getFullYear() !== prevDateRef.current.getFullYear()) {
        console.log("year change");
        const fetchCurrentYearFocusData = async () => {
          const res = await fetch(
            `http://localhost:8000/api/concData/${
              userProfile.id
            }/${selectedDate.getFullYear()}/year`,
            { method: "GET" }
          );

          const res_json = await res.json();
          if (res.status === 200) {
            console.log(res_json.msg);

            setConcentrateData(res_json.dataOnConcentration);
          } else {
            console.error(res_json.msg);
          }
        };

        fetchCurrentYearFocusData();
        console.log("今終わり");
      }
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  return (
    <div className="Review" onMouseMove={(event) => onMouseMove(event)}>
      <Sidebar
        whichMenuIsOpen={whichMenuIsOpen}
        setWhichMenuIsOpen={setWhichMenuIsOpen}
        ref={sidebarRef}
      />
      {currentMenu}
      {userProfile ? null : (
        <>
          <FlexBox className="review__mask" width="90%" height="81%"></FlexBox>
          <h1 className="review-mask__title">ログインしてください</h1>
        </>
      )}
    </div>
  );
};

export default Review;

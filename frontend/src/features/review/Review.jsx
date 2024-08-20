import React, { useRef, useState, useEffect, useMemo } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";
import Analysis from "./components/analysis/Analysis";
import Track from "./components/track/Track";

const Review = ({ userProfile }) => {
  const [concentrateData, setConcentrateData] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  //fetch後のStateの更新を待ってからレンダリングするためのState
  const [isLoading, setIsLoading] = useState(false);

  const [currentMenu, setCurrentMenu] = useState(null);
  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  const sidebarRef = useRef(null);

  const onMouseMove = (e) => {
    if (e.clientX < 10) {
      sidebarRef.current.classList.add("open");
    }
  };

  const prevDateRef = useRef();

  useEffect(() => {
    if (prevDateRef.current) {
      if (selectedDate.getFullYear() !== prevDateRef.current.getFullYear()) {
        console.log("year change");
        const fetchCurrentYearFocusData = async () => {
          //年をまたぐと、ひとつ前の年のデータが閲覧できなくなる。
          //2025年01月02日にいると、2024年12月31日のデータが見えなくなる

          setIsLoading(true);

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
          return setIsLoading(false);
        };

        fetchCurrentYearFocusData();
        console.log(isLoading);
      }
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    const fetchCurrentYearFocusData = async () => {
      setIsLoading(true);
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

      return setIsLoading(false);
    };

    fetchCurrentYearFocusData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (whichMenuIsOpen === "analysis") {
        setCurrentMenu(
          <Analysis
            concentrateData={concentrateData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            userProfile={userProfile}
          />
        );
      } else if (whichMenuIsOpen === "track") {
        setCurrentMenu(
          <Track
            concentrateData={concentrateData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            userProfile={userProfile}
          />
        );
      }
    }
  }, [concentrateData, whichMenuIsOpen, selectedDate, userProfile, isLoading]);

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

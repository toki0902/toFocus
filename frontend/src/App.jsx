import React, { useState } from "react";
import Router from "./Router";
import Header from "./components/header/Header";
import "./App.css";
import { set } from "date-fns";

function App() {
  //プロトタイプは{id: 01, name:"zizi0902", icon_path:"https://expample.com"}
  //みたいなデータを設定する。
  const [userProfile, setUserProfile] = useState(null);
  console.log(userProfile);
  return (
    <div className="App">
      <Header userProfile={userProfile} setUserProfile={setUserProfile} />
      <Router userProfile={userProfile} setUserProfile={setUserProfile} />
    </div>
  );
}

export default App;

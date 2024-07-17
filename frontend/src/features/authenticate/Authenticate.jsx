import React, { useEffect, useState } from "react";
import "./authenticate.css";
import AuthCards from "./components/authcards/AuthCards";
import ResInfo from "./components/resInfo/ResInfo";

const Authenticate = () => {
  useEffect(() => {
    setWhichPageIsOpen(
      <AuthCards setWhichPageIsOpen={setWhichPageIsOpen}></AuthCards>
    );
  }, []);
  const [whichPageIsOpen, setWhichPageIsOpen] = useState("");
  return <div className="Authenticate">{whichPageIsOpen}</div>;
};

export default Authenticate;

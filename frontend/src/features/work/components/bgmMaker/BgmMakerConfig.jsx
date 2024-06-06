import React from "react";
import { FlexBox } from "@component";

const BgmMakerConfig = ({ addBgmMaker }) => {
  return (
    <FlexBox className="Bgmmakerconfig" width="100%" height="100%" column>
      <h2 className="bgmmakerconfig__title">ジャンルを選んでください。</h2>
      <FlexBox width="100%" height="80%" pr="5%" pl="5%" pt="5%" pb="5%" sb>
        <FlexBox
          className="bgmmakerconfig__choises"
          width="26%"
          height="40%"
          onClick={() => addBgmMaker("fire")}
        >
          焚き火
        </FlexBox>
        <FlexBox
          className="bgmmakerconfig__choises"
          width="26%"
          height="40%"
          onClick={() => addBgmMaker("jazz")}
        >
          ジャズ
        </FlexBox>
        <FlexBox
          className="bgmmakerconfig__choises"
          width="26%"
          height="40%"
          onClick={() => addBgmMaker("rainy")}
        >
          水の音
        </FlexBox>
        <FlexBox
          className="bgmmakerconfig__choises"
          width="26%"
          height="40%"
          onClick={() => addBgmMaker()}
        >
          浪漫革命
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default BgmMakerConfig;

import React, { useState } from "react";
import "./config.css";
import { FlexBox } from "@component";

const Config = ({ userProfile }) => {
  const [defaultTime, setDefaultTime] = useState(0);
  return (
    <div className="Config">
      <h2 className="config__title">{userProfile?.name || "無名"}さんの設定</h2>
      <ul className="config__setting-list">
        <li className="config__list-item">
          <FlexBox width="70%" height="50%" column sb left>
            <h3 className="config__item-title">タイマーのデフォルト時間</h3>
            <p className="config__item-explain">
              ポモドーロタイマーの時間を設定します
            </p>
          </FlexBox>
          <FlexBox width="30%" height="100%">
            <label>
              変更後:{defaultTime}分
              <input
                type="range"
                min="0"
                max="120"
                step="10"
                value={defaultTime}
                onChange={(e) => setDefaultTime(e.target.value)}
              />
            </label>
          </FlexBox>
        </li>
        <li className="config__list-item">
          <FlexBox width="70%" height="50%" column sb left>
            <h3 className="config__item-title">セキュリティ情報の変更</h3>
            <p className="config__item-explain">
              現在のメールアドレスを変更します
            </p>
          </FlexBox>
          <FlexBox width="30%" height="100%"></FlexBox>
        </li>
      </ul>
    </div>
  );
};

export default Config;

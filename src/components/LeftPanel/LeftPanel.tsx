import React from "react";
import cls from "./LeftPanel.module.scss";

function LeftPanel({
  summonerName,
  opponentName,
  handleSummonerInputChange,
  handleOpponentInputChange,
  fetchDataAndMatches,
}) {
  return (
    <div className={cls["left-panel"]}>
      <h1 className={cls["main-title"]}>Check your teammate</h1>
      <div className={cls["input-container"]}>
        <input
          className="summoner-input"
          type="text"
          value={summonerName}
          onChange={handleSummonerInputChange}
          placeholder="Enter your nickname"
        />
        <input
          className="summoner-input"
          type="text"
          value={opponentName}
          onChange={handleOpponentInputChange}
          placeholder="Enter your teammate's nickname"
        />
      </div>
      <div className={cls["button-container"]}>
        <button className={cls["button-primary"]} onClick={fetchDataAndMatches}>
          Check
          <img
            src="./src/assets/icons/icon-search.svg"
            alt="icon-search.svg"
            className={cls["icon"]}
          />
        </button>
      </div>
    </div>
  );
}

export default LeftPanel;

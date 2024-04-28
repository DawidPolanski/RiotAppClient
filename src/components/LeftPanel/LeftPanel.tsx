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
      <input
        type="text"
        value={summonerName}
        onChange={handleSummonerInputChange}
        placeholder="Your nickname"
      />
      <input
        type="text"
        value={opponentName}
        onChange={handleOpponentInputChange}
        placeholder="Your teammate nickname"
      />
      <button onClick={fetchDataAndMatches}>Check</button>
    </div>
  );
}

export default LeftPanel;

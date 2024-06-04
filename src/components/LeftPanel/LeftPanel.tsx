import React, { useState, useEffect } from "react";
import cls from "./LeftPanel.module.scss";
import regions from "../../shared/regionList";

function LeftPanel({
  summonerName,
  opponentName,
  handleSummonerInputChange,
  handleOpponentInputChange,
  fetchDataAndMatches,
}) {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  const [showSelect, setShowSelect] = useState(false);

  const handleClick = () => {
    if (!isButtonDisabled) {
      setButtonDisabled(true);
      fetchDataAndMatches(selectedRegion);
      setTimeout(() => {
        setButtonDisabled(false);
      }, 2000);
    }
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <div className={`${cls["left-panel"]} left-panel`}>
      <h1 className={cls["main-title"]}>Check your teammate</h1>
      <div
        className={`${cls["input-container"]} ${
          showSelect ? cls["show-select"] : ""
        }`}
      >
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
        <select
          className={`${cls["region-select"]} region-select`}
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
      <div className={cls["button-container"]}>
        <button
          className={cls["button-primary"]}
          onClick={handleClick}
          disabled={isButtonDisabled}
        >
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

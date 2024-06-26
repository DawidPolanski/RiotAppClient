import React, { useState } from "react";
import axios from "axios";
import RightPanel from "./components/RightPanel/RightPanel";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import debounce from "lodash/debounce";
import chevronLeft from "./assets/icons/chevron-left.svg";
import chevronRight from "./assets/icons/chevron-right.svg";

function App() {
  const [summonerName, setSummonerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [specificMatch, setSpecificMatch] = useState(null);
  const [commonMatches, setCommonMatches] = useState([]);
  const [error, setError] = useState(null);
  const [opponentLeagueData, setOpponentLeagueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const handleSummonerInputChange = (event) => {
    setSummonerName(event.target.value);
  };

  const handleClosePanel = () => {
    setShowRightPanel(false);
  };

  const handleOpenPanel = () => {
    setShowRightPanel(true);
  };

  const handleOpponentInputChange = (event) => {
    setOpponentName(event.target.value);
  };

  const delayedFetchDataAndMatches = debounce(fetchDataAndMatches, 50);

  async function fetchDataAndMatches(region) {
    try {
      setLoading(true);
      const [summonerGameName, summonerTagLine] = summonerName.split("#");
      const [opponentGameName, opponentTagLine] = opponentName.split("#");

      const encodedSummonerTagLine = encodeURIComponent(summonerTagLine);
      const encodedOpponentTagLine = encodeURIComponent(opponentTagLine);

      const response = await axios.get(
        `http://localhost:3001/summonerAndMatchData/${summonerGameName}/${encodedSummonerTagLine}/${opponentGameName}/${encodedOpponentTagLine}?region=${region}`
      );

      const responseData = response.data;

      setSummonerData(responseData.summonerData);
      setOpponentData(responseData.opponentData);
      setSpecificMatch(responseData.specificMatch);
      setCommonMatches(responseData.commonMatches);
      setOpponentLeagueData(responseData.opponentLeagueData);
      setError(null);
      setShowRightPanel(true);
    } catch (error) {
      setError("Błąd pobierania danych przywoływaczy: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`app-container ${showRightPanel ? "show-right-panel" : ""}`}
    >
      {loading && <div className="overlay"></div>}
      <LeftPanel
        summonerName={summonerName}
        opponentName={opponentName}
        handleSummonerInputChange={handleSummonerInputChange}
        handleOpponentInputChange={handleOpponentInputChange}
        fetchDataAndMatches={delayedFetchDataAndMatches}
      />
      {showRightPanel ? (
        <button
          className="chevron-button chevron-left"
          onClick={handleClosePanel}
        >
          <img src={chevronLeft} alt="Close" />
        </button>
      ) : (
        <button
          className="chevron-button chevron-right"
          onClick={handleOpenPanel}
        >
          <img src={chevronRight} alt="Open" />
        </button>
      )}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <RightPanel
          error={error}
          summonerData={summonerData}
          opponentData={opponentData}
          commonMatches={commonMatches}
          specificMatch={specificMatch}
          opponentLeagueData={opponentLeagueData}
        />
      )}
    </div>
  );
}

export default App;

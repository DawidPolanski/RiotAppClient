import React, { useState, useEffect } from "react";
import axios from "axios";
import RightPanel from "./components/RightPanel/RightPanel";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import debounce from "lodash/debounce";

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

  const handleSummonerInputChange = (event) => {
    setSummonerName(event.target.value);
  };

  const handleOpponentInputChange = (event) => {
    setOpponentName(event.target.value);
  };

  const delayedFetchDataAndMatches = debounce(fetchDataAndMatches, 50);

  async function fetchDataAndMatches() {
    try {
      setLoading(true);
      const [summonerGameName, summonerTagLine] = summonerName.split("#");
      const [opponentGameName, opponentTagLine] = opponentName.split("#");

      const encodedSummonerTagLine = encodeURIComponent(summonerTagLine);
      const encodedOpponentTagLine = encodeURIComponent(opponentTagLine);

      const response = await axios.get(
        `http://localhost:3001/summonerAndMatchData/${summonerGameName}/${encodedSummonerTagLine}/${opponentGameName}/${encodedOpponentTagLine}`
      );

      const responseData = response.data;

      setSummonerData(responseData.summonerData);
      setOpponentData(responseData.opponentData);
      setSpecificMatch(responseData.specificMatch);
      setCommonMatches(responseData.commonMatches);
      setOpponentLeagueData(responseData.opponentLeagueData);
      setError(null);
    } catch (error) {
      setError("Błąd pobierania danych przywoływaczy: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      {loading && <div className="overlay"></div>}
      <LeftPanel
        summonerName={summonerName}
        opponentName={opponentName}
        handleSummonerInputChange={handleSummonerInputChange}
        handleOpponentInputChange={handleOpponentInputChange}
        fetchDataAndMatches={delayedFetchDataAndMatches}
      />
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

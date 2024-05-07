import React, { useState } from "react";
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

  const handleSummonerInputChange = (event) => {
    setSummonerName(event.target.value);
  };

  const handleOpponentInputChange = (event) => {
    setOpponentName(event.target.value);
  };

  const delayedFetchDataAndMatches = debounce(fetchDataAndMatches, 50);

  async function fetchDataAndMatches() {
    try {
      const [summonerGameName, summonerTagLine] = summonerName.split("#");
      const [opponentGameName, opponentTagLine] = opponentName.split("#");

      const encodedSummonerTagLine = encodeURIComponent(summonerTagLine);
      const encodedOpponentTagLine = encodeURIComponent(opponentTagLine);

      const summonerResponse = await axios.get(
        `http://localhost:3001/summonerData/${summonerGameName}/${encodedSummonerTagLine}`
      );

      const opponentResponse = await axios.get(
        `http://localhost:3001/summonerData/${opponentGameName}/${encodedOpponentTagLine}`
      );

      const summonerPuuid = summonerResponse.data.puuid;
      const opponentPuuid = opponentResponse.data.puuid;

      const summonerMatchResponse = await axios.get(
        `http://localhost:3001/summonerMatch/${summonerPuuid}`
      );

      const opponentMatchResponse = await axios.get(
        `http://localhost:3001/summonerMatch/${opponentPuuid}`
      );

      const summonerMatchesData = summonerMatchResponse.data;
      const opponentMatchesData = opponentMatchResponse.data;

      if (
        summonerMatchesData.length === 0 ||
        opponentMatchesData.length === 0
      ) {
        throw new Error("Brak meczów dla któregoś z przywoływaczy.");
      }

      const commonMatches = summonerMatchesData.filter((match) =>
        opponentMatchesData.includes(match)
      );

      if (commonMatches.length === 0) {
        throw new Error("Brak wspólnych meczów dla obu przywoływaczy.");
      }

      const matchDetailsPromises = commonMatches.map(async (matchId) => {
        const specificMatchResponse = await axios.get(
          `http://localhost:3001/specificMatch/${matchId}`
        );
        return specificMatchResponse.data;
      });

      const matchDetails = await Promise.all(matchDetailsPromises);

      setSpecificMatch(matchDetails);
      setSummonerData(summonerResponse.data);
      setOpponentData(opponentResponse.data);
      console.log(summonerResponse.data);
      console.log(opponentResponse.data);
      setCommonMatches(commonMatches);
      console.log(commonMatches[10]);
      setError(null);
    } catch (error) {
      setError("Błąd pobierania danych przywoływaczy: " + error.message);
    }
  }

  return (
    <div className="app-container">
      <LeftPanel
        summonerName={summonerName}
        opponentName={opponentName}
        handleSummonerInputChange={handleSummonerInputChange}
        handleOpponentInputChange={handleOpponentInputChange}
        fetchDataAndMatches={delayedFetchDataAndMatches}
      />
      <RightPanel
        error={error}
        summonerData={summonerData}
        opponentData={opponentData}
        commonMatches={commonMatches}
        specificMatch={specificMatch}
      />
    </div>
  );
}

export default App;

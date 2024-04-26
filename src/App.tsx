import React, { useState } from "react";
import axios from "axios";

function App() {
  const [summonerName, setSummonerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  // const [summonerMatches, setSummonerMatches] = useState([]);
  // const [opponentMatches, setOpponentMatches] = useState([]);
  const [commonMatches, setCommonMatches] = useState([]);
  const [error, setError] = useState(null);

  const handleSummonerInputChange = (event) => {
    setSummonerName(event.target.value);
  };

  const handleOpponentInputChange = (event) => {
    setOpponentName(event.target.value);
  };

  const fetchDataAndMatches = async () => {
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

      setSummonerData(summonerResponse.data);
      setOpponentData(opponentResponse.data);
      // setSummonerMatches(summonerMatchesData);
      // setOpponentMatches(opponentMatchesData);
      setCommonMatches(commonMatches);
      setError(null);
    } catch (error) {
      setError("Błąd pobierania danych przywoływaczy: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={summonerName}
        onChange={handleSummonerInputChange}
        placeholder="Wprowadź nazwę użytkownika (Summoner)"
      />
      <input
        type="text"
        value={opponentName}
        onChange={handleOpponentInputChange}
        placeholder="Wprowadź nazwę użytkownika (Przeciwnik)"
      />
      <button onClick={fetchDataAndMatches}>
        Pobierz dane i historię meczy
      </button>
      {error && <div>{error}</div>}
      {summonerData && (
        <div>
          <h2>Dane użytkownika {summonerName}</h2>
          <pre>{JSON.stringify(summonerData, null, 2)}</pre>
        </div>
      )}
      {opponentData && (
        <div>
          <h2>Dane użytkownika {opponentName}</h2>
          <pre>{JSON.stringify(opponentData, null, 2)}</pre>
        </div>
      )}
      {commonMatches && commonMatches.length > 0 && (
        <div>
          <h2>Wspólne mecze</h2>
          <ul>
            {commonMatches.map((match) => (
              <li key={match}>
                {match}
                {" - "}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

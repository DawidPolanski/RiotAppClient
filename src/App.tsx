import React, { useState } from "react";
import axios from "axios";

function App() {
  const [summonerName, setSummonerName] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [specificMatch, setSpecificMatch] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSummonerName(event.target.value);
  };

  const fetchDataAndMatches = async () => {
    try {
      const [gameName, tagLine] = summonerName.split("#");
      const encodedTagLine = encodeURIComponent(tagLine);

      const response = await axios.get(
        `http://localhost:3001/summonerData/${gameName}/${encodedTagLine}`
      );

      const puuid = response.data.puuid;

      const responseMatch = await axios.get(
        `http://localhost:3001/summonerMatch/${puuid}`
      );

      const matchIds = responseMatch.data;

      if (matchIds.length === 0) {
        throw new Error("Brak meczów dla tego przywoływacza.");
      }

      const matchId = matchIds[0];

      const specificMatchResponse = await axios.get(
        `http://localhost:3001/specificMatch/${matchId}`
      );

      const specificMatchData = specificMatchResponse.data;
      setSpecificMatch(specificMatchData);

      setSummonerData(response.data);
      setMatches(matchIds);
      setError(null);
    } catch (error) {
      setError("Błąd pobierania danych przywoływacza: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={summonerName}
        onChange={handleInputChange}
        placeholder="Wprowadź nazwę użytkownika"
      />
      <button onClick={fetchDataAndMatches}>
        Pobierz dane i historię meczy
      </button>
      {error && <div>{error}</div>}
      {summonerData && (
        <div>
          <h2>Dane użytkownika:</h2>
          <pre>{JSON.stringify(summonerData, null, 2)}</pre>
        </div>
      )}
      {matches && matches.length > 0 && (
        <div>
          <h2>Mecze użytkownika:</h2>
          <ul>
            {matches.map((match) => (
              <li key={match}>{match}</li>
            ))}
          </ul>
        </div>
      )}
      {specificMatch && (
        <div>
          <h2>Dane meczu:</h2>
          <pre>{JSON.stringify(specificMatch, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

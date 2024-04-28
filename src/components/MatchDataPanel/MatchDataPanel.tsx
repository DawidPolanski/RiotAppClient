// MatchDataPanel.jsx
import React from "react";
import cls from "./MatchDataPanel.module.scss";

const MatchDataPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
}) => {
  return (
    <div className={cls["match-data-panel"]}>
      <div className={cls["scroll-container"]}>
        {error && <div className="error-message">{error}</div>}
        {summonerData && (
          <div className="card">
            <h2>Dane użytkownika {summonerData.gameName}</h2>
            <pre>{JSON.stringify(summonerData, null, 2)}</pre>
          </div>
        )}
        {opponentData && (
          <div className="card">
            <h2>Dane użytkownika {opponentData.gameName}</h2>
            <pre>{JSON.stringify(opponentData, null, 2)}</pre>
          </div>
        )}
        {commonMatches && commonMatches.length > 0 && (
          <div className="card match-details">
            <h2>Wspólne mecze</h2>
            <ul>
              {commonMatches.map((match) => (
                <li key={match}>{match}</li>
              ))}
            </ul>
          </div>
        )}
        {specificMatch && (
          <div className="card match-details">
            <h2>Wspólne mecze:</h2>
            {specificMatch.map((match, index) => (
              <div key={index} className="match">
                <p>
                  <strong>Id meczu:</strong> {commonMatches[index]}
                </p>
                {match.info.participants.map((participant) => {
                  if (
                    participant.puuid === summonerData.puuid ||
                    participant.puuid === opponentData.puuid
                  ) {
                    return (
                      <p key={participant.participantId}>
                        <strong>Rola:</strong> {participant.role},{" "}
                        <strong>Postać:</strong> {participant.championName}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDataPanel;

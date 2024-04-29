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
      {specificMatch &&
        specificMatch.map((match, index) => {
          const gameStartTimestamp = match.info.gameStartTimestamp;
          const currentDate = new Date();
          const gameStartDate = new Date(gameStartTimestamp);
          const timeDifference =
            currentDate.getTime() - gameStartDate.getTime();
          const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          const queueType =
            match.info.queueId === 440
              ? "Rankingowa Elastyczna"
              : "Rankingowa Solo/Duo";

          return (
            <div key={index} className={cls["specific-match"]}>
              <div className="left">
                <p>
                  <strong>Days Ago:</strong> {daysAgo}
                </p>
                <p>
                  <strong>Queue Type:</strong> {queueType}
                </p>
              </div>
              <div className="middle">
                <p>
                  <strong>Opponent Name:</strong> {opponentData.gameName}
                </p>
                <p>
                  <strong>Champion Name:</strong>{" "}
                  {match.info.participants
                    .filter(
                      (participant) =>
                        participant.summonerName === opponentData.gameName
                    )
                    .map(
                      (filteredParticipant) => filteredParticipant.championName
                    )}
                </p>
              </div>
              <div className="right">
                <h3>All Players</h3>
                {match.info.participants.map((participant) => (
                  <p key={participant.participantId}>
                    <strong>Summoner Name:</strong> {participant.summonerName}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MatchDataPanel;

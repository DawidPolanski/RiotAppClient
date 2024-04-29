import React from "react";
import cls from "./MatchDataPanel.module.scss";
import championsIcons from "../../assets/image/champions-icons";

const MatchDataPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
}) => {
  return (
    <div className={cls["match-data-panel"]}>
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
          const opponentChampionName = match.info.participants
            .filter(
              (participant) =>
                participant.summonerName === opponentData.gameName
            )
            .map((filteredParticipant) => filteredParticipant.championName);

          const opponentChampionIcon = championsIcons[opponentChampionName];

          const opponentKills = match.info.participants
            .filter(
              (participant) =>
                participant.summonerName === opponentData.gameName
            )
            .reduce((total, participant) => total + participant.kills, 0);

          const opponentDeaths = match.info.participants
            .filter(
              (participant) =>
                participant.summonerName === opponentData.gameName
            )
            .reduce((total, participant) => total + participant.deaths, 0);

          const opponentAssists = match.info.participants
            .filter(
              (participant) =>
                participant.summonerName === opponentData.gameName
            )
            .reduce((total, participant) => total + participant.assists, 0);

          const kdaStyle = {
            color: "#36AE42",
          };

          const deathStyle = {
            color: "#993636",
          };

          const assistStyle = {
            color: "#A6A912",
          };

          return (
            <div key={index} className={cls["specific-match"]}>
              <div className={cls["game-data"]}>
                <p>
                  <strong>Days Ago:</strong> {daysAgo}
                </p>
                <p>{queueType}</p>
              </div>
              <div className={cls["player-data"]}>
                <div className={cls["opponent-info"]}>
                  <div className={cls["opponent-champion"]}>
                    <img
                      className={cls["champion-icon"]}
                      src={opponentChampionIcon}
                      alt={opponentChampionName}
                    />
                  </div>

                  <p>
                    <span style={kdaStyle}>{opponentKills}</span>/
                    <span style={deathStyle}>{opponentDeaths}</span>/
                    <span style={assistStyle}>{opponentAssists}</span>
                  </p>
                </div>
              </div>

              <div className={cls["players-list"]}>
                {match.info.participants.map((participant) => (
                  <div
                    key={participant.participantId}
                    className={cls["player"]}
                  >
                    <img
                      src={championsIcons[participant.championName]}
                      alt={participant.championName}
                      width="30"
                      height="30"
                    />
                    <span className={cls["summoner-name"]}>
                      {participant.summonerName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MatchDataPanel;

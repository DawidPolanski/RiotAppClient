import React, { useEffect, useState } from "react";
import cls from "./MatchDataPanel.module.scss";
import championsIcons from "../../assets/image/champions-icons";
import { queueDescriptions } from "../../shared/queueDescriptions";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MatchDataPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
  onValueChange,
}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (specificMatch && summonerData && opponentData && commonMatches) {
      let totalWinsForSummoner = 0;
      let totalMatchesAgainstOpponent = [];
      let totalMatchesWithOpponent = [];
      let dates = [];
      let winsAgainstData = [];
      let winsWithData = [];

      specificMatch.forEach((match, index) => {
        if (
          match.info &&
          match.info.participants &&
          match.info.participants.length > 0
        ) {
          const player = match.info.participants.find(
            (participant) =>
              participant.riotIdGameName === summonerData.gameName
          );
          const opponent = match.info.participants.find(
            (participant) =>
              participant.riotIdGameName === opponentData.gameName
          );
          if (player && opponent) {
            const summonerTeamId = player.teamId;
            const opponentTeamId = opponent.teamId;

            if (summonerTeamId === opponentTeamId) {
              totalMatchesWithOpponent.push(match);
              if (player.win) {
                totalWinsForSummoner++;
              }
            } else {
              totalMatchesAgainstOpponent.push(match);
              if (player.win) {
                totalWinsForSummoner++;
              }
            }

            const gameStartDate = new Date(match.info.gameStartTimestamp);
            dates.push(gameStartDate.toLocaleDateString());

            winsAgainstData.push(
              summonerTeamId !== opponentTeamId && player.win ? 1 : 0
            );
            winsWithData.push(
              summonerTeamId === opponentTeamId && player.win ? 1 : 0
            );
          }
        }
      });

      const winsRatioAgainstOpponent =
        totalMatchesAgainstOpponent.length > 0
          ? (totalWinsForSummoner / totalMatchesAgainstOpponent.length) * 100
          : 0;
      const winsRatioWithOpponent =
        totalMatchesWithOpponent.length > 0
          ? (totalWinsForSummoner / totalMatchesWithOpponent.length) * 100
          : 0;

      onValueChange(
        winsRatioAgainstOpponent,
        winsRatioWithOpponent,
        totalMatchesWithOpponent.length,
        totalMatchesAgainstOpponent.length
      );

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Wins Against Opponent",
            data: winsAgainstData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
          {
            label: "Wins With Opponent",
            data: winsWithData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
          },
        ],
      });
    }
  }, [specificMatch, summonerData, opponentData, commonMatches, onValueChange]);

  return (
    <div className={cls["match-data-panel"]}>
      <div className={cls["matches-container"]}>
        {specificMatch &&
          specificMatch.map((match, index) => {
            const gameStartTimestamp = match.info.gameStartTimestamp;
            const gameEndTimestamp = match.info.gameEndTimestamp;
            const gameDurationInSeconds = match.info.gameDuration;
            const gameDuration = calculateGameDuration(
              gameStartTimestamp,
              gameEndTimestamp,
              gameDurationInSeconds
            );
            const currentDate = new Date();
            const gameStartDate = new Date(gameStartTimestamp);
            const timeDifference =
              currentDate.getTime() - gameStartDate.getTime();
            const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const queueType =
              queueDescriptions[match.info.queueId] || "Unknown Queue";
            const opponentChampionName = match.info.participants
              .filter(
                (participant) =>
                  participant.riotIdGameName === opponentData?.gameName
              )
              .map(
                (filteredParticipant) => filteredParticipant.championName
              )[0];

            const opponentChampionIcon = championsIcons[opponentChampionName];

            const opponentKills = match.info.participants
              .filter(
                (participant) =>
                  participant.riotIdGameName === opponentData?.gameName
              )
              .reduce((total, participant) => total + participant.kills, 0);

            const opponentDeaths = match.info.participants
              .filter(
                (participant) =>
                  participant.riotIdGameName === opponentData?.gameName
              )
              .reduce((total, participant) => total + participant.deaths, 0);

            const opponentAssists = match.info.participants
              .filter(
                (participant) =>
                  participant.riotIdGameName === opponentData?.gameName
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
            const playerResult = match.info.participants.find((participant) => {
              return participant.riotIdGameName === summonerData?.gameName;
            })?.win;

            return (
              <div key={index} className={cls["specific-match"]}>
                <div className={cls["game-data"]}>
                  <p className={cls["queue-type"]}>{queueType}</p>
                  <p className={cls["game-duration"]}>
                    <strong> {daysAgo} Days ago</strong>
                  </p>
                  {playerResult !== undefined && (
                    <p
                      className={cls["win-result"]}
                      style={{ color: playerResult ? "#36AE42" : "#993636" }}
                    >
                      {playerResult ? "YOU WIN" : "YOU LOSE"}
                    </p>
                  )}
                  <p className={cls["game-time"]}>
                    <strong>Time:</strong> {gameDuration}
                  </p>
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
                      <span style={kdaStyle}>{opponentKills}</span>{" "}
                      &nbsp;/&nbsp;
                      <span style={deathStyle}>{opponentDeaths}</span>
                      &nbsp;/&nbsp;
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
                      <span
                        className={
                          participant.riotIdGameName === summonerData?.gameName
                            ? cls["summoner-name-summoner"]
                            : participant.riotIdGameName ===
                              opponentData?.gameName
                            ? cls["summoner-name-opponent"]
                            : ""
                        }
                      >
                        {participant.riotIdGameName === summonerData?.gameName
                          ? summonerData?.gameName
                          : participant.riotIdGameName ===
                            opponentData?.gameName
                          ? opponentData?.gameName
                          : participant.riotIdGameName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
      <div className={cls["chart-container"]}>
        {chartData && <Line data={chartData} />}
      </div>
    </div>
  );
};

const calculateGameDuration = (
  gameStartTimestamp,
  gameEndTimestamp,
  gameDurationInSeconds
) => {
  let gameDurationFormatted;

  if (gameEndTimestamp) {
    const durationInSeconds = (gameEndTimestamp - gameStartTimestamp) / 1000;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    gameDurationFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  } else {
    const minutes = Math.floor(gameDurationInSeconds / 60);
    const seconds = Math.floor(gameDurationInSeconds % 60);
    gameDurationFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  return gameDurationFormatted;
};

export default MatchDataPanel;

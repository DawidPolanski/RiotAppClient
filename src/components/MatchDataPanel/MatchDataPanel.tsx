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
      let totalMatches = 0;
      let totalWinsAgainstOpponent = 0;
      let totalWinsWithOpponent = 0;
      let totalMatchesAgainstOpponent = 0;
      let totalMatchesWithOpponent = 0;
      let dates = [];
      let winPercentages = [];
      let winsAgainstData = [];
      let winsWithData = [];

      for (let i = specificMatch.length - 1; i >= 0; i--) {
        const match = specificMatch[i];
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
            totalMatches++;
            if (player.win) {
              totalWinsForSummoner++;
            }

            const summonerTeamId = player.teamId;
            const opponentTeamId = opponent.teamId;

            if (summonerTeamId === opponentTeamId) {
              totalMatchesWithOpponent++;
              if (player.win) {
                totalWinsWithOpponent++;
              }
            } else {
              totalMatchesAgainstOpponent++;
              if (player.win) {
                totalWinsAgainstOpponent++;
              }
            }

            const gameStartDate = new Date(match.info.gameStartTimestamp);
            dates.push(gameStartDate.toLocaleDateString());
            winPercentages.push((totalWinsForSummoner / totalMatches) * 100);
            winsAgainstData.push(
              totalMatchesAgainstOpponent > 0
                ? (totalWinsAgainstOpponent / totalMatchesAgainstOpponent) * 100
                : 0
            );
            winsWithData.push(
              totalMatchesWithOpponent > 0
                ? (totalWinsWithOpponent / totalMatchesWithOpponent) * 100
                : 0
            );
          }
        }
      }

      const sortedData = dates
        .map((date, index) => ({
          date,
          winPercentage: winPercentages[index],
          winsAgainst: winsAgainstData[index],
          winsWith: winsWithData[index],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const sortedWinPercentages = sortedData.map((data) => data.winPercentage);
      const sortedWinsWithData = sortedData.map((data) => data.winsWith);

      onValueChange(
        sortedWinPercentages[sortedWinPercentages.length - 1] || 0,
        sortedWinsWithData[sortedWinsWithData.length - 1] || 0,
        totalMatchesWithOpponent,
        totalMatchesAgainstOpponent
      );

      setChartData({
        labels: sortedData.map((data) => data.date),
        datasets: [
          {
            label: "Win With Opponent",
            data: sortedData.map((data) => data.winPercentage),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Wins Against Opponent",
            data: sortedData.map((data) => data.winsAgainst),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            yAxisID: "y",
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
            const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
            const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            let timeAgo;
            if (hoursAgo < 24) {
              timeAgo = hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`;
            } else {
              timeAgo = daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
            }

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
                    <strong> {timeAgo}</strong>
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
                            : cls["summoner-name"]
                        }
                      >
                        {participant.riotIdGameName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
      <div className={cls["chart-container"]}>
        {chartData && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Win Percentage Over Time",
                },
              },
              scales: {
                y: {
                  min: 0,
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Win Percentage",
                  },
                  grid: {
                    color: "rgba(53, 54, 59, 0.2)",
                    lineWidth: 1.5,
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Time",
                  },
                  grid: {
                    color: "rgba(53, 54, 59, 0.2)",
                    lineWidth: 1.5,
                  },
                },
              },
            }}
          />
        )}
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

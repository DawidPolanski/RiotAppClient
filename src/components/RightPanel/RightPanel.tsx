import React, { useState, useEffect } from "react";
import cls from "./RightPanel.module.scss";
import MatchDataPanel from "../MatchDataPanel/MatchDataPanel";
import divisionLol from "../../assets/image/division_lol";

const RightPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
  opponentLeagueData,
}) => {
  const [winsRatioAgainstOpponent, setWinsRatioAgainstOpponent] = useState<
    number | null
  >(null);
  const [winsRatioWithOpponent, setWinsRatioWithOpponent] = useState<
    number | null
  >(null);
  const [totalMatchesAgainstOpponent, setTotalMatchesAgainstOpponent] =
    useState<number | null>(null);
  const [totalMatchesWithOpponent, setTotalMatchesWithOpponent] = useState<
    number | null
  >(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handleValueChange = (
    winsRatioAgainstOpponent,
    winsRatioWithOpponent,
    totalMatchesWithOpponent,
    totalMatchesAgainstOpponent
  ) => {
    setWinsRatioAgainstOpponent(winsRatioAgainstOpponent);
    setWinsRatioWithOpponent(winsRatioWithOpponent);
    setTotalMatchesWithOpponent(totalMatchesWithOpponent);
    setTotalMatchesAgainstOpponent(totalMatchesAgainstOpponent);
  };

  useEffect(() => {
    if (commonMatches && specificMatch && summonerData && opponentData) {
      let totalWinsForSummoner = 0;
      let totalWinsWithOpponent = 0;
      let totalMatchesAgainstOpponent = 0;
      let totalMatchesWithOpponent = 0;

      const winsAgainstData = [];
      const winsWithData = [];

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
            const playerResult = player.win;

            if (summonerTeamId === opponentTeamId) {
              totalMatchesWithOpponent++;
              winsWithData.push(playerResult ? 1 : 0);
              if (playerResult) {
                totalWinsWithOpponent++;
              }
            } else {
              totalMatchesAgainstOpponent++;
              winsAgainstData.push(playerResult ? 1 : 0);
              if (playerResult) {
                totalWinsForSummoner++;
              }
            }
          }
        }
      });

      const winsRatioAgainstOpponent =
        totalMatchesAgainstOpponent > 0
          ? (totalWinsForSummoner / totalMatchesAgainstOpponent) * 100
          : 0;
      const winsRatioWithOpponent =
        totalMatchesWithOpponent > 0
          ? (totalWinsWithOpponent / totalMatchesWithOpponent) * 100
          : 0;

      handleValueChange(
        winsRatioAgainstOpponent,
        winsRatioWithOpponent,
        totalMatchesWithOpponent,
        totalMatchesAgainstOpponent
      );
    }
  }, [specificMatch, commonMatches, summonerData, opponentData]);

  return (
    <div className={`${cls["right-panel"]} right-panel`}>
      <div className={cls["data-section"]}>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Games</div>
          <div className={cls["field-value"]}>
            {commonMatches.length !== 0 ? commonMatches.length : "-"}
          </div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Wins against</div>
          <div className={cls["field-value"]}>
            {winsRatioAgainstOpponent !== null &&
            totalMatchesAgainstOpponent !== null &&
            totalMatchesAgainstOpponent !== 0
              ? `${winsRatioAgainstOpponent.toFixed(
                  2
                )}% on ${totalMatchesAgainstOpponent} ${
                  totalMatchesAgainstOpponent !== 1 ? "Games" : "Game"
                }`
              : "-"}
          </div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Wins with</div>
          <div className={cls["field-value"]}>
            {winsRatioWithOpponent !== null &&
            totalMatchesWithOpponent !== null &&
            totalMatchesWithOpponent !== 0
              ? `${winsRatioWithOpponent.toFixed(
                  2
                )}% on ${totalMatchesWithOpponent} ${
                  totalMatchesWithOpponent !== 1 ? "Games" : "Game"
                }`
              : "-"}
          </div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Rank solo/duo</div>
          <div className={cls["field-value"]}>
            {opponentLeagueData && opponentLeagueData.length > 0
              ? opponentLeagueData
                  .filter((league) => league.queueType === "RANKED_SOLO_5x5")
                  .map((league, index) => (
                    <div key={index} className={cls["tier-info"]}>
                      <img
                        className={cls["tier-icon"]}
                        src={divisionLol[league.tier]}
                        alt={league.tier}
                      />
                      <div>
                        <div>
                          {league.tier} {league.rank} {league.leaguePoints} LP
                        </div>
                      </div>
                      {index !== opponentLeagueData.length - 1 && " "}
                    </div>
                  ))
              : "-"}
          </div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Rank flex</div>
          <div className={cls["field-value"]}>
            {opponentLeagueData && opponentLeagueData.length > 0
              ? opponentLeagueData
                  .filter((league) => league.queueType !== "RANKED_SOLO_5x5")
                  .map((league, index) => (
                    <div key={index} className={cls["tier-info"]}>
                      <img
                        className={cls["tier-icon"]}
                        src={divisionLol[league.tier]}
                        alt={league.tier}
                      />
                      <div>
                        <div>
                          {league.tier} {league.rank} {league.leaguePoints} LP
                        </div>
                      </div>
                      {index !== opponentLeagueData.length - 1 && " "}
                    </div>
                  ))
              : "-"}
          </div>
        </div>
      </div>
      <div className={cls["scroll-container"]}>
        {error && <div className="error-message">{error}</div>}
        <MatchDataPanel
          error={error}
          summonerData={summonerData}
          opponentData={opponentData}
          commonMatches={commonMatches}
          specificMatch={specificMatch}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
};

export default RightPanel;

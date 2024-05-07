import React, { useState, useEffect } from "react";
import cls from "./RightPanel.module.scss";
import MatchDataPanel from "../MatchDataPanel/MatchDataPanel";

const RightPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
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

      specificMatch.forEach((match) => {
        if (
          match.info &&
          match.info.participants &&
          match.info.participants.length > 0
        ) {
          const player = match.info.participants.find(
            (participant) => participant.summonerName === summonerData.gameName
          );
          const opponent = match.info.participants.find(
            (participant) => participant.summonerName === opponentData.gameName
          );

          if (player && opponent) {
            const summonerTeamId = player.teamId;
            const opponentTeamId = opponent.teamId;
            const playerResult = player.win;

            if (summonerTeamId === opponentTeamId) {
              totalMatchesWithOpponent++;
              if (playerResult) {
                totalWinsWithOpponent++;
              }
            } else {
              totalMatchesAgainstOpponent++;
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
    <div className={cls["right-panel"]}>
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
          <div className={cls["field-label"]}>Rank</div>
          <div className={cls["field-value"]}>{33}</div>
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

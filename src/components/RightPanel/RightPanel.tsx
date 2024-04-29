import React from "react";
import cls from "./RightPanel.module.scss";
import MatchDataPanel from "../MatchDataPanel/MatchDataPanel";

const RightPanel = ({
  error,
  summonerData,
  opponentData,
  commonMatches,
  specificMatch,
}) => {
  return (
    <div className={cls["right-panel"]}>
      <div className={cls["data-section"]}>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Games</div>
          <div className={cls["field-value"]}>{commonMatches.length}</div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Winrate against</div>
          <div className={cls["field-value"]}>{33}</div>
        </div>
        <div className={cls["data-field"]}>
          <div className={cls["field-label"]}>Winrate with</div>
          <div className={cls["field-value"]}>{33}</div>
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
        />
      </div>
    </div>
  );
};

export default RightPanel;

import React, { useState, useEffect, useRef } from "react";
import cls from "./LeftPanel.module.scss";
import regions from "../../shared/regionList";

function LeftPanel({
  summonerName,
  opponentName,
  handleSummonerInputChange,
  handleOpponentInputChange,
  fetchDataAndMatches,
}) {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  const [showSelect, setShowSelect] = useState(false);
  const [summonerSuggestions, setSummonerSuggestions] = useState([]);
  const [opponentSuggestions, setOpponentSuggestions] = useState([]);

  const canvasRef = useRef(null);

  useEffect(() => {
    setShowSelect(true);

    const storedSummonerSuggestions =
      JSON.parse(localStorage.getItem("summonerSearches")) || [];
    const storedOpponentSuggestions =
      JSON.parse(localStorage.getItem("opponentSearches")) || [];
    setSummonerSuggestions(storedSummonerSuggestions);
    setOpponentSuggestions(storedOpponentSuggestions);

    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    class Firefly {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.s = Math.random() * 2;
        this.ang = Math.random() * 2 * Math.PI;
        this.v = (this.s * this.s) / 4;
      }
      move() {
        this.x += this.v * Math.cos(this.ang);
        this.y += this.v * Math.sin(this.ang);
        this.ang += Math.random() * 20 * (Math.PI / 180) - 10 * (Math.PI / 180);
      }
      show() {
        c.beginPath();
        c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
        c.fillStyle = "#fddba3";
        c.fill();
      }
    }

    let f = [];

    function draw() {
      if (f.length < 200) {
        for (let j = 0; j < 20; j++) {
          f.push(new Firefly());
        }
      }

      for (let i = 0; i < f.length; i++) {
        f[i].move();
        f[i].show();
        if (f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h) {
          f.splice(i, 1);
        }
      }
    }

    function loop() {
      c.clearRect(0, 0, w, h);
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  const handleClick = () => {
    if (!isButtonDisabled) {
      setButtonDisabled(true);
      fetchDataAndMatches(selectedRegion);

      const newSummonerSuggestions = [
        summonerName,
        ...summonerSuggestions.filter((name) => name !== summonerName),
      ].slice(0, 5);
      const newOpponentSuggestions = [
        opponentName,
        ...opponentSuggestions.filter((name) => name !== opponentName),
      ].slice(0, 5);

      localStorage.setItem(
        "summonerSearches",
        JSON.stringify(newSummonerSuggestions)
      );
      localStorage.setItem(
        "opponentSearches",
        JSON.stringify(newOpponentSuggestions)
      );

      setSummonerSuggestions(newSummonerSuggestions);
      setOpponentSuggestions(newOpponentSuggestions);

      setTimeout(() => {
        setButtonDisabled(false);
      }, 2000);
    }
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <div className={`${cls["left-panel"]} left-panel`}>
      <h1 className={cls["main-title"]}>Check your teammate</h1>
      <div
        className={`${cls["input-container"]} ${
          showSelect ? cls["show-select"] : ""
        }`}
      >
        <input
          className="summoner-input"
          type="text"
          value={summonerName}
          onChange={handleSummonerInputChange}
          placeholder="Enter your nickname"
          list="summoner-suggestions"
        />
        <datalist id="summoner-suggestions">
          {summonerSuggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <input
          className="summoner-input"
          type="text"
          value={opponentName}
          onChange={handleOpponentInputChange}
          placeholder="Enter your teammate's nickname"
          list="opponent-suggestions"
        />
        <datalist id="opponent-suggestions">
          {opponentSuggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <select
          className={`${cls["region-select"]} region-select`}
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
      <div className={cls["button-container"]}>
        <button
          className={cls["button-primary"]}
          onClick={handleClick}
          disabled={isButtonDisabled}
        >
          Check
          <img
            src="./src/assets/icons/icon-search.svg"
            alt="icon-search.svg"
            className={cls["icon"]}
          />
        </button>
      </div>
      <canvas ref={canvasRef} className={cls["background-canvas"]}></canvas>
    </div>
  );
}

export default LeftPanel;

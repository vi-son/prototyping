import React, { useState } from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "./AudioPlayer.js";
import SelectBox from "./SelectBox.js";

const Harvester = () => {
  const scenarioCount = 10;
  const [completedCount, setCompletedCount] = useState(0);
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [samples] = useState([
    "dmutr_s01_pad-lo.mp3",
    "piano_s01_piano.mp3",
    "piano_s03_wind-pad.mp3",
    "shine-on_s01_arp.mp3",
    "shine-on_s02_horns.mp3",
    "shine-on_s03_km03.mp3",
    "shine-on_s04_brass-gm-d14.mp3",
    "shine-on_s06_git-bridge-01-triolen.mp3",
    "shine-on_s07_git-bridge-05-rev.mp3"
  ]);

  const onNextScenario = e => {
    setCompletedCount(completedCount + 1);
    const nextSampleIdx = Math.round(Math.random() * (samples.length - 1));
    setSelectedSampleIdx(nextSampleIdx);
  };

  const onRestartWorkflow = e => {
    setCompletedCount(0);
  };

  const finishedLayout = (
    <main>
      <span className="emoji">&#127881;</span>
      <h1>Congratulations</h1>
      <button onClick={onRestartWorkflow}>Another round</button>
    </main>
  );

  const workflowLayout = (
    <main>
      <AudioPlayer audiosrc={`/audio/samples/${samples[selectedSampleIdx]}`} />
      <SelectBox></SelectBox>
      <button onClick={onNextScenario}>Next</button>
    </main>
  );

  return (
    <div className="harvester">
      <div className="titlebar">
        <h2>Title Bar</h2>
      </div>
      {completedCount === scenarioCount ? finishedLayout : workflowLayout}
      <div className="progressbar">
        <div
          className="completed-text"
          style={{ width: `${(completedCount / scenarioCount) * 100}vw` }}
        >
          {completedCount} <span className="divider">/</span> {scenarioCount}
        </div>
        <div className="bar">
          <div
            className="completed"
            style={{ width: `${(completedCount / scenarioCount) * 100}vw` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<Harvester />, mount);

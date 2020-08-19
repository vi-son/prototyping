import React, { useState } from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "./AudioPlayer.js";

const Harvester = () => {
  const scenarioCount = 10;
  const [completedCount, setCompletedCount] = useState(0);

  const onNextScenario = e => {
    setCompletedCount(completedCount + 1);
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
      <AudioPlayer audiosrc={"audio/patterns.202006.mp3"} />
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

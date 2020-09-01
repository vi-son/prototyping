import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "./AudioPlayer.js";
import SelectBox from "./SelectBox.js";
import ColorInput from "./ColorInput.js";
import FeelingsInput from "./FeelingsInput.js";
import ShapeInput from "./ShapeInput.js";

const Harvester = () => {
  const scenarioCount = 10;
  const fadeDuration = 1000;
  const audioPlayerRef = useRef();
  const selectBoxRef = useRef();
  const [backgroundColor, setBackgroundColor] = useState("var(--color-snow)");
  const [isColorReactive, setIsColorReactive] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [samples, setSamples] = useState([
    "aurora-20200829-bass01.mp3",
    "aurora-20200829-git01.mp3",
    "aurora-20200829-synth01.mp3",
    "dmutr_s01_pad-lo.mp3",
    "gig-teaser-20200829-bass01.mp3",
    "gig-teaser-20200829-beat01.mp3",
    "gig-teaser-20200829-synth01.mp3",
    "montez-20200829-git01.mp3",
    "montez-20200829-git02.mp3",
    "montez-20200829-keys01.mp3",
    "piano_s01_piano.mp3",
    "piano_s03_wind-pad.mp3",
    "shine-on_s01_arp.mp3",
    "shine-on_s02_horns.mp3",
    "shine-on_s03_km03.mp3",
    "shine-on_s04_brass-gm-d14.mp3",
    "shine-on_s06_git-bridge-01-triolen.mp3",
    "shine-on_s07_git-bridge-05-rev.mp3"
  ]);
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(
    Math.round(Math.random() * (samples.length - 1))
  );
  const [seenSamples, setSeenSamples] = useState([]);
  const [currentMapping, setCurrentMapping] = useState({
    audiosample: samples[selectedSampleIdx],
    type: "none",
    mapping: {}
  });
  const [mappings, setMappings] = useState([]);

  const moveToNextScenario = e => {
    setCompletedCount(completedCount + 1);
    setSamples([
      ...samples.slice(0, selectedSampleIdx),
      ...samples.slice(selectedSampleIdx + 1)
    ]);
    setSeenSamples([...seenSamples, ...[samples[selectedSampleIdx]]]);
    const nextSampleIdx = Math.min(
      0,
      Math.round(Math.random() * (samples.length - 2))
    );
    setSelectedSampleIdx(nextSampleIdx);
    setMappings([...mappings, ...[currentMapping]]);
    selectBoxRef.current.init();
  };

  const onRestartWorkflow = e => {
    setCompletedCount(0);
    setSamples(seenSamples);
    setSeenSamples([]);
  };

  const updateMappings = () => {};

  const finishedLayout = (
    <main>
      <span className="emoji">&#127881;</span>
      <h1>Congratulations</h1>
      <button onClick={onRestartWorkflow}>Another round</button>
    </main>
  );

  const samplePoolDebug = (
    <div className="samples">
      <div className="pool">
        <h4>Sample Pool</h4>
        <ol>
          {samples.map((s, i) => (
            <li key={i}>
              {i}: {s}
            </li>
          ))}
        </ol>
      </div>
      <div className="seen">
        <h4>Already Played:</h4>
        <ol>
          {seenSamples.map((s, i) => (
            <li key={i}>
              {i}: {s}
            </li>
          ))}
        </ol>
      </div>
      <b>Selected Index: {selectedSampleIdx}</b>
    </div>
  );

  const workflowLayout = (
    <main>
      <AudioPlayer
        ref={audioPlayerRef}
        fadeDuration={fadeDuration}
        audiosrc={`/audio/samples/${samples[selectedSampleIdx]}`}
        onStopped={moveToNextScenario}
      />
      <SelectBox
        ref={selectBoxRef}
        options={["feeling", "color", "shape"]}
        onIndexChange={(i, name) => {
          i === 1 ? setIsColorReactive(true) : setIsColorReactive(false);
          setCurrentMapping(Object.assign({}, currentMapping, { type: name }));
        }}
      >
        <FeelingsInput />
        <ColorInput
          onChange={(s, r, g, b) => {
            setBackgroundColor(s);
          }}
          onClick={(r, g, b) => {
            setCurrentMapping(
              Object.assign({}, currentMapping, { mapping: [r, g, b] })
            );
          }}
        />
        <ShapeInput />
      </SelectBox>
      <button
        className="next-sample"
        onClick={() => audioPlayerRef.current.stopAudio()}
      >
        Next
      </button>
    </main>
  );

  return (
    <div
      className="harvester"
      style={{
        backgroundColor: isColorReactive ? backgroundColor : `currentColor`
      }}
    >
      <div className="titlebar">
        <h2>harvester 2.0</h2>
        {/* {samplePoolDebug} */}
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
      <div className="mappings">
        {mappings.map((m, i) => {
          return (
            <small className="mapping" key={i}>
              <span>
                <b>sample: </b>
                {m.audiosample}
              </span>
              <span>
                <b>type: </b>
                {m.type}
              </span>
              <span>
                <b>mapping: </b>
                {JSON.stringify(m.mapping)}
              </span>
            </small>
          );
        })}
      </div>
    </div>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<Harvester />, mount);

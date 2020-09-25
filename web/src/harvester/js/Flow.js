import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Layout from "./Layout.js";
import AudioPlayer from "./AudioPlayer.js";
import SelectBox from "./SelectBox.js";
import ColorInput from "./ColorInput.js";
import FeelingsInput from "./FeelingsInput.js";
import ShapeInput from "./ShapeInput.js";

const RealFlow = ({ onFinish }) => {
  const history = useHistory();
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
    mapping: undefined
  });
  const [mappings, setMappings] = useState([]);

  const moveToNextScenario = e => {
    if (scenarioCount === completedCount) {
      const downloadLink = document.createElement("a");
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(mappings));
      downloadLink.href = dataStr;
      downloadLink.download = "result.json";
      document.body.append(downloadLink);
      downloadLink.click();
      onFinish(JSON.stringify(mappings), history);
      return;
    }
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

    setCurrentMapping(
      Object.assign({}, currentMapping, {
        audiosample: samples[nextSampleIdx]
      })
    );
    setMappings([...mappings, ...[currentMapping]]);
    selectBoxRef.current.init();
  };

  const onRestartWorkflow = e => {
    setCompletedCount(0);
    setSamples(seenSamples);
    setSeenSamples([]);
  };

  const updateMappings = () => {};

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
        <FeelingsInput
          onSelect={(feeling, point) => {
            setCurrentMapping(
              Object.assign({}, currentMapping, {
                mapping: { feeling: feeling, point: point }
              })
            );
          }}
        />
        <ColorInput
          onChange={(s, r, g, b) => {
            setBackgroundColor(s);
          }}
          onSelect={(r, g, b) => {
            setCurrentMapping(
              Object.assign({}, currentMapping, { mapping: [r, g, b] })
            );
          }}
        />
        <ShapeInput
          onSelect={shape => {
            setCurrentMapping(
              Object.assign({}, currentMapping, { mapping: shape })
            );
          }}
        />
      </SelectBox>
      <button
        className="next-sample"
        onClick={() => audioPlayerRef.current.stopAudio()}
      >
        Next
      </button>
    </main>
  );

  const mappingDebug = (
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
  );

  return (
    <Layout
      className="harvester"
      style={{
        backgroundColor: isColorReactive ? backgroundColor : `currentColor`
      }}
    >
      {workflowLayout}
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
      {mappingDebug}
    </Layout>
  );
};

export default RealFlow;

import React, { useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import Layout from "./Layout.js";
import AudioPlayer from "./AudioPlayer.js";
import SelectBox from "./SelectBox.js";
import ColorInput from "./ColorInput.js";
import FeelingsInput from "./FeelingsInput.js";
import ShapeInput from "./ShapeInput.js";

const Flow = ({ onFinish }) => {
  const history = useHistory();
  const fadeDuration = 1000;
  const audioPlayerRef = useRef();
  const selectBoxRef = useRef();
  const [backgroundColor, setBackgroundColor] = useState("var(--color-snow)");
  const [isColorReactive, setIsColorReactive] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [groups] = useState([
    "synthesizer",
    "guitar",
    "chords",
    "bass",
    "rhythm"
  ]);
  const [scenarioCount] = useState(groups.length);
  const [unmappedGroups, setUnmappedGroups] = useState(
    Array.from(groups.values())
  );

  const [groupSamples] = useState(new Map());
  groupSamples.set("synthesizer", ["montez-sample-01-lead-synth.wav.mp3"]);

  groupSamples.set("guitar", [
    "montez-sample-02-main-git.wav.mp3",
    "montez-sample-17-arp-git.wav.mp3"
  ]);

  groupSamples.set("chords", [
    "montez-sample-03-pad-01.wav.mp3",
    "montez-sample-04-pad-02.wav.mp3",
    "montez-sample-05-pad-03.wav.mp3",
    "montez-sample-16-keys-02.wav.mp3",
    "montez-sample-14-keys-01.wav.mp3"
  ]);

  groupSamples.set("bass", [
    "montez-sample-06-synth-bass-02.wav.mp3",
    "montez-sample-07-synth-bass-01.wav.mp3",
    "montez-sample-18-e-bass-01.wav.mp3"
  ]);

  groupSamples.set("rhythm", [
    "montez-sample-08-e-perc-01.wav.mp3",
    "montez-sample-09-e-perc-02.wav.mp3",
    "montez-sample-10-e-drums-01.wav.mp3",
    "montez-sample-11-shaker.wav.mp3",
    "montez-sample-12-toms.wav.mp3",
    "montez-sample-13-hh.wav.mp3"
  ]);

  const [seenSamples, setSeenSamples] = useState([]);
  const [currentMapping, setCurrentMapping] = useState({
    sample: "fallback.mp3",
    group: undefined,
    type: undefined,
    mapping: undefined
  });
  const [mappings, setMappings] = useState([]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const prepareNextScenario = () => {
    const randomGroupIdx =
      unmappedGroups.length > 1
        ? getRandomInt(0, unmappedGroups.length - 1)
        : 0;
    const selectedGroup = unmappedGroups[randomGroupIdx];
    const availableSamples = groupSamples.get(selectedGroup);
    const randomSampleIdx = getRandomInt(0, availableSamples.length - 1);
    const selectedSample = availableSamples[randomSampleIdx];
    setCurrentMapping(
      Object.assign({}, currentMapping, {
        sample: selectedSample,
        group: selectedGroup,
        type: undefined,
        mapping: undefined
      })
    );
    setUnmappedGroups(unmappedGroups.filter(e => e !== selectedGroup));
  };

  const moveToNextScenario = e => {
    setCompletedCount(completedCount + 1);
    selectBoxRef.current.init();
    setMappings([...mappings, ...[currentMapping]]);
    if (completedCount < scenarioCount - 1) {
      prepareNextScenario();
    }
  };

  const onRestartWorkflow = e => {
    setUnmappedGroups(Array.from(groups.values()));
    setCompletedCount(0);
    prepareNextScenario();
  };

  useEffect(() => {
    prepareNextScenario();
  }, []);

  const workflowLayout = (
    <main>
      <AudioPlayer
        ref={audioPlayerRef}
        fadeDuration={fadeDuration}
        audiosrc={`/audio/harvester/${currentMapping.sample}`}
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
      {currentMapping.type !== undefined &&
      currentMapping.mapping !== undefined ? (
        <button
          className="next-sample"
          onClick={() => {
            if (completedCount === scenarioCount) {
              onFinish(JSON.stringify(mappings), history);
              return;
            }
            audioPlayerRef.current.stopAudio();
          }}
        >
          {completedCount === scenarioCount ? "Finish" : "Next"}
        </button>
      ) : (
        <></>
      )}
    </main>
  );

  const mappingDebug = (
    <div className="mappings">
      <span>{completedCount}</span>
      <hr />
      <h5>Scenario count: {scenarioCount}</h5>
      <span>
        {currentMapping.sample} ({currentMapping.group})
      </span>
      <hr />
      <ol>
        {unmappedGroups.map((umg, i) => {
          return <li key={i}>{umg}</li>;
        })}
      </ol>
      <hr />
      {mappings.map((m, i) => {
        return (
          <small className="mapping" key={i}>
            <span>
              <b>sample: </b>
              {m.sample} ({m.group})
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
      {/* {mappingDebug} */}
    </Layout>
  );
};

export default Flow;

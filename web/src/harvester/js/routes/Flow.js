// node_modules imports
import React, { useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// Local imports
import Layout from "../Layout.js";
import AudioPlayer from "../components/AudioPlayer.js";
import SelectBox from "../components/SelectBox.js";
import ColorInput from "../components/ColorInput.js";
import FeelingsInput from "../components/FeelingsInput.js";
import ShapeInput from "../components/ShapeInput.js";
import Progressbar from "../components/Progressbar.js";
// SVG imports
import IconColor from "../../../../assets/svg/audiovisio/color.svg";
import IconFeeling from "../../../../assets/svg/audiovisio/feeling.svg";
import IconShape from "../../../../assets/svg/audiovisio/shape.svg";
// Style imports
import "../../sass/Flow.sass";

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
  groupSamples.set("synthesizer", ["montez-sample-01-lead-synth.mp3"]);

  groupSamples.set("guitar", [
    "montez-sample-02-main-git.mp3",
    "montez-sample-17-arp-git.mp3"
  ]);

  groupSamples.set("chords", [
    "montez-sample-03-pad-01.mp3",
    "montez-sample-04-pad-02.mp3",
    "montez-sample-05-pad-03.mp3",
    "montez-sample-16-keys-02.mp3",
    "montez-sample-14-keys-01.mp3"
  ]);

  groupSamples.set("bass", [
    "montez-sample-06-synth-bass-02.mp3",
    "montez-sample-07-synth-bass-01.mp3",
    "montez-sample-18-e-bass-01.mp3"
  ]);

  groupSamples.set("rhythm", [
    "montez-sample-08-e-perc-01.mp3",
    "montez-sample-09-e-perc-02.mp3",
    "montez-sample-10-e-drums-01.mp3",
    "montez-sample-11-shaker.mp3",
    "montez-sample-12-toms.mp3",
    "montez-sample-13-hh.mp3"
  ]);

  const [seenSamples, setSeenSamples] = useState([]);
  const [currentMapping, setCurrentMapping] = useState({
    sample: undefined,
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
    setBackgroundColor("var(--color-snow)");
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
    setMappings([...mappings, ...[currentMapping]]);
  };

  const onRestartWorkflow = e => {
    setUnmappedGroups(Array.from(groups.values()));
    setCompletedCount(0);
    prepareNextScenario();
  };

  useEffect(() => {
    prepareNextScenario();
  }, []);

  useEffect(() => {
    if (completedCount === scenarioCount) {
      onFinish(JSON.stringify(mappings), history);
    } else {
      selectBoxRef.current.init();
      if (completedCount < scenarioCount - 1) {
        prepareNextScenario();
      }
    }
  }, [completedCount]);

  const workflowLayout = (
    <main className="flow">
      <div className="left">
        <div className="description">
          <h3>1. Audio</h3>
          <article>Spiel das Audiosample ab</article>
        </div>
        {currentMapping.sample !== undefined ? (
          <AudioPlayer
            ref={audioPlayerRef}
            fadeDuration={fadeDuration}
            audiosrc={`/audio/harvester/${currentMapping.sample}`}
            onStopped={moveToNextScenario}
          />
        ) : (
          <></>
        )}
        <div className="empty"></div>
      </div>
      <div className="right">
        <SelectBox
          ref={selectBoxRef}
          options={["Gefühl", "Farbe", "Form"]}
          icons={[<IconFeeling />, <IconColor />, <IconShape />]}
          onIndexChange={(i, name) => {
            i === 1 ? setIsColorReactive(true) : setIsColorReactive(false);
            setCurrentMapping(
              Object.assign({}, currentMapping, { type: name })
            );
          }}
        >
          <FeelingsInput
            onSelect={(feeling, point) => {
              setBackgroundColor("var(--color-snow)");
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
              setBackgroundColor("var(--color-snow)");
              setCurrentMapping(
                Object.assign({}, currentMapping, { mapping: shape })
              );
            }}
          />
        </SelectBox>
      </div>

      {currentMapping.type !== undefined &&
      currentMapping.mapping !== undefined ? (
        <div className="button-wrapper">
          <div className="description">
            <h4>3. Fortschritt</h4>
            <article>Zum nächsten Schritt</article>
          </div>
          <button
            className="next-sample"
            onClick={() => {
              if (completedCount === scenarioCount) {
                audioPlayerRef.current.stopAudio();
                onFinish(JSON.stringify(mappings), history);
                return;
              }
              audioPlayerRef.current.stopAudio();
            }}
          >
            {completedCount === scenarioCount ? "Finish" : "Weiter"}
          </button>
        </div>
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
      className="audiovis-io"
      style={{
        backgroundColor: isColorReactive ? backgroundColor : `currentColor`
      }}
    >
      {completedCount !== scenarioCount ? workflowLayout : <></>}

      <Progressbar
        percent={(completedCount / scenarioCount) * 100}
        completedCount={completedCount}
        scenarioCount={scenarioCount}
      />

      {/* {mappingDebug} */}
    </Layout>
  );
};

export default Flow;

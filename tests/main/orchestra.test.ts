import { expect } from "chai";
import "mocha";
import {
  getOnsetFrequencyIndex,
  isBorn,
  NoteState,
  getNewNoteState,
  ISongtime,
  InstrumentNoteState,
  getHitNotes
} from "../../src/orchestra";
import { Onset } from "../../src/types/types";
import { Circumstances } from "../../src/noteViz/interfaces";
import { getAllEnumOptionsExceptFor } from "../../src/util/funUtil";

describe("OrchestraTesting", () => {
  it("onsetfrequencyIndex of highest note is numnotes - 1", () => {
    let onset = new Onset();
    onset.energy = 2;
    onset.frequency = 11;
    let numnotes = 4;
    const Freq = getOnsetFrequencyIndex(onset, numnotes);
    expect(Freq).to.equal(numnotes - 1);
  });

  it("onsetfrequencyIndex of highest note is numnotes - 1 example 2", () => {
    let onset = new Onset();
    onset.energy = 2;
    onset.frequency = 11;
    let numnotes = 20;
    const Freq = getOnsetFrequencyIndex(onset, numnotes);
    expect(Freq).to.equal(numnotes - 1);
  });

  let onset = new Onset();
  onset.time = 2.2; //

  it("upcoming notes in playerview get born", () => {
    let currentTime = 1;
    expect(isBorn(onset, NoteState.UNBORN, currentTime, 2)).to.equal(true);
  });

  it("upcoming notes outside playerview dont get born", () => {
    let currentTime = 0;
    expect(isBorn(onset, NoteState.UNBORN, currentTime, 2)).to.equal(false);
  });

  it("only births new notes if the onset state is unborn", () => {
    let currentTime = 1;
    expect(isBorn(onset, NoteState.ALIVE, currentTime, 2)).to.equal(false);
    expect(isBorn(onset, NoteState.HIT, currentTime, 2)).to.equal(false);
    expect(isBorn(onset, NoteState.MISS, currentTime, 2)).to.equal(false);
    expect(isBorn(onset, NoteState.DEAD, currentTime, 2)).to.equal(false);
  });

  let circumstances = new Circumstances();
  circumstances.currentTime = 10;
  let msg: ISongtime = { kind: "timeUpdate", circumstances: circumstances };

  it("kill notes beyond the viewable window", () => {
    let onset = new Onset();
    onset.time = 3.5; //
    expect(getNewNoteState(onset, NoteState.ALIVE, msg)).to.equal(
      NoteState.DEAD
    );
    expect(getNewNoteState(onset, NoteState.HIT, msg)).to.equal(NoteState.DEAD);
    expect(getNewNoteState(onset, NoteState.MISS, msg)).to.equal(
      NoteState.DEAD
    );
    expect(getNewNoteState(onset, NoteState.UNBORN, msg)).to.equal(
      NoteState.DEAD
    );
  });

  it("detects hit notes if they are alive, they are in the hittable window and the instrumentNote has been played", () => {
    let onset1 = new Onset();
    onset1.time = 3.5; //
    onset1.frequency = 10;
    let numnotes = 4;
    let instrumentFrequency = getOnsetFrequencyIndex(onset1, numnotes);
    let ins = new Array(numnotes).fill(0).map(x => new InstrumentNoteState());
    ins[instrumentFrequency].isActive = true;
    let hits = getHitNotes([onset1], [NoteState.ALIVE], ins, 3.5, numnotes);
    expect(hits.length).to.equal(1);
  });

  it("does not detects hit notes if they are not alive, they are in the hittable window and the instrumentNote has been played", () => {
    let notestates = getAllEnumOptionsExceptFor(NoteState, NoteState.ALIVE);

    let onsets = notestates.map(x => {
      let onset = new Onset();
      onset.frequency = 10;
      onset.time = 3.5;
      return onset;
    });
    let numnotes = 4;
    let instrumentFrequency = getOnsetFrequencyIndex(onsets[0], numnotes);
    let ins = notestates.map(x => new InstrumentNoteState());
    ins[instrumentFrequency].isActive = true;

    let hits = getHitNotes(onsets, notestates, ins, 3.5, numnotes);
    expect(hits.length).to.equal(0);
  });

  it("does not detects hit notes if they are alive, they are not the hittable window and the instrumentNote has been played", () => {
    let notestates = [NoteState.ALIVE];

    let onsets = notestates.map(x => {
      let onset = new Onset();
      onset.frequency = 10;
      onset.time = 1.5;
      return onset;
    });
    let numnotes = 4;
    let instrumentFrequency = getOnsetFrequencyIndex(onsets[0], numnotes);
    let ins = new Array(4).fill(0).map(x => new InstrumentNoteState());
    ins[instrumentFrequency].isActive = true;

    let hits = getHitNotes(onsets, notestates, ins, 3.5, numnotes);
    expect(hits.length).to.equal(0);
  });
});

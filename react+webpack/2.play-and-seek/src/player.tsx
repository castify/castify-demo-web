import React, { Component, FormEvent } from 'react';
import { Player, PlayerState, Source } from '@castify-inc/castify-player';

type State = {
  target?: {
    broadcastId: string,
    duration?: number
  },
  state: PlayerState,
  timer: number,
  seeked: boolean,
  paused: boolean,
  muted: boolean,
};

type Props = {
  broadcastId?: string
};

let spinnerStyle = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  margin: "auto"
};

let unmuteSytle = { top: "4px", left: "4px" };

const useWebWorkers = true;
if (useWebWorkers) {
  Player.createWorker = () => new Worker(new URL("@castify-inc/castify-player/worker.js", import.meta.url));
}

export class CastifyPlayer extends Component<Props, State> {

  state: State = {
    state: "initial", 
    timer: 0,
    seeked: false,
    paused: false,
    muted: true
  };

  private video = React.createRef<HTMLVideoElement>();
  private player?: Player;

  static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
    let broadcastId = nextProps.broadcastId;
    if (broadcastId === prevState.target?.broadcastId) {
      return null;
    }
    return { 
      ...prevState, 
      target: broadcastId ? { broadcastId }: undefined
    };
  }

  componentWillUnmount() {
    this.player?.reset();
  }

  componentDidMount() {
    let video = this.video.current;
    if (video === null) {
      return;
    }
    let player = new Player(video, { useWebWorkers });
    player.addEventListener("timer", this.onTimer);
    player.addEventListener("state", () => this.setState({ state: player.state }));
    player.addEventListener("ended", e => console.error(e.detail.cause));

    this.player = player;
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  render() {
    return <div>
      <div style={{ display: "inline-block" }}>
        <div className="position-relative">
          <video muted={this.state.muted} ref={this.video} width="640" height="360" style={{background: "black"}} autoPlay={false} controls={false} playsInline={true}></video>
          <div id="spinner" style={spinnerStyle} hidden={this.state.state !== "loading"} className="position-absolute spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <button onClick={this.unmute} style={unmuteSytle} hidden={!this.state.muted} type="button" className="position-absolute btn btn-primary">ミュート解除</button>
        </div>
        <div className="row">
          <div className="col">
            <input type="range" min="0" max={this.state.target?.duration} onMouseUp={this.onSliderDragEnded} onChange={this.onSliderDragStart} className="form-control" disabled={!this.state.target?.duration} value={this.state.timer} />
          </div>
          <div className="col-2">
          {
            this.state.paused
              ? <button onClick={this.togglePaused} className="btn btn-block btn-success">Resume</button>
              : <button onClick={this.togglePaused} className="btn btn-block btn-warning">Pause</button>
          }
          </div>
        </div>
        <label>
          <code>{toDurationString(this.state.timer)} / {toDurationString(this.state.target?.duration ?? 0)}</code>
        </label>
      </div>
    </div>;
  }

  togglePaused = () => this.setState({ paused: !this.state.paused });

  unmute = () => this.setState({ muted: false });

  onSliderDragStart = (e: FormEvent<HTMLInputElement>) => {
    this.setState({ 
      seeked: true,
      timer: parseInt(e.currentTarget.value)
    });
  };

  onSliderDragEnded = (e: FormEvent<HTMLInputElement>) => {
    let duration = this.state.target?.duration;
    if (duration !== undefined) {
      let timer = parseInt(e.currentTarget.value);
      this.setState({ 
        seeked: false,
        timer
      });
      this.player?.seek(timer);
    }
  };

  onTimer = (e: CustomEvent) => {
    if (!this.state.seeked) this.setState({ timer: e.detail.time });
  }

  private update() {
    const player = this.player;
    if (player === undefined) {
      return;
    }
    player.paused = this.state.paused;
    const broadcastId = this.state.target?.broadcastId;
    if (broadcastId === player.source?.broadcastId) {
      return;
    }
    if (broadcastId === undefined) {
      player.source = undefined;
      return;
    }
    player.source = new Source(broadcastId);
    player.source.load().then(e => {
      if (this.state.target?.broadcastId === broadcastId) {
        if (e.stoppedAt === undefined) {
          player.seek("live");
        }
        else {
          let duration = (e.stoppedAt - e.startedAt) / 1000;
          this.setState({ 
            target: { broadcastId, duration } 
          });
          player.seek(0);
        }
      }
    });
  }
}

function toDurationString(src: number) {
  src = Math.max(0, src) | 0;
  let out = "";
  out = ":" + ("0" + src % 60).slice(-2) + out; src = src / 60 | 0;
  out = ":" + ("0" + src % 60).slice(-2) + out; src = src / 60 | 0;
  return ("0" + src).slice(-2) + out;
}

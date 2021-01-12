import React, { Component } from 'react';
import { Player, Source } from '@castify-inc/castify-player';

const useWebWorkers = true;
if (useWebWorkers) {
  Player.createWorker = () => new Worker(new URL("@castify-inc/castify-player/worker.js", import.meta.url));
}

export class CastifyPlayer extends Component<{ broadcastId: string }, {}> {

  private video = React.createRef<HTMLVideoElement>();
  private player?: Player;

  componentWillUnmount() {
    this.player?.reset();
  }

  componentDidMount() {
    if (!this.video.current) {
      return;
    }
    this.player = new Player(this.video.current, { useWebWorkers });
    this.setup();
  }

  componentDidUpdate() {
    this.setup();
  }

  render() {
    return <video ref={this.video} width="640" height="360" style={{background: "black"}} autoPlay={false} controls={false} playsInline={true} muted={true} />;
  }

  private setup() {
    const player = this.player;
    if (player === undefined) {
      return;
    }
    let broadcastId = this.props.broadcastId;
    if (broadcastId === player.source?.broadcastId) {
      return;
    }
    player.source = new Source(broadcastId);
    player.source.load().then(e => {
      if (e.stoppedAt === undefined) { // live
        player.seek("live");
      }
      else {
        player.seek(0);
      }
    });
  }
}

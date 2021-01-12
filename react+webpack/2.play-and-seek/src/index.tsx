import React from 'react';
import ReactDOM from 'react-dom';

import { CastifyPlayer } from './player';

let broadcastId = "bc_XXX";

ReactDOM.render(
  <CastifyPlayer broadcastId={broadcastId} />,
  document.getElementById('player'),
);

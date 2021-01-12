import React from 'react';
import ReactDOM from 'react-dom';

import { CastifyPlayer } from './player';

const broadcastId = "bc_XXX";

ReactDOM.render(
  <CastifyPlayer broadcastId={broadcastId} />,
  document.getElementById('player'),
);

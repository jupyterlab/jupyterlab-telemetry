// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-telemetry extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-telemetry',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('Telemetry extension activated');
  }
};

export default extension;
export * from './eventlog'

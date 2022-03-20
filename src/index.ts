// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

export * from './eventlog';
export * from './handler';

const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/jupyterlab-telemetry',
  autoStart: false,
  activate: async (app: JupyterFrontEnd) => {
    // Emplty plugin to satisfy build
  }
};

export default plugin;

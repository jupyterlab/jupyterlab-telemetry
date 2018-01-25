// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  uuid
} from '@jupyterlab/coreutils';

import {
  Telemetry, TelemetryHandler
} from './handler';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-telemetry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-telemetry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    const { commands } = app;
    const handler = new TelemetryHandler();
    const sessionLog = {
      id: uuid(),
      commands: [] as Telemetry.ICommandExecuted[]
    };

    commands.commandExecuted.connect((registry, command) => {
      const date = new Date();
      sessionLog.commands.push({
        id: command.id,
        args: command.args,
        date: date.toJSON(),
      });
      handler.save(sessionLog);
    });
  }
};

export default extension;

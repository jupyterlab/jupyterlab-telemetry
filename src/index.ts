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
    // Make a uuid for this session, which will be its
    // key in the session data.
    const id = uuid();
    // A log of executed commands.
    const commandLog: Telemetry.ICommandExecuted[] = [];

    // When a command is executed, store it in the log.
    commands.commandExecuted.connect((registry, command) => {
      const date = new Date();
      commandLog.push({
        id: command.id,
        args: command.args,
        date: date.toJSON(),
      });
    });

    const saveLog = () => {
      const outgoing = commandLog.splice(0);
      handler.save({ id, commands: outgoing }).catch(() => {
        // If the save fails, put the outgoing list back in the log.
        commandLog.unshift(...outgoing);
      });
    };
    // Save the log to the server every two minutes.
    setInterval(saveLog, 120 * 1000);
  }
};

export default extension;

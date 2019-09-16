// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { UUID } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';
import '../style/index.css';
import { Telemetry, TelemetryHandler } from './handler';

/**
 * Initialization data for the jupyterlab-telemetry extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-telemetry',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const { commands } = app;
    const handler = new TelemetryHandler();
    const id = UUID.uuid4()
    // A log of executed commands.
    const commandLog: Telemetry.ICommandExecuted[] = [];

    app.restored.then(() => {
      // Create the disclaimer dialog
      const title = 'JupyterLab UX Survey'
      const message = 'Are you willing to participate in a ' +
                      'JupyterLab user-experience survey? ' +
                      'If you agree, we will log:';
      const message2 = 'We will NOT track:';
      const dos = 'The menu items you use, the command palette commands you run, the keyboard shortcuts you invoke, the keyboard shortcuts you invoke, the filebrowser operations you use.'
      const donts = 'The contents of any notebooks or other files, the code you run, or the commands you give in terminals.'
      const body = `${message} ${dos} ${message2} ${donts}`

      showDialog({
        title,
        body,
        buttons: [
          Dialog.cancelButton({ label: 'NO WAY!' }),
          Dialog.okButton({ label: 'SURE!' }),
        ]
      }).then(result => {
        if (result.button.accept) {
          // Add a telemetry icon to the top bar.
          // We do it after the app has been restored to place it
          // at the right.
          const widget = new Widget();
          widget.addClass('jp-telemetry-icon');
          widget.id = 'telemetry:icon';
          widget.node.title = 'Telemetry data is being collected';
          app.shell.add(widget, 'top');

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
            if (commandLog.length === 0) {
              return;
            }
            const outgoing = commandLog.splice(0);
            handler.save({ id, commands: outgoing }).catch(() => {
              // If the save fails, put the outgoing list back in the log.
              commandLog.unshift(...outgoing);
            });
          };
          // Save the log to the server every two minutes.
          setInterval(saveLog, 120 * 1000);
        }
      });
    });
  }
};

export default extension;

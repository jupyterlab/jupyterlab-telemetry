// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  Dialog, showDialog
} from '@jupyterlab/apputils';

import {
  uuid
} from '@jupyterlab/coreutils';

import {
  h
} from '@phosphor/virtualdom';

import {
  Widget
} from '@phosphor/widgets';

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

    app.restored.then(() => {
      // Create the disclaimer dialog
      const headerLogo = h.div({className: 'jp-About-header-logo'});
      const title = h.span({className: 'jp-About-header'},
        headerLogo,
        'JupyterLab UX Survey');
      const message = 'Are you willing to participate in a ' +
                      'JupyterLab user-experience survey? ' +
                      'If you agree, we will log:';
      const message2 = 'We will NOT track:';
      const dos = h.ul({},
        h.li({}, 'The menu items you use'),
        h.li({}, 'The command palette commands you run'),
        h.li({}, 'The keyboard shortcuts you invoke'),
        h.li({}, 'The filebrowser operations you use'),
      );
      const donts = h.ul({},
        h.li({}, 'The contents of any notebooks or other files'),
        h.li({}, 'The code you run'),
        h.li({}, 'The commands you give in terminals'),
      );
      const disclaimer = h.div({}, message, dos, message2, donts);
      const body = h.div({ className: 'jp-About-body' },
        disclaimer
      );

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
          app.shell.addToTopArea(widget);

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

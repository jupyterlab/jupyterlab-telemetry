import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-telemetry extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-telemetry',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab-telemetry is activated!');
  }
};

export default extension;

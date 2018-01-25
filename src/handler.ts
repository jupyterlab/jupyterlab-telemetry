// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  URLExt
} from '@jupyterlab/coreutils';

import {
  ServerConnection
} from '@jupyterlab/services';

import {
  ReadonlyJSONObject
} from '@phosphor/coreutils';

/**
 * The handler for telemetry data.
 */
export
class TelemetryHandler {
  /**
   * Create a new telemetry handler.
   */
  constructor(options: TelemetryHandler.IOptions = { }) {
    this.serverSettings = options.serverSettings ||
      ServerConnection.makeSettings();
  }

  /**
   * The server settings used to make API requests.
   */
  readonly serverSettings: ServerConnection.ISettings;

  /**
   * Save telemetry data to the server.
   *
   * @param id - The telemetry's ID.
   *
   * @param telemetry - The telemetry being saved.
   *
   * @returns A promise that resolves when saving is complete or rejects with
   * a `ServerConnection.IError`.
   */
  save(telemetry: Telemetry.ISessionLog): Promise<void> {
    const { serverSettings } = this;
    const url = URLExt.join(serverSettings.baseUrl, 'telemetry');
    const init = {
      body: JSON.stringify(telemetry),
      method: 'PUT'
    };
    const promise = ServerConnection.makeRequest(url, init, serverSettings);

    return promise.then(response => {
      if (response.status !== 204) {
        throw new ServerConnection.ResponseError(response);
      }

      return undefined;
    });
  }
}


/**
 * A namespace for `TelemetryHandler` statics.
 */
export
namespace TelemetryHandler {
  /**
   * The instantiation options for a telemetry handler.
   */
  export
  interface IOptions {
    /**
     * The server settings used to make API requests.
     */
    serverSettings?: ServerConnection.ISettings;
  }
}


/**
 * A namespace for telemetry API interfaces.
 */
export
namespace Telemetry {
  /**
   * The interface describing a telemetry resource.
   */
  export
  interface ISessionLog {
    /**
     * A unique identifier for the current session.
     */
    id: string;

    /**
     * A log of executed commands.
     */
    commands: ICommandExecuted[];
  }

  /**
   * An interface describing an executed command.
   */
  export
  interface ICommandExecuted {
    /**
     * The id of the command.
     */
    readonly id: string;

    /**
     * The args of the command.
     */
    readonly args: ReadonlyJSONObject;

    /**
     * The timestamp of the command.
     */
    readonly date: string;
  }
}

// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { ReadonlyJSONObject } from '@lumino/coreutils';

/**
 * The handler for telemetry data.
 */
export class TelemetryHandler {
  constructor(options: TelemetryHandler.IOptions = {}) {
    this.serverSettings =
      options.serverSettings || ServerConnection.makeSettings();
  }

  /**
   * Save telemetry data to the server.
   *
   * @param id - The telemetry's ID.
   *
   * @param telemetry - The telemetry being saved.
   */
  async save(telemetry: Telemetry.ISessionLog): Promise<void> {
    const { serverSettings } = this;
    const requestUrl = URLExt.join(serverSettings.baseUrl, 'telemetry');
    const init = {
      body: JSON.stringify(telemetry),
      method: 'PUT'
    };

    let response: Response;
    try {
      response = await ServerConnection.makeRequest(
        requestUrl,
        init,
        serverSettings
      );
    } catch (error: any) {
      throw new ServerConnection.NetworkError(error);
    }

    if (response.status !== 204) {
      throw new ServerConnection.ResponseError(response);
    }

    return undefined;
  }

  /**
   * The server settings used to make API requests.
   */
  readonly serverSettings: ServerConnection.ISettings;
}

/**
 * A namespace for `TelemetryHandler` statics.
 */
export namespace TelemetryHandler {
  /**
   * The instantiation options for a telemetry handler.
   */
  export interface IOptions {
    /**
     * The server settings used to make API requests.
     */
    serverSettings?: ServerConnection.ISettings;
  }
}

/**
 * A namespace for telemetry API interfaces.
 */
export namespace Telemetry {
  /**
   * The interface describing a telemetry resource.
   */
  export interface ISessionLog {
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
  export interface ICommandExecuted {
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

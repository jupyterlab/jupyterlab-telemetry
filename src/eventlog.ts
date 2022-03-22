// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CommandRegistry } from '@lumino/commands';
import { IDisposable } from '@lumino/disposable';
import { Signal, Slot } from '@lumino/signaling';

/**
 * A configurable Event Log for publishing and receiving JupyterLab events.
 */
export class EventLog implements IDisposable {
  private readonly handlers: Slot<EventLog, EventLog.IRecordedEvent[]>[];
  private readonly allowedSchemas: string[];

  private readonly _eventSignal: Signal<EventLog, EventLog.IRecordedEvent[]>;
  private readonly _commandLog: EventLog.IRecordedEvent[];
  private _isDisposed: boolean;
  private _saveInterval: number | undefined;

  constructor(options: EventLog.IOptions) {
    this._isDisposed = false;
    this.handlers = options.handlers;
    this.allowedSchemas = options.allowedSchemas;
    this._eventSignal = new Signal(this);
    this._commandLog = [];

    for (const handler of this.handlers) {
      this._eventSignal.connect(handler);
    }

    if (options.commandRegistry) {
      this.enableCommandEvents(options);
    } else {
      console.log(
        'No commandRegistry provided. Not publishing JupyterLab command events.'
      );
    }
  }

  /**
   * Get whether the Event Log is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose of the resources used by the EventLog.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    if (this._saveInterval !== undefined) {
      clearInterval(this._saveInterval);
    }
    Signal.clearData(this);
    this._isDisposed = true;
  }

  /**
   * The interface for event publishers to record a single event.
   *
   * - Validate that the event schema is whitelisted
   * - Validate that the event schema is valid
   * - Emit the event to the configured handlers.
   * @param event the event to record
   */
  async recordEvent(event: EventLog.IEvent): Promise<void> {
    if (!this.isSchemaWhitelisted(event.schema)) {
      return;
    }

    if (!this.isSchemaValid(event)) {
      return;
    }

    this._eventSignal.emit([
      {
        ...event,
        publishTime: new Date()
      }
    ]);
  }

  /**
   * TODO: Implement schema validation.
   */
  private isSchemaValid(event: EventLog.IEvent): boolean {
    return true;
  }

  /**
   * TODO: Make this configurable via Settings Registry
   */
  private isSchemaWhitelisted(schemaName: string): boolean {
    return this.allowedSchemas.indexOf(schemaName) > -1;
  }

  /**
   * Subscribe the EventLog instance to all command executions in the JupyterLab application.
   *
   * Batches command events in-memory before emitting to each event handler.
   *
   * @param options the EventLog instantiation options.
   */
  private enableCommandEvents(options: EventLog.IOptions) {
    options.commandRegistry?.commandExecuted.connect((registry, command) => {
      const commandEventSchema = `org.jupyterlab.commands.${command.id}`;
      if (this.isSchemaWhitelisted(commandEventSchema)) {
        this._commandLog.push({
          schema: `org.jupyterlab.commands.${command.id}`,
          body: command.args,
          version: 1,
          publishTime: new Date()
        });
      }
    });
    const saveLog = () => {
      if (this._commandLog.length === 0) {
        return;
      }
      const outgoing = this._commandLog.splice(0);
      this._eventSignal.emit(outgoing);
    };
    this._saveInterval = setInterval(
      saveLog,
      options.commandEmitIntervalSeconds !== undefined
        ? options.commandEmitIntervalSeconds * 1000
        : 120 * 1000
    );
  }
}

/**
 * A namespace for `EventLog` data.
 */
export namespace EventLog {
  /**
   * The instantiation options for an EventLog
   */
  export interface IOptions {
    /**
     * The list of schema IDs to whitelist for the EventLog instance.
     */
    allowedSchemas: string[];

    /**
     * The list of event handlers to subscribe to the EventLog instance
     */
    handlers: Slot<EventLog, EventLog.IRecordedEvent[]>[];

    /**
     * The `CommandRegistry` instance from the JupyterLab application.
     * If provided, this causes the EventLog to subscribe to JupyterLab command executions and
     * emit events to the provided handlers.
     *
     * Individual commands still need to be whitelisted using the `org.jupyterlab.commands.$COMMAND_ID` schema ID.
     */
    commandRegistry?: CommandRegistry;

    /**
     * The interval, in seconds, for which JupyterLab command events are batched in-memory before being emitted
     * to the provided handlers.
     *
     * If not provided, the default interval is 120 seconds (2 minutes).
     */
    commandEmitIntervalSeconds?: number;
  }

  /**
   * The model to represent an event being received from a publisher.
   * The event body needs to conform to the given schema.
   */
  export interface IEvent {
    schema: string;
    version: number;
    body: any;
  }

  /**
   * The model to represent an event being sent to a handler. This includes additional
   * metadata that is added by the EventLog.
   */
  export interface IRecordedEvent {
    schema: string;
    version: number;
    body: any;
    publishTime: Date;
  }
}

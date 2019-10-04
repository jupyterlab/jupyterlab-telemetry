# jupyterlab-telemetry

[![Version](https://img.shields.io/npm/v/@jupyterlab/jupyterlab-telemetry.svg)](https://www.npmjs.com/package/@jupyterlab/jupyterlab-telemetry)

A JupyterLab extension for logging and telemetry of usage data

## Prerequisites

* JupyterLab 1.0+

## Installation

```bash
jupyter labextension install @jupyterlab/jupyterlab-telemetry
```

## Usage

Define handlers that can receive events from the `EventLog`

```typescript
import { EventLog } from "@jupyterlab/jupyterlab-telemetry";

function consoleHandler(el: EventLog, events: EventLog.RecordedEvent[]) {
  console.log(`[Handler1] Received events ${JSON.stringify(events)}`)
}

function consoleHandler2(el: EventLog, events: EventLog.RecordedEvent[]) {
  console.log(`[Handler2] Received events ${JSON.stringify(events)}`)
}
```

Create an instance of the EventLog and configure the handler and other options from `EventLog.IOptions`

```typescript

const el = new EventLog({
  handlers: [consoleHandler, consoleHandler2],
  allowedSchemas: ['org.jupyter.foo', 'org.jupyterlab.commands.docmanager:open'],
  commandRegistry: app.commands,
  commandEmitIntervalSeconds: 2
});
```

Send custom events via the `recordEvents` interface. If the `commandRegistry` instance was passed, then the `EventLog`  will subscribe to commands executed in the JuptyerLab application and send the whitelisted ones to each configured handler.

```typescript
el.recordEvent({
  schema: 'org.jupyter.foo',
  version: 1,
  body: {
    'foo': 'bar'
  }
});

```

Dispose the event log after use

```typescript
el.dispose();
```

## Development

For a development install, do the following in the repository directory:

```bash
yarn
yarn build
jupyter labextension install .
```

To rebuild the package and the JupyterLab app:

```bash
yarn build
jupyter lab build
```

To auto-build the package and JupyterLab on any change:

```bash

# In one terminal
yarn watch

# In second terminal

jupyter lab --watch

```

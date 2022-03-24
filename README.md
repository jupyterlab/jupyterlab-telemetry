# jupyterlab_telemetry

[![Github Actions Status](https://github.com/jupyterlab/jupyterlab-telemetry/workflows/Build/badge.svg)](https://github.com/jupyterlab/jupyterlab-telemetry/actions/workflows/build.yml)

A JupyterLab library for logging and telemetry of usage data

This extension is composed of a Python package named `jupyterlab_telemetry`
for the server extension and a NPM package named `@jupyterlab/jupyterlab-telemetry`
for the front end library.

## Requirements

- JupyterLab >= 3.0

## Install

To install the server extension, execute:

```bash
pip install jupyterlab_telemetry
```

To install the front end library, add `"@jupyterlab/jupyterlab-telemetry": "^1.0.0"` to dependencies in `package.json`.

## Uninstall

To remove the server extension, execute:

```bash
pip uninstall jupyterlab_telemetry
```

To remove the front end library, remove `"@jupyterlab/jupyterlab-telemetry": "^1.0.0"` from dependencies in `package.json`.

## Troubleshoot

If you have installed the frontend library, but it is not able to connect to telemetry endpoint, check
that the server extension is enabled:

```bash
jupyter server extension list
```

## Usage

Define handlers that can receive events from the `EventLog`

```typescript
import { EventLog } from '@jupyterlab/jupyterlab-telemetry';

function consoleHandler(el: EventLog, events: EventLog.RecordedEvent[]) {
  console.log(`[Handler1] Received events ${JSON.stringify(events)}`);
}

function consoleHandler2(el: EventLog, events: EventLog.RecordedEvent[]) {
  console.log(`[Handler2] Received events ${JSON.stringify(events)}`);
}
```

Create an instance of the EventLog and configure the handler and other options from `EventLog.IOptions`

```typescript
const el = new EventLog({
  handlers: [consoleHandler, consoleHandler2],
  allowedSchemas: [
    'org.jupyter.foo',
    'org.jupyterlab.commands.docmanager:open'
  ],
  commandRegistry: app.commands,
  commandEmitIntervalSeconds: 2
});
```

Send custom events via the `recordEvents` interface. If the `commandRegistry` instance was passed, then the `EventLog` will subscribe to commands executed in the JupyterLab application and send the whitelisted ones to each configured handler.

```typescript
el.recordEvent({
  schema: 'org.jupyter.foo',
  version: 1,
  body: {
    foo: 'bar'
  }
});
```

Dispose the event log after use

```typescript
el.dispose();
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
git clone https://github.com/jupyterlab/jupyterlab-telemetry.git

# Change directory to the jupyterlab-telemetry directory
cd jupyterlab-telemetry

# Install package in development mode
pip install -e .

# Server extension must be manually installed in develop mode
jupyter server extension enable jupyterlab_telemetry

# Build the Typescript source after making changes
jlpm build
```

### Testing

The server extension has python tests which can be updated and tested before pushing the new changes.

```bash
# Install the test dependencies
pip install .[test]

# Run the tests
pytest
```

The front end library is using `jest` for testing, and is setup to produce test coverage when the `test` target is run.

```bash
# To run the tests with coverage
jlpm test
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_telemetry
pip uninstall jupyterlab_telemetry
```

### Packaging the extension

See [RELEASE](RELEASE.md)

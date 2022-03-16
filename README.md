# jupyterlab_telemetry

[![Github Actions Status](https://github.com/jupyterlab/jupyterlab-telemetry/workflows/Build/badge.svg)](https://github.com/jupyterlab/jupyterlab-telemetry/actions/workflows/build.yml)

A JupyterLab library for logging and telemetry of usage data


This extension is composed of a Python package named `jupyterlab_telemetry`
for the server extension and a NPM package named `@jupyterlab/jupyterlab-telemetry`
for the frontend extension.


## Requirements

* JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyterlab_telemetry
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_telemetry
```


## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
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

Send custom events via the `recordEvents` interface. If the `commandRegistry` instance was passed, then the `EventLog`  will subscribe to commands executed in the JupyterLab application and send the whitelisted ones to each configured handler.

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

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_telemetry directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable jupyterlab_telemetry
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_telemetry
pip uninstall jupyterlab_telemetry
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-telemetry` within that folder.

### Packaging the extension

See [RELEASE](RELEASE.md)

import { ServerConnection } from '@jupyterlab/services';
import { TelemetryHandler } from '../handler';

const requestCollector = jest.fn();

function getRequestHandler(
  status: number,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  body: any
): ServerConnection.ISettings {
  const fetch = (info: RequestInfo, init?: RequestInit | undefined) => {
    // Normalize the body.
    body = JSON.stringify(body);

    requestCollector(info);

    // Create the response and return it as a promise.
    const response = new Response(body, { status });
    return Promise.resolve(response as any);
  };
  return ServerConnection.makeSettings({ fetch });
}

describe('TelemetryHandler', () => {
  afterEach(() => {
    requestCollector.mockClear();
  });

  describe('.save', () => {
    const dt = new Date().toDateString();
    const el = {
      id: 'org.jupyterlab',
      commands: [
        {
          id: 'command',
          args: {
            foo: 'bar'
          },
          date: dt
        }
      ]
    };

    it('should send the event data in a PUT request', async () => {
      const settings = getRequestHandler(204, null);
      const handler = new TelemetryHandler({
        serverSettings: settings
      });
      await handler.save(el);
      const request = requestCollector.mock.calls[0][0];
      const payload = await request.json();
      expect(requestCollector).toBeCalledTimes(1);
      expect(payload).toEqual(el);
    });

    it('should throw error when server does not return OK response', async () => {
      const settings = getRequestHandler(404, 'Does not exist');
      const handler = new TelemetryHandler({
        serverSettings: settings
      });
      await expect(handler.save(el)).rejects.toThrowError();
    });
  });
});

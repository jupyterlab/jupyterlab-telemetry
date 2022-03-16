import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class TelemetryHandler(APIHandler):
    """
    A handler that receives and stores telemetry data from the client.
    """
    @tornado.web.authenticated
    def put(self, *args, **kwargs):
        # Parse the data from the request body
        raw = self.request.body.strip().decode(u'utf-8')
        try:
            decoder = json.JSONDecoder()
            session_log = decoder.decode(raw)
        except Exception as e:
            raise web.HTTPError(400, str(e))

        self.log.info(session_log)
        self.set_status(204)
        self.finish()



def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "telemetry")
    handlers = [(route_pattern, TelemetryHandler)]
    web_app.add_handlers(host_pattern, handlers)

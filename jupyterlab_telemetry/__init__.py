""" JupyterLab LaTex : live Telemetry editing for JupyterLab """

import json

from tornado import gen, web

from notebook.utils import url_path_join
from notebook.base.handlers import APIHandler, json_errors

from ._version import __version__


class TelemetryHandler(APIHandler):
    """
    A handler that receives and stores telemetry data from the client.
    """
    @json_errors
    @gen.coroutine
    def get(self, rest):
        self.set_status(204)

    @json_errors
    @gen.coroutine
    def put(self, rest):
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



def _jupyter_server_extension_paths():
    return [{
        'module': 'jupyterlab_telemetry'
    }]

def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    # Prepend the base_url so that it works in a jupyterhub setting
    base_url = web_app.settings['base_url']
    endpoint = url_path_join(base_url, 'telemetry')
    web_app.log.error(endpoint)
    handlers = [(endpoint + "(.*)", TelemetryHandler)]
    web_app.add_handlers('.*$', handlers)

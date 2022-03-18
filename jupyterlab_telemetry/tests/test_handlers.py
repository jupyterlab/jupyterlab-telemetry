import json
import pytest

#@pytest.mark.skip("pytest run warns jupyter_telemetry could not be found")
async def test_put(jp_fetch):
    r = await jp_fetch(
                'telemetry',
                method='PUT', 
                body=json.dumps({
                    'foo': 'bar'
                })
            )
    assert r.code == 204
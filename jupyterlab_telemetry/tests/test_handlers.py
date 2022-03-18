import json
import pytest


async def test_handlers(jp_fetch):
    r = await jp_fetch(
                'telemetry',
                method='PUT', 
                body=json.dumps({
                    'foo': 'bar'
                })
            )
    assert r.code == 204

async def test_handlers_for_invalid_payload(jp_fetch):
    with pytest.raises(Exception):
        r = await jp_fetch(
                'telemetry',
                method='PUT', 
                body=''
            )
    
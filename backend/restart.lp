<?
require('apps')

local data = json.decode(getvar('data'))

-- Check that device actually responds, before we restart. Otherwise, we might say it's been restarted when it can't.
local ping = knxlib.ping(data.address)
-- Restart
knxlib.restart(data.address)
-- Respond with the ping. If it replies to a ping, it will respond to a restart command.
write(json.encode({result = ping}))

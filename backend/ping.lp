<?
require('apps')

local data = json.decode(getvar('data'))
local result = knxlib.ping(data.address)
write(json.encode({result = result}))

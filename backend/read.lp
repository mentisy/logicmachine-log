<?
require('apps')

local data = json.decode(getvar('data'))

-- Read the address, so we can get the updated value
grp.read(data.address)
os.sleep(.5) -- Wait a bit before getting the group address from the database.

local info = grp.find(data.address)
responded = false
if (info ~= nil) then
	local currentTime = os.microtime()
	local updatedTime = info.updatetime
	if ((currentTime - updatedTime) <= 2) then
		responded = true
	end
end

local result = {
	responded = responded,
	info = info,
}

write(json.encode(result))

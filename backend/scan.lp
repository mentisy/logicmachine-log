<?
require('apps')

-- Get data and prepare for scan
local data = json.decode(getvar('data'))
local devices = data.devices or {}
local scannedDevices = {}
local hasError = false

-- Scan and built result
for _, address in pairs(devices) do
    local ping = knxlib.ping(address)
    local scannedDevice = {
        address = address,
        status = ping,
    }
    table.insert(scannedDevices, scannedDevice)
    if (ping == false) then
        hasError = true
    end
end

-- Build result response
local result = {
    devices = scannedDevices,
    hasError = hasError,
}

-- Send response
write(json.encode(result))

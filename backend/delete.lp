<?

local IS_PROD = true -- Whether is production or not

-- Require library from proper path, and get variables from request, or fake them if not in production
if (IS_PROD) then
	require 'apps'
	require 'applibs.logs'
	local data = json.decode(getvar('data'))
    logIds = data.ids
    logType = data.type
else
    require 'user.logs'
    logIds = nil
    logType = "alerts"
end

-- Instantiate Logs class
local logs = Logs:new(IS_PROD)

-- Validate delete log ids - Must be set and not empty
if (logIds == nil or #logIds == 0) then
    return logs:validationError("No logs were selected for deletion")
end

-- Validate type - Must be either `alerts`, `errors`, `logs` or `objects`
if (not logs:isValidLogType(logType)) then
    local validOptions = table.concat(logs:getValidLogTypes(), ", ")

    return logs:validationError("Type is not valid. Must be one of these: " .. validOptions)
end

-- Execute deletion
result = logs:deleteLogTypeByIds(logType, logIds)

-- Write result
logs:result(result)

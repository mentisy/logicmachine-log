<?

local IS_PROD = true -- Whether is production or not

-- Require library from proper path, and get variables from request, or fake them if not in production
if (IS_PROD) then
	require 'apps'
	require 'applibs.logs'
	local data = json.decode(getvar('data'))
    searchTerm = data.search
    logType = data.type
else
    require 'user.logs'
    searchTerm = "vind"
    logType = "objectlog"
end

-- Instantiate Logs class
local logs = Logs:new(IS_PROD)

-- Validate searchTerm - Must be set (empty is allowed)
if (searchTerm == nil) then
    return logs:validationError("Search term is required")
end

-- Validate type - Must be either `alerts`, `errors`, `logs` or `objects`
if (not logs:isValidLogType(logType)) then
    local validOptions = table.concat(logs:getValidLogTypes(), ", ")

    return logs:validationError("Type is not valid. Must be one of these: " .. validOptions)
end

-- Execute search
result = logs:searchLogType(logType, searchTerm)

-- Write result
logs:result(result)

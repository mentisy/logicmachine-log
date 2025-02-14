Logs = {}

function Logs:new(isProduction)
  	local newObj = {
        isProduction = isProduction or false,
        validLogTypes = {
            OBJECTS_LOG_TABLE = "objectlog",
            ALERTS_TABLE = "alerts",
            ERRORS_TABLE = "errors",
            LOGS_TABLE = "logs",
        },
        OBJECTS_TABLE = "objects",
	}
  	self.__index = self
    if (isProduction) then
        require 'apps'
    else
        require 'json'
    end

  	return setmetatable(newObj, self)
end

function Logs:validationError(message)
    result = {
        hasError = true,
        message = message,
    }
    self:result(result)
end

function Logs:getValidLogTypes()
    local valid = {}
    for _, value in pairs(self.validLogTypes) do
        table.insert(valid, value)
    end

    return valid
end

function Logs:isValidLogType(type)
    local valid = self.validLogTypes
    for _, value in pairs(valid) do
        if (value == type) then
            return true
        end
    end

    return false
end

function Logs:searchLogType(logType, searchTerm)
    if (logType == self.validLogTypes.OBJECTS_LOG_TABLE) then
        return self:searchObjectLogs(searchTerm)
    elseif (logType == self.validLogTypes.ALERTS_TABLE) then
        return self:searchAlerts(searchTerm)
    elseif (logType == self.validLogTypes.ERRORS_TABLE) then
        return self:searchErrors(searchTerm)
    elseif (logType == self.validLogTypes.LOGS_TABLE) then
        return self:searchLogs(searchTerm)
    end
end

function Logs:searchObjectLogs(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local encodedGa = knxlib.encodega(searchTerm) -- Convert three-level group address into integer address
    local encodedIa = knxlib.encodeia(searchTerm) -- Convert three-level individual address into integer address
    local args = { searchLike }
    local query = "select objectlog.*, objects.name, objects.datatype, objects.units, objects.enums from objectlog left join objects on objectlog.address = objects.address"
    query = query .. "  where objects.name like ?"
    if (encodedGa) then
        query = query .. " or objectlog.address like ?"
        table.insert(args, encodedGa)
    end
    if (encodedIa) then
        query = query .. " or objectlog.src like ?"
        table.insert(args, encodedIa)
    end
    query = query .. " order by logtime DESC"

    return self:runSelectQuery(query, args)
end

function Logs:searchAlerts(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "select * from ? where scriptname like ? or alert like ?"
    query = query .. " order by alerttime DESC"
    local args = { self.validLogTypes.ALERTS_TABLE, searchLike, searchLike }

    return self:runSelectQuery(query, args)
end

function Logs:searchErrors(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "select * from ? where scriptname like ? or errortext like ?"
    query = query .. " order by errortime DESC"
    local args = { self.validLogTypes.ERRORS_TABLE, searchLike, searchLike }

    return self:runSelectQuery(query, args)
end

function Logs:searchLogs(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "select * from ? where scriptname like ? or log like ?"
    query = query .. " order by logtime DESC"
    local args = { self.validLogTypes.LOGS_TABLE, searchLike, searchLike }

    return self:runSelectQuery(query, args)
end

function Logs:deleteLogType(logType, searchTerm)
    if (logType == self.validLogTypes.OBJECTS_LOG_TABLE) then
        return self:deleteObjectLogs(searchTerm)
    elseif (logType == self.validLogTypes.ALERTS_TABLE) then
        return self:deleteAlerts(searchTerm)
    elseif (logType == self.validLogTypes.ERRORS_TABLE) then
        return self:deleteErrors(searchTerm)
    elseif (logType == self.validLogTypes.LOGS_TABLE) then
        return self:deleteLogs(searchTerm)
    end
end

function Logs:deleteLogTypeByIds(logType, ids)
    if (self:isValidLogType(logType)) then
        local idsParameterized = string.rep('?', #ids, ', ') -- repeat ? times number of ids
        local query = string.format("DELETE FROM ? WHERE id IN (%s)", idsParameterized)
        local args = ids -- First initialize args as ids, which will skip the ? representing the logType table
        table.insert(args, 1, logType) -- Prepend logType table to args

        return self:runDeleteQuery(query, args)
    end

    return nil
end

---
--- Delete object logs records, based on `searchTerm`. Checks object name, object source and object destination address.
--- Returns a table with the rows fetched and row count.
---
---@param searchTerm string Term to search for
---@return table<string, number|table>
function Logs:deleteObjectLogs(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local encodedGa = knxlib.encodega(searchTerm) -- Convert three-level group address into integer address
    local encodedIa = knxlib.encodeia(searchTerm) -- Convert three-level individual address into integer address
    local query = "delete from objectlog where objectlog.address in (%s)"
    local subQuery = "select objects.address from objects where objects.name like ?"
    local args = { searchLike }
    if (encodedGa) then
        subQuery = subQuery .. " or objectlog.address like ?"
        table.insert(args, encodedGa)
    end
    if (encodedIa) then
        subQuery = subQuery .. " or objectlog.src like ?"
        table.insert(args, encodedIa)
    end
    query = string.format(query, subQuery)

    return self:runDeleteQuery(query, args)
end

function Logs:deleteAlerts(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "delete from ? where scriptname like ? or alert like ?"
    local args = { self.validLogTypes.ALERTS_TABLE, searchLike, searchLike }

    return self:runDeleteQuery(query, args)
end

function Logs:deleteErrors(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "delete from ? where scriptname like ? or errortext like ?"
    local args = { self.validLogTypes.ERRORS_TABLE, searchLike, searchLike }

    return self:runDeleteQuery(query, args)
end

function Logs:deleteLogs(searchTerm)
	local searchLike = "%" .. searchTerm .. "%"
    local query = "delete from ? where scriptname like ? or log like ?"
    local args = { self.validLogTypes.LOGS_TABLE, searchLike, searchLike }

    return self:runDeleteQuery(query, args)
end

function Logs:runSelectQuery(query, args)
    local rows = db:getall(query, args)

    return {
        rows = rows,
        rowCount = #rows,
    }
end

function Logs:runDeleteQuery(query, args)
    local affectedRows = db:query(query, args)

    return {
        rowCount = affectedRows,
    }
end

function Logs:result(appendResult)
    local result = {
        hasError = false,
        message = "",
    }
    if (type(appendResult) == 'table') then
		for index, value in pairs(appendResult) do
	  		result[index] = value
		end
    end

    if (self.isProduction) then
        write(json.encode(result))
    else
        log(result)
    end
end

import Table from "./Table.tsx";
import {
    AlertLogType,
    ErrorLogType,
    LogTypesId,
    ObjectLogType,
    ObjectLogWithObjectType,
    ScriptLogType,
} from "../types/types.ts";
import { decodeGa, decodeIa, formatValue, timestampToDateTimeString } from "../utils/responseHelpers.ts";
import { convertDatatypeToString } from "../utils/datatypes.ts";

type LogsProps = {
    type: LogTypesId;
    logs: (AlertLogType | ErrorLogType | ScriptLogType | ObjectLogType)[];
    deleteHandler: (ids: number[], logType: LogTypesId) => Promise<boolean>;
};

export default function LogsTable({ type, logs, deleteHandler }: LogsProps) {
    let headers = ["Log time", "Script name", "Message"];
    let rows: { id: number; values: (string | number)[] }[] = [];

    if (type === LogTypesId.Alerts) {
        rows = logs.map((log) => {
            const alertLog = log as AlertLogType;
            return {
                id: alertLog.id,
                values: [timestampToDateTimeString(alertLog.alerttime), alertLog.scriptname, alertLog.alert],
            };
        });
    } else if (type === LogTypesId.Errors) {
        rows = logs.map((log) => {
            const errorLog = log as ErrorLogType;
            return {
                id: errorLog.id,
                values: [timestampToDateTimeString(errorLog.errortime), errorLog.scriptname, errorLog.errortext],
            };
        });
    } else if (type === LogTypesId.Logs) {
        rows = logs.map((log) => {
            const logLog = log as ScriptLogType;
            return {
                id: logLog.id,
                values: [timestampToDateTimeString(logLog.logtime), logLog.scriptname, logLog.log],
            };
        });
    } else if (type === LogTypesId.Objects) {
        headers = ["Log time", "Source", "Address", "Object", "Datatype", "Value"];
        rows = logs.map((log) => {
            const logLog = log as ObjectLogWithObjectType;
            return {
                id: logLog.id,
                values: [
                    timestampToDateTimeString(logLog.logtime),
                    logLog.src === 0 ? logLog.sender : decodeIa(logLog.src),
                    decodeGa(logLog.address),
                    logLog.name,
                    convertDatatypeToString(logLog.datatype),
                    formatValue(logLog),
                ],
            };
        });
    }

    return (
        <Table
            headers={headers}
            rows={rows}
            deleteHandler={(ids: number[]) => {
                return deleteHandler(ids, type);
            }}
        />
    );
}

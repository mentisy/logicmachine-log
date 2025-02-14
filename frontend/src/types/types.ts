export enum JOBS_STATUS {
    IDLING = 0,
    PENDING = 1,
    SUCCESS = 2,
    UNSUCCESS = 3,
}

export enum LogTypesId {
    Objects = "objectlog",
    Alerts = "alerts",
    Logs = "logs",
    Errors = "errors",
}

export enum LogTypesName {
    Objects = "Object Logs",
    Alerts = "Alerts",
    Logs = "Logs",
    Errors = "Error Logs",
}

export const LogTypesMap = {
    Objects: {
        id: LogTypesId.Objects,
        name: LogTypesName.Objects,
    },
    Alerts: {
        id: LogTypesId.Alerts,
        name: LogTypesName.Alerts,
    },
    Logs: {
        id: LogTypesId.Logs,
        name: LogTypesName.Logs,
    },
    Errors: {
        id: LogTypesId.Errors,
        name: LogTypesName.Errors,
    },
};

export type AlertLogType = {
    id: number;
    scriptname: string;
    alert: string;
    alerttime: number;
};

export type ErrorLogType = {
    id: number;
    scriptname: string;
    errortext: string;
    errortime: number;
};

export type ScriptLogType = {
    id: number;
    scriptname: string; // Script that logged message
    log: string; // Logged message contents
    logtime: number; // Time message was logged
};

export type ObjectLogType = {
    id: number;
    src: number; // Individual address as a one-level counterpart (needs to be converted if three-level is required)
    address: number; // As the one-level address (needs to be converted if three-level is required)
    dataraw: string; // Often not added, whene datahex can is the same as dataraw would be
    datahex: string; // Value in hexadecimal
    logtime: number; // float, with seconds as the whole/integer part, and the microseconds as the fractional part
    eventtype: "write" | "read"; // Was it a read request or a write request.
    sender: "bus" | "se" | "ss" | "sr"; // Source of telegram: se = event script, ss = scheduled script, sr = resident script
    meta: string;
};

export type ObjectLogWithObjectType = ObjectLogType & ObjectType;

export type ObjectType = {
    name: string; // Name of object stored in LM
    datatype: number; // Datatype as a whole number as represented in ETS, multiplied by 1000. 1.001 = 1001, 1.002 = 1002
    units: string | null; // Unit/suffix of object
    enums: string | null; // Enum values
    // There are more columns sent from API, but this type only has the columns required for this app to work
};

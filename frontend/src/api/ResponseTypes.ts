import { AlertLogType, ErrorLogType, ObjectLogType, ScriptLogType } from "../types/types.ts";

export type IndexResponseType = {
    hasError: boolean;
    message: string;
    rows?: (AlertLogType | ErrorLogType | ScriptLogType | ObjectLogType)[];
    rowCount?: number;
};

export type DeleteResponseType = {
    hasError: boolean;
    message: string;
    rowCount?: number;
};

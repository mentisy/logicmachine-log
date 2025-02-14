import { ObjectLogWithObjectType } from "../types/types.ts";
import { convertDatatypeValue } from "./datatypes.ts";

export const timestampToDateTimeString = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" });
};

export const decodeIa = (individualAddress: number) => {
    const area = (individualAddress >> 12) & 0x0f;
    const line = (individualAddress >> 8) & 0x0f;
    const device = individualAddress & 0xff;

    return `${area}.${line}.${device}`;
};

export const decodeGa = (groupAddress: number) => {
    const main = (groupAddress >> 11) & 0x1f;
    const middle = (groupAddress >> 8) & 0x07;
    const sub = groupAddress & 0xff;

    return `${main}/${middle}/${sub}`;
};

export const formatValue = (logLog: ObjectLogWithObjectType) => {
    const convertedValue = convertDatatypeValue(logLog.datatype, logLog.datahex);
    const unit = logLog.units ?? "";
    if (logLog?.enums) {
        const enumOptions = JSON.parse(logLog.enums);
        const formatValue = enumOptions[convertedValue] ?? enumOptions["default"] ?? null;
        if (formatValue) {
            return formatValue + unit;
        }
    }

    return convertedValue + unit;
};

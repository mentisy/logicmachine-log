import { DeleteResponseType, IndexResponseType } from "./ResponseTypes";
import { LogTypesId } from "../types/types.ts";

export async function searchLogs(search: string, type: LogTypesId | null) {
    return fetching<IndexResponseType>("search", { search, type });
}

export async function deleteManyLogs(ids: number[], type: LogTypesId) {
    return fetching<DeleteResponseType>("delete", { ids, type });
}

async function fetching<T>(url: string, data: object) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiSuffix = import.meta.env.VITE_API_SUFFIX;

    return (await fetch(apiUrl + url + apiSuffix, {
        method: "post",
        body: "data=" + JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    }).then((res) => res.json())) as T;
}

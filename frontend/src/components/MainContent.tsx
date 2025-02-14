import Button from "../components/Button.tsx";
import Input from "../components/Input.tsx";
import { ChangeEvent, FormEvent, useState } from "react";
import { deleteManyLogs, searchLogs } from "../api/Api.ts";
import { IndexResponseType } from "../api/ResponseTypes.ts";
import { JOBS_STATUS, LogTypesId, LogTypesMap } from "../types/types.ts";
import { Select } from "./Select.tsx";
import Status from "./Status.tsx";
import LogsTable from "./LogsTable.tsx";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/16/solid";

type FormState = {
    search: string;
    type: LogTypesId;
};

type MainContentProps = {
    toggleWideMode: () => void;
    toggleSettingsOpened: () => void;
    wideMode: boolean;
};

export default function MainContent({ toggleWideMode, wideMode }: MainContentProps) {
    const [data, setData] = useState<FormState>({
        search: "",
        type: LogTypesId.Objects,
    });
    const [response, setResponse] = useState<IndexResponseType | null | undefined>();
    const [error, setError] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setError("");
        setResponse(undefined);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setResponse(null);
        searchLogs(data.search, data.type)
            .then((res) => {
                setResponse(res);
            })
            .catch((err) => {
                setError("Something went wrong during the request.");
                setResponse(undefined);
                throw err;
            });
    };

    const handleDelete = async (ids: number[], logType: LogTypesId): Promise<boolean> => {
        const res = await deleteManyLogs(ids, logType);
        if (!res.hasError) {
            setResponse((prevState) => {
                if (prevState && prevState.rows) {
                    return {
                        ...prevState,
                        rows: prevState.rows.filter((row) => !ids.includes(row.id)),
                    };
                }
                return prevState;
            });
        }

        return !res.hasError;
    };

    let result: JOBS_STATUS = JOBS_STATUS.IDLING;
    if (response === null) {
        result = JOBS_STATUS.PENDING;
    } else if (response !== undefined) {
        result = !response.hasError ? JOBS_STATUS.SUCCESS : JOBS_STATUS.UNSUCCESS;
    }
    let successMessage = "";
    if (!response?.hasError) {
        if (response?.rowCount) {
            successMessage = `Found ${response.rowCount} logs`;
        } else {
            successMessage = "Found no logs";
        }
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-5 mt-10 sm:mx-auto sm:w-full">
            <h4 className="font-bold text-left mb-4 flex justify-between">
                <div>Search and Delete Logs</div>
                <button onClick={toggleWideMode}>
                    {wideMode && <ArrowsPointingInIcon className="h-5 w-5 mx-auto" />}
                    {!wideMode && <ArrowsPointingOutIcon className="h-5 w-5 mx-auto" />}
                </button>
            </h4>
            <form className="space-y-4" action="#" method="POST" onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="group"
                        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
                    >
                        Search string
                    </label>
                    <div className="mt-2">
                        <Input
                            name="search"
                            value={data.search}
                            onChange={(event) => handleChange(event as ChangeEvent<HTMLInputElement>)}
                            placeholder=""
                        />
                    </div>
                </div>
                <div>
                    <div className="flex-grow w-100">
                        <label
                            htmlFor="group"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
                        >
                            Type
                        </label>
                        <div className="mt-2">
                            <Select
                                name="type"
                                value={data.type}
                                options={Object.values(LogTypesMap).map((type) => ({
                                    value: type.id,
                                    text: type.name,
                                }))}
                                onChange={(event: ChangeEvent<HTMLSelectElement>) => handleChange(event)}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Button text="Search" className="w-full" />
                </div>
            </form>
            <Status
                status={result}
                error={error}
                pending="Searching..."
                success={successMessage}
                unsuccess={
                    response?.message && response.message?.length > 0 ? response.message : "Could not search logs"
                }
            />
            {response?.rows && response.rows.length === 0 && (
                <div className="mt-4 text-indigo-800 dark:text-indigo-200">No matching logs found</div>
            )}
            {response?.rows && response.rows.length > 0 && (
                <div className="mt-4">
                    <LogsTable type={data.type} logs={response?.rows} deleteHandler={handleDelete} />
                </div>
            )}
        </div>
    );
}

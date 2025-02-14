import { XMarkIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useState } from "react";
import Button from "./Button.tsx";

type NewTableProps = {
    headers: string[];
    rows: { id: number; values: (string | number)[] }[];
    deleteHandler: (ids: number[]) => Promise<boolean>;
};

export default function Table({ headers, rows, deleteHandler }: NewTableProps) {
    const [selected, setSelected] = useState<number[]>([]);
    const [errorMessage, setErrorMesage] = useState("");
    const isAllSelected = selected.length === rows.length;

    const handleCheckChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        const { checked } = event.target;
        if (checked) {
            // If not already found id in state, then add it. Should never be found in reality, but let's safeguard.
            if (!selected.find((selectedId) => selectedId === id)) {
                setSelected((prevState) => [...prevState, id]);
            }
        } else {
            // Remove from state
            setSelected((prevState) => prevState.filter((selectedId) => selectedId !== id));
        }
    };

    const handleToggleSelectAll = () => {
        if (selected.length === rows.length) {
            setSelected([]);
        } else {
            setSelected(rows.map((row) => row.id));
        }
    };

    /**
     * Delete single log. If deletion was OK from API, then remove it from selected state.
     * Otherwise, leave it in state.
     * @param id
     */
    const handleDeleteSingle = (id: number) => {
        deleteHandler([id]).then((ok) => {
            if (ok) {
                setErrorMesage("");
                setSelected((prevState) => prevState.filter((selectedId) => selectedId !== id));
            } else {
                setErrorMesage("Could not delete item");
            }
        });
    };

    /**
     * Delete many logs, based on selected state. If deletion was OK from API, then remove them from selected state.
     * Otherwise, leave them in state.
     */
    const handleDeleteMany = () => {
        deleteHandler(selected).then((ok) => {
            if (ok) {
                setErrorMesage("");
                setSelected([]);
            } else {
                setErrorMesage("Could not delete items");
            }
        });
    };

    const columnHeaderClass =
        "px-4 py-2 border-b border-gray-200 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-50 uppercase tracking-wider";
    const columnRowClass = "px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:bg-gray-600 dark:text-gray-200";

    const renderedRows = rows.map((row) => (
        <tr key={row.id}>
            <td className={columnRowClass + " align-top"}>
                <input
                    type="checkbox"
                    onChange={(event) => handleCheckChange(event, row.id)}
                    checked={!!selected.find((sel) => sel === row.id)}
                />
            </td>
            {row.values.map((value, index) => (
                <td key={`${row.id}-${headers[index]}`} className={columnRowClass}>
                    {value}
                </td>
            ))}
            <td className={columnRowClass + " text-end grow"}>
                <div className="text-red-500 hover:text-red-700 cursor-pointer grow">
                    <XMarkIcon className="h-6 w-6" onClick={() => handleDeleteSingle(row.id)} />
                </div>
            </td>
        </tr>
    ));

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr>
                            <th className={columnHeaderClass + " align-top"}>
                                <input type="checkbox" onChange={handleToggleSelectAll} checked={isAllSelected} />
                            </th>
                            {headers.map((header) => (
                                <th key={header} className={columnHeaderClass}>
                                    <div className="flex gap-1">{header}</div>
                                </th>
                            ))}
                            <th className={columnHeaderClass}></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">{renderedRows}</tbody>
                </table>
            </div>
            {selected.length > 0 && (
                <div className="mt-2">
                    <Button
                        text="Delete selected"
                        onClick={handleDeleteMany}
                        className="w-full bg-red-600 hover:bg-red-500"
                    />
                </div>
            )}
            {errorMessage.length > 0 && <div className="mt-2 text-red-600">{errorMessage}</div>}
        </div>
    );
}

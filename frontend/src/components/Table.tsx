import { FunnelIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { FunnelIcon as FunnelIconOutline } from "@heroicons/react/24/outline";
import { ChangeEvent, useState } from "react";
import Button from "./Button.tsx";
import FilterModal, { CurrentFilterType } from "./filter/FilterModal.tsx";
import useFilter from "../hooks/useFilter.ts";

export type TableProps = {
    headers: string[];
    rows: { id: number; values: (string | number)[] }[];
    deleteHandler: (ids: number[]) => Promise<boolean>;
};

export default function Table({ headers, rows, deleteHandler }: TableProps) {
    const [isFilterModalOpened, setIsFilterModalOpened] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [errorMessage, setErrorMesage] = useState("");
    const { isFiltered, filteredValues, filters, fieldValues, modifyFilter, clearFilter, shouldRowBeFiltered } =
        useFilter();
    const isAllSelected = selected.length === rows.length;

    const closeFilterModal = () => setIsFilterModalOpened(false);
    const openFilterModal = (field: string, fieldIndex: number) => {
        const values = fieldValues(fieldIndex, rows);
        setIsFilterModalOpened(true);
        setModalFilter({
            index: fieldIndex,
            field,
            values,
            filters: filters[fieldIndex],
            filtered: filteredValues(fieldIndex),
        });
    };
    const [modalFilter, setModalFilter] = useState<CurrentFilterType>(null);

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
        "px-4 py-2 border-b text-left text-xs font-medium uppercase tracking-wider theme-table-th";
    const columnRowClass = "px-4 py-2 whitespace-nowrap text-sm theme-table-td";

    const renderedRows = rows
        .filter((row) => !shouldRowBeFiltered(row))
        .map((row) => {
            return (
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
            );
        });

    return (
        <div>
            <FilterModal
                opened={isFilterModalOpened}
                close={closeFilterModal}
                filter={modalFilter}
                modifyFilter={modifyFilter}
                clearFilter={clearFilter}
            />
            {isFiltered() && (
                <div className="mb-2">
                    <FunnelIconOutline className="h-4 w-4 inline-block" />{" "}
                    <span className="align-text-top">{renderedRows.length} logs remain after filter</span>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full theme-bg-color border border-gray-200 rounded-lg">
                    <thead>
                        <tr>
                            <th className={columnHeaderClass + " align-top"}>
                                <input type="checkbox" onChange={handleToggleSelectAll} checked={isAllSelected} />
                            </th>
                            {headers.map((header, headerIndex) => (
                                <th key={header} className={columnHeaderClass}>
                                    <div className="flex gap-1">
                                        {header}
                                        <button
                                            className="align-bottom"
                                            onClick={() => openFilterModal(header, headerIndex)}
                                        >
                                            {!isFiltered(headerIndex) && (
                                                <FunnelIconOutline className="h-4 w-4 mx-auto" />
                                            )}
                                            {isFiltered(headerIndex) && <FunnelIcon className="h-4 w-4 mx-auto" />}
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className={columnHeaderClass}></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderedRows.length === 0 && (
                            <tr>
                                <td colSpan={7} className="mt-4 theme-info-color p-3">
                                    Based on filter conditions, no logs remain. Change filters or{" "}
                                    <span
                                        className="theme-info-color-darker underline cursor-pointer"
                                        onClick={() => clearFilter(null)}
                                    >
                                        clear all filters
                                    </span>
                                    .
                                </td>
                            </tr>
                        )}
                        {renderedRows.length > 0 && renderedRows}
                    </tbody>
                </table>
            </div>
            {selected.length > 0 && (
                <div className="mt-2">
                    <Button
                        text="Delete selected"
                        onClick={handleDeleteMany}
                        className="w-full theme-button theme-button-delete"
                    />
                </div>
            )}
            {errorMessage.length > 0 && <div className="mt-2 text-red-600">{errorMessage}</div>}
        </div>
    );
}

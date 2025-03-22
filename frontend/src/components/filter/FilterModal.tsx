import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton } from "@material-tailwind/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/16/solid";
import FilterModalContent from "./FilterModalContent.tsx";
import { FilterValuesType } from "../../hooks/useFilter.ts";
import { useEffect, useState } from "react";

export type CurrentFilterType = {
    index: number;
    field: string;
    values: FilterValuesType;
    filtered?: boolean[];
    filters: (string | number)[];
} | null;

type FilterModalProps = {
    opened: boolean;
    close: () => void;
    filter: CurrentFilterType;
    modifyFilter: (index: number, values: FilterValuesType | null) => void;
    clearFilter: (index: number | null) => void;
};

export default function FilterModal({ opened, close, filter, modifyFilter, clearFilter }: FilterModalProps) {
    const filler = {
        placeholder: null,
        onPointerEnterCapture: null,
        onPointerLeaveCapture: null,
    };

    const [checked, setChecked] = useState<boolean[] | null>(null);

    useEffect(() => {
        if (filter === null) {
            // No filter? Everything null (means checked)
            setChecked(null);
        } else {
            setChecked(
                filter.values.map((value) => {
                    // If no filter, then everything should be checked
                    if (!filter.filters) {
                        return true;
                    }

                    // If the value exists in the filter, make it unchecked. Leave checked otherwise.
                    return filter.filters.find((val) => value === val) !== undefined;
                }),
            );
        }
    }, [filter]);

    const onCheckChange = (changedIndex: number) => {
        setChecked((prevState) => {
            if (!prevState) {
                return null;
            }
            return prevState.map((check, index) => {
                if (index === changedIndex) {
                    return !check;
                }
                return check;
            });
        });
    };

    const handleClearFilter = () => {
        if (filter?.field) {
            clearFilter(filter.index);
        }
        close();
    };

    const handleSaveFilter = () => {
        if (filter?.field) {
            const filtered = filter.values.filter((_, index) => checked && checked[index]);
            if (filtered.length === filter.values.length) {
                modifyFilter(filter.index, null);
            } else {
                modifyFilter(filter.index, filtered);
            }
        }
        close();
    };

    return (
        <Dialog open={opened} handler={close} {...filler} className="overflow-y-scroll max-h-[90%] theme-dialog">
            <DialogHeader className="relative" {...filler}>
                <div className="theme-dialog-color">
                    <FunnelIcon className="inline-block h-6 w-6" /> <span className="align-middle">Filter</span>
                </div>
                <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute right-3.5 top-3.5 theme-dialog-color"
                    onClick={close}
                    {...filler}
                >
                    <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
            </DialogHeader>
            <DialogBody {...filler}>
                <FilterModalContent
                    field={filter?.field ?? "Unknown"}
                    options={filter?.values ?? []}
                    checked={checked}
                    onCheckChange={onCheckChange}
                />
            </DialogBody>
            <DialogFooter {...filler}>
                <Button variant="text" color="red" onClick={handleClearFilter} className="mr-1" {...filler}>
                    <span>Clear</span>
                </Button>
                <Button variant="text" color="green" onClick={handleSaveFilter} {...filler}>
                    <span>Accept</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

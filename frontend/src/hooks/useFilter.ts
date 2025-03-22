import { useState } from "react";

export type FilterType = Record<string | number, FilterValuesType>;
export type FilterValuesType = (string | number)[];

export default function useFilter() {
    const [filters, setFilters] = useState<FilterType>({});

    const clearFilter = (index: number | undefined | null) => {
        if (!index) {
            setFilters({});
        }
        setFilters((prevState) => {
            const entries = Object.entries(prevState);

            const withoutCleared = entries.filter(([key]) => {
                return parseInt(key) !== index;
            });

            return Object.fromEntries(withoutCleared);
        });
    };

    const modifyFilter = (index: string | number, values: FilterValuesType | null) => {
        if (values === null) {
            // Remove the filter index from filters, since we are now displaying all items (same as when it's never been filtered)
            setFilters((prevState) => {
                return Object.fromEntries(
                    Object.entries(prevState).filter(([key]) => {
                        return parseInt(key) !== index;
                    }),
                );
            });
        } else {
            // Add/modify the index filter values
            setFilters((prevState) => ({
                ...prevState,
                [index]: values,
            }));
        }
    };

    const isFiltered = (index: number | null = null) => {
        if (index === null) {
            return Object.keys(filters).length > 0;
        } else {
            return !!filters[index];
        }
    };

    const filteredValues = (index: number) => {
        return (filters[index] ?? []).map((_) => true);
    };

    const fieldValues = (fieldIndex: number, rows: { id: number; values: FilterValuesType }[]) => {
        const values: (string | number)[] = [];
        rows.forEach((row) => {
            row.values.forEach((headerValue, headerIndex) => {
                if (fieldIndex === headerIndex && !values.find((value) => value === headerValue)) {
                    values.push(headerValue);
                }
            });
        });

        return values;
    };

    const shouldRowBeFiltered = (row: { id: number; values: (string | number)[] }) => {
        let shouldBeFiltered = false;
        for (const [index, value] of row.values.entries()) {
            if (!filters[index]) {
                continue;
            }

            const isFoundInFilter = filters[index].find((val) => value === val);
            if (!isFoundInFilter) {
                shouldBeFiltered = true;
            }
        }

        return shouldBeFiltered;
    };

    return { filteredValues, filters, fieldValues, isFiltered, clearFilter, modifyFilter, shouldRowBeFiltered };
}

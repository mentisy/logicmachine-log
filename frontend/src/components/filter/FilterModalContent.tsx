import { Checkbox, Typography } from "@material-tailwind/react";
import { FilterValuesType } from "../../hooks/useFilter.ts";

type FilterModalContentProps = {
    field: string;
    options: FilterValuesType;
    checked: boolean[] | null;
    onCheckChange: (changedIndex: number) => void;
};

export default function FilterModalContent({ field, options, checked, onCheckChange }: FilterModalContentProps) {
    const filler = {
        onPointerEnterCapture: undefined,
        onPointerLeaveCapture: undefined,
    };
    const renderedCheckboxes = options.map((option, index) => (
        <div key={option}>
            <Checkbox
                crossOrigin={undefined}
                label={option}
                labelProps={{ className: "theme-dialog-checkbox-label" }}
                checked={checked ? (checked[index] ?? false) : false}
                onChange={() => onCheckChange(index)}
                {...filler}
            />
        </div>
    ));

    return (
        <div>
            <Typography variant="lead" {...filler} placeholder={null} className="theme-dialog-color">
                {field}
            </Typography>
            {renderedCheckboxes}
        </div>
    );
}

import { HTMLProps } from "react";

type SelectPropsType = {
    options: { value: string; text: string }[];
};

export function Select({ options, ...props }: SelectPropsType & HTMLProps<HTMLSelectElement>) {
    let { className } = props;
    className =
        "block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-50 dark:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 " +
        (className ?? "");

    return (
        <select name={props.name} value={props.value} className={className} {...props}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.text}
                </option>
            ))}
        </select>
    );
}

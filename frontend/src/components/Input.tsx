import { HTMLProps } from "react";

type InputProps = HTMLProps<HTMLInputElement> & {
    name: string;
};

export default function Input(props: InputProps) {
    const id = props.id || props.name;
    const className =
        (props.className ?? "") +
        " block w-full rounded-md border-0 py-1.5 theme-input shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-50 placeholder:text-gray-400 placeholder:dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

    return <input id={id} className={className} type="text" autoComplete="off" required {...props} />;
}

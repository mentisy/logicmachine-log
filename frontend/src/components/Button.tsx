import { HTMLProps, ReactNode } from "react";

type ButtonProps = HTMLProps<HTMLButtonElement> & {
    text: string | ReactNode;
};

export default function Button(props: ButtonProps) {
    let { className } = props;
    className =
        "flex justify-center rounded-md theme-button px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-500 " +
        (className ?? "");

    return (
        <button {...props} type="submit" className={className}>
            {props.text}
        </button>
    );
}

import { BugAntIcon } from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <>
            <div>
                Developed by{" "}
                <a
                    href={import.meta.env.VITE_MY_WEBSITE_URL}
                    target="_blank"
                    className="text-indigo-600 dark:text-indigo-400 font-bold"
                >
                    {import.meta.env.VITE_MY_WEBSITE_NAME}
                </a>
                . Source code:{" "}
                <a
                    href={import.meta.env.VITE_GITHUB_URL}
                    target="_blank"
                    className="text-indigo-600 dark:text-indigo-400 font-bold"
                >
                    <img src={"./github.svg"} alt="" className="w-5 h-5 inline align-sub dark:hidden" />
                    <img src={"./github-dark.svg"} alt="" className="w-5 h-5 align-sub hidden dark:inline" /> GitHub
                </a>
            </div>
            <div>
                <a
                    href={import.meta.env.VITE_GITHUB_ISSUES_URL}
                    target="_blank"
                    className="text-indigo-600 dark:text-indigo-400 font-bold"
                >
                    <BugAntIcon className="h-4 w-4 inline" /> If you find any issues, please report it here.
                </a>
            </div>
        </>
    );
}

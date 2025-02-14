import { ArrowsPointingInIcon, ArrowsPointingOutIcon, CogIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { MouseEvent } from "react";

type SettingsProps = {
    toggleSettingsOpened: () => void;
};

export default function Settings({ toggleSettingsOpened }: SettingsProps) {
    const handleClickInside = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="absolute top-0 right-0 bottom-0 left-0" onClick={toggleSettingsOpened}>
            <div className="w-full">
                <div className="flex justify-center mt-24">
                    <div
                        className="w-1/2 bg-gray-200 dark:bg-slate-800 rounded-lg dark:text-white p-5 shadow-xl transform"
                        onClick={handleClickInside}
                    >
                        <section>
                            <div className="flex w-100 justify-between gap-1">
                                <div>
                                    <CogIcon className="w-6 h-6 inline-block align-top" /> Settings
                                </div>
                                <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={toggleSettingsOpened} />
                            </div>
                        </section>
                        <section className="mt-5">
                            <div className="flex gap-1">
                                <div>Wide mode:</div>
                                <div>
                                    <ArrowsPointingInIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <ArrowsPointingOutIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

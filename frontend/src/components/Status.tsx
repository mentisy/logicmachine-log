import { ReactNode } from "react";
import { CheckIcon, ScaleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { JOBS_STATUS } from "../types/types.ts";

type ResultProps = {
    status: JOBS_STATUS;
    error: string;
    pending: string;
    success: string;
    unsuccess: string;
};

export default function Status({ status, error, pending, success, unsuccess }: ResultProps) {
    let resultComponent: ReactNode = undefined;
    switch (status) {
        case JOBS_STATUS.PENDING: {
            resultComponent = (
                <>
                    <span className="text-indigo-600">
                        <ScaleIcon className="h-5 w-5 inline" />
                    </span>{" "}
                    <span className="align-middle">{pending}</span>
                </>
            );
            break;
        }
        case JOBS_STATUS.SUCCESS: {
            resultComponent = (
                <>
                    <span className="text-green-600">{<CheckIcon className="h-5 w-5 inline" />}</span>{" "}
                    <span className="align-middle">{success}</span>
                </>
            );
            break;
        }
        case JOBS_STATUS.UNSUCCESS: {
            resultComponent = (
                <>
                    <span className="text-red-600">{<XMarkIcon className="h-5 w-5 inline" />}</span>{" "}
                    <span className="align-middle">{unsuccess}</span>
                </>
            );
            break;
        }
    }

    return (
        <>
            {resultComponent !== undefined && (
                <div className="mt-4 text-left">
                    <div className="font-medium">{resultComponent}</div>
                </div>
            )}
            {error.length > 0 && (
                <div className="mt-4 text-left">
                    <div className="font-medium text-red-500">
                        <span className="text-red-600">{<ExclamationTriangleIcon className="h-5 w-5 inline" />}</span>{" "}
                        <span className="align-middle">{error}</span>
                    </div>
                </div>
            )}
        </>
    );
}

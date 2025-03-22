import { useEffect, useState } from "react";

export default function useLocalStorage(key: string, defaultValue?: any) {
    const keyWithPrefix = `${import.meta.env.VITE_STORAGE_PREFIX}_${key}`;
    const [localValue, setLocalValue] = useState<any | undefined>();

    useEffect(() => {
        const value = localStorage.getItem(keyWithPrefix);
        if (value === undefined && defaultValue) {
            setLocalValue(defaultValue);
        } else if (value) {
            setLocalValue(JSON.parse(value));
        }
    });

    const changeValue = (value: any) => {
        const newValue = JSON.stringify(value);
        localStorage.setItem(keyWithPrefix, newValue);
        setLocalValue(newValue);
    };

    return [localValue, changeValue];
}

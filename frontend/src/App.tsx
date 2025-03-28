import "./App.css";
import { BugAntIcon } from "@heroicons/react/24/outline";
import MainContent from "./components/MainContent.tsx";
import Footer from "./components/Footer.tsx";
import useLocalStorage from "./hooks/useLocalStorage.ts";

export default function App() {
    const [wideMode, setWideMode] = useLocalStorage("widemode", false);
    let narrowClass = "";
    if (!wideMode) {
        narrowClass = " lg:w-4/5 max-w-screen-lg";
    }

    const toggleWideMode = () => setWideMode(!wideMode);

    return (
        <div className="relative h-full">
            <div className={"flex min-h-full flex-1 flex-col px-6 py-6 lg:px-8 mx-auto " + narrowClass}>
                <header className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <BugAntIcon className="h-12 w-12 mx-auto theme-text-color" />
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">Logs</h2>
                </header>
                <section>
                    <MainContent wideMode={wideMode} toggleWideMode={toggleWideMode} />
                </section>
                <footer className="text-center mt-3">
                    <Footer />
                </footer>
            </div>
        </div>
    );
}

import forms from "@tailwindcss/forms";
import withMT from "@material-tailwind/react/utils/withMt";

/** @type {import('tailwindcss').Config} */
export default withMT({
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [forms],
});

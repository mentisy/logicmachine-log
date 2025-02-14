const datatypes: { [key: number]: string } = {
    1: "01. 1 bit (boolean)",
    1001: "01.001 switch",
    1002: "01.002 boolean",
    1003: "01.003 enable",
    1004: "01.004 transition",
    1005: "01.005 alarm",
    1006: "01.006 low/high",
    1007: "01.007 step",
    1008: "01.008 up/down",
    1009: "01.009 open/close",
    1010: "01.010 start/stop",
    1011: "01.011 activity",
    1012: "01.012 inversion",
    1013: "01.013 dim style",
    1014: "01.014 data source",
    2: "02. 2 bit (1 bit controlled)",
    3: "03. 4 bit (3 bit controlled)",
    3007: "03.007 dim/blinds step",
    4: "04. 1 byte ASCII character",
    5: "05. 1 byte unsigned integer",
    5001: "05.001 scale",
    5003: "05.003 angle",
    6: "06. 1 byte signed integer",
    7: "07. 2 byte unsigned integer",
    8: "08. 2 byte signed integer",
    9: "09. 2 byte floating point",
    9001: "09.001 Temperature",
    // 3 byte unsigned integer
    10: "10. 3 byte time / day",
    11: "11. 3 byte date",
    12: "12. 4 byte unsigned integer",
    12600: "12.600 RGBW color", // check key
    13: "13. 4 byte unsigned integer",
    14: "14. 4 byte floating point",
    15: "15. 4 byte access control",
    16: "16. 14 byte ASCII string",
    16002: "16.002 14 byte HEX", // check key
    20: "20. 1 byte enumeration",
    20004: "20.004 priority", // check key
    20007: "20.007 alarm class", // check key
    20102: "20.102 HVAC mode", // check key
    20110: "20.110 heater mode", // check key
    20111: "20.111 fan mode", // check key
    20112: "20.112 master/slave mode", // check key
    27001: "27.001 4 byte combined on/off",
    29: "29. 8 byte signed integer",
    250: "250 byte string",
    238600: "238.600 1 byte DALI diagnostics",
    245600: "245.600 6 byte DALI test result",
    250600: "250.600 3 byte DALI brightness and color temperature control",
    251600: "251.600 6 byte DALI RGBW",
};

export const convertDatatypeToString = (datatype: number | null): string => {
    if (datatype === null) {
        return "Not specified";
    }
    if (datatypes[datatype] === undefined) {
        return "Unknown";
    }

    return datatypes[datatype];
};

export const convertDatatypeValue = (datatype: number | null, value: string) => {
    switch (datatype) {
        case null:
            return value;
        case 1:
            return !parseInt(value) ? "0" : "1";
        case 1001:
            return !parseInt(value) ? "off" : "on";
        case 1002:
            return !parseInt(value) ? "false" : "true";
        case 1003:
            return !parseInt(value) ? "disabled" : "enabled";
        case 1004:
            return !parseInt(value) ? "no ramp" : "ramp";
        case 1005:
            return !parseInt(value) ? "no alarm" : "alarm";
        case 1006:
            return !parseInt(value) ? "low" : "high";
        case 1007:
            return !parseInt(value) ? "decrease" : "increase";
        case 1008:
            return !parseInt(value) ? "up" : "down";
        case 1009:
            return !parseInt(value) ? "open" : "close";
        case 1010:
            return !parseInt(value) ? "stop" : "start";
        case 1011:
            return !parseInt(value) ? "inactive" : "active";
        case 1012:
            return !parseInt(value) ? "not inverted" : "inverted";
        case 1013:
            return !parseInt(value) ? "start/stop" : "cyclically";
        case 1014:
            return !parseInt(value) ? "fixed" : "calculated";
        case 2:
            return "No control, " + parseInt(value);
        case 3:
            return convertControlStep(value);
        case 3007:
            return convertDimmingStep(value);
        case 4:
            return String.fromCharCode(hexToInt(value)); // Hex to ASCII
        case 5:
            return hexToInt(value); // Hex to 1 byte unsigned integer
        case 5001:
            return Math.round((hexToInt(value) * 100) / 255) + "%"; // Hex to scale
        case 5003:
            return Math.round((hexToInt(value) * 100) / 360) + "°"; // Hex to angle
        case 6:
            return twosComplement(value, 8); // 1 byte signed integer (-128 to 127)
        case 7:
            return hexToInt(value); // Hex to 2 byte unsigned integer
        case 8:
            return twosComplement(value, 16); // 2 byte signed integer (-32768 to 32767)
        case 9:
            return floatedTwoByte(value); // 2 byte float (-671088,64 to 670760,96)
        case 9001:
            return floatedTwoByte(value); // 2 byte float (-671088,64 to 670760,96)
        case 10:
            return timeDay(value); // 22:01:44, Monday
        case 11:
            return date(value); //24.12.2024
        case 12:
            return hexToInt(value); // Hex to 4 byte unsigned integer
        case 12600:
            return rgbw(value); // #00FFAA 255 (RGB in hex, White in decimal)
        case 13:
            return twosComplement(value, 32); // 4 byte signed integer (-2147483648 to 2147483647)
        case 14:
            return floatedFourByte(value); // 4 byte float (-2147483648 to 2147483647)
        case 15:
            return hexToInt(value); // Hex to 4 byte unsigned integer
        case 16:
            return characterString(value);
        case 16002:
            return characterStringHex(value);
        case 20:
            return hexToInt(value); // Hex to 1 byte unsigned integer (enumeration)
        case 20004:
            return enumeration(value, ["high", "medium", "low", "void"]);
        case 20007:
            return enumeration(value, { 1: "simple alarm", 2: "basic alarm", 3: "extended alarm" });
        case 20102:
            return enumeration(value, ["auto", "comfort", "standby", "economy", "building protection"]);
        case 20110:
            return enumeration(value, {
                1: "heat stage A on/off",
                2: "heat stage A proportional",
                3: "heat stage B proportional",
            });
        case 20111:
            return enumeration(value, ["not running", "permanently running", "running in intervals"]);
        case 20112:
            return enumeration(value, ["autonomous", "master", "slave"]);
        case 27001:
            return value;
        case 29:
            return twosComplement(value, 64); // 8 byte signed integer (-92233372036854775000 to 9223372036854775000)
        case 250:
            return characterString(value); // 250 character bytes
        case 238600:
            return daliDiagnostics(value); // 1 byte DALI diagnostics
        case 245600:
            return value; // 6 byte DALI test result
        case 250600:
            return daliBrightnessColorTemperatureControl(value); // 3 byte DALI Brightness and color temperature control
        case 251600:
            return rgbwSixByte(value); // 6 byte DALI RGBW
        default:
            return value; // Fallback
    }
};

const convertControlStep = (value: string) => {
    const parsed = hexToInt(value);
    if (parsed === 0) {
        return "No control, Break";
    } else if (parsed < 8) {
        return "No control, Step " + parsed;
    }

    return "Control, Step" + parsed;
};

const convertDimmingStep = (value: string) => {
    const parsed = hexToInt(value);
    switch (parsed) {
        case 0:
            return "Stop";
        case 1:
            return "Down 100%";
        case 2:
            return "Down 50%";
        case 3:
            return "Down 25%";
        case 4:
            return "Down 12%";
        case 5:
            return "Down 6%";
        case 6:
            return "Down 3%";
        case 7:
            return "Down 1%";
        case 8:
            return "Up 100%";
        case 9:
            return "Up 50%";
        case 10:
            return "Up 25%";
        case 11:
            return "Up 12%";
        case 12:
            return "Up 6%";
        case 13:
            return "Up 3%";
        case 14:
            return "Up 1%";
    }

    return parsed;
};

const hexToInt = (hex: string) => {
    return parseInt(hex, 16);
};

const twosComplement = (value: number | string, size: number, isNegative: boolean | null = null) => {
    if (typeof value === "string") {
        value = hexToInt(value);
    }
    const maxInt = 2 ** size;
    const halfInt = 2 ** (size - 1);
    if (isNegative === null) {
        isNegative = value >= halfInt;
    }
    if (isNegative) {
        return value - maxInt;
    }

    return value;
};

const floatedTwoByte = (hex: string) => {
    const dec = hexToInt(hex);
    const isNegative = dec >>> 15 === 1; // if left-most binary digit is 1, then negative
    const exponent = (dec & 0b0111100000000000) >>> 11; // remove the 11 right-most digits, so we can get exponent
    let m = dec & 0b0000011111111111; // get the last 11 digits
    // Get the two's complement based on last 11 digits, and the sign from the 1st digit on original value
    const mTwosComplemented = twosComplement(m, 11, isNegative);

    return 0.01 * mTwosComplemented * 2 ** exponent;
};

const floatedFourByte = (hex: string) => {
    const dec = hexToInt(hex);
    const isNegative = dec >>> 31; // if left-most binary digit is 1, then negative
    const exponent = (dec & 0b01111111100000000000000000000000) >>> 23; // remove the 23 right-most digits, so we can get exponent
    const fraction = dec & 0b00000000011111111111111111111111; // get the last 23 digits
    const biasedExponent = exponent - 127;
    const normalizedFraction = 1 + fraction / 2 ** 23; // fraction divided by maximum possible size of fraction in 23 bits

    return (-1) ** isNegative * normalizedFraction * 2 ** biasedExponent;
};

const timeDay = (hex: string) => {
    const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const dec = hexToInt(hex);

    const HOUR_MASK = 0b000111110000000000000000; // Bits 16-20 (from right)
    const MINUTE_MASK = 0b000000000011111100000000; // Bits 8-15 (from right)
    const SECOND_MASK = 0b000000000000000000111111; // Bits 0-5 (from right)

    const day = dec >>> 21; // day = 3 left-most digits, so remove the other 21
    const hour = (dec & HOUR_MASK) >>> 16;
    const minute = (dec & MINUTE_MASK) >>> 8;
    const second = dec & SECOND_MASK;

    const time = new Date(0, 0, 0, hour, minute, second).toLocaleTimeString();
    if (day === 0) {
        return time;
    }

    return `${time}, ${days[day]}`;
};

const date = (hex: string) => {
    const dec = hexToInt(hex);

    const DAY_MASK = 0b000111110000000000000000;
    const MONTH_MASK = 0b000000000000111100000000;
    const YEAR_MASK = 0xff; // third octet from left

    const day = (dec & DAY_MASK) >>> 16;
    const month = (dec & MONTH_MASK) >>> 8;
    const year = dec & YEAR_MASK;
    let centuryNotOrdinal = 20; // The century (not ordinal) - 20 means 20xx and 19 means 19xx
    if (year >= 90) {
        centuryNotOrdinal = 19;
    }
    const yearWithCentury = parseInt(centuryNotOrdinal + "" + year);

    return new Date(yearWithCentury, month - 1, day).toLocaleDateString();
};

const rgbw = (hex: string) => {
    const dec = hexToInt(hex);

    const RED_MASK = 0xff000000; // first octet from left
    const GREEN_MASK = 0x00ff0000; // second octet from left
    const BLUE_MASK = 0x0000ff00; // third octet from left
    const WHITE_MASK = 0x000000ff; // fourth octet from left

    const red = (dec & RED_MASK) >>> 24;
    const green = (dec & GREEN_MASK) >>> 16;
    const blue = (dec & BLUE_MASK) >>> 8;
    const white = dec & WHITE_MASK;

    const redFormatted = red.toString(16).padStart(2, "0").toUpperCase();
    const greenFormatted = green.toString(16).padStart(2, "0").toUpperCase();
    const blueFormatted = blue.toString(16).padStart(2, "0").toUpperCase();
    const whiteFormatted = white.toString(16).padStart(2, "0").toUpperCase();

    return `#${redFormatted}${greenFormatted}${blueFormatted}${whiteFormatted}`;
};

const rgbwSixByte = (hex: string) => {
    const dec = BigInt("0x" + hex);
    const fourByte = Number(dec >> BigInt(16));

    return rgbw(fourByte.toString(16));
};

const characterString = (hex: string) => {
    const chars = hex.match(/(..)/g);
    if (!chars) {
        return hex;
    }
    const charNumbers = chars.filter((n) => n !== "00").map((n) => parseInt(n, 16));

    return String.fromCharCode(...charNumbers);
};

const characterStringHex = (hex: string) => {
    const chars = hex.match(/(..)/g);
    if (!chars) {
        return hex;
    }

    return chars.filter((n) => n !== "00").join("");
};

const enumeration = (hex: string, values: string[] | { [key: number]: string }) => {
    const dec = hexToInt(hex);
    let value = values[dec] ?? "unknown";

    return `${value} (${dec})`;
};

const daliDiagnostics = (hex: string) => {
    const dec = hexToInt(hex);
    const address = dec % 64; // Maximum address range 0-63
    if (dec <= 63) {
        return `Address ${address} OK`;
    }
    if (dec <= 127) {
        return `Address ${address} Lamp error`;
    }
    if (dec <= 191) {
        return `Address ${address} ECG error`;
    }
    if (dec <= 255) {
        return `Address ${address} Lamp & ECG error`;
    }

    return "Unknown";
};

const daliBrightnessColorTemperatureControl = (hex: string) => {
    const dec = hexToInt(hex);
    if (dec === 0) {
        return "—";
    }
    const options = [
        "Stop",
        "Down 100%",
        "Down 50%",
        "Down 25%",
        "Down 12%",
        "Down 6%",
        "Down 3%",
        "Down 1%",
        "",
        "Up 100%",
        "Up 50%",
        "Up 25%",
        "Up 12%",
        "Up 6%",
        "Up 3%",
        "Up 1%",
    ];

    const COLOR_MASK = 0xff0000; // 1st octet
    const BRIGHTNESS_MASK = 0xff00; // 2nd octet
    const MODE_MASK = 0xff; // third octet

    const colorOption = (dec & COLOR_MASK) >>> 16;
    const brightnessOption = (dec & BRIGHTNESS_MASK) >>> 8;
    const mode = dec & MODE_MASK; // 0 = Disabled, 1 = Brightness, 2 = Color, 3 = Both

    // Set brightness and color values based on mode
    let color;
    let brightness;
    if (mode === 0) {
        return "—";
    } else if (mode === 1) {
        color = undefined;
        brightness = options[brightnessOption] ?? "—";
    } else if (mode === 2) {
        color = options[colorOption] ?? "—";
        brightness = undefined;
    } else if (mode === 3) {
        color = options[colorOption] ?? "—";
        brightness = options[brightnessOption] ?? "—";
    } else {
        return "—";
    }

    // Generate display values. Returns comma separated list
    const values = [];
    if (brightness !== undefined) {
        values.push("BR: " + brightness);
    }
    if (color !== undefined) {
        values.push("CT: " + color);
    }

    return values.join(", ");
};

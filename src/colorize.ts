declare type rgb = { r: number, g: number, b: number };

interface AvailableColors {
    'purple': rgb;
    'cyan': rgb;
    'grey': rgb;
}

export default class Colorize {

    private static endTag: string = '\x1b[0m';

    private static colors: AvailableColors = {
        'purple': {r: 100, g: 40, b: 180},
        'cyan': {r: 44, g: 181, b: 233},
        'grey': {r: 128, g: 128, b: 128}
    };

    private static correctInnerColor(text: string, startTag: string): string {
        const lastIndex = text.lastIndexOf(Colorize.endTag);

        if (lastIndex < 0) {
            return text;
        }

        if (text.endsWith(Colorize.endTag)) {
            return text.substring(0, text.length - Colorize.endTag.length);
        }

        return text.substring(0, lastIndex + Colorize.endTag.length) +
            startTag +
            text.substring(lastIndex + Colorize.endTag.length);
    }

    public static purple(text: string) {
        const color = Colorize.colors.purple;
        const startTag = `\x1b[38;2;${color.r};${color.g};${color.b}m`;

        return `${startTag}${Colorize.correctInnerColor(text, startTag)}${Colorize.endTag}`;
    }

    public static cyan(text: string) {
        const color = Colorize.colors.cyan;
        const startTag = `\x1b[38;2;${color.r};${color.g};${color.b}m`;

        return `${startTag}${Colorize.correctInnerColor(text, startTag)}${Colorize.endTag}`;
    }

    public static grey(text: string) {
        const color = Colorize.colors.grey;
        const startTag = `\x1b[38;2;${color.r};${color.g};${color.b}m`;

        return `${startTag}${Colorize.correctInnerColor(text, startTag)}${Colorize.endTag}`;
    }

    public static bold(text: string) {
        const startTag = `\x1b[1m`;

        return `${startTag}${Colorize.correctInnerColor(text, startTag)}${Colorize.endTag}`;
    }
}

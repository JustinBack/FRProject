import * as Color from 'chalk';
import { inspect } from 'util';

export class LoggingManager {

    private static extractClassFromStack(stacktrace: string) {
        let regex = new RegExp(/(?<=at )(.*)(?=.\<anonymous\>)/);

        if (!regex.exec(stacktrace)[0]) {
            return "UnknownModule";
        }
        if (regex.exec(stacktrace)[0] === "Object") {
            return "Entrypoint";
        }

        return regex.exec(stacktrace)[0];
    }

    public static info(...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.cyan(arguments[i]));
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        console.info(Color.cyan("INFO:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }

    public static error(...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.red(arguments[i]));
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        console.error(Color.red("ERROR:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }

    public static warn(...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.yellow(arguments[i]));
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        console.warn(Color.yellow("WARN:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }

    public static debug(...args: any) {

        if (process.env.FR_ENV == "production") return;
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.green(arguments[i]));
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        console.warn(Color.green("DEBUG:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }

    public static log(...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.magenta(arguments[i]));
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        console.warn(Color.magenta("LOG:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
}
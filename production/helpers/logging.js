"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingManager = void 0;
const Color = require("chalk");
const util_1 = require("util");
class LoggingManager {
    static extractClassFromStack(stacktrace) {
        let regex = new RegExp(/(?<=at )(.*)(?=.\<anonymous\>)/);
        return regex.exec(stacktrace)[0] || "UnknownModule";
    }
    static info(...args) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.cyan(arguments[i]));
                continue;
            }
            objs.push(util_1.inspect(arguments[i]));
        }
        console.info(Color.cyan("INFO:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
    static error(...args) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.red(arguments[i]));
                continue;
            }
            objs.push(util_1.inspect(arguments[i]));
        }
        console.error(Color.red("ERROR:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
    static warn(...args) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.yellow(arguments[i]));
                continue;
            }
            objs.push(util_1.inspect(arguments[i]));
        }
        console.warn(Color.yellow("WARN:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
    static debug(...args) {
        if (!process.env.FS_ENV && process.env.FS_ENV == "production")
            return;
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.green(arguments[i]));
                continue;
            }
            objs.push(util_1.inspect(arguments[i]));
        }
        console.warn(Color.green("DEBUG:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
    static log(...args) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(Color.magenta(arguments[i]));
                continue;
            }
            objs.push(util_1.inspect(arguments[i]));
        }
        console.warn(Color.magenta("LOG:"), Color.blue(`[${LoggingManager.extractClassFromStack(new Error().stack)}]`), objs.join(" "));
    }
}
exports.LoggingManager = LoggingManager;

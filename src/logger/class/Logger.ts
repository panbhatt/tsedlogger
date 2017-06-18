/**
 * @module logger
 */
/** */
import {LoggerAppenders} from "./LoggerAppenders";
import {drawTable, ITableSettings} from "../utils/tableUtils";

import {LogEvent} from "../../core/LogEvent";
import {LogLevel} from "../../core/LogLevel";
import {BaseAppender} from "../../appenders/class/BaseAppender";
const util = require("util");

export class Logger {

    private _appenders: LoggerAppenders = new LoggerAppenders();
    private _level: LogLevel;
    /**
     *
     */
    private _context: Map<any, any> = new Map();

    /**
     *
     */
    constructor(private _name: string = "default") {
        this.level = "all";
    }

    get appenders(): LoggerAppenders {
        return this._appenders;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    set level(level: string) {
        this._level = LogLevel.getLevel(level, "debug");
    }

    get context(): Map<any, any> {
        return this._context;
    }

    get level(): string {
        return this._level.toString();
    }

    public isLevelEnabled(otherLevel: string | LogLevel) {
        return this._level.isLessThanOrEqualTo(otherLevel);
    }

    /**
     * Prints to stdout with newline. Multiple arguments can be passed, with the first used as the primary message and all additional used as substitution values similar to printf() (the arguments are all passed to util.format()).
     * @param data
     * @returns {any}
     */
    public debug(...data): Logger {
        return this.write(LogLevel.levels().DEBUG, data);
    }

    /**
     *
     * @param data
     * @returns {any}
     */
    public info(...data): Logger {
        return this.write(LogLevel.levels().INFO, data);
    }

    /**
     *
     * @param data
     * @returns {any}
     */
    public warn(...data): Logger {
        return this.write(LogLevel.levels().WARN, data);
    }

    /**
     * Prints to stderr with newline. Multiple arguments can be passed, with the first used as the primary
     * message and all additional used as substitution values similar to printf() (the arguments are all
     * passed to util.format()).
     * @param data
     * @param args
     * @returns {any}
     */
    public error(...data): Logger {
        return this.write(LogLevel.levels().ERROR, data);
    }

    public fatal(...data): Logger {
        return this.write(LogLevel.levels().FATAL, data);
    }

    /**
     *
     * @param data
     * @returns {Logger}
     */
    public trace(...data): Logger {
        const stack = "\n" + Logger.createStack() + "\n";
        data.push(stack);
        return this.write(LogLevel.levels().TRACE, data);
    }

    /**
     *
     */
    public start(): Logger {
        this.level = "ALL";
        return this;
    }

    /**
     *
     */
    public stop(): Logger {
        this.level = "OFF";
        return this;
    }

    /**
     *
     * @returns {Logger}
     */
    private write(logLevel: LogLevel, data: any[]): Logger {

        if (!this.isLevelEnabled(logLevel)) return this;

        const logEvent = new LogEvent(
            this._name,
            logLevel,
            data,
            this._context
        );

        this.appenders
            .byLogLevel(logLevel)
            .forEach((appender: BaseAppender) => {
                appender.write(logEvent);
            });

        return this;
    }

    /**
     * Create stack trace  the lines of least Logger.
     * @returns {string}
     */
    public static createStack(): string {
        const stack: string = new Error().stack.replace("Error\n", "");
        const array: string[] = stack.split("\n");

        /* istanbul ignore else */
        if (array[0].indexOf("Logger.") > -1) { // remove current function
            array.splice(0, 1);
        }

        /* istanbul ignore else */
        if (array[0].indexOf("Logger.") > -1) { // remove caller
            array.splice(0, 1);
        }

        return array.join("\n");
    }

    /**
     *
     * @param list
     * @param settings
     */
    public drawTable(list: any[], settings: ITableSettings = {}): string {
        return drawTable(list, settings);
    }

    /**
     *
     * @param list
     * @param settings
     * @returns {Logger}
     */
    public printTable(list: any[], settings: ITableSettings = {}) {
        this.info(`\n${this.drawTable(list, settings)}`);
        return this;
    }
}
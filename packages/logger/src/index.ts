export * from "./core";
export * from "./appenders";
export * from "./layouts";
export * from "./logger";

import {Logger} from "./logger/class/Logger";

let $log: Logger = new Logger("default");

$log.appenders
  .set("stdout", {type: "stdout", levels: ["info", "debug"]})
  .set("stderr", {type: "stderr", levels: ["trace", "fatal", "error", "warn"]});

export default {
  $log
};

export {$log};

import { ERROR_RESULT } from "./constants.js";

export const operations = {
  sum: "+",
  minus: "-",
  divide: "/",
  multiple: "*",
  percent: "%",
};

export const operationsArray = Object.values(operations);

export class CommandsController {
  constructor() {
    this.commands = [];
  }

  append(command) {
    Array.isArray(command)
      ? this.commands.push(...command)
      : this.commands.push(command);
  }

  remove(offset = 1) {
    const start = this.commands.length - offset;
    this.commands.splice(start, offset);
  }

  reset() {
    this.commands = [];
  }

  execute() {
    const result = eval(this.commands.join(""));
    return result === Infinity ? ERROR_RESULT : result;
  }
}

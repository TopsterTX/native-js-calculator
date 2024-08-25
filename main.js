import {
  CommandsController,
  operationsArray,
  operations,
} from "./commandsController.js";
import {
  ERROR_RESULT,
  DEFAULT_INPUT_VALUE,
  DEFAULT_OFFSET_VALUE,
} from "./constants.js";
import { State } from "./state.js";

const numberButtonList = document.querySelectorAll(".number");
const operationButtonList = document.getElementById("operation-button-list");
const input = document.getElementById("input");
const clear = document.getElementById("clear");
const execute = document.getElementById("execute");
const backspace = document.getElementById("backspace");

const plusOffset = document.getElementById("plus-offset");
const minusOffset = document.getElementById("minus-offset");
const count = document.getElementById("count-offset");

const main = () => {
  const commandsController = new CommandsController();
  const inputState = new State(DEFAULT_INPUT_VALUE);
  const countState = new State(DEFAULT_OFFSET_VALUE);

  // show default values
  count.innerText = countState.value;
  input.innerText = inputState.value;

  countState.subscribe((value) => {
    if (value > 0) {
      count.innerText = value;
    }
  });

  inputState.subscribe((value) => {
    if (value === ERROR_RESULT) {
      inputState.set("");
      input.innerText = "";
    } else {
      input.innerText = value;
    }
  });

  numberButtonList.forEach((button) =>
    button.addEventListener("click", (event) => {
      commandsController.append(event.target.innerText);
      const hasOperation = operationsArray.includes(inputState.value.at(-1));
      inputState.set((value) =>
        String(
          `${value !== DEFAULT_INPUT_VALUE ? value : ""}${hasOperation ? " " : ""}${event.target.innerText}`,
        ),
      );
    }),
  );

  for (let button of operationButtonList.children) {
    button.addEventListener("click", (event) => {
      const inputHasValue = Boolean(inputState.value);
      const lastValueNotOperation = !operationsArray.includes(
        commandsController.commands.at(-1),
      );

      if (inputHasValue && lastValueNotOperation) {
        const operation = operations[event.target.id];
        commandsController.append(operation);
        inputState.set((value) => String(`${value} ${operation}`));
      }
    });
  }

  execute.addEventListener("click", (e) => {
    const result = String(commandsController.execute());
    const errorResult = result === ERROR_RESULT;

    inputState.set(result);
    commandsController.reset();
    if (!errorResult) {
      commandsController.append(result.split(""));
    }
  });

  clear.addEventListener("click", (e) => {
    inputState.set("");
    commandsController.reset();
  });

  backspace.addEventListener("click", (e) => {
    inputState.set((oldValue) => oldValue.slice(0, -countState.value));
    commandsController.remove(countState.value);
  });

  plusOffset.addEventListener("click", (e) => {
    countState.set((oldValue) => Number(oldValue) + 1);
  });

  minusOffset.addEventListener("click", (e) => {
    countState.set((oldValue) =>
      Number(oldValue) <= 1 ? oldValue : Number(oldValue) - 1,
    );
  });
};

main();

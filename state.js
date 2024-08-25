export class State {
  constructor(value) {
    this.value = value;
    this.subscribers = [];
  }

  set(newValue) {
    this.value =
      typeof newValue === "function" ? newValue(this.value) : newValue;
    this.subscribers.forEach((callback) => callback(this.value));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

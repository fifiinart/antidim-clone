export interface EventHandler {
  (): void;
}

export interface EventController {
  queue: string[];
  init(): void;
  pressedKeys: Set<string>;
  resetQueue(): void;
  handlerRegister: Map<string, EventHandler[]>;
  register(id: string, handler: EventHandler): void;
  processEvents(): void;
}

export const EventController: EventController = {
  queue: [],
  pressedKeys: new Set(),
  init() {
    [...document.getElementsByClassName("button")].forEach(el => {
      // el.onclick = () => events.push(el.id)
      el.addEventListener("click", () => this.queue.push(el.id));
    });

    this.pressedKeys = new Set();
    addEventListener("keydown", e => {
      this.pressedKeys.add(e.key);
    });
    addEventListener("keyup", e => {
      this.pressedKeys.delete(e.key);
    });
  },

  resetQueue() {
    this.queue = [...Array.from(this.pressedKeys).map(k => "keypress-" + k)];
  },
  handlerRegister: new Map(),
  register(id, handler) {
    const arr = this.handlerRegister.get(id);
    if (arr) arr.push(handler);
    else this.handlerRegister.set(id, [handler]);
  },
  processEvents(): void {
    for (const event of this.queue) {
      const handlers = this.handlerRegister.get(event);
      if (!handlers || handlers.length === 0) {
        console.log(`Event ${event} fired with no handlers!`)
      } else {
        handlers.forEach(x => x())
      }
    }

    this.resetQueue();
  }
}

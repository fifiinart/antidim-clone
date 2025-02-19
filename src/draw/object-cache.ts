export class ObjectCache {
  map: Map<string, HTMLElement>;
  constructor() {
    this.map = new Map();
  }

  get(id: string) {
    let obj = this.map.get(id);
    if (obj !== undefined) return obj;
    else return this.forceGet(id);
  }

  forceGet(id: string) {
    let obj = document.getElementById(id);
    if (obj === null) throw new Error(`Element #${id} not found.`);
    this.map.set(id, obj);
    return obj;
  }
}
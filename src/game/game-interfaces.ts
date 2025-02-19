
export interface Resource {
  value: number;
  rate: number;

  tick(delta: number): void;
}

export interface Producer {
  resource: Resource;

  produce(): void;
}
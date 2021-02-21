export class NumberSet {
  private values: Uint32Array;
  private mark = 1;

  constructor(size: number) {
    this.values = new Uint32Array(size);
  }

  add(value: number) {
    this.values[value] = this.mark;
  }

  delete(value: number) {
    this.values[value] = 0;
  }

  has(value: number) {
    return this.values[value] === this.mark;
  }

  clear() {
    this.mark++;
  }
}

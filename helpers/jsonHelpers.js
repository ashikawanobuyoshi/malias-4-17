export function parse(string) {
    return this.deserialize(JSON.parse(string));
  }
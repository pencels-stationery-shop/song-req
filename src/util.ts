export function urlJoin(a: string, b: string): string {
  if (a.charAt(a.length - 1) === "/") {
    return a + b;
  } else {
    return a + "/" + b;
  }
}

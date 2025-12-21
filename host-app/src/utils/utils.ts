export function importRemoteFunction(path: string) {
  async function callImportRemoteFunction() {
    return await import(path);
  }
  return callImportRemoteFunction;
}

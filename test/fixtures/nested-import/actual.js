function getModule(path) {
  return import('test-module?chunkName=test');
}

getModule().then(() => {});

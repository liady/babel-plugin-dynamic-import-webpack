import('test-module').then(() => (
  import('test-module-2')
));

Promise.all([
  import('test-1'),
  import('test-2?chunkName=test'),
  import('test-3'),
]).then(() => {});
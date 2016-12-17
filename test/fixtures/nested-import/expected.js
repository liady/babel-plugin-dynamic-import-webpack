function getModule(path) {
  return new Promise(resolve => {
    require.ensure([], require => {
      resolve(require('test-module'));
    }, 'test');
  });
}

getModule().then(() => {});

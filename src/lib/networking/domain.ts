var os = require('os');

export const isDevEnv = () => {
  return os.hostname().indexOf('local') > -1;
};

const logger = (error) => {
  if (typeof cwr == 'function') {
    console.log('Logging to cwr', error);
    cwr('recordError', error);
  }
  if (window.console) {
    console.log('Caught error', error);
  }
};

export default logger;

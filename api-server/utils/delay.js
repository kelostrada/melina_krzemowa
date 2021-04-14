const delay = (duration) =>
  new Promise((resolve) => setTimeout(() => resolve(), duration));

exports.delay = delay;

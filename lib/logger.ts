const isDev = import.meta.env.DEV;

const logger = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  info: (...args: unknown[]) => { if (isDev) console.info(...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => { if (isDev) console.error(...args); },
  group: (...args: unknown[]) => { if (isDev) console.group(...args); },
  groupEnd: () => { if (isDev) console.groupEnd(); },
};

export default logger;

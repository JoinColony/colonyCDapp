const localStorageKey = '__COLONY_DEBUG_ENABLED__';

const debugLogging = <T extends unknown[]>(...messages: T) => {
  const debugEnabled =
    import.meta.env.DEV || localStorage.getItem(localStorageKey) === 'true';
  if (debugEnabled) {
    console.info(...messages);
  }
};

export default debugLogging;

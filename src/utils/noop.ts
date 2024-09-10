const noop = () => undefined;

export default noop;

export const asyncNoop = () => Promise.resolve(undefined);

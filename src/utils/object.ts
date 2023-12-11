export const objectKeys = <T extends { [_: string]: any }, K extends keyof T>(
  obj: T,
): K[] => Object.keys(obj) as K[];

export const objectValues = <T extends { [_: string]: any }, K extends keyof T>(
  obj: T,
): T[K][] => Object.values(obj);

export const objectEntries = <
  T extends { [_: string]: any },
  K extends keyof T,
>(
  obj: T,
): [K, T[K]][] => Object.entries(obj) as [K, T[K]][];

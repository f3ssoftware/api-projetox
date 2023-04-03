import { IToNumberOptions } from '../interfaces/to-number-options.interface';

export const toLowerCase = (value: string): string => {
  return value.toLowerCase();
};

export const trim = (value: string): string => {
  return value.trim();
};

export const toDate = (value: string): Date => {
  return new Date(value);
};

export const toBoolean = (value: string): boolean => {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
};

export const toNumber = (
  value: string,
  opts: IToNumberOptions = {},
): number => {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
};

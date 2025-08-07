import * as L from './localStorageP'

export const readObjectP = <T extends object>(key: string) =>
  new Promise<T | null>((resolve, reject) => {
    L.readStringP(key)
      .then(value => resolve(value ? JSON.parse(value) : null))
      .catch(reject)
  })

export const writeObjectP = (key: string, value: object) =>
  L.writeStringP(key, JSON.stringify(value))

export const removeKeyP = (key: string): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      localStorage.removeItem(key);
      resolve();
    } catch (e) {
      reject(e);
    }
  });

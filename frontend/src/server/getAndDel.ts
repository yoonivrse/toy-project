import {getServerUrl} from './getServerUrl'

export const get = (path: string) => fetch(getServerUrl(path),{credentials: 'include'})
export const del = (path: string) => fetch(getServerUrl(path), {method: 'DELETE'})

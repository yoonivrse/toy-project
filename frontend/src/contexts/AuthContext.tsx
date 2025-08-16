import { createContext, useContext, useState, useCallback, type FC, type PropsWithChildren, useEffect } from 'react'
import { get, post } from '../server'
import * as U from '../utils'

export type LoggedUser = { email: string; password: string; username?: string }
type Callback = () => void

type ContextType = {
  loggedUser?: LoggedUser
  signup: (email: string, password: string, username: string, callback?: Callback) => void
  login: (email: string, password: string, callback?: Callback) => void
  logout: (callback?: Callback) => void
  loginGoogle: (callback?: Callback) => void
}

export const AuthContext = createContext<ContextType>({
  signup: () => {},
  login: () => {},
  logout: () => {},
  loginGoogle: () => {},
})

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>(undefined)
  const [token, setToken] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const signup = useCallback((email: string, password: string, username: string, callback?: Callback) => {
    const user = { email, password, username }

    post('/auth/register', user)
      .then(res => res.json())
      .then((result: {
        ok: boolean;
        body?: string;
        errorMessage?: string;
      }) => {
        if (result.ok) {
          U.writeStringP('token', result.body ?? '').finally(() => {
            console.log('result.ok')
            setToken(result.body ?? '')
            setLoggedUser(user)
            U.writeObjectP('user', user).finally(() => callback && callback())
          })
        } else {
          setErrorMessage(result.errorMessage ?? '')
          window.alert(result.errorMessage);
        }
      })
      .catch(err => {
        console.error('Signup error:', err)
        setErrorMessage('Signup failed.')
      })
  }, [])

  const login = useCallback((email: string, password: string, callback?: Callback) => {
    const user = { email, password }

    post('/auth/login-local', user)
      .then(res => res.json())
      .then((result: {
        ok: boolean;
        body?: LoggedUser;
        errorMessage?: string;
      }) => {
        if (result.ok && result.body) {
          setLoggedUser(result.body)
          U.writeObjectP('user', result.body).finally(() => callback?.())
        } else {
          throw new Error(result.errorMessage);
        }
      })
      .catch(err => {
        console.error('Login error:', err)
        window.alert(err);
        setErrorMessage('Login failed.')
      })
  }, [])

  const logout = useCallback((callback?: Callback) => {
    setLoggedUser(undefined)
    U.removeKeyP('user') 
    callback?.()
  }, [])

  const loginGoogle = useCallback((callback?: Callback) => {
    get('/auth/check-login')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.ok && data.user) {
          setLoggedUser(data.user);
          U.writeObjectP('user', data.user).finally(() => callback && callback());
        } else {
          throw new Error('login failed');
        }
      })
      .catch(err => {
        console.log(err);
        window.alert(err);
        setErrorMessage('Login failed.');
      });
  }, []);

  const value = {
    loggedUser,
    signup,
    login,
    logout,
    loginGoogle
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

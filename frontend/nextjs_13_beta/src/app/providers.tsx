'use client';

import { MyContext } from './components/mycontext';

const defaultValue = {
  accounts: {}
};

export function Providers({ children }) {
  return (
    <MyContext.Provider value={ defaultValue }>
      {children}
    </MyContext.Provider>
  );
}

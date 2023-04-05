'use client';

import { MyContext } from './mycontext';

const defaultValue = {
  accounts: {}
};

export function Providers({ 
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MyContext.Provider value={ defaultValue }>
      {children}
    </MyContext.Provider>
  );
}

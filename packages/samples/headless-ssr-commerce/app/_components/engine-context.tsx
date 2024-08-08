import {createContext, useState} from 'react';

export const MyContext = createContext({});

export const MyProvider = ({children}: {children: React.ReactNode}) => {
  const [state, setState] = useState(null);

  return (
    <MyContext.Provider value={{state, setState}}>
      {children}
    </MyContext.Provider>
  );
};

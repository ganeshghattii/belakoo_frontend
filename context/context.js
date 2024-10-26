import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [profId, setProfId] = useState();
  
    return (
      <MyContext.Provider value={{ profId, setProfId }}>
        {children}
      </MyContext.Provider>
    );
  };
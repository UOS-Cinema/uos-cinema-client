import { createContext } from 'react';
import React, { useState } from 'react';


export const UserContext = createContext(null);
const UserProvider = ({ children }) => {
    const [user, setUser] = useState({id:null, role:null}); // ex: { id: 1, name: '철수' }
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };
export default UserProvider;

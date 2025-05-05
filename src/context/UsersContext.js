// src/context/UsersContext.js
import React, { createContext, useState } from 'react';

export const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    setUsers(prev => [...prev, user]);
  };
  const updateUser = (index, newUser) => {
    setUsers(prev => prev.map((u, i) => (i === index ? newUser : u)));
  };
  const deleteUser = (index) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

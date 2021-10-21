import { v4 as uuidv4 } from 'uuid';
import { IUser } from './interfaces';

let users: IUser[] = [];

export const findUserById = (id) => users.filter((user) => user.id === id);

export const findUserByLogin = (login) => users.filter((user) => user.login === login);

export const createNewUser = ({ login, password, age }) => {
  const newUser = {
    id: uuidv4(),
    login,
    password,
    age,
    isDeleted: false,
  };

  users.push(newUser);

  return newUser;
};

export const updateUser = ({ id, ...params }) => {
  const updatedUsers = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        ...params,
      };
    }

    return user;
  });

  users = updatedUsers;

  return true;
};

export const deleteUser = (id) => {
  const updatedUsers = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        isDeleted: true,
      };
    }

    return user;
  });

  users = updatedUsers;

  return true;
};

export const getAutoSuggestUsers = (str, limit) => {
  let count = 0;

  return users
    .sort((u1, u2) => (u1.login.toLowerCase() > u2.login.toLowerCase() ? 1 : -1))
    .filter((user) => {
      if (count < limit) {
        if (user.login.toLowerCase().includes(str.toLowerCase()) && !user.isDeleted) {
          count += 1;
          return user;
        }
      }
    });
};

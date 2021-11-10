import { v4 as uuidv4 } from 'uuid';
import { IUser } from './interfaces';

let users: IUser[] = [];

export const findUserById = (id: string) => users.find((user) => user.id === id);

export const findUserByLogin = (login: string) => users.filter((user) => user.login === login);

export const createNewUser = ({ login, password, age }: IUser) => {
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

export const updateUser = ({ id, ...params }: IUser) => {
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

export const deleteUser = (id: string) => {
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

export const getAutoSuggestUsers = (str: string, limit: number) => {
  const filteredUsers = users
    .sort((u1, u2) => (u1.login.toLowerCase() > u2.login.toLowerCase() ? 1 : -1))
    .filter((user) => {
      if (user.login.toLowerCase().includes(str.toLowerCase()) && !user.isDeleted) {
        return user;
      }

      return false;
    });

  const limitedUsers = filteredUsers.slice(0, limit || filteredUsers.length);

  return limitedUsers;
};

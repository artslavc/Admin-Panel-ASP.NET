import { useState } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  banned: boolean;
  role: "user" | "admin";
}

const initialUsers: User[] = [
  {
    id: "1",
    username: "alex",
    email: "alex@example.com",
    banned: false,
    role: "admin",
  },
  {
    id: "2",
    username: "maria",
    email: "maria@example.com",
    banned: false,
    role: "user",
  },
  {
    id: "3",
    username: "john",
    email: "john@example.com",
    banned: true,
    role: "user",
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, banned: !user.banned } : user
      )
    );
  };

  const changeUsername = (userId: string, newUsername: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, username: newUsername } : user
      )
    );
  };

  const changeRole = (userId: string, newRole: "user" | "admin") => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return { users, toggleBan, changeUsername, changeRole };
}
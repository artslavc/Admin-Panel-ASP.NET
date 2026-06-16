import { useState } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  banned: boolean;
}

const initialUsers: User[] = [
  { id: "1", username: "Алексей", email: "aleksey@example.com", banned: false },
  { id: "2", username: "masha2005", email: "masha2005@example.com", banned: true },
  { id: "3", username: "kto", email: "ktototam@example.com", banned: false },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, banned: !user.banned } : user
      )
    );
  };

  const changeUsername = (id: string, newUsername: string) => {
    if (!newUsername.trim()) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, username: newUsername.trim() } : user
      )
    );
  };

  return { users, toggleBan, changeUsername };
}
import { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  login: string;
  role: "admin" | "user";
  status: "active" | "ban";
}

const BASE_API_URL = "http://localhost:5198";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = useCallback(async (silent = false) => {
    const token = getToken();
    if (!token) {
      setError("Не авторизован");
      if (!silent) setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Сессия истекла");
        }
        throw new Error("Ошибка загрузки пользователей");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить пользователей");
    } finally {
      if (!silent) setLoading(false);
      else setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(false);
  }, [fetchUsers]);

  const blockUser = useCallback(async (userId: number) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/users/block/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Не удалось заблокировать");
      await fetchUsers(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [fetchUsers]);

  const unblockUser = useCallback(async (userId: number) => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/users/unblock/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Не удалось разблокировать");
      await fetchUsers(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [fetchUsers]);

  const changeRole = useCallback(async (userId: number, newRole: "admin" | "user") => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Не удалось изменить роль");
      await fetchUsers(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [fetchUsers]);

  return { users, loading, refreshing, error, blockUser, unblockUser, changeRole };
}
"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const { users, loading, error, blockUser, unblockUser, changeRole } = useUsers();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleBlock = async (userId: number) => {
    const success = await blockUser(userId);
    if (success) {
      setNotification({ message: "Пользователь заблокирован", type: "success" });
    } else {
      setNotification({ message: "Не удалось заблокировать пользователя", type: "error" });
    }
  };

  const handleUnblock = async (userId: number) => {
    const success = await unblockUser(userId);
    if (success) {
      setNotification({ message: "Пользователь разблокирован", type: "success" });
    } else {
      setNotification({ message: "Не удалось разблокировать пользователя", type: "error" });
    }
  };

  const handleRoleChange = async (userId: number, newRole: "admin" | "user") => {
    const success = await changeRole(userId, newRole);
    if (success) {
      setNotification({ message: "Роль изменена", type: "success" });
    } else {
      setNotification({ message: "Не удалось изменить роль", type: "error" });
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Загрузка пользователей...</span>
      </div>
    );
  }

  if (error && users.length === 0) {
    return <div className="text-red-600 p-4">Ошибка: {error}</div>;
  }

  const sortedUsers = [...users].sort((a, b) => a.id - b.id);

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Управление пользователями</h1>
      {notification && (
        <div className={`mb-4 p-3 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Логин
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.login}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "ban"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status === "ban" ? "Заблокирован" : "Активен"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as "admin" | "user")
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      user.status === "ban"
                        ? handleUnblock(user.id)
                        : handleBlock(user.id)
                    }
                    className={`${
                      user.status === "ban"
                        ? "text-green-600 hover:text-green-900"
                        : "text-red-600 hover:text-red-900"
                    } hover:cursor-pointer`}
                  >
                    {user.status === "ban" ? "Разблокировать" : "Заблокировать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedUsers.length === 0 && (
          <div className="p-4 text-center text-gray-500">Нет пользователей</div>
        )}
      </div>
    </div>
  );
}
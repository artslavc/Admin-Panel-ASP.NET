"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";

export default function UsersPage() {
  const { users, toggleBan, changeUsername, changeRole } = useUsers();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");

  const handleEditClick = (user: { id: string; username: string }) => {
    setEditingUserId(user.id);
    setNewUsername(user.username);
  };

  const handleSaveUsername = (id: string) => {
    changeUsername(id, newUsername);
    setEditingUserId(null);
    setNewUsername("");
  };

  const handleRoleChange = (userId: string, newRole: "user" | "admin") => {
    changeRole(userId, newRole);
  };

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Управление пользователями</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Имя пользователя
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSaveUsername(user.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <span>{user.username}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.banned
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.banned ? "Заблокирован" : "Активен"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role || "user"}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as "user" | "admin")
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingUserId !== user.id && (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-black hover:text-gray-500 hover:cursor-pointer"
                    >
                      Изменить ник
                    </button>
                  )}
                  <button
                    onClick={() => toggleBan(user.id)}
                    className={`${
                      user.banned
                        ? "ml-[15px] text-green-600 hover:text-green-900 hover:cursor-pointer"
                        : "ml-[15px] text-red-600 hover:text-red-900 hover:cursor-pointer"
                    }`}
                  >
                    {user.banned ? "Разблокировать" : "Заблокировать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-4 text-center text-black">Нет пользователей</div>
        )}
      </div>
    </div>
  );
}
'use client';

import { User } from '@/hooks/useAdmin';

interface UsersTableProps {
  users: User[];
  search: string;
  currentPage: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRoleChange: (id: string, currentRole: string, newRole: string) => void;
  onDeleteClick: (id: string) => void;
  totalPages: number;
}

export const UsersTable = ({
  users,
  search,
  currentPage,
  onSearchChange,
  onPageChange,
  onRoleChange,
  onDeleteClick,
  totalPages,
}: UsersTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold">Пользователи</h2>
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); onPageChange(1); }}
          className="px-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4">Имя / Email</th>
              <th className="p-4">Роль</th>
              <th className="p-4">Задачи</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{user.name || 'Без имени'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-primary' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{user._count?.tasks ?? 0}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user.id, user.role, e.target.value)}
                        className="text-sm border rounded px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        onClick={() => onDeleteClick(user.id)}
                        className="text-primary hover:text-primary/80 p-1 transition-colors cursor-pointer"
                        title="Удалить пользователя"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Пользователи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 flex justify-between items-center border-t border-gray-100">
         <span className="text-sm text-gray-500">Страница {currentPage}</span>
         <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Назад
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};
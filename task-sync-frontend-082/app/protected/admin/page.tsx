'use client';

import { useAdmin } from "@/hooks/useAdmin";
import { AdminHeader } from "@/components/shared/admin-panel/AdminHeader";
import { StatsCards } from "@/components/shared/admin-panel/StatsCards";
import { UsersTable } from "@/components/shared/admin-panel/UsersTable";
import { DeleteConfirmDialog } from "@/components/shared/admin-panel/DeleteConfirmDialog";
import { RoleChangeDialog } from "@/components/shared/admin-panel/RoleChangeDialog";

export default function AdminPage() {
  const {
    loading,
    stats,
    users,
    search,
    currentPage,
    userToDelete,
    roleChange,
    setSearch,
    setCurrentPage,
    setUserToDelete,
    setRoleChange,
    handleDeleteUser,
    handleRoleUpdate,
    goBack,
  } = useAdmin();

  const handleRoleChangeSelect = (id: string, currentRole: string, newRole: string) => {
    setRoleChange({ id, currentRole, newRole });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-7xl mx-auto w-full">
        
        <AdminHeader onBack={goBack} />

        {stats && <StatsCards stats={stats} />}

        <UsersTable
          users={users}
          search={search}
          currentPage={currentPage}
          onSearchChange={setSearch}
          onPageChange={setCurrentPage}
          onRoleChange={handleRoleChangeSelect} 
          onDeleteClick={setUserToDelete}
          totalPages={Math.ceil((stats?.users.total || 0) / 10)}
        />
      </div>

      <DeleteConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />

      {roleChange && (
        <RoleChangeDialog
          open={!!roleChange}
          onOpenChange={(open) => !open && setRoleChange(null)}
          onConfirm={handleRoleUpdate}
          currentRole={roleChange.currentRole}
          newRole={roleChange.newRole}
        />
      )}
    </div>
  );
}
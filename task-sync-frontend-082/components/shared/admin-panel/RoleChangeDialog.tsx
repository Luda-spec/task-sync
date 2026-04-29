'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentRole: string;
  newRole: string;
}

export const RoleChangeDialog = ({ open, onOpenChange, onConfirm, currentRole, newRole }: RoleChangeDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Изменить роль?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь изменить роль пользователя с <b>{currentRole}</b> на <b>{newRole}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)} className="cursor-pointer">Отмена</AlertDialogCancel>
          <AlertDialogAction className="rounded-lg cursor-pointer" onClick={onConfirm}>Подтвердить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
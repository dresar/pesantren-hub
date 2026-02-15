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
import { useAppStore } from '@/stores/app-store';
export function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useAppStore();
  const handleConfirm = () => {
    confirmDialog.onConfirm();
    hideConfirm();
  };
  const handleCancel = () => {
    confirmDialog.onCancel?.();
    hideConfirm();
  };
  return (
    <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && hideConfirm()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={confirmDialog.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
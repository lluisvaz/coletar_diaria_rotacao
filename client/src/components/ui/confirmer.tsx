import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function Confirmer({
  open,
  onOpenChange,
  onConfirm,
  title = "Tem certeza?",
  description = "Esta ação não pode ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmerProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirmer() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title?: string;
    description?: string;
    onConfirm: () => void;
  }>({
    onConfirm: () => {},
  });

  const confirm = (
    onConfirm: () => void,
    options?: { title?: string; description?: string }
  ) => {
    setConfig({
      onConfirm,
      title: options?.title,
      description: options?.description,
    });
    setOpen(true);
  };

  const handleConfirm = () => {
    config.onConfirm();
    setOpen(false);
  };

  return {
    confirm,
    ConfirmerDialog: (
      <Confirmer
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title={config.title}
        description={config.description}
      />
    ),
  };
}

import React, { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  Overlay,
  DialogContainer,
  DialogHeader,
  DialogIcon,
  DialogTitle,
  DialogMessage,
  DialogActions,
  Button,
} from "./styled";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title = "Confirmar Exclusão",
  message,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps): JSX.Element | null {
  // Handle ESC key to close dialog
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <DialogContainer>
        <DialogHeader>
          <DialogIcon>
            <FaExclamationTriangle />
          </DialogIcon>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogMessage>{message}</DialogMessage>
        <DialogActions>
          <Button onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Excluindo..." : confirmText}
          </Button>
        </DialogActions>
      </DialogContainer>
    </Overlay>
  );
}

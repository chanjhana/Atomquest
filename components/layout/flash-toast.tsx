"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function FlashToast({ success, error }: { success?: string; error?: string }) {
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, []);
  return null;
}

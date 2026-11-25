
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AlertCircle, Check, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastData = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({
        id: Date.now(),
        message,
        type,
      });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const styles = {
    success: {
      icon: <Check size={21} />,
      iconStyle: "bg-[#F0F5ED] text-[#66805D]",
      title: "Success",
    },
    error: {
      icon: <AlertCircle size={21} />,
      iconStyle: "bg-red-50 text-red-600",
      title: "Something went wrong",
    },
    info: {
      icon: <Info size={21} />,
      iconStyle: "bg-[#F5EEE8] text-[#79563E]",
      title: "Information",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed right-4 top-5 z-[9999] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-[0_12px_40px_rgba(60,40,20,0.12)] animate-in slide-in-from-top-3 fade-in duration-300"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles[toast.type].iconStyle}`}
          >
            {styles[toast.type].icon}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#292723]">
              {styles[toast.type].title}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#82776D]">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
            className="rounded-lg p-1 text-[#A0968D] transition hover:bg-[#F8F3EE] hover:text-[#79563E]"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

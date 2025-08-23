import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'success';
}

export const Toast = ({
  message,
  isVisible,
  onClose,
  type = 'error',
}: ToastProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const startTime = Date.now();
      const duration = 1800;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
          requestAnimationFrame(updateProgress);
        } else {
          onClose();
        }
      };

      requestAnimationFrame(updateProgress);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'rounded-[4px] bg-neutral-100 text-neutral-10 shadow-lg';
      case 'success':
        return 'rounded-[4px] bg-neutral-100 text-neutral-10 shadow-lg';
      default:
        return 'rounded-[4px] bg-neutral-100 text-neutral-10 shadow-lg';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'error':
        return 'bg-error';
      case 'success':
        return 'bg-primary-100';
      default:
        return 'bg-secondary-100';
    }
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 z-[9999] -translate-x-1/2 transform px-4 transition-all duration-500 ease-out ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-8 scale-95 opacity-0'
      }`}
    >
      <div
        className={`relative w-full max-w-[90vw] rounded-sm px-4 py-3 text-center shadow-xl md:min-w-[500px] md:max-w-[700px] md:px-6 md:py-4 ${getToastStyles()}`}
      >
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-t-lg bg-neutral-80">
          <div
            className={`h-full ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-xs text-neutral-40 transition-colors hover:text-neutral-60 md:right-4 md:top-3"
        >
          ✕
        </button>
        <span className="text-xs font-medium md:text-sm">{message}</span>
      </div>
    </div>
  );
};

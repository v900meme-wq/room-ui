import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        function handleOnline() {
            setIsOnline(true);
            toast.success('Đã kết nối internet', { duration: 2000 });
        }

        function handleOffline() {
            setIsOnline(false);
            toast.warning('Mất kết nối internet. Một số tính năng có thể không hoạt động.', {
                duration: 5000,
            });
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
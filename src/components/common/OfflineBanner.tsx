import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineBanner() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="bg-yellow-50 border-b border-yellow-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">
                            Bạn đang offline
                        </p>
                        <p className="text-xs text-yellow-600">
                            Vui lòng bật mạng để đồng bộ dữ liệu mới nhất
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
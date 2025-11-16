import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
    '/dashboard': 'Trang chủ',
    '/houses': 'Nhà trọ',
    '/rooms': 'Phòng trọ',
    '/payments': 'Hóa đơn',
};

export function Header() {
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || 'Room Management';

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex-1 pl-12 md:pl-0">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                    {pageTitle}
                </h2>
            </div>
        </header>
    );
}
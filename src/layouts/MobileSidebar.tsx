import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Building2, DoorOpen, Receipt, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Trang chủ' },
        { to: '/houses', icon: Building2, label: 'Nhà trọ' },
        { to: '/rooms', icon: DoorOpen, label: 'Phòng trọ' },
        { to: '/payments', icon: Receipt, label: 'Hóa đơn' },
    ];

    const handleLogout = () => {
        clearAuth();
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-bold text-primary-600">Room Mng</h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-600">
                                {user?.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500">Người dùng</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </>
    );
}
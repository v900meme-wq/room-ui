import { NavLink } from 'react-router-dom';
import { Home, Building2, DoorOpen, Receipt, Tag, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

export function Sidebar() {
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Trang chủ' },
        { to: '/houses', icon: Building2, label: 'Nhà trọ' },
        { to: '/rooms', icon: DoorOpen, label: 'Phòng trọ' },
        { to: '/payments', icon: Receipt, label: 'Hóa đơn' },
        { to: '/prices', icon: Tag, label: 'Mẫu giá' },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-primary-600">V Room</h1>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
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
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
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
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={clearAuth}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}
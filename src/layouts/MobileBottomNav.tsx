import { NavLink } from 'react-router-dom';
import { Home, Building2, DoorOpen, Receipt } from 'lucide-react';
import { cn } from '../utils/cn';

export function MobileBottomNav() {
    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Trang chủ' },
        { to: '/houses', icon: Building2, label: 'Nhà' },
        { to: '/rooms', icon: DoorOpen, label: 'Phòng' },
        { to: '/payments', icon: Receipt, label: 'Hóa đơn' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0',
                                isActive
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
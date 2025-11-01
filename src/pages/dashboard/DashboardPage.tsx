import { useQuery } from '@tanstack/react-query';
import {
    Home,
    Building2,
    DoorOpen,
    Receipt,
    TrendingUp,
    Users,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services/admin.service';
import { houseService } from '../../services/house.service';
import { roomService } from '../../services/room.service';
import { paymentService } from '../../services/payment.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface StatCardProps {
    icon: typeof Home;
    label: string;
    value: string | number;
    trend?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning';
}

function StatCard({ icon: Icon, label, value, trend, variant = 'default' }: StatCardProps) {
    const variantClasses = {
        default: 'bg-gray-50 text-gray-600',
        primary: 'bg-primary-50 text-primary-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={cn('p-3 rounded-lg', variantClasses[variant])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

// Admin Dashboard
function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: () => adminService.getDashboard(),
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!stats) {
        return <div>Không có dữ liệu</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    icon={Users}
                    label="Tổng người dùng"
                    value={stats.overview.totalUsers}
                    variant="primary"
                />
                <StatCard
                    icon={Building2}
                    label="Tổng nhà trọ"
                    value={stats.overview.totalHouses}
                    variant="default"
                />
                <StatCard
                    icon={DoorOpen}
                    label="Tổng phòng"
                    value={stats.overview.totalRooms}
                    variant="default"
                />
                <StatCard
                    icon={Receipt}
                    label="Hóa đơn tháng này"
                    value={stats.overview.totalPayments}
                    variant="success"
                />
            </div>

            {/* Revenue & Occupancy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Doanh thu</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Tổng doanh thu</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(stats.revenue.totalRevenue)}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-600"
                                    style={{
                                        width: `${(stats.revenue.paidRevenue / stats.revenue.totalRevenue) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-gray-600">Đã thanh toán</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(stats.revenue.paidRevenue)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Chưa thanh toán</p>
                                <p className="text-lg font-semibold text-yellow-600">
                                    {formatCurrency(stats.revenue.unpaidRevenue)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Tỷ lệ lấp đầy</h3>
                    <div className="flex items-center justify-center h-32">
                        <div className="relative w-32 h-32">
                            <svg className="transform -rotate-90 w-32 h-32">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.overview.occupancyRate / 100)}`}
                                    className="text-primary-600"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">
                                    {stats.overview.occupancyRate}%
                                </span>
                                <span className="text-xs text-gray-600">Đang thuê</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                        <div>
                            <p className="text-sm text-gray-600">Đang thuê</p>
                            <p className="text-lg font-semibold text-green-600">
                                {stats.overview.occupiedRooms} phòng
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Còn trống</p>
                            <p className="text-lg font-semibold text-gray-600">
                                {stats.overview.availableRooms} phòng
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unpaid Payments */}
            {stats.unpaidPayments.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Hóa đơn chưa thanh toán ({stats.unpaidPayments.length})
                    </h3>
                    <div className="space-y-3">
                        {stats.unpaidPayments.slice(0, 5).map((payment) => (
                            <div
                                key={payment.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-yellow-50 rounded-lg gap-2"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {payment.room?.roomName} - {payment.room?.house?.address}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Tháng {payment.month}/{payment.year} - {payment.room?.renter}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-yellow-600">
                                        {formatCurrency(payment.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// User Dashboard
function UserDashboard() {
    const { data: houses, isLoading: housesLoading } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    const { data: rooms, isLoading: roomsLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getAll(),
    });

    const { data: payments, isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments'],
        queryFn: () => paymentService.getAll(),
    });

    const isLoading = housesLoading || roomsLoading || paymentsLoading;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const totalHouses = houses?.length || 0;
    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter((r) => r.status === 'rented').length || 0;
    const unpaidPayments = payments?.filter((p) => p.status === 'unpaid') || [];

    const totalRevenue = payments?.reduce((sum, p) => sum + p.totalAmount, 0) || 0;
    const paidRevenue = payments
        ?.filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + p.totalAmount, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Tổng quan quản lý của bạn</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    icon={Building2}
                    label="Nhà trọ"
                    value={totalHouses}
                    variant="primary"
                />
                <StatCard
                    icon={DoorOpen}
                    label="Tổng phòng"
                    value={totalRooms}
                    variant="default"
                />
                <StatCard
                    icon={Home}
                    label="Đang thuê"
                    value={occupiedRooms}
                    variant="success"
                />
                <StatCard
                    icon={Receipt}
                    label="Chưa thanh toán"
                    value={unpaidPayments.length}
                    variant="warning"
                />
            </div>

            {/* Revenue */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Doanh thu</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Tổng doanh thu</span>
                            <span className="text-xl font-bold text-gray-900">
                                {formatCurrency(totalRevenue)}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600"
                                style={{
                                    width: totalRevenue > 0 ? `${(paidRevenue / totalRevenue) * 100}%` : '0%',
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <p className="text-sm text-gray-600">Đã thanh toán</p>
                            <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(paidRevenue)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Chưa thanh toán</p>
                            <p className="text-lg font-semibold text-yellow-600">
                                {formatCurrency(totalRevenue - paidRevenue)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unpaid Payments */}
            {unpaidPayments.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Cần thanh toán ({unpaidPayments.length})
                    </h3>
                    <div className="space-y-3">
                        {unpaidPayments.slice(0, 5).map((payment) => (
                            <div
                                key={payment.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-yellow-50 rounded-lg gap-2"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{payment.room?.roomName}</p>
                                    <p className="text-sm text-gray-600">
                                        Tháng {payment.month}/{payment.year}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-yellow-600">
                                        {formatCurrency(payment.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Main Component
export function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return user?.isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
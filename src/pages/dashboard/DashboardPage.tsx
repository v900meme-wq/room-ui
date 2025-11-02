import { useQuery } from '@tanstack/react-query';
import {
    Home,
    Building2,
    DoorOpen,
    Receipt,
    AlertCircle
} from 'lucide-react';
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
    variant?: 'default' | 'primary' | 'success' | 'warning';
}

function StatCard({ icon: Icon, label, value, variant = 'default' }: StatCardProps) {
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
                </div>
                <div className={cn('p-3 rounded-lg', variantClasses[variant])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

export function DashboardPage() {
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
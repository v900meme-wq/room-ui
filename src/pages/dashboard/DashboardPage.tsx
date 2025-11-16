import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Home,
    Building2,
    DoorOpen,
    Receipt,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    User,
    Phone,
    MapPin,
    Calendar,
    Zap,
    Droplet
} from 'lucide-react';
import { houseService } from '../../services/house.service';
import { roomService } from '../../services/room.service';
import { paymentService } from '../../services/payment.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, getCurrentMonth, getCurrentYear, getMonthName, formatPhoneNumber } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { MonthlyPayment, Room } from '../../types';

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

// Modal xem chi tiết hóa đơn
interface PaymentDetailModalProps {
    payment: MonthlyPayment;
    onClose: () => void;
}

function PaymentDetailModal({ payment, onClose }: PaymentDetailModalProps) {
    const electUsage = payment.electEnd - payment.electStart;
    const waterUsage = payment.waterEnd - payment.waterStart;
    const electCost = electUsage * payment.electPrice;
    const waterCost = waterUsage * payment.waterPrice;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Chi tiết hóa đơn</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tháng {payment.month}/{payment.year}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Room Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary-600" />
                            Thông tin phòng
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phòng:</span>
                                <span className="font-medium">{payment.room?.roomName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Địa chỉ:</span>
                                <span className="font-medium text-right">{payment.room?.house?.address}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-600">Người thuê:</span>
                                <div className="text-right">
                                    <p className="font-medium flex items-center gap-2 justify-end">
                                        <User className="w-4 h-4" />
                                        {payment.room?.renter}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 justify-end mt-1">
                                        <Phone className="w-4 h-4" />
                                        {payment.room?.phone && formatPhoneNumber(payment.room.phone)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Trạng thái:</span>
                                <StatusBadge status={payment.status} />
                            </div>
                        </div>
                    </div>

                    {/* Usage Details */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            Chi tiết tiêu thụ
                        </h3>

                        {/* Electric */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-yellow-600" />
                                <h4 className="font-medium text-yellow-900">Điện</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Chỉ số đầu:</span>
                                    <span className="font-medium">{payment.electStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Chỉ số cuối:</span>
                                    <span className="font-medium">{payment.electEnd}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-yellow-200">
                                    <span className="text-yellow-700">Tiêu thụ:</span>
                                    <span className="font-semibold">{electUsage} số × {formatCurrency(payment.electPrice)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-yellow-900 font-medium">Thành tiền:</span>
                                    <span className="font-bold text-yellow-900">{formatCurrency(electCost)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Water */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Droplet className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-900">Nước</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Chỉ số đầu:</span>
                                    <span className="font-medium">{payment.waterStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Chỉ số cuối:</span>
                                    <span className="font-medium">{payment.waterEnd}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                    <span className="text-blue-700">Tiêu thụ:</span>
                                    <span className="font-semibold">{waterUsage} số × {formatCurrency(payment.waterPrice)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-blue-900 font-medium">Thành tiền:</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(waterCost)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Chi phí khác</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tiền phòng:</span>
                                <span className="font-medium">{formatCurrency(payment.roomPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí rác:</span>
                                <span className="font-medium">{formatCurrency(payment.trashFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Máy giặt:</span>
                                <span className="font-medium">{formatCurrency(payment.washingMachineFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thang máy:</span>
                                <span className="font-medium">{formatCurrency(payment.elevatorFee)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600 mb-1">Tổng cộng</p>
                                <p className="text-3xl md:text-4xl font-bold text-yellow-900">
                                    {formatCurrency(payment.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    {payment.note && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Ghi chú:</p>
                            <p className="text-sm text-gray-600">{payment.note}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-white flex gap-3 p-6 border-t border-gray-200 rounded-b-xl">
                    <button onClick={onClose} className="flex-1 btn btn-primary">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal xem chi tiết phòng trống
interface RoomDetailModalProps {
    room: Room;
    onClose: () => void;
}

function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{room.roomName}</h2>
                        <p className="text-sm text-gray-600 mt-1">{room.house?.address}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <StatusBadge status={room.status} />
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary-600" />
                            Thông tin cơ bản
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Diện tích:</span>
                                <span className="font-medium">{room.area} m²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Người thuê:</span>
                                <span className="font-medium">{room.renter}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số điện thoại:</span>
                                <span className="font-medium">{formatPhoneNumber(room.phone)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tiền cọc:</span>
                                <span className="font-medium">{formatCurrency(room.deposit)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Bảng giá</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                <p className="text-xs text-primary-600 mb-1">Tiền phòng</p>
                                <p className="text-lg font-bold text-primary-900">
                                    {formatCurrency(room.roomPrice)}
                                </p>
                                <p className="text-xs text-primary-600">/ tháng</p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-xs text-yellow-600 mb-1">Tiền điện</p>
                                <p className="text-lg font-bold text-yellow-900">
                                    {formatCurrency(room.electPrice)}
                                </p>
                                <p className="text-xs text-yellow-600">/ số</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-xs text-blue-600 mb-1">Tiền nước</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {formatCurrency(room.waterPrice)}
                                </p>
                                <p className="text-xs text-blue-600">/ số</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Phí rác</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.trashFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Máy giặt</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.washingMachineFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Thang máy</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.elevatorFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            Địa chỉ
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900">{room.house?.address}</p>
                        </div>
                    </div>

                    {/* Note */}
                    {room.note && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Ghi chú</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">{room.note}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-white flex gap-3 p-6 border-t border-gray-200 rounded-b-xl">
                    <button onClick={onClose} className="flex-1 btn btn-primary">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export function DashboardPage() {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const [availableRoomsPage, setAvailableRoomsPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<MonthlyPayment | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const ROOMS_PER_PAGE = 6;

    const { data: houses, isLoading: housesLoading } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    const { data: rooms, isLoading: roomsLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getRoomsByUser(),
    });

    const { data: payments, isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments', selectedMonth, selectedYear],
        queryFn: () => paymentService.getAll({
            month: selectedMonth,
            year: selectedYear,
        }),
    });

    const isLoading = housesLoading || roomsLoading || paymentsLoading;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const totalHouses = houses?.length || 0;
    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter((r) => r.status === 'rented').length || 0;
    const availableRooms = rooms?.filter((r) => r.status === 'available') || [];
    const unpaidPayments = payments?.filter((p) => p.status === 'unpaid') || [];

    const totalRevenue = payments?.reduce((sum, p) => sum + p.totalAmount, 0) || 0;
    const paidRevenue = payments
        ?.filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + p.totalAmount, 0) || 0;

    // Pagination for available rooms
    const totalAvailablePages = Math.ceil(availableRooms.length / ROOMS_PER_PAGE);
    const paginatedAvailableRooms = availableRooms.slice(
        (availableRoomsPage - 1) * ROOMS_PER_PAGE,
        availableRoomsPage * ROOMS_PER_PAGE
    );

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Trang chủ</h1>
                <p className="text-gray-600 mt-1">Tổng quan quản lý của bạn</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Doanh thu tháng {selectedMonth}/{selectedYear}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600 min-w-[100px] text-center">
                            {getMonthName(selectedMonth)} {selectedYear}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
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
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-yellow-50 rounded-lg gap-2 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedPayment(payment)}
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{payment.room?.roomName}</p>
                                    <p className="text-sm text-gray-600">
                                        Tháng {payment.month}/{payment.year}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-yellow-600">
                                        {formatCurrency(payment.totalAmount)}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPayment(payment);
                                        }}
                                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4 text-yellow-700" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Rooms */}
            {availableRooms.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <DoorOpen className="w-5 h-5 text-blue-600" />
                            Phòng trống ({availableRooms.length})
                        </h3>
                        {totalAvailablePages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setAvailableRoomsPage(Math.max(1, availableRoomsPage - 1))}
                                    disabled={availableRoomsPage === 1}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm text-gray-600">
                                    {availableRoomsPage} / {totalAvailablePages}
                                </span>
                                <button
                                    onClick={() => setAvailableRoomsPage(Math.min(totalAvailablePages, availableRoomsPage + 1))}
                                    disabled={availableRoomsPage === totalAvailablePages}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {paginatedAvailableRooms.map((room) => (
                            <div
                                key={room.id}
                                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedRoom(room)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{room.roomName}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{room.house?.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={room.status} />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRoom(room);
                                            }}
                                            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4 text-blue-700" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Diện tích:</span>
                                        <span className="font-medium">{room.area} m²</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giá phòng:</span>
                                        <span className="font-semibold text-primary-600">
                                            {formatCurrency(room.roomPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            {selectedPayment && (
                <PaymentDetailModal
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}

            {selectedRoom && (
                <RoomDetailModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </div>
    );
}
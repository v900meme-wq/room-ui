import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Receipt, Edit, Trash2, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { MonthlyPayment } from '../../types';
import { paymentService } from '../../services/payment.service';
import { roomService } from '../../services/room.service';
import { houseService } from '../../services/house.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentModal } from './PaymentModal';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { formatCurrency, getMonthName, getCurrentYear } from '../../utils/format';
import { PaymentDetailModal } from './PaymentDetailModal';

export function PaymentsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [viewingPayment, setViewingPayment] = useState<MonthlyPayment | null>(null);

    const [filters, setFilters] = useState({
        houseId: undefined as number | undefined,
        roomId: undefined as number | undefined,
        month: undefined as number | undefined,  // ← Đổi thành undefined
        year: getCurrentYear() as number | undefined,
        status: undefined as string | undefined,
    });

    const isOnline = useOnlineStatus();
    const queryClient = useQueryClient();

    // Fetch houses
    const { data: houses } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    // Fetch rooms by house
    const { data: rooms } = useQuery({
        queryKey: ['rooms', filters.houseId],
        queryFn: () => roomService.getAll(filters.houseId),
        enabled: !!filters.houseId,
    });

    // Fetch payments
    const { data: payments, isLoading } = useQuery({
        queryKey: ['payments', filters],
        queryFn: () => paymentService.getAll({
            roomId: filters.roomId,
            month: filters.month,
            year: filters.year,
            status: filters.status,
        }),
    });

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: (data: { id?: number; values: Partial<MonthlyPayment> }) =>
            data.id
                ? paymentService.update(data.id, data.values)
                : paymentService.create(data.values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['recent-payments'] }); // ← Invalidate recent data
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
            toast.success(editingPayment ? 'Cập nhật thành công!' : 'Tạo hóa đơn thành công!');
            setIsModalOpen(false);
            setEditingPayment(null);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => paymentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['recent-payments'] }); // ← Invalidate recent data
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
            toast.success('Xóa thành công!');
            setDeletingId(null);
        },
    });

    const handleCreate = () => {
        setEditingPayment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (payment: MonthlyPayment) => {
        setEditingPayment(payment);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) return;
        setDeletingId(id);
        deleteMutation.mutate(id);
    };

    const handleSubmit = (values: Partial<MonthlyPayment>) => {
        // Remove roomId when updating (cannot change room)
        if (editingPayment) {
            const { roomId, ...updateValues } = values;
            saveMutation.mutate({
                id: editingPayment.id,
                values: updateValues,
            });
        } else {
            saveMutation.mutate({
                values,
            });
        }
    };

    const handleView = (payment: MonthlyPayment) => {
        setViewingPayment(payment);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý hóa đơn</h1>
                    <p className="text-gray-600 mt-1">
                        {payments?.length || 0} hóa đơn
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={!isOnline}
                    className="btn btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tạo hóa đơn</span>
                    <span className="sm:hidden">Tạo</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* House Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Nhà trọ
                        </label>
                        <select
                            value={filters.houseId || ''}
                            onChange={(e) => {
                                const houseId = e.target.value ? Number(e.target.value) : undefined;
                                setFilters({ ...filters, houseId, roomId: undefined });
                            }}
                            className="input w-full text-sm"
                        >
                            <option value="">Tất cả</option>
                            {houses?.map((house) => (
                                <option key={house.id} value={house.id}>
                                    {house.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Room Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Phòng
                        </label>
                        <select
                            value={filters.roomId || ''}
                            onChange={(e) => setFilters({ ...filters, roomId: e.target.value ? Number(e.target.value) : undefined })}
                            className="input w-full text-sm"
                            disabled={!filters.houseId}
                        >
                            <option value="">Tất cả</option>
                            {rooms?.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.roomName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Tháng
                        </label>
                        <select
                            value={filters.month || ''}
                            onChange={(e) => setFilters({ ...filters, month: e.target.value ? Number(e.target.value) : undefined })}
                            className="input w-full text-sm"
                        >
                            <option value="">Tất cả</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month}>
                                    {getMonthName(month)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Năm
                        </label>
                        <select
                            value={filters.year || ''}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : undefined })}
                            className="input w-full text-sm"
                        >
                            <option value="">Tất cả</option>
                            {Array.from({ length: 3 }, (_, i) => getCurrentYear() - 1 + i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                            className="input w-full text-sm"
                        >
                            <option value="">Tất cả</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingSpinner />
            ) : !payments || payments.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="Chưa có hóa đơn"
                    description="Bắt đầu bằng cách tạo hóa đơn đầu tiên"
                    action={
                        <button onClick={handleCreate} className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Tạo hóa đơn
                        </button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="card bg-primary-50 border-primary-200">
                            <p className="text-sm text-primary-600 mb-1">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-primary-900">
                                {formatCurrency(payments.reduce((sum, p) => sum + p.totalAmount, 0))}
                            </p>
                        </div>
                        <div className="card bg-green-50 border-green-200">
                            <p className="text-sm text-green-600 mb-1">Đã thanh toán</p>
                            <p className="text-2xl font-bold text-green-900">
                                {formatCurrency(
                                    payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalAmount, 0)
                                )}
                            </p>
                        </div>
                        <div className="card bg-yellow-50 border-yellow-200">
                            <p className="text-sm text-yellow-600 mb-1">Chưa thanh toán</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {formatCurrency(
                                    payments.filter(p => p.status === 'unpaid').reduce((sum, p) => sum + p.totalAmount, 0)
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Payments List */}
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="card hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900">
                                                    {payment.room?.roomName} - {payment.room?.house?.address}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {payment.room?.renter}
                                                </p>
                                            </div>
                                            <StatusBadge status={payment.status} />
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Tháng {payment.month}/{payment.year}</span>
                                            </div>
                                            <span>Điện: {payment.electStart} → {payment.electEnd} ({payment.electEnd - payment.electStart} số)</span>
                                            <span>Nước: {payment.waterStart} → {payment.waterEnd} ({payment.waterEnd - payment.waterStart} số)</span>
                                        </div>
                                    </div>

                                    {/* Amount & Actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                            <p className="text-xl font-bold text-primary-600">
                                                {formatCurrency(payment.totalAmount)}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(payment)}
                                                className="btn btn-secondary text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(payment)}
                                                disabled={!isOnline}
                                                className="btn btn-secondary text-sm"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(payment.id)}
                                                disabled={!isOnline || deletingId === payment.id}
                                                className="btn btn-danger text-sm"
                                            >
                                                {deletingId === payment.id ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <PaymentModal
                    payment={editingPayment}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingPayment(null);
                    }}
                    onSubmit={handleSubmit}
                    isLoading={saveMutation.isPending}
                />
            )}

            {/* Detail Modal */}
            {viewingPayment && (
                <PaymentDetailModal
                    payment={viewingPayment}
                    onClose={() => setViewingPayment(null)}
                    onEdit={() => {
                        setEditingPayment(viewingPayment);
                        setViewingPayment(null);
                        setIsModalOpen(true);
                    }}
                />
            )}
        </div>
    );
}

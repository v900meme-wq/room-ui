import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { priceService, type Price } from '../../services/price.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { PriceModal } from './PriceModal';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { formatCurrency } from '../../utils/format';

export function PricesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrice, setEditingPrice] = useState<Price | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const isOnline = useOnlineStatus();
    const queryClient = useQueryClient();

    // Fetch prices
    const { data: prices, isLoading } = useQuery({
        queryKey: ['prices'],
        queryFn: () => priceService.getAll(),
    });

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: (data: { id?: number; values: Partial<Price> }) =>
            data.id
                ? priceService.update(data.id, data.values)
                : priceService.create(data.values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            toast.success(editingPrice ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            setIsModalOpen(false);
            setEditingPrice(null);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => priceService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            toast.success('Xóa thành công!');
            setDeletingId(null);
        },
    });

    const handleCreate = () => {
        setEditingPrice(null);
        setIsModalOpen(true);
    };

    const handleEdit = (price: Price) => {
        setEditingPrice(price);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa mẫu giá này?')) return;
        setDeletingId(id);
        deleteMutation.mutate(id);
    };

    const handleSubmit = (values: Partial<Price>) => {
        saveMutation.mutate({
            id: editingPrice?.id,
            values,
        });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý mẫu giá</h1>
                    <p className="text-gray-600 mt-1">
                        {prices?.length || 0} mẫu giá
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={!isOnline}
                    className="btn btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Thêm mẫu giá</span>
                    <span className="sm:hidden">Thêm</span>
                </button>
            </div>

            {/* Prices Grid */}
            {!prices || prices.length === 0 ? (
                <EmptyState
                    icon={Tag}
                    title="Chưa có mẫu giá"
                    description="Tạo mẫu giá để dễ dàng áp dụng cho nhiều phòng"
                    action={
                        <button onClick={handleCreate} className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Thêm mẫu giá
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {prices.map((price) => (
                        <div key={price.id} className="card hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                                        <Tag className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {price.priceName}
                                        </h3>
                                        <p className="text-sm text-gray-500">Mẫu giá</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="space-y-3">
                                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                                    <p className="text-xs text-primary-600 mb-1">Tiền phòng</p>
                                    <p className="text-xl font-bold text-primary-900">
                                        {formatCurrency(price.roomPrice)}
                                    </p>
                                    <p className="text-xs text-primary-600">/ tháng</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Điện</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.electPrice)}/số
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Nước</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.waterPrice)}/số
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Rác</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.trashFee)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Gửi xe</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.parkingFee)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Máy giặt</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.washingMachineFee)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Thang máy</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.elevatorFee)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs">Cọc</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(price.deposit)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(price)}
                                    disabled={!isOnline}
                                    className="flex-1 btn btn-secondary text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(price.id)}
                                    disabled={!isOnline || deletingId === price.id}
                                    className="flex-1 btn btn-danger text-sm"
                                >
                                    {deletingId === price.id ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Xóa
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <PriceModal
                    price={editingPrice}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingPrice(null);
                    }}
                    onSubmit={handleSubmit}
                    isLoading={saveMutation.isPending}
                />
            )}
        </div>
    );
}
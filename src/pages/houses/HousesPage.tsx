import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, Edit, Trash2, Home, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { House } from '../../types';
import { houseService } from '../../services/house.service';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { HouseModal } from './HouseModal';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function HousesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHouse, setEditingHouse] = useState<House | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const user = useAuthStore((state) => state.user);
    const isOnline = useOnlineStatus();
    const queryClient = useQueryClient();

    // Fetch houses
    const { data: houses, isLoading } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: (data: { id?: number; values: Partial<House> }) =>
            data.id
                ? houseService.update(data.id, data.values)
                : houseService.create(data.values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
            toast.success(editingHouse ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            setIsModalOpen(false);
            setEditingHouse(null);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => houseService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
            toast.success('Xóa thành công!');
            setDeletingId(null);
        },
    });

    const handleCreate = () => {
        setEditingHouse(null);
        setIsModalOpen(true);
    };

    const handleEdit = (house: House) => {
        setEditingHouse(house);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhà trọ này?')) return;
        setDeletingId(id);
        deleteMutation.mutate(id);
    };

    const handleSubmit = (values: Partial<House>) => {
        saveMutation.mutate({
            id: editingHouse?.id,
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý nhà trọ</h1>
                    <p className="text-gray-600 mt-1">
                        {houses?.length || 0} nhà trọ
                        {user?.roomLimit && ` (Giới hạn: ${user.roomLimit} phòng)`}
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={!isOnline}
                    className="btn btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Thêm nhà trọ</span>
                    <span className="sm:hidden">Thêm</span>
                </button>
            </div>

            {/* Houses Grid */}
            {!houses || houses.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    title="Chưa có nhà trọ"
                    description="Bắt đầu bằng cách thêm nhà trọ đầu tiên của bạn"
                    action={
                        <button onClick={handleCreate} className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Thêm nhà trọ
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {houses.map((house) => (
                        <div key={house.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {house.address}
                                        </h3>
                                        {user?.isAdmin && house.user && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Chủ: {house.user.username}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-2">{house.note}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Home className="w-4 h-4" />
                                    <span>{house._count?.rooms || 0} phòng</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(house)}
                                    disabled={!isOnline}
                                    className="flex-1 btn btn-secondary text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(house.id)}
                                    disabled={!isOnline || deletingId === house.id}
                                    className="flex-1 btn btn-danger text-sm"
                                >
                                    {deletingId === house.id ? (
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
                <HouseModal
                    house={editingHouse}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingHouse(null);
                    }}
                    onSubmit={handleSubmit}
                    isLoading={saveMutation.isPending}
                />
            )}
        </div>
    );
}
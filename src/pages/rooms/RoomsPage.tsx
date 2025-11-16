import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, DoorOpen, Edit, Trash2, Filter, User, Phone, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Room } from '../../types';
import { roomService } from '../../services/room.service';
import { houseService } from '../../services/house.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RoomModal } from './RoomModal';
import { RoomDetailModal } from './RoomDetailModal';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { formatCurrency, formatPhoneNumber } from '../../utils/format';

export function RoomsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedHouseId, setSelectedHouseId] = useState<number | undefined>();
    const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

    const isOnline = useOnlineStatus();
    const queryClient = useQueryClient();

    // Fetch houses for filter
    const { data: houses } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    // Fetch rooms
    const { data: rooms, isLoading } = useQuery({
        queryKey: ['rooms', selectedHouseId],
        queryFn: () => roomService.getAll(selectedHouseId),
        enabled: !!selectedHouseId,
    });

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: (data: { id?: number; values: Partial<Room> }) =>
            data.id
                ? roomService.update(data.id, data.values)
                : roomService.create(data.values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['houses'] });
            toast.success(editingRoom ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            setIsModalOpen(false);
            setEditingRoom(null);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => roomService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['houses'] });
            toast.success('Xóa thành công!');
            setDeletingId(null);
        },
    });

    const handleCreate = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    };

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa phòng này?')) return;
        setDeletingId(id);
        deleteMutation.mutate(id);
    };

    const handleSubmit = (values: Partial<Room>) => {
        saveMutation.mutate({
            id: editingRoom?.id,
            values,
        });
    };

    const handleView = (room: Room) => {
        setViewingRoom(room);
    };

    // Auto-select first house if only one
    if (!selectedHouseId && houses && houses.length === 1) {
        setSelectedHouseId(houses[0].id);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý phòng trọ</h1>
                        <p className="text-gray-600 mt-1">
                            {rooms?.length || 0} phòng
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={!isOnline || !selectedHouseId}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm phòng</span>
                        <span className="sm:hidden">Thêm</span>
                    </button>
                </div>

                {/* House Filter */}
                {houses && houses.length > 0 && (
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedHouseId || ''}
                                onChange={(e) => setSelectedHouseId(e.target.value ? Number(e.target.value) : undefined)}
                                className="input flex-1"
                            >
                                <option value="">-- Chọn nhà trọ --</option>
                                {houses.map((house) => (
                                    <option key={house.id} value={house.id}>
                                        {house.address} ({house._count?.rooms || 0} phòng)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {!houses || houses.length === 0 ? (
                <EmptyState
                    icon={DoorOpen}
                    title="Chưa có nhà trọ"
                    description="Vui lòng tạo nhà trọ trước khi thêm phòng"
                />
            ) : !selectedHouseId ? (
                <EmptyState
                    icon={Filter}
                    title="Chọn nhà trọ"
                    description="Vui lòng chọn nhà trọ để xem danh sách phòng"
                />
            ) : isLoading ? (
                <LoadingSpinner />
            ) : !rooms || rooms.length === 0 ? (
                <EmptyState
                    icon={DoorOpen}
                    title="Chưa có phòng"
                    description="Bắt đầu bằng cách thêm phòng đầu tiên"
                    action={
                        <button onClick={handleCreate} className="btn btn-primary">
                            <Plus className="w-4 h-4" />
                            Thêm phòng
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="card hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <DoorOpen className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {room.roomName}
                                        </h3>
                                        <StatusBadge status={room.status} />
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-primary-600">
                                        {formatCurrency(room.roomPrice)}
                                    </p>
                                    <p className="text-xs text-gray-500">/ tháng</p>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-900 font-medium truncate">{room.renter}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">{formatPhoneNumber(room.phone)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Diện tích: {room.area} m²</span>
                                    <span className="text-gray-300">•</span>
                                    <span>Cọc: {formatCurrency(room.deposit)}</span>
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-600">Điện</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(room.electPrice)}/số
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-600">Nước</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(room.waterPrice)}/số
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-600">Rác</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(room.trashFee)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-600">Gửi xe</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(room.parkingFee)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-600">Thang máy</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(room.elevatorFee)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleView(room)}
                                    className="flex-1 btn btn-secondary text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Xem
                                </button>
                                <button
                                    onClick={() => handleEdit(room)}
                                    disabled={!isOnline}
                                    className="flex-1 btn btn-secondary text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    disabled={!isOnline || deletingId === room.id}
                                    className="flex-1 btn btn-danger text-sm"
                                >
                                    {deletingId === room.id ? (
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
                <RoomModal
                    room={editingRoom}
                    houses={houses || []}
                    defaultHouseId={selectedHouseId}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingRoom(null);
                    }}
                    onSubmit={handleSubmit}
                    isLoading={saveMutation.isPending}
                />
            )}

            {/* Detail Modal */}
            {viewingRoom && (
                <RoomDetailModal
                    room={viewingRoom}
                    onClose={() => setViewingRoom(null)}
                    onEdit={() => {
                        setEditingRoom(viewingRoom);
                        setViewingRoom(null);
                        setIsModalOpen(true);
                    }}
                />
            )}
        </div>
    );
}
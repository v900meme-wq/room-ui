import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Room, House } from '../../types';

interface RoomModalProps {
    room: Room | null;
    houses: House[];
    defaultHouseId?: number;
    onClose: () => void;
    onSubmit: (values: Partial<Room>) => void;
    isLoading: boolean;
}

export function RoomModal({
    room,
    houses,
    defaultHouseId,
    onClose,
    onSubmit,
    isLoading,
}: RoomModalProps) {
    const [formData, setFormData] = useState({
        roomName: '',
        renter: '',
        phone: '',
        area: 0,
        status: 'available',
        roomPrice: 0,
        electPrice: 3500,
        waterPrice: 20000,
        trashFee: 50000,
        washingMachineFee: 100000,
        elevatorFee: 50000,
        rentedAt: new Date().toISOString().split('T')[0],
        deposit: 0,
        note: '',
        houseId: defaultHouseId || 0,
    });

    useEffect(() => {
        if (room) {
            setFormData({
                roomName: room.roomName,
                renter: room.renter,
                phone: room.phone,
                area: room.area,
                status: room.status,
                roomPrice: room.roomPrice,
                electPrice: room.electPrice,
                waterPrice: room.waterPrice,
                trashFee: room.trashFee,
                washingMachineFee: room.washingMachineFee,
                elevatorFee: room.elevatorFee,
                rentedAt: room.rentedAt.split('T')[0],
                deposit: room.deposit,
                note: room.note,
                houseId: room.houseId,
            });
        }
    }, [room]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomName.trim() || !formData.houseId) {
            return;
        }

        onSubmit({
            ...formData,
            rentedAt: new Date(formData.rentedAt).toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8">
                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                        {room ? 'Sửa phòng trọ' : 'Thêm phòng trọ'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Thông tin cơ bản</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhà trọ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.houseId}
                                    onChange={(e) => setFormData({ ...formData, houseId: Number(e.target.value) })}
                                    className="input w-full"
                                    required
                                >
                                    <option value="">-- Chọn nhà trọ --</option>
                                    {houses.map((house) => (
                                        <option key={house.id} value={house.id}>
                                            {house.address}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên phòng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.roomName}
                                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                                    className="input w-full"
                                    placeholder="VD: P101"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="input w-full"
                                >
                                    <option value="available">Trống</option>
                                    <option value="rented">Đang thuê</option>
                                    <option value="maintenance">Bảo trì</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người thuê <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.renter}
                                    onChange={(e) => setFormData({ ...formData, renter: e.target.value })}
                                    className="input w-full"
                                    placeholder="Tên người thuê"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input w-full"
                                    placeholder="0912345678"
                                    maxLength={10}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diện tích (m²)
                                </label>
                                <input
                                    type="number"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày thuê
                                </label>
                                <input
                                    type="date"
                                    value={formData.rentedAt}
                                    onChange={(e) => setFormData({ ...formData, rentedAt: e.target.value })}
                                    className="input w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Giá cả</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá phòng (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.roomPrice}
                                    onChange={(e) => setFormData({ ...formData, roomPrice: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiền cọc (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={formData.deposit}
                                    onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điện (VNĐ/số)
                                </label>
                                <input
                                    type="number"
                                    value={formData.electPrice}
                                    onChange={(e) => setFormData({ ...formData, electPrice: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nước (VNĐ/số)
                                </label>
                                <input
                                    type="number"
                                    value={formData.waterPrice}
                                    onChange={(e) => setFormData({ ...formData, waterPrice: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phí rác (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={formData.trashFee}
                                    onChange={(e) => setFormData({ ...formData, trashFee: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Máy giặt (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={formData.washingMachineFee}
                                    onChange={(e) => setFormData({ ...formData, washingMachineFee: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thang máy (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={formData.elevatorFee}
                                    onChange={(e) => setFormData({ ...formData, elevatorFee: Number(e.target.value) })}
                                    className="input w-full"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="input w-full min-h-[80px] resize-none"
                            placeholder="Ghi chú thêm..."
                            rows={3}
                        />
                    </div>
                </form>

                {/* Actions - Sticky Bottom */}
                <div className="flex gap-3 p-4 md:p-6 border-t sticky bottom-0 bg-white rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn btn-secondary"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="flex-1 btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang lưu...' : room ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </div>
            </div>
        </div>
    );
}
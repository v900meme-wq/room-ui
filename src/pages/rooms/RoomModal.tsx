import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Sparkles } from 'lucide-react';
import type { Room, House } from '../../types';
import { priceService } from '../../services/price.service';

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
        area: '' as string | number,
        status: 'available',
        roomPrice: '' as string | number,
        electPrice: '' as string | number,
        waterPrice: '' as string | number,
        trashFee: '' as string | number,
        parkingFee: '' as string | number,
        washingMachineFee: '' as string | number,
        elevatorFee: '' as string | number,
        rentedAt: new Date().toISOString().split('T')[0],
        deposit: '' as string | number,
        note: '',
        houseId: defaultHouseId || 0,
    });

    // Fetch price templates
    const { data: priceTemplates } = useQuery({
        queryKey: ['prices'],
        queryFn: () => priceService.getAll(),
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
                parkingFee: room.parkingFee,
                washingMachineFee: room.washingMachineFee,
                elevatorFee: room.elevatorFee,
                rentedAt: room.rentedAt.split('T')[0],
                deposit: room.deposit,
                note: room.note,
                houseId: room.houseId,
            });
        }
    }, [room]);

    // Handle price template selection
    const handlePriceTemplateChange = (priceId: string) => {
        if (!priceId) return;

        const selectedPrice = priceTemplates?.find(p => p.id === Number(priceId));
        if (selectedPrice) {
            setFormData(prev => ({
                ...prev,
                roomPrice: selectedPrice.roomPrice,
                electPrice: selectedPrice.electPrice,
                waterPrice: selectedPrice.waterPrice,
                trashFee: selectedPrice.trashFee,
                parkingFee: selectedPrice.parkingFee,  // ← Thêm dòng này
                washingMachineFee: selectedPrice.washingMachineFee,
                elevatorFee: selectedPrice.elevatorFee,
                deposit: selectedPrice.deposit,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomName.trim() || !formData.houseId) {
            return;
        }

        // Convert empty strings to 0
        onSubmit({
            ...formData,
            area: formData.area === '' ? 0 : Number(formData.area),
            roomPrice: formData.roomPrice === '' ? 0 : Number(formData.roomPrice),
            electPrice: formData.electPrice === '' ? 0 : Number(formData.electPrice),
            waterPrice: formData.waterPrice === '' ? 0 : Number(formData.waterPrice),
            trashFee: formData.trashFee === '' ? 0 : Number(formData.trashFee),
            parkingFee: formData.parkingFee === '' ? 0 : Number(formData.parkingFee),
            washingMachineFee: formData.washingMachineFee === '' ? 0 : Number(formData.washingMachineFee),
            elevatorFee: formData.elevatorFee === '' ? 0 : Number(formData.elevatorFee),
            deposit: formData.deposit === '' ? 0 : Number(formData.deposit),
            rentedAt: new Date(formData.rentedAt).toISOString(),
        });
    };

    const handleNumberChange = (field: string, value: string) => {
        const cleanValue = value.replace(/\./g, '');
        if (cleanValue === '' || !isNaN(Number(cleanValue))) {
            setFormData({ ...formData, [field]: cleanValue });
        }
    };

    const formatNumber = (value: string | number): string => {
        if (value === '' || value === 0) return '';
        const num = typeof value === 'string' ? value : value.toString();
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="fixed -top-10 inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
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
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
                                    type="text"
                                    value={formatNumber(formData.area)}
                                    onChange={(e) => handleNumberChange('area', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
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

                    {/* Price Template Selection */}
                    {priceTemplates && priceTemplates.length > 0 && (
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h3 className="font-semibold text-primary-900">Chọn mẫu giá</h3>
                            </div>
                            <select
                                onChange={(e) => handlePriceTemplateChange(e.target.value)}
                                className="input w-full"
                                defaultValue=""
                            >
                                <option value="">-- Chọn mẫu để tự động điền giá --</option>
                                {priceTemplates.map((price) => (
                                    <option key={price.id} value={price.id}>
                                        {price.priceName}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-primary-600 mt-2">
                                💡 Chọn mẫu giá để tự động điền các thông tin giá cả bên dưới
                            </p>
                        </div>
                    )}

                    {/* Prices */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Giá cả</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá phòng (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.roomPrice)}
                                    onChange={(e) => handleNumberChange('roomPrice', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiền cọc (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.deposit)}
                                    onChange={(e) => handleNumberChange('deposit', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điện (VNĐ/số)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.electPrice)}
                                    onChange={(e) => handleNumberChange('electPrice', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nước (VNĐ/số)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.waterPrice)}
                                    onChange={(e) => handleNumberChange('waterPrice', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phí rác (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.trashFee)}
                                    onChange={(e) => handleNumberChange('trashFee', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gửi xe (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.parkingFee)}
                                    onChange={(e) => handleNumberChange('parkingFee', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Máy giặt (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.washingMachineFee)}
                                    onChange={(e) => handleNumberChange('washingMachineFee', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thang máy (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(formData.elevatorFee)}
                                    onChange={(e) => handleNumberChange('elevatorFee', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
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
                <div className="flex gap-3 p-4 md:p-6 border-t border-gray-200 flex-shrink-0">
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
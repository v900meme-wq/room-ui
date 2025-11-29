import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Price } from '../../services/price.service';

interface PriceModalProps {
    price: Price | null;
    onClose: () => void;
    onSubmit: (values: Partial<Price>) => void;
    isLoading: boolean;
}

export function PriceModal({ price, onClose, onSubmit, isLoading }: PriceModalProps) {
    const [formData, setFormData] = useState({
        priceName: '',
        roomPrice: '' as string | number,
        electPrice: '' as string | number,
        waterPrice: '' as string | number,
        trashFee: '' as string | number,
        washingMachineFee: '' as string | number,
        elevatorFee: '' as string | number,
        deposit: '' as string | number,
    });

    useEffect(() => {
        if (price) {
            setFormData({
                priceName: price.priceName,
                roomPrice: price.roomPrice,
                electPrice: price.electPrice,
                waterPrice: price.waterPrice,
                trashFee: price.trashFee,
                washingMachineFee: price.washingMachineFee,
                elevatorFee: price.elevatorFee,
                deposit: price.deposit,
            });
        }
    }, [price]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.priceName.trim()) {
            return;
        }

        onSubmit({
            priceName: formData.priceName,
            roomPrice: formData.roomPrice === '' ? 0 : Number(formData.roomPrice),
            electPrice: formData.electPrice === '' ? 0 : Number(formData.electPrice),
            waterPrice: formData.waterPrice === '' ? 0 : Number(formData.waterPrice),
            trashFee: formData.trashFee === '' ? 0 : Number(formData.trashFee),
            washingMachineFee: formData.washingMachineFee === '' ? 0 : Number(formData.washingMachineFee),
            elevatorFee: formData.elevatorFee === '' ? 0 : Number(formData.elevatorFee),
            deposit: formData.deposit === '' ? 0 : Number(formData.deposit),
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
                        {price ? 'Sửa mẫu giá' : 'Thêm mẫu giá'}
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên mẫu giá <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.priceName}
                            onChange={(e) => setFormData({ ...formData, priceName: e.target.value })}
                            className="input w-full"
                            placeholder="VD: Giá phòng thường, Giá phòng VIP..."
                            required
                            autoFocus
                        />
                    </div>

                    {/* Prices */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Bảng giá</h3>

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
                                <p className="text-xs text-gray-500 mt-1">/ tháng</p>
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
                                <p className="text-xs text-gray-500 mt-1">/ tháng</p>
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
                                <p className="text-xs text-gray-500 mt-1">/ tháng</p>
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
                                <p className="text-xs text-gray-500 mt-1">/ tháng</p>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            💡 <strong>Mẹo:</strong> Tạo nhiều mẫu giá khác nhau (phòng thường, VIP, studio...) để dễ dàng áp dụng khi thêm phòng mới.
                        </p>
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
                        {isLoading ? 'Đang lưu...' : price ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { House } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface HouseModalProps {
    house: House | null;
    onClose: () => void;
    onSubmit: (values: Partial<House>) => void;
    isLoading: boolean;
}

export function HouseModal({ house, onClose, onSubmit, isLoading }: HouseModalProps) {
    const user = useAuthStore((state) => state.user);
    const [formData, setFormData] = useState({
        address: '',
        note: '',
        userId: user?.id || 0,
    });

    useEffect(() => {
        if (house) {
            setFormData({
                address: house.address,
                note: house.note,
                userId: house.userId,
            });
        }
    }, [house]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address.trim()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {house ? 'Sửa nhà trọ' : 'Thêm nhà trọ'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="input w-full"
                            placeholder="Nhập địa chỉ nhà trọ"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="input w-full min-h-[100px] resize-none"
                            placeholder="Nhập ghi chú (mô tả, tiện ích...)"
                            rows={4}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
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
                            className="flex-1 btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : house ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
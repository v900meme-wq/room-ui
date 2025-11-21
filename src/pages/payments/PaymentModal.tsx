import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Info, TrendingUp } from 'lucide-react';
import type { MonthlyPayment } from '../../types';
import { houseService } from '../../services/house.service';
import { roomService } from '../../services/room.service';
import { paymentService } from '../../services/payment.service';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '../../utils/format';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface PaymentModalProps {
    payment: MonthlyPayment | null;
    onClose: () => void;
    onSubmit: (values: Partial<MonthlyPayment>) => void;
    isLoading: boolean;
}

export function PaymentModal({ payment, onClose, onSubmit, isLoading }: PaymentModalProps) {
    const [selectedHouseId, setSelectedHouseId] = useState<number | undefined>();
    const [formData, setFormData] = useState({
        electStart: '' as string | number,
        electEnd: '' as string | number,
        waterStart: '' as string | number,
        waterEnd: '' as string | number,
        month: getCurrentMonth(),
        year: getCurrentYear(),
        status: 'unpaid',
        note: '',
        roomId: 0,
    });

    // Fetch houses
    const { data: houses } = useQuery({
        queryKey: ['houses'],
        queryFn: () => houseService.getAll(),
    });

    // Fetch rooms by house
    const { data: rooms } = useQuery({
        queryKey: ['rooms', selectedHouseId],
        queryFn: () => roomService.getAll(selectedHouseId),
        enabled: !!selectedHouseId,
    });

    // Fetch recent payments for suggestion
    const { data: recentData, isLoading: recentLoading } = useQuery({
        queryKey: ['recent-payments', formData.roomId],
        queryFn: () => paymentService.getRecentByRoom(formData.roomId),
        enabled: !!formData.roomId && !payment,
    });

    // Get selected room for price calculation
    const selectedRoom = rooms?.find(r => r.id === formData.roomId);

    useEffect(() => {
        if (payment) {
            setFormData({
                electStart: payment.electStart,
                electEnd: payment.electEnd,
                waterStart: payment.waterStart,
                waterEnd: payment.waterEnd,
                month: payment.month,
                year: payment.year,
                status: payment.status,
                note: payment.note,
                roomId: payment.roomId,
            });
            setSelectedHouseId(payment.room?.house?.id);
        }
    }, [payment]);

    // Auto-fill suggestion
    useEffect(() => {
        if (recentData?.suggestion && !payment) {
            setFormData(prev => ({
                ...prev,
                electStart: recentData.suggestion?.suggestedElectStart ?? '',
                waterStart: recentData.suggestion?.suggestedWaterStart ?? '',
            }));
        }
    }, [recentData, payment]);

    const handleNumberChange = (field: string, value: string) => {
        if (value === '' || !isNaN(Number(value))) {
            setFormData({ ...formData, [field]: value });
        }
    };

    const calculateTotal = () => {
        if (!selectedRoom) return 0;

        const electStart = formData.electStart === '' ? 0 : Number(formData.electStart);
        const electEnd = formData.electEnd === '' ? 0 : Number(formData.electEnd);
        const waterStart = formData.waterStart === '' ? 0 : Number(formData.waterStart);
        const waterEnd = formData.waterEnd === '' ? 0 : Number(formData.waterEnd);

        const electUsage = electEnd - electStart;
        const waterUsage = waterEnd - waterStart;

        return (
            selectedRoom.roomPrice +
            electUsage * selectedRoom.electPrice +
            waterUsage * selectedRoom.waterPrice +
            selectedRoom.trashFee +
            selectedRoom.parkingFee +
            selectedRoom.washingMachineFee +
            selectedRoom.elevatorFee
        );
    };

    const totalAmount = calculateTotal();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomId) {
            return;
        }

        const electStart = formData.electStart === '' ? 0 : Number(formData.electStart);
        const electEnd = formData.electEnd === '' ? 0 : Number(formData.electEnd);
        const waterStart = formData.waterStart === '' ? 0 : Number(formData.waterStart);
        const waterEnd = formData.waterEnd === '' ? 0 : Number(formData.waterEnd);

        if (electEnd < electStart) {
            alert('Chỉ số điện cuối phải lớn hơn hoặc bằng chỉ số đầu');
            return;
        }

        if (waterEnd < waterStart) {
            alert('Chỉ số nước cuối phải lớn hơn hoặc bằng chỉ số đầu');
            return;
        }

        onSubmit({
            ...formData,
            electStart,
            electEnd,
            waterStart,
            waterEnd,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                        {payment ? 'Sửa hóa đơn' : 'Tạo hóa đơn mới'}
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
                    {/* Room Selection */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Chọn phòng</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhà trọ
                                </label>
                                <select
                                    value={selectedHouseId || ''}
                                    onChange={(e) => {
                                        const houseId = e.target.value ? Number(e.target.value) : undefined;
                                        setSelectedHouseId(houseId);
                                        setFormData({ ...formData, roomId: 0 });
                                    }}
                                    className="input w-full"
                                    disabled={!!payment}
                                >
                                    <option value="">-- Chọn nhà trọ --</option>
                                    {houses?.map((house) => (
                                        <option key={house.id} value={house.id}>
                                            {house.address}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phòng <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.roomId}
                                    onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
                                    className="input w-full"
                                    disabled={!selectedHouseId || !!payment}
                                    required
                                >
                                    <option value="">-- Chọn phòng --</option>
                                    {rooms?.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.roomName} - {room.renter}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Recent Payments Suggestion */}
                    {recentLoading && formData.roomId && !payment && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <LoadingSpinner size="sm" />
                            <p className="text-sm text-blue-700 ml-2">Đang tải gợi ý...</p>
                        </div>
                    )}

                    {recentData?.suggestion && !payment && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900 mb-2">
                                        Gợi ý từ tháng {recentData.suggestion.lastPaymentMonth}/{recentData.suggestion.lastPaymentYear}
                                    </p>
                                    <div className="flex gap-4 text-sm text-blue-700">
                                        <span>Chỉ số điện bắt đầu: <strong>{recentData.suggestion.suggestedElectStart}</strong></span>
                                        <span>Chỉ số nước bắt đầu: <strong>{recentData.suggestion.suggestedWaterStart}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent 5 payments */}
                            {recentData.recentPayments && recentData.recentPayments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <p className="text-xs font-medium text-blue-900 mb-2">5 tháng gần nhất:</p>
                                    <div className="space-y-1">
                                        {recentData.recentPayments.map((p) => (
                                            <div key={p.id} className="flex justify-between text-xs text-blue-700">
                                                <span>Tháng {p.month}/{p.year}</span>
                                                <span>Điện: {p.electStart}→{p.electEnd} | Nước: {p.waterStart}→{p.waterEnd}</span>
                                                <span className="font-medium">{formatCurrency(p.totalAmount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Period */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Kỳ thanh toán</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tháng
                                </label>
                                <select
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                                    className="input w-full"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <option key={month} value={month}>
                                            Tháng {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Năm
                                </label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                    className="input w-full"
                                >
                                    {Array.from({ length: 3 }, (_, i) => getCurrentYear() - 1 + i).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
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
                                    <option value="unpaid">Chưa thanh toán</option>
                                    <option value="paid">Đã thanh toán</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Usage */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Chỉ số</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điện đầu
                                </label>
                                <input
                                    type="number"
                                    value={formData.electStart}
                                    onChange={(e) => handleNumberChange('electStart', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điện cuối
                                </label>
                                <input
                                    type="number"
                                    value={formData.electEnd}
                                    onChange={(e) => handleNumberChange('electEnd', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nước đầu
                                </label>
                                <input
                                    type="number"
                                    value={formData.waterStart}
                                    onChange={(e) => handleNumberChange('waterStart', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nước cuối
                                </label>
                                <input
                                    type="number"
                                    value={formData.waterEnd}
                                    onChange={(e) => handleNumberChange('waterEnd', e.target.value)}
                                    className="input w-full"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {selectedRoom && (
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <p className="text-gray-600 mb-2">Tiêu thụ:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <span>
                                        Điện: {(formData.electEnd === '' ? 0 : Number(formData.electEnd)) - (formData.electStart === '' ? 0 : Number(formData.electStart))} số × {formatCurrency(selectedRoom.electPrice)} = <strong>{formatCurrency(((formData.electEnd === '' ? 0 : Number(formData.electEnd)) - (formData.electStart === '' ? 0 : Number(formData.electStart))) * selectedRoom.electPrice)}</strong>
                                    </span>
                                    <span>
                                        Nước: {(formData.waterEnd === '' ? 0 : Number(formData.waterEnd)) - (formData.waterStart === '' ? 0 : Number(formData.waterStart))} số × {formatCurrency(selectedRoom.waterPrice)} = <strong>{formatCurrency(((formData.waterEnd === '' ? 0 : Number(formData.waterEnd)) - (formData.waterStart === '' ? 0 : Number(formData.waterStart))) * selectedRoom.waterPrice)}</strong>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="input w-full min-h-[60px] resize-none"
                            placeholder="Ghi chú thêm..."
                            rows={2}
                        />
                    </div>

                    {/* Total */}
                    {selectedRoom && totalAmount > 0 && (
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-primary-600 mb-1">Tổng tiền</p>
                                    <p className="text-3xl font-bold text-primary-900">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-primary-600" />
                            </div>
                        </div>
                    )}
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
                        disabled={isLoading || !formData.roomId}
                    >
                        {isLoading ? 'Đang lưu...' : payment ? 'Cập nhật' : 'Tạo hóa đơn'}
                    </button>
                </div>
            </div>
        </div>
    );
}
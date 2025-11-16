import { X, Edit, User, Phone, Zap, Droplet } from 'lucide-react';
import type { MonthlyPayment } from '../../types';
import { formatCurrency, formatPhoneNumber, formatDateTime } from '../../utils/format';
import { StatusBadge } from '../../components/common/StatusBadge';

interface PaymentDetailModalProps {
    payment: MonthlyPayment;
    onClose: () => void;
    onEdit: () => void;
}

export function PaymentDetailModal({ payment, onClose, onEdit }: PaymentDetailModalProps) {
    const electUsage = payment.electEnd - payment.electStart;
    const waterUsage = payment.waterEnd - payment.waterStart;
    const electCost = electUsage * payment.electPrice;
    const waterCost = waterUsage * payment.waterPrice;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col">
                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">Chi tiết hóa đơn</h2>
                        <p className="text-sm text-gray-600">Tháng {payment.month}/{payment.year}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Room & Status - Compact */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{payment.room?.roomName}</span>
                            <StatusBadge status={payment.status} />
                        </div>
                        <p className="text-gray-600 text-xs">{payment.room?.house?.address}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <User className="w-3.5 h-3.5" />
                                <span>{payment.room?.renter}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{payment.room?.phone && formatPhoneNumber(payment.room.phone)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Usage - Compact Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Electric */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Zap className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-900">Điện</span>
                            </div>
                            <div className="space-y-1 text-xs text-yellow-700">
                                <div className="flex justify-between">
                                    <span>Đầu:</span>
                                    <span className="font-medium">{payment.electStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cuối:</span>
                                    <span className="font-medium">{payment.electEnd}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-yellow-200">
                                    <span>Dùng:</span>
                                    <span className="font-semibold">{electUsage}</span>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-yellow-200">
                                <p className="text-xs text-yellow-600">Thành tiền</p>
                                <p className="text-base font-bold text-yellow-900">{formatCurrency(electCost)}</p>
                            </div>
                        </div>

                        {/* Water */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Droplet className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Nước</span>
                            </div>
                            <div className="space-y-1 text-xs text-blue-700">
                                <div className="flex justify-between">
                                    <span>Đầu:</span>
                                    <span className="font-medium">{payment.waterStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cuối:</span>
                                    <span className="font-medium">{payment.waterEnd}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-blue-200">
                                    <span>Dùng:</span>
                                    <span className="font-semibold">{waterUsage}</span>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-blue-200">
                                <p className="text-xs text-blue-600">Thành tiền</p>
                                <p className="text-base font-bold text-blue-900">{formatCurrency(waterCost)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Other Fees - Compact */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Chi phí khác</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phòng:</span>
                                <span className="font-medium">{formatCurrency(payment.roomPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rác:</span>
                                <span className="font-medium">{formatCurrency(payment.trashFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gửi xe:</span>
                                <span className="font-medium">{formatCurrency(payment.parkingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">M.giặt:</span>
                                <span className="font-medium">{formatCurrency(payment.washingMachineFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thang máy:</span>
                                <span className="font-medium">{formatCurrency(payment.elevatorFee)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total - Compact */}
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-xs text-primary-600">Tổng cộng</p>
                                <p className="text-2xl font-bold text-primary-900">
                                    {formatCurrency(payment.totalAmount)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-primary-600">Tạo lúc</p>
                                <p className="text-xs text-primary-700">{formatDateTime(payment.createdAt).split(' ')[0]}</p>
                                <p className="text-xs text-primary-700">{formatDateTime(payment.createdAt).split(' ')[1]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Note - Compact */}
                    {payment.note && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Ghi chú:</p>
                            <p className="text-xs text-gray-600">{payment.note}</p>
                        </div>
                    )}
                </div>

                {/* Actions - Sticky Bottom */}
                <div className="flex gap-2 p-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 btn btn-secondary text-sm py-2">
                        Đóng
                    </button>
                    <button onClick={onEdit} className="flex-1 btn btn-primary text-sm py-2">
                        <Edit className="w-4 h-4" />
                        Sửa
                    </button>
                </div>
            </div>
        </div>
    );
}
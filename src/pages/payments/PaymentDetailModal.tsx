import { X, Edit, Calendar, User, Phone, Home, Zap, Droplet, Trash, WashingMachine, Columns2 } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl z-10">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">Chi tiết hóa đơn</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tháng {payment.month}/{payment.year}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-240px)] overflow-y-auto">
                    {/* Room Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary-600" />
                            Thông tin phòng
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phòng:</span>
                                <span className="font-medium">{payment.room?.roomName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Địa chỉ:</span>
                                <span className="font-medium text-right">{payment.room?.house?.address}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-600">Người thuê:</span>
                                <div className="text-right">
                                    <p className="font-medium flex items-center gap-2 justify-end">
                                        <User className="w-4 h-4" />
                                        {payment.room?.renter}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 justify-end mt-1">
                                        <Phone className="w-4 h-4" />
                                        {payment.room?.phone && formatPhoneNumber(payment.room.phone)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Trạng thái:</span>
                                <StatusBadge status={payment.status} />
                            </div>
                        </div>
                    </div>

                    {/* Usage Details */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            Chi tiết tiêu thụ
                        </h3>

                        {/* Electric */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-yellow-600" />
                                <h4 className="font-medium text-yellow-900">Điện</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Chỉ số đầu:</span>
                                    <span className="font-medium">{payment.electStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Chỉ số cuối:</span>
                                    <span className="font-medium">{payment.electEnd}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-yellow-200">
                                    <span className="text-yellow-700">Tiêu thụ:</span>
                                    <span className="font-semibold">{electUsage} số × {formatCurrency(payment.electPrice)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-yellow-900 font-medium">Thành tiền:</span>
                                    <span className="font-bold text-yellow-900">{formatCurrency(electCost)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Water */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Droplet className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-900">Nước</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Chỉ số đầu:</span>
                                    <span className="font-medium">{payment.waterStart}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Chỉ số cuối:</span>
                                    <span className="font-medium">{payment.waterEnd}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                    <span className="text-blue-700">Tiêu thụ:</span>
                                    <span className="font-semibold">{waterUsage} số × {formatCurrency(payment.waterPrice)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-blue-900 font-medium">Thành tiền:</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(waterCost)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Chi phí khác</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tiền phòng:</span>
                                <span className="font-medium">{formatCurrency(payment.roomPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Trash className="w-4 h-4" />
                                    Phí rác:
                                </span>
                                <span className="font-medium">{formatCurrency(payment.trashFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <WashingMachine className="w-4 h-4" />
                                    Máy giặt:
                                </span>
                                <span className="font-medium">{formatCurrency(payment.washingMachineFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Columns2 className="w-4 h-4" />
                                    Thang máy:
                                </span>
                                <span className="font-medium">{formatCurrency(payment.elevatorFee)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary-600 mb-1">Tổng cộng</p>
                                <p className="text-3xl md:text-4xl font-bold text-primary-900">
                                    {formatCurrency(payment.totalAmount)}
                                </p>
                                <p className="text-xs text-primary-600 mt-2">
                                    Tạo lúc: {formatDateTime(payment.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    {payment.note && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Ghi chú:</p>
                            <p className="text-sm text-gray-600">{payment.note}</p>
                        </div>
                    )}
                </div>

                {/* Actions - Sticky */}
                <div className="sticky bottom-0 bg-white flex gap-3 p-6 border-t border-gray-200 rounded-b-xl">
                    <button onClick={onClose} className="flex-1 btn btn-secondary">
                        Đóng
                    </button>
                    <button onClick={onEdit} className="flex-1 btn btn-primary">
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                    </button>
                </div>
            </div>
        </div>
    );
}
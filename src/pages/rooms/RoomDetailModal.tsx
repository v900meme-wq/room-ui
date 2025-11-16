import { Eye, Home, MapPin, User, Phone, Edit } from 'lucide-react';
import type { Room } from '../../types';
import { formatCurrency, formatPhoneNumber } from '../../utils/format';
import { StatusBadge } from '../../components/common/StatusBadge';

interface RoomDetailModalProps {
    room: Room;
    onClose: () => void;
    onEdit: () => void;
}

export function RoomDetailModal({ room, onClose, onEdit }: RoomDetailModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{room.roomName}</h2>
                        <p className="text-sm text-gray-600 mt-1">{room.house?.address}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <StatusBadge status={room.status} />
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary-600" />
                            Thông tin cơ bản
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Diện tích:</span>
                                <span className="font-medium">{room.area} m²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Người thuê:
                                </span>
                                <span className="font-medium">{room.renter}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Số điện thoại:
                                </span>
                                <span className="font-medium">{formatPhoneNumber(room.phone)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tiền cọc:</span>
                                <span className="font-medium">{formatCurrency(room.deposit)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Bảng giá</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                <p className="text-xs text-primary-600 mb-1">Tiền phòng</p>
                                <p className="text-lg font-bold text-primary-900">
                                    {formatCurrency(room.roomPrice)}
                                </p>
                                <p className="text-xs text-primary-600">/ tháng</p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-xs text-yellow-600 mb-1">Tiền điện</p>
                                <p className="text-lg font-bold text-yellow-900">
                                    {formatCurrency(room.electPrice)}
                                </p>
                                <p className="text-xs text-yellow-600">/ số</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-xs text-blue-600 mb-1">Tiền nước</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {formatCurrency(room.waterPrice)}
                                </p>
                                <p className="text-xs text-blue-600">/ số</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Phí rác</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.trashFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Gửi xe</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.parkingFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Máy giặt</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.washingMachineFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">Thang máy</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(room.elevatorFee)}
                                </p>
                                <p className="text-xs text-gray-600">/ tháng</p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            Địa chỉ
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900">{room.house?.address}</p>
                        </div>
                    </div>

                    {/* Note */}
                    {room.note && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Ghi chú</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">{room.note}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions - Sticky Bottom */}
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
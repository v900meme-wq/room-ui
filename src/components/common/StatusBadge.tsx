import { Badge } from './Badge';

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig: Record<string, { label: string; variant: any }> = {
        paid: { label: 'Đã thanh toán', variant: 'success' },
        unpaid: { label: 'Chưa thanh toán', variant: 'warning' },
        overdue: { label: 'Quá hạn', variant: 'danger' },
        rented: { label: 'Đang thuê', variant: 'success' },
        available: { label: 'Trống', variant: 'info' },
        maintenance: { label: 'Bảo trì', variant: 'warning' },
        active: { label: 'Hoạt động', variant: 'success' },
        inactive: { label: 'Ngừng hoạt động', variant: 'default' },
    };

    const config = statusConfig[status.toLowerCase()] || {
        label: status,
        variant: 'default',
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}
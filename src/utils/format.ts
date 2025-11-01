export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatPhoneNumber(phone: string): string {
    // Format: 0326704963 -> 032 670 4963
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

export function getMonthName(month: number): string {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];
    return months[month - 1] || '';
}

export function getCurrentMonth(): number {
    return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}

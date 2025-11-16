export interface User {
    id: number;
    username: string;
    phone: string;
    roomLimit: number | null;
    isAdmin: boolean;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface House {
    id: number;
    address: string;
    note: string;
    userId: number;
    user?: {
        id: number;
        username: string;
        phone: string;
    };
    rooms?: Room[];
    _count?: {
        rooms: number;
    };
}

export interface Room {
    id: number;
    roomName: string;
    renter: string;
    phone: string;
    area: number;
    status: string;
    roomPrice: number;
    electPrice: number;
    waterPrice: number;
    trashFee: number;
    parkingFee: number;
    washingMachineFee: number;
    elevatorFee: number;
    rentedAt: string;
    deposit: number;
    note: string;
    houseId: number;
    house?: {
        id: number;
        address: string;
        user?: {
            id: number;
            username: string;
        };
    };
    monthlyPayments?: MonthlyPayment[];
    _count?: {
        monthlyPayments: number;
    };
}

export interface MonthlyPayment {
    id: number;
    electStart: number;
    electEnd: number;
    waterStart: number;
    waterEnd: number;
    month: number;
    year: number;
    roomPrice: number;
    electPrice: number;
    waterPrice: number;
    trashFee: number;
    parkingFee: number;
    washingMachineFee: number;
    elevatorFee: number;
    totalAmount: number;
    status: string;
    note: string;
    createdAt: string;
    roomId: number;
    room?: {
        id: number;
        roomName: string;
        renter: string;
        phone: string;
        house?: {
            id: number;
            address: string;
        };
    };
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface DashboardStats {
    overview: {
        totalUsers: number;
        totalHouses: number;
        totalRooms: number;
        totalPayments: number;
        activeUsers: number;
        occupiedRooms: number;
        availableRooms: number;
        occupancyRate: number;
    };
    revenue: {
        totalRevenue: number;
        paidRevenue: number;
        unpaidRevenue: number;
        totalPaidPayments: number;
        totalUnpaidPayments: number;
        revenueByMonth: Array<{
            month: number;
            year: number;
            total: number;
            paid: number;
            unpaid: number;
            count: number;
        }>;
    };
    unpaidPayments: MonthlyPayment[];
    recentActivities: Array<{
        id: number;
        username: string;
        action: string;
        entity: string;
        entityId: number | null;
        createdAt: string;
    }>;
}
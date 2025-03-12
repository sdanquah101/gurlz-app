export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  description: string;
  rating: number;
  totalSales: number;
  joinDate: Date;
  location: string;
  profileImage?: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  vendor: Vendor;
  rating: number;
  reviews: number;
  inStock: number;
  features: string[];
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  vendorId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'held' | 'released' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  orderId?: string;
  read: boolean;
}
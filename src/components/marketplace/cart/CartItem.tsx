import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCartStore } from '../../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.vendorName}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Minus size={16} className="text-gray-500" />
            </button>
            <span className="text-gray-700">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-primary">
              ₵{(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
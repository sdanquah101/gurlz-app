import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/common/Button';
import PaymentModal from '../../components/marketplace/payment/PaymentModal';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const total = getTotal();

  const handlePaymentComplete = (paymentDetails: any) => {
    // Process payment
    console.log('Payment completed:', paymentDetails);
    clearCart();
    navigate('/marketplace', { 
      state: { message: 'Payment successful! Your order has been placed.' }
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/marketplace')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/marketplace')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Marketplace
        </Button>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-secondary-light/90">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.vendorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₵{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₵{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="text-xl font-bold text-primary">₵{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button onClick={() => setShowPaymentModal(true)} className="w-full">
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={total}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
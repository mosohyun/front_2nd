import { Coupon } from '../../types.ts';
import { useState } from 'react';
import { useCartCalculator } from '../hooks/index.ts';
import CartItem from './CartItem.tsx';
import { formatCurrency } from '../hooks/utils/formatCurrency.ts';

export default function CartBox({
  coupons,
  cart,
  updateQuantity,
  removeFromCart,
}) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { calculateTotal, getMaxDiscount } = useCartCalculator(
    cart,
    selectedCoupon
  );
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>장바구니 내역</h2>

      <div className='space-y-2'>
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            appliedDiscount={getMaxDiscount(item)}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      <div className='mt-6 bg-white p-4 rounded shadow'>
        <h2 className='text-2xl font-semibold mb-2'>쿠폰 적용</h2>
        <select
          onChange={(e) => setSelectedCoupon(coupons[parseInt(e.target.value)])}
          className='w-full p-2 border rounded mb-2'
        >
          <option value=''>쿠폰 선택</option>
          {coupons.map((coupon, index) => (
            <option key={coupon.code} value={index}>
              {coupon.name} -{' '}
              {coupon.discountType === 'amount'
                ? `${coupon.discountValue}원`
                : `${coupon.discountValue}%`}
            </option>
          ))}
        </select>
        {selectedCoupon && (
          <p className='text-green-600'>
            적용된 쿠폰: {selectedCoupon.name}(
            {selectedCoupon.discountType === 'amount'
              ? `${selectedCoupon.discountValue}원`
              : `${selectedCoupon.discountValue}%`}{' '}
            할인)
          </p>
        )}
      </div>

      <div className='mt-6 bg-white p-4 rounded shadow'>
        <h2 className='text-2xl font-semibold mb-2'>주문 요약</h2>
        <div className='space-y-1'>
          <p>상품 금액: {formatCurrency(totalBeforeDiscount)}원</p>
          <p className='text-green-600'>
            할인 금액: {formatCurrency(totalDiscount)}원
          </p>
          <p className='text-xl font-bold'>
            최종 결제 금액: {formatCurrency(totalAfterDiscount)}원
          </p>
        </div>
      </div>
    </div>
  );
}

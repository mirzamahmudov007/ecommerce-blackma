"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { selectCartItems, selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { orderService } from "@/services/orderService";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Checkout = () => {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Savat bo'sh!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      const firstItem = cartItems[0];
      const business_id = firstItem.businessId || ""; // Fallback to empty if not found
      const branch_id = firstItem.branchId || business_id; // Using business_id as branch_id if missing

      // Retrieve client info from localStorage or similar
      const client_id = typeof window !== "undefined" ? localStorage.getItem("client_id") || "guest" : "guest";
      const client_address_id = "placeholder_address_id"; // Ideally from a selected address

      const orderPayload: any = {
        business_id,
        branch_id,
        client_id,
        client_address_id,
        channel_order_id: `ORD-${Date.now()}`,
        delivery_address: `${formData.get("address")}, ${formData.get("town")}, ${formData.get("country")}`,
        payment_type: "CARD", // Should be dynamic based on PaymentMethod selection
        order_type: "DELIVERY",
        comment: formData.get("notes") as string,
        delivery_fee: 0, // Should be calculated
        total_discount: 0, // Should be calculated
        total_amount: totalPrice,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          discount_amount: item.price - item.discountedPrice,
          title: item.title
        }))
      };

      const response = await orderService.createMarketplaceOrder(orderPayload);
      if (response.success) {
        toast.success("Buyurtma muvaffaqiyatli qabul qilindi!");
        dispatch(removeAllItemsFromCart());
        router.push(`/orders/${response.data.id}`); // Redirect to order detail
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.message || "Buyurtma berishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                <Login />

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                <Shipping />

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items --> */}
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">
                            {item.title} <span className="text-dark-4">x {item.quantity}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-dark text-right">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$0.00</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- shipping box --> */}
                <ShippingMethod />

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50"
                >
                  {loading ? "Checking out..." : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;

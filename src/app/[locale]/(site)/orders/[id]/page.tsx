"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/api";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getMarketplaceOrderById(id as string);
        if (response.success) {
          setOrder(response.data);
        } else {
          toast.error("Buyurtma topilmadi");
        }
      } catch (error) {
        toast.error("Buyurtmani yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Yuklanmoqda...</div>;
  if (!order) return <div className="py-20 text-center">Buyurtma topilmadi</div>;

  return (
    <>
      <Breadcrumb title={`Buyurtma #${order.id}`} pages={["orders", order.id]} />
      <section className="py-20 bg-gray-2">
        <div className="max-w-[800px] mx-auto px-4 bg-white shadow-1 rounded-lg p-8">
          <div className="border-b pb-4 mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Buyurtma tafsilotlari</h2>
            <span className={`px-3 py-1 rounded text-white ${order.status === "NEW" ? "bg-blue" : "bg-green"
              }`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-gray-500">Sana:</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">To'lov holati:</p>
              <p className="font-medium text-green">{order.paymentStatus}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Mahsulotlar</h3>
            <div className="border rounded">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between p-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name || "Noma'lum mahsulot"}</p>
                    <p className="text-sm text-gray-400">Miqdori: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-xl font-bold">Jami:</p>
            <p className="text-xl font-bold text-blue">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;

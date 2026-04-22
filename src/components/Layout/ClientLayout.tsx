"use client";
import { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ModalProvider } from "../../app/context/QuickViewModalContext";
import { CartModalProvider } from "../../app/context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../../app/context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import QueryProvider from "../../app/context/QueryProvider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <PreLoader />;

  return (
    <>
      <QueryProvider>
        <ReduxProvider>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Header />
                {children}
                <Footer />
                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
        </ReduxProvider>
      </QueryProvider>
      <ScrollToTop />
    </>
  );
}

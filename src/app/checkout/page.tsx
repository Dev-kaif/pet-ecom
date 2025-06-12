// src/app/checkout/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IAddress, CalculatedCartSummary, PaymentMethod, IUser } from "@/types";
import { toast } from "react-hot-toast";
import PaymentForm from "@/components/checkout/PaymentForm";
import ReviewOrder from "@/components/checkout/ReviewOrder";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderSummarySidebar from "@/components/checkout/OrderSummarySidebar";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import Loader from "@/components/ui/Loader";

const initialShippingAddress: IAddress = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  isDefault: false,
};

const initialPaymentMethod: PaymentMethod = "card";

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<IAddress>(
    initialShippingAddress
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(initialPaymentMethod);
  const [cartSummary, setCartSummary] = useState<CalculatedCartSummary | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<IUser | null>(null); // New state for current user
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New loading state for user
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // --- Fetch Cart Summary ---
  const fetchCartSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await fetch("/api/cart/summary");
      const data = await res.json();
      if (data.success) {
        setCartSummary(data.data);
        if (data.data.itemCount === 0) {
          toast.error("Your cart is empty. Redirecting to cart page.");
          router.push("/cart");
        }
      } else {
        toast.error(data.message || "Failed to load cart summary.");
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error fetching cart summary:", error);
      toast.error("An error occurred while loading your cart summary.");
      router.push("/cart");
    } finally {
      setIsLoadingSummary(false);
    }
  }, [router]);

  // --- Fetch User Data ---
  const fetchUserData = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (data.success) {
        const user: IUser = data.data;
        setCurrentUser(user);

        // Auto-select default address if user has one
        const defaultAddress =
          user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];
        if (defaultAddress) {
          // Ensure we copy the address to allow modification without affecting original user object
          setShippingAddress({ ...defaultAddress });
        }
      } else {
        toast.error(data.message || "Failed to load user data.");
        // If user data can't be fetched, they might be logged out or have an issue
        // Decide whether to block checkout or allow manual entry. For now, allow manual.
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An error occurred while loading your user profile.");
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Effect to fetch both cart summary and user data on mount
  useEffect(() => {
    fetchCartSummary();
    fetchUserData();
  }, [fetchCartSummary, fetchUserData]);

  // --- Step Navigation Handlers ---
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // --- Place Order Handler ---
  const handlePlaceOrder = async () => {
    setIsProcessingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order placed successfully!");
        router.push(`/orders/${data.data._id}`);
      } else {
        toast.error(data.message || "Failed to place order.");
        console.error("Order creation error:", data.details || data.error);
      }
    } catch (error) {
      console.error("Network or unexpected error placing order:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // --- Render Current Step Component ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingForm
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            onNext={handleNext}
            userAddresses={currentUser?.addresses || []} // Pass user's addresses
            isLoadingUserAddresses={isLoadingUser} // Pass loading state for addresses
          />
        );
      case 2:
        return (
          <PaymentForm
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ReviewOrder
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            cartSummary={cartSummary}
            onPlaceOrder={handlePlaceOrder}
            onBack={handleBack}
            isProcessingOrder={isProcessingOrder}
          />
        );
      default:
        return <div>Error: Invalid step</div>;
    }
  };

  // Overall loading state for the page
  if (isLoadingSummary || isLoadingUser) {
    return <Loader />;
  }

  // Ensure cartSummary is loaded before rendering main content
  if (!cartSummary) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-50 text-secondary-700">
        <p>Error: Cart summary could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <CheckoutHeader />

      <main className="container mx-auto px-4 py-8 md:flex md:space-x-8">
        {/* Left Column: Form Steps */}
        <div className="md:w-2/3 lg:w-3/4 bg-white p-6 rounded-lg shadow-sm">
          <CheckoutProgress currentStep={currentStep} />
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            {currentStep === 1 && "Shipping Information"}
            {currentStep === 2 && "Payment Method"}
            {currentStep === 3 && "Review Your Order"}
          </h2>
          {renderStep()}
        </div>

        {/* Right Column: Order Summary (Sticky on desktop) */}
        <div className="md:w-1/3 lg:w-1/4 mt-8 md:mt-0">
          <div className="sticky top-8 bg-primary-50 p-6 rounded-lg shadow-sm border border-primary-100">
            <OrderSummarySidebar cartSummary={cartSummary} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Your Store Name. All rights reserved.
      </footer>
    </div>
  );
}

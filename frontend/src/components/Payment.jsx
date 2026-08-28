import { Button } from "@chakra-ui/react";
import { createSkillOrderApi, verifySkillPaymentApi } from "@/api/payments";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";

const Payment = ({ skillId, amountLabel, bookingDraft, onSuccess }) => {
  const { user } = useAuth();

  const handlePayment = async () => {
    try {
      const { data } = await createSkillOrderApi({ skillId, ...bookingDraft });
      if (!data.success) throw new Error(data.message || "Could not create Razorpay order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Skill Exchange",
        description: "Skill booking payment",
        order_id: data.order.id,

        handler: async (response) => {
          try {
            const verifyRes = await verifySkillPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toaster.create({ title: "Payment successful", description: "Booking request sent.", type: "success" });
              onSuccess?.(verifyRes.data.booking);
            } else {
              toaster.create({ title: "Payment could not be verified", type: "error" });
            }
          } catch (err) {
            toaster.create({ title: "Verification failed", description: err.response?.data?.message, type: "error" });
          }
        },

        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.phoneNumber,
        },

        theme: { color: "#c8961e" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toaster.create({ title: "Could not start payment", description: error.response?.data?.message, type: "error" });
    }
  };

  return (
    <Button type="button" onClick={handlePayment} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
      {amountLabel ? `Pay ${amountLabel} & request booking` : "Pay & request booking"}
    </Button>
  );
};

export default Payment;
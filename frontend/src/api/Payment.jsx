import { Button } from "@chakra-ui/react";

const Payment = () => {
  const handlePayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Could not create Razorpay order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Skill Exchange",
        description: "Test Payment",
        order_id: data.order.id,

        handler: function (response) {
          console.log("Payment successful!");
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#c8961e",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      bg="var(--gold)"
      color="white"
      _hover={{ bg: "var(--gold-deep)" }}
    >
      Pay ₹100
    </Button>
  );
};

export default Payment;
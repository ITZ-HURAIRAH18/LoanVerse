import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PayLoan = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();

  // Load PayPal SDK dynamically
  useEffect(() => {
    const loadPayPalScript = async () => {
      if (window.paypal) {
        setSdkReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ATSZ9oB0Z0XePLBJ4Ue2sUa3lUUB8BcWxLiK2eoguOM5vObizoDs4fh57Dj9PCCGmSRuKaXB7FqoYZqX&currency=USD";
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  // Fetch loan details
  useEffect(() => {
    fetch("/api/loan-history/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((l) => l.id === parseInt(loanId, 10));
        setLoan(selected || null);
      })
      .catch((err) => console.error("Error fetching loan:", err));
  }, [loanId]);

  // Render PayPal Buttons
  useEffect(() => {
    if (sdkReady && loan) {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";

      window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "pill",
          label: "pay",
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: loan.request_amount.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((orderData) => {
            const transaction = orderData.purchase_units[0].payments.captures[0];
            fetch(`/api/pay-loan/${loan.id}/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
              },
              credentials: "include",
              body: JSON.stringify({
                transaction_id: transaction.id,
                amount: transaction.amount.value,
              }),
            })
              .then((res) => {
                if (res.ok) {
                  alert("✅ Payment Successful!");
                  navigate("/loan-history");
                } else {
                  alert("⚠ Server error saving payment.");
                }
              })
              .catch(() => alert("❌ Network error."));
          });
        },
      }).render("#paypal-button-container");
    }
  }, [sdkReady, loan, navigate]);

  // Extract CSRF token from cookies
  const getCSRFToken = () => {
    const name = "csrftoken=";
    const cookies = decodeURIComponent(document.cookie).split(";");
    for (let cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name)) return c.substring(name.length);
    }
    return "";
  };

  if (!loan)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-100 p-6">
        <p className="text-blue-800 font-semibold text-lg select-none">Loading loan...</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center py-10 px-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-blue-100 text-blue-900 select-none">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Pay Loan #{loan.id}</h2>
        <p>
          <strong>Category:</strong> {loan.category.name}
        </p>
        <p>
          <strong>Amount Due:</strong> ₹{loan.request_amount.toFixed(2)}
        </p>

        <div className="mt-6 text-center">
          <p className="font-semibold mb-3">Pay with PayPal</p>
          <div id="paypal-button-container" className="inline-block min-h-[45px]" />
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/loan-history")}
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition rounded-md px-5 py-2 font-semibold"
          >
            Back to History
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PayLoan;

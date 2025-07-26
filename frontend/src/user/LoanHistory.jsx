import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const PayPalModal = ({ amount, loanId, onClose, onSuccess }) => {
  useEffect(() => {
    if (!window.paypal) {
      console.error("PayPal SDK not loaded");
      alert("PayPal SDK not loaded");
      onClose();
      return;
    }

    const container = document.getElementById("paypal-button-container");
    container.innerHTML = "";

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "blue", shape: "pill", label: "pay" },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((orderData) => {
            const transaction = orderData.purchase_units[0].payments.captures[0];
            fetch(`/api/pay-loan/${loanId}/`, {
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
                  alert("✅ Payment successful!");
                  onSuccess();
                } else {
                  alert("⚠ Server failed to record payment.");
                }
              })
              .catch((err) => {
                console.error("Error saving payment:", err);
                alert("❌ Network error.");
              });
          });
        },
        onCancel: onClose,
        onError: (err) => {
          console.error("PayPal error:", err);
          alert("❌ Payment error.");
          onClose();
        },
      })
      .render("#paypal-button-container");
  }, []);

  const getCSRFToken = () => {
    const name = "csrftoken=";
    const cookies = decodeURIComponent(document.cookie).split(";");
    for (let cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name)) return c.substring(name.length);
    }
    return "";
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 10,
          padding: 20,
          width: 320,
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close PayPal modal"
          style={{
            position: "absolute",
            top: 10,
            right: 15,
            background: "transparent",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        <div id="paypal-button-container" />
      </div>
    </div>,
    document.body
  );
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);
  const [payModalInfo, setPayModalInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    fetch("/api/loan-history/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loan history:", err);
        setLoading(false);
      });

    const addPayPalScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ATSZ9oB0Z0XePLBJ4Ue2sUa3lUUB8BcWxLiK2eoguOM5vObizoDs4fh57Dj9PCCGmSRuKaXB7FqoYZqX&currency=USD";
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => console.error("PayPal SDK failed to load.");
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const handlePayClick = (loanId, amount) => {
    if (!sdkReady) {
      alert("PayPal SDK is still loading. Please wait.");
      return;
    }
    setPayModalInfo({ loanId, amount });
  };

  const closePayModal = () => setPayModalInfo(null);
  const onPaymentSuccess = () => {
    closePayModal();
    window.location.reload();
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = loans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(loans.length / rowsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 font-semibold">
        Loading loan history...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 py-10 px-6 overflow-x-auto">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12 tracking-tight drop-shadow-md select-none">
        Your Loan History
      </h2>

      <div className="mx-auto max-w-7xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
        <table className="w-full text-sm text-left text-blue-900 table-auto">
          <thead className="bg-blue-100 text-blue-700 uppercase text-xs tracking-widest select-none">
            <tr>
              <th className="py-4 px-6">Loan ID</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Principal</th>
              <th className="py-4 px-6">Interest</th>
              <th className="py-4 px-6">Total Payable</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Request Date</th>
              <th className="py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentRows.length === 0 ? (
                <motion.tr
                  key="no-loans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={8}
                    className="py-6 px-6 text-center text-blue-400 italic select-none"
                  >
                    No loan history available.
                  </td>
                </motion.tr>
              ) : (
                currentRows.map((loan, index) => (
                  <motion.tr
                    key={loan.id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`cursor-pointer transition-shadow duration-300 ${
                      index % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:shadow-xl hover:bg-blue-100 select-none`}
                  >
                    <td className="py-4 px-6 text-center font-mono">{loan.id}</td>
                    <td className="py-4 px-6 text-center">{loan.category.name}</td>
                    <td className="py-4 px-6 text-center font-mono">${Math.round(loan.request_amount)}</td>
                    <td className="py-4 px-6 text-center font-mono text-yellow-700">${Math.round(loan.interest_amount)}</td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-blue-800">${Math.round(loan.total_with_interest)}</td>
                    <td className="py-4 px-6 text-center">
                      {loan.status === "Approved" && !loan.is_fully_paid ? (
                        <span className="text-yellow-600 font-semibold">Approved</span>
                      ) : loan.status === "Paid" || loan.is_fully_paid ? (
                        <span className="text-green-600 font-semibold">Paid</span>
                      ) : loan.status === "Pending" ? (
                        <span className="text-cyan-600 font-semibold">Pending</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">{loan.request_date}</td>
                    <td className="py-4 px-6 text-center">
                      {loan.status === "Approved" && !loan.is_fully_paid ? (
                        <button
                          onClick={() => handlePayClick(loan.id, parseFloat(loan.total_with_interest))}
                          disabled={!sdkReady}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-1 px-4 rounded text-sm w-24 transition-shadow hover:shadow-md"
                        >
                          Pay
                        </button>
                      ) : loan.status === "Paid" || loan.is_fully_paid ? (
                        <span className="text-gray-500 select-none">Paid</span>
                      ) : loan.status === "Pending" ? (
                        <span className="text-cyan-600 select-none">Waiting</span>
                      ) : (
                        <span className="text-red-600 select-none">N/A</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {loans.length > rowsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-blue-800 font-semibold text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {payModalInfo && (
        <PayPalModal
          amount={payModalInfo.amount}
          loanId={payModalInfo.loanId}
          onClose={closePayModal}
          onSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default LoanHistory;

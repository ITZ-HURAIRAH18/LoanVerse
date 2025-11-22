import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../axiosfile/axios";

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;



useEffect(() => {
  axiosInstance
    .get("/transaction-history/")
    .then((res) => {
      setTransactions(res.data.transactions || []);
    })
    .catch((err) => {
      console.error("Error fetching transaction history:", err);
    });
}, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 py-12 px-4">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-8 select-none">
          Your Transactions
        </h2>

        <div className="overflow-x-auto scrollbar-hide" style={{ overflowY: "hidden" }}>
          <table className="min-w-full table-auto text-sm text-blue-900 border-separate border-spacing-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead className="bg-blue-100 text-blue-800 uppercase text-xs select-none">
              <tr>
                <th className="px-6 py-3 border-b border-blue-200 text-center">Transaction ID</th>
                <th className="px-6 py-3 border-b border-blue-200 text-center">Loan ID</th>
                <th className="px-6 py-3 border-b border-blue-200 text-center">Amount Paid</th>
                <th className="px-6 py-3 border-b border-blue-200 text-center">Status</th>
                <th className="px-6 py-3 border-b border-blue-200 text-center">Paid On</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentRows.length > 0 ? (
                  currentRows.map((txn, idx) => (
                    <motion.tr
                      key={txn.id}
                      custom={idx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`$${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} cursor-default transition-shadow duration-300 hover:shadow-xl hover:bg-blue-100 select-none`}
                      style={{ borderLeft: "none", borderRight: "none" }}
                    >
                      <td className="px-6 py-4 border-b border-blue-200 text-center font-mono">{txn.id}</td>
                      <td className="px-6 py-4 border-b border-blue-200 text-center">{txn.loan_id}</td>
                      <td className="px-6 py-4 border-b border-blue-200 text-center font-mono">${txn.amount_paid}</td>
                      <td className="px-6 py-4 border-b border-blue-200 text-center">{txn.status}</td>
                      <td className="px-6 py-4 border-b border-blue-200 text-center">{txn.paid_on}</td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    key="no-transactions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="text-center text-blue-400 italic px-6 py-6 border-b border-blue-200 select-none">
                      No transaction history available.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {transactions.length > rowsPerPage && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-blue-800 font-semibold">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default TransactionHistory;

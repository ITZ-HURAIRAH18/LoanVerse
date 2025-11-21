import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../axiosfile/axios";

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const AdminUserLoans = () => {
  const [loans, setLoans] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

useEffect(() => {
  const fetchUserLoans = async () => {
    try {
      const res = await axiosInstance.get("/user-loans/");
      
      // 🔥 Filter out rejected loans
      const filtered = res.data.loans.filter((loan) => loan.status !== "Rejected");
      setLoans(filtered);

    } catch (err) {
      console.error("Failed to fetch loans:", err);
      setLoans([]); // fallback
    }
  };

  fetchUserLoans();
}, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = loans ? loans.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = loans ? Math.ceil(loans.length / itemsPerPage) : 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const calculateTotalWithInterest = (amount, term_years) => {
    const years = term_years || 1;
    const interest = amount * 0.08 * years;
    return (amount + interest).toFixed(2);
  };

  if (loans === null)
    return (
      <div className="max-w-7xl mx-auto p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={40} className="mb-3 rounded-xl" />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6">
      <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
        User Loan Records
      </h2>
      <div className="max-w-7xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl overflow-x-auto p-6 animate-fade-in">
        <table className="min-w-full text-sm text-left text-indigo-900">
          <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs tracking-widest">
            <tr>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Loan ID</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Username</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Category</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Approved Amount</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Term (Years)</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Total with Interest</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Approved Date</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Status</th>
              <th className="sticky top-0 py-4 px-6 backdrop-blur-sm">Payments</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentItems.length ? (
                currentItems.map((loan, index) => (
                  <motion.tr
                    key={loan.id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`cursor-pointer transition-shadow duration-300 ${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:shadow-xl hover:bg-indigo-100`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <td className="py-3 px-6 font-mono">{loan.id}</td>
                    <td className="py-3 px-6 font-semibold">{loan.username}</td>
                    <td className="py-3 px-6">{loan.category}</td>
                    <td className="py-3 px-6 font-mono text-indigo-900">${loan.approved_amount}</td>
                    <td className="py-3 px-6">{loan.term_years}</td>
                    <td className="py-3 px-6 font-mono text-green-800 font-semibold">
                      ${calculateTotalWithInterest(loan.approved_amount, loan.term_years)}
                    </td>
                    <td className="py-3 px-6">
                      {loan.approved_date !== "N/A" ? (
                        loan.approved_date
                      ) : (
                        <span className="text-indigo-300 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full select-none ${
                          loan.status === "Paid"
                            ? "bg-green-200 text-green-900"
                            : loan.status === "Unpaid"
                            ? "bg-yellow-200 text-yellow-900"
                            : loan.status === "Pending"
                            ? "bg-indigo-200 text-indigo-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      {loan.status === "Pending" ? (
                        <span className="text-indigo-300 italic">N/A</span>
                      ) : loan.transactions.length ? (
                        loan.transactions.map((tx, i) => (
                          <div key={i} className="text-sm">
                            ${tx.amount_paid}{" "}
                            <span className="text-indigo-400 text-xs">on {tx.payment_date}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-indigo-300 italic">No payments</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-6 px-6 text-center text-indigo-400 italic">
                    No loan records found.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {loans.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 pt-6 text-indigo-800">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl bg-indigo-200 hover:bg-indigo-300 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-sm font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl bg-indigo-200 hover:bg-indigo-300 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserLoans;

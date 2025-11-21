import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../axiosfile/axios";

// Animation for each table row
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

const AdminLoans = () => {
  const [loans, setLoans] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

useEffect(() => {
  const fetchLoans = async () => {
    try {
      const res = await axiosInstance.get("/loans/");
      setLoans(res.data.loans || []);
    } catch (err) {
      console.error("Failed to fetch loans", err);
      setLoans([]); // fallback on error
    }
  };

  fetchLoans();
}, []);

  if (loans === null) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
          All User Loans
        </h2>
        <div className="max-w-7xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl p-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={40} className="mb-3 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = loans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(loans.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
        All User Loans
      </h2>

      <div className="max-w-7xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl">
        <div className="w-full">
          <table className="w-full text-sm text-left text-indigo-900 table-auto">
            <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs tracking-widest">
              <tr>
                <th className="py-4 px-4">Loan ID</th>
                <th className="py-4 px-4">Username</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Interest</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentLoans.length > 0 ? (
                  currentLoans.map((loan, idx) => (
                    <motion.tr
                      key={loan.id}
                      custom={idx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`transition-shadow duration-300 ${
                        idx % 2 === 0 ? "bg-white" : "bg-indigo-50"
                      } hover:shadow-xl hover:bg-indigo-100 cursor-pointer`}
                    >
                      <td className="py-4 px-4 font-mono">{loan.id}</td>
                      <td className="py-4 px-4 font-semibold truncate max-w-[180px]">
                        {loan.username}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[150px]">
                        {loan.category}
                      </td>
                      <td className="py-4 px-4 font-mono truncate max-w-[120px]">
                        ${loan.amount}
                      </td>
                      <td className="py-4 px-4 font-mono truncate max-w-[120px]">
                        ${(loan.amount * 0.08 * (loan.term_years || 1)).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[100px]">
                        {loan.status}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[160px]">
                        {loan.date}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={7} className="py-6 px-4 text-center text-indigo-400 italic">
                      No loans found.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {loans.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 py-6 text-indigo-800">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl bg-indigo-200 hover:bg-indigo-300 transition-all duration-200 ${
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
              className={`px-4 py-2 rounded-xl bg-indigo-200 hover:bg-indigo-300 transition-all duration-200 ${
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

export default AdminLoans;

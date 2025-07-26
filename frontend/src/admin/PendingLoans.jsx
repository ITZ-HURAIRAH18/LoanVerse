import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Animation config
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

const PendingLoans = () => {
  const [loans, setLoans] = useState(null); // null = loading
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pending-loans/", {
        credentials: "include",
      });
      const data = await res.json();
      setLoans(data.loans);
    } catch (error) {
      console.error("Error fetching pending loans:", error);
      setLoans([]); // fallback
    }
  };

  const handleAction = async (loanId, action) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/process-loan/${loanId}/${action}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
        }
      );
      const result = await res.json();
      if (result.success) {
        fetchLoans(); // Refresh list
      }
    } catch (err) {
      console.error("Error processing loan:", err);
    }
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loans === null) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
          Pending Loan Requests
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
        Pending Loan Requests
      </h2>

      <div className="max-w-7xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl">
        <div className="w-full">
          <table className="w-full text-sm text-left text-indigo-900 table-auto">
            <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs tracking-widest">
              <tr>
                <th className="py-4 px-4">Loan ID</th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Requested Date</th>
                <th className="py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentLoans.length > 0 ? (
                  currentLoans.map((loan, index) => (
                    <motion.tr
                      key={loan.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`transition-shadow duration-300 ${
                        index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                      } hover:shadow-xl hover:bg-indigo-100`}
                    >
                      <td className="py-4 px-4 font-mono">{loan.id}</td>
                      <td className="py-4 px-4 font-semibold truncate max-w-[160px]">
                        {loan.user}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[140px]">
                        {loan.category}
                      </td>
                      <td className="py-4 px-4 font-mono truncate max-w-[120px]">
                        ${loan.amount}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[160px]">
                        {loan.requested_date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(loan.id, "approve")}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(loan.id, "reject")}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="py-6 px-4 text-center text-indigo-400 italic">
                      No pending requests.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

export default PendingLoans;

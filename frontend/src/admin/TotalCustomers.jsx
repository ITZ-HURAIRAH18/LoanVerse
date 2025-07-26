import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const TotalCustomers = () => {
  const [customers, setCustomers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/customers/", {
          credentials: "include",
        });
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]); // fallback
      }
    };

    fetchCustomers();
  }, []);

  if (customers === null) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
          Total Customers
        </h2>
        <div className="max-w-5xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl p-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={40} className="mb-3 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
        Total Customers
      </h2>

      <div className="max-w-5xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl">
        <div className="w-full">
          <table className="w-full text-sm text-left text-indigo-900 table-auto">
            <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs tracking-widest">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Email</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, idx) => (
                    <motion.tr
                      key={customer.id}
                      custom={idx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`transition-shadow duration-300 ${
                        idx % 2 === 0 ? "bg-white" : "bg-indigo-50"
                      } hover:shadow-xl hover:bg-indigo-100 cursor-pointer`}
                    >
                      <td className="py-4 px-6 font-mono">{customer.id}</td>
                      <td className="py-4 px-6 font-semibold truncate max-w-[200px]">
                        {customer.username}
                      </td>
                      <td className="py-4 px-6 truncate max-w-[250px]">
                        {customer.email}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={3} className="py-6 px-6 text-center text-indigo-400 italic">
                      No customers found.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {customers.length > itemsPerPage && (
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

export default TotalCustomers;

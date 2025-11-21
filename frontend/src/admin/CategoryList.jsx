import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosfile/axios";

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

const CategoryList = () => {
  const [categories, setCategories] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories/");

    setCategories(res.data.categories || []);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    setCategories([]);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setDeleting(id);
      const res = await axiosInstance.delete(`/categories/${id}/`);

      if (res.status === 200 || res.status === 204) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete category.");
    } finally {
      setDeleting(null);
    }
  };

  if (categories === null) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
          Loan Categories
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
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-10 px-6 overflow-hidden">
      <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 tracking-tight drop-shadow-md">
        Loan Categories
      </h2>

      <div className="max-w-7xl mx-auto bg-white border border-indigo-100 shadow-2xl rounded-3xl">
        <div className="w-full">
          <table className="w-full text-sm text-left text-indigo-900 table-auto">
            <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs tracking-widest select-none">
              <tr>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.length > 0 ? (
                  currentItems.map((cat, idx) => (
                    <motion.tr
                      key={cat.id}
                      custom={idx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`transition-shadow duration-300 ${
                        idx % 2 === 0 ? "bg-white" : "bg-indigo-50"
                      } hover:shadow-xl hover:bg-indigo-100`}
                    >
                      <td className="py-4 px-4 font-semibold truncate max-w-[200px]">
                        {cat.name}
                      </td>
                      <td className="py-4 px-4 truncate max-w-[500px]">
                        {cat.description || (
                          <span className="italic text-indigo-400">No description</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center space-x-2">
                        <Link
                          to={`/edit-category/${cat.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-xs font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleting === cat.id}
                          className={`px-4 py-1 rounded-full text-xs font-semibold text-white transition ${
                            deleting === cat.id
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {deleting === cat.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={3} className="py-6 px-4 text-center text-indigo-400 italic">
                      No categories found.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {categories.length > itemsPerPage && (
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

export default CategoryList;
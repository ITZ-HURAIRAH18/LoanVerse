import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 20 } },
};

const linkVariants = {
  hover: { scale: 1.1, color: '#60a5fa' }, // Tailwind blue-400 color
  tap: { scale: 0.95 },
};

const AdminHeader = () =>
(
  <motion.nav
    className="bg-gray-900 text-gray-100 px-8 py-4 shadow-lg"
    variants={navVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* Branding */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/admin-dashboard" >
          <h1 className="text-3xl font-extrabold tracking-tight text-white cursor-pointer select-none">
            Admin Panel
          </h1>
        </Link>
      </motion.div>

      {/* Navigation Links */}
      <div className="flex gap-8 items-center text-sm font-semibold">
        {[
          { label: "Total Customers", to: "/total-customers" },
          { label: "Loans", to: "/loans" },
          { label: "Approved Loans", to: "/approved-loans" },
          { label: "Pending Loans", to: "/pending-loans" },
          { label: "Rejected Loans", to: "/rejected-loans" },
          { label: "Loan Categories", to: "/categories" },
          { label: "Add Category", to: "/create-category" },
          { label: "User Loans", to: "/user-loans" },
        ].map(({ label, to }) =>
(
          <motion.div key={to} variants={linkVariants} whileHover="hover" whileTap="tap" >
            <Link to={to} className="cursor-pointer">
              {label}
            </Link>
          </motion.div>
        ))}

        <motion.a
          href="/logout"
          className="text-red-500 hover:text-red-400 cursor-pointer font-semibold"
          whileHover={{ scale: 1.1, color: "#fca5a5" }} // lighter red
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.a>
      </div>
    </div>
  </motion.nav>
);

export default AdminHeader;

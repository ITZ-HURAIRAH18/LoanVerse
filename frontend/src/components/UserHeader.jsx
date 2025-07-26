import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 25, delay: 0.1 } },
};

const linkVariants = {
  hover: { scale: 1.1, color: '#60a5fa' }, // Tailwind's blue-400 color hex
  tap: { scale: 0.95 },
};

const UserHeader = () =>
(
  <motion.nav
    className="bg-gray-900 text-gray-100 px-8 py-4 shadow-lg"
    variants={navVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* Branding */}
      <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
        <Link to="/user-dashboard">
          <h1 className="text-3xl font-extrabold tracking-tight text-white cursor-pointer select-none">
            User Panel
          </h1>
        </Link>
      </motion.div>

      {/* Navigation Links */}
      <div className="flex gap-8 items-center text-sm font-semibold">
        {[
          { label: "Dashboard", to: "/user-dashboard" },
          { label: "Loan History", to: "/loan-history" },
          { label: "Apply Loan", to: "/apply-loan" },
          { label: "Transactions", to: "/transactions" }, // New Link
        ].map(({ label, to }) =>
(
          <motion.div
            key={to}
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link to={to} className="cursor-pointer">
              {label}
            </Link>
          </motion.div>
        ))}

        <motion.a
          href="/logout"
          className="text-red-500 hover:text-red-400 cursor-pointer font-semibold"
          whileHover={{ scale: 1.1, color: "#fca5a5" }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.a>
      </div>
    </div>
  </motion.nav>
);

export default UserHeader;

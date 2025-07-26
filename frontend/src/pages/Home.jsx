import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { motion } from 'framer-motion';
import { LogIn, LogOut, LayoutDashboard, UserPlus } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const lottieContainer = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets10.lottiefiles.com/packages/lf20_gjmecwii.json' // ✅ Correct animation path
    });

    return () => animation.destroy();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout/', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex items-center justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-6xl bg-white bg-opacity-90 shadow-xl rounded-3xl p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col justify-center space-y-8">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">Loan Manager</span>
          </h1>
          <p className="text-xl text-gray-700 min-h-[48px]">
            <Typewriter
              words={[
                'Apply loans easily 📄',
                'Get instant approvals 🔒',
                'Manage repayments securely 💼',
              ]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2200}
            />
          </p>

          {/* ACTION BUTTONS */}
          {user?.is_authenticated ? (
            <div className="flex flex-wrap gap-6 mt-4">
              {user.is_staff ? (
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin-dashboard')}
                  className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg font-semibold text-lg"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  Admin Dashboard
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/user-dashboard')}
                  className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg font-semibold text-lg"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  User Dashboard
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-lg"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 mt-4">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-gradient-blue flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg font-semibold text-lg text-white"
              >
                <LogIn className="w-6 h-6" />
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="btn-gradient-pink flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg font-semibold text-lg text-white"
              >
                <UserPlus className="w-6 h-6" />
                Sign Up
              </motion.button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE LOTTIE ANIMATION */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div
            ref={lottieContainer}
            className="w-full max-w-md h-[360px]"
          />
        </motion.div>
      </motion.div>

      {/* Tailwind Custom Styles */}
      <style>{`
        .btn-primary {
          background-color: #2563eb;
          transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background-color: #1e40af;
        }
        .btn-secondary {
          transition: background-color 0.3s ease;
        }
        .btn-gradient-blue {
          background: linear-gradient(90deg, #3b82f6, #6366f1, #4f46e5);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5);
        }
        .btn-gradient-blue:hover {
          background: linear-gradient(90deg, #2563eb, #4f46e5, #4338ca);
        }
        .btn-gradient-pink {
          background: linear-gradient(90deg, #ec4899, #db2777, #be185d);
          box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.5);
        }
        .btn-gradient-pink:hover {
          background: linear-gradient(90deg, #db2777, #be185d, #9d174d);
        }
      `}</style>
    </div>
  );
};

export default Home;

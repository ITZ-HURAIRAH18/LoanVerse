
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, CheckCircle, XCircle, Users } from "lucide-react";
import axios from "axios";

// 💡 Icon mapping
const iconBlueClass = "w-7 h-7 text-blue-600";
const iconMap = {
  total_approved_amount: <DollarSign className={iconBlueClass} />,
  total_due_amount: <DollarSign className={iconBlueClass} />,
  approved_loans: <CheckCircle className={iconBlueClass} />,
  rejected_loans: <XCircle className={iconBlueClass} />,
  pending_loans: <XCircle className={iconBlueClass} />,
  total_customers: <Users className={iconBlueClass} />,
  total_paid_amount: <DollarSign className={iconBlueClass} />,
  default: <DollarSign className={iconBlueClass} />,
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const COLORS_PIE_EXTENDED = ["#3b82f6", "#ef4444", "#f59e0b"];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(0);

    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-300 rounded-md shadow-lg">
        <p className="label text-blue-700 font-semibold">{`${data.name}`}</p>
        <p className="intro text-gray-800">{`Amount: $${data.value.toLocaleString()}`}</p>
        <p className="percent text-gray-600">{`Percentage: ${percentage}%`}</p>
      </div>
    );
  }

  return null;
};

const AdminDashboard = () => {
  const [adminStats, setAdminStats] = useState(null);
  const [name, setName] = useState("Admin");
  const [llmResponse, setLlmResponse] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);

  const parseMoney = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = Number(val.replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const parseCount = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseInt(val.replace(/[^0-9]+/g, ""), 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const sanitizeKey = (str) => {
    if (!str) return "";
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/admin-dashboard/", {
          withCredentials: true,
        });
        setAdminStats(Array.isArray(response.data.stats) ? response.data.stats : []);
        setName(response.data.first_name || "Admin");
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
        setAdminStats([]);
      }
    };

    fetchDashboardData();
  }, []);

  if (adminStats === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <span className="text-blue-700 text-lg">Loading dashboard data...</span>
      </div>
    );
  }

  const mappedStats = adminStats.map((stat) => ({
    ...stat,
    iconKey: sanitizeKey(stat.title),
  }));

  const findStatValue = (key, parser = parseMoney) => {
    const stat = mappedStats.find((s) => s.iconKey === key);
    if (!stat) return 0;
    return parser(stat.value);
  };

  const approvedAmount = findStatValue("total_approved_amount");
  const totalPaid = findStatValue("total_paid_amount");
  const totalDue = findStatValue("total_due_amount");

  const approvedLoansCount = findStatValue("approved_loans", parseCount);
  const rejectedLoansCount = findStatValue("rejected_loans", parseCount);
  const pendingLoansCount = findStatValue("pending_loans", parseCount);
  const totalCustomers = findStatValue("total_customers", parseCount);

  const totalLoans = approvedLoansCount + rejectedLoansCount + pendingLoansCount;

  const totalInterest = approvedAmount * 0.08;
  const paidInterest = totalPaid * 0.08;
  const unpaidInterest = totalDue * 0.08;

  const barChartData = [
    { name: "Approved Amount", amount: approvedAmount },
    { name: "Paid Amount", amount: totalPaid },
    { name: "Due Amount", amount: totalDue },
  ];

  const pieData = [
    { name: "Paid Interest", value: parseFloat(paidInterest.toFixed(2)) },
    { name: "Unpaid Interest", value: parseFloat(unpaidInterest.toFixed(2)) },
  ].filter((entry) => entry.value > 0);

  const callGeminiApi = async (prompt) => {
    setLlmLoading(true);
    setLlmResponse("");
    // IMPORTANT: Replace "YOUR_API_KEY" with your actual Gemini API key.
    // In a real application, you should load this securely (e.g., from environment variables).
    const apiKey = "AIzaSyBWkDcaP0O0D6NfTzFhYe9FVEsMGEtRvPc"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("LLM API error response:", errorData);
        setLlmResponse(`Error from LLM API: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log("LLM API raw response:", result); // Log the full response for debugging

      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        setLlmResponse(result.candidates[0].content.parts[0].text);
      } else {
        // Fallback for unexpected format - try to stringify the whole result for inspection
        setLlmResponse(`Unexpected LLM response format. Raw: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error("Error calling LLM API:", error);
      setLlmResponse(`Error: ${error.message}. Please check your API key and network connection.`);
    } finally {
      setLlmLoading(false);
    }
  };

  const handleGetDashboardInsights = () => {
    const prompt = `Analyze the following loan dashboard data and provide key insights and potential recommendations for an administrator. Focus on trends, areas of concern, and opportunities.

    Total Approved: $${approvedAmount.toLocaleString()}
    Total Paid: $${totalPaid.toLocaleString()}
    Total Due: $${totalDue.toLocaleString()}
    Approved Loans: ${approvedLoansCount}
    Rejected Loans: ${rejectedLoansCount}
    Pending Loans: ${pendingLoansCount}
    Total Customers: ${totalCustomers}
    Total Loans: ${totalLoans}`;
    callGeminiApi(prompt);
  };

  const handleMoneyInCirculation = () => {
    const prompt = `Analyze money circulation based on:
    - Total Approved: $${approvedAmount.toLocaleString()}
    - Total Paid: $${totalPaid.toLocaleString()}
    - Total Due: $${totalDue.toLocaleString()}`;
    callGeminiApi(prompt);
  };

  const handleEnhanceOrganization = () => {
    const prompt = `Given the statistics below, suggest improvements for process, efficiency, and risk management:
    Approved Amount: $${approvedAmount.toLocaleString()}
    Paid: $${totalPaid.toLocaleString()}
    Due: $${totalDue.toLocaleString()}
    Approved Loans: ${approvedLoansCount}
    Rejected Loans: ${rejectedLoansCount}
    Pending Loans: ${pendingLoansCount}
    Customers: ${totalCustomers}`;
    callGeminiApi(prompt);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-2 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {name}'s Dashboard
          </motion.h2>
        </header>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mappedStats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center space-x-5"
              variants={cardVariants}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
                {iconMap[stat.iconKey] || iconMap.default}
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900">
                  {(stat.iconKey.includes("amount") ||
                    stat.iconKey.includes("paid") ||
                    stat.iconKey.includes("due"))
                    ? `$${parseMoney(stat.value).toLocaleString()}`
                    : parseCount(stat.value).toLocaleString()}
                </p>
                <p className="text-xs font-semibold uppercase text-blue-500 tracking-widest truncate">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center space-x-5"
            variants={cardVariants}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
              <DollarSign className={iconBlueClass} />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">
                ${parseFloat(totalInterest).toLocaleString()}
              </p>
              <p className="text-xs font-semibold uppercase text-blue-500 tracking-widest truncate">
                Total Interest (8% Yearly)
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="bg-white border border-blue-100 rounded-3xl shadow-2xl p-8"
            variants={chartVariants}
          >
            <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">
              Approved vs Paid vs Due Amounts
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" stroke="#2563eb" />
                <YAxis stroke="#2563eb" />
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(val) => `$${val.toLocaleString()}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white border border-blue-100 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
            variants={chartVariants}
          >
            <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">
              Interest Payment Status (8% Yearly)
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_PIE_EXTENDED[index % COLORS_PIE_EXTENDED.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-blue-600 font-medium text-center">
                No interest data available to display.
              </p>
            )}
            <p className="text-blue-700 mt-4 font-medium">
              Total Interest: ${parseFloat(totalInterest).toLocaleString()}
            </p>
          </motion.div>
        </motion.div>

        {/* AI Section */}
        <motion.div
          className="bg-white border border-blue-100 rounded-3xl shadow-2xl p-8 mt-10"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">
            AI Analysis for Administrators
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={handleGetDashboardInsights}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md"
              disabled={llmLoading}
            >
              📊 Get Dashboard Insights
            </button>
            <button
              onClick={handleMoneyInCirculation}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md"
              disabled={llmLoading}
            >
              💰 Analyze Money in Circulation
            </button>
            <button
              onClick={handleEnhanceOrganization}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md"
              disabled={llmLoading}
            >
              🚀 Suggest Organizational Enhancements
            </button>
          </div>

          {llmLoading && (
            <div className="text-center text-blue-600 font-medium mt-4">
              Generating response...
            </div>
          )}

          {llmResponse && (
            <motion.div
              className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-lg font-semibold text-blue-800 mb-3">Generated Response:</h4>
              <textarea
                className="w-full p-3 border border-blue-300 rounded-md bg-white text-gray-800"
                rows="10"
                value={llmResponse}
                readOnly
              ></textarea>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
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
} from "recharts";
import { DollarSign, CheckCircle, XCircle, Users } from "lucide-react";
import axios from "axios";

const iconBlueClass = "w-7 h-7 text-blue-600";

const iconMap = {
  total_approved_amount: <DollarSign className={iconBlueClass} />,
  total_due: <DollarSign className={iconBlueClass} />,
  approved: <CheckCircle className={iconBlueClass} />,
  rejected: <XCircle className={iconBlueClass} />,
  total_loan_requests: <Users className={iconBlueClass} />,
  total_paid: <DollarSign className={iconBlueClass} />,
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

const COLORS_PIE = ["#3b82f6", "#ef4444"];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0];
    const total = payload[0].payload.total;
    const percentage = total ? ((value / total) * 100).toFixed(1) : 0;

    return (
      <div className="relative flex flex-col items-center justify-center min-w-[180px] min-h-[90px] bg-white border border-blue-300 rounded-2xl shadow-lg p-4 text-blue-900 text-center select-none">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold text-base">
            {name === "Approved" ? "Approved Loans" : "Rejected Loans"}
          </span>
        </div>
        <div className="font-bold text-2xl mb-1">
          {value.toLocaleString()} ({percentage}%)
        </div>
        <div className="text-xs text-blue-500">
          {name === "Approved"
            ? "Number of approved loan requests"
            : "Number of rejected loan requests"}
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}) => {
  const radius = outerRadius * 0.7;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-bold text-sm select-none"
    >
      {`${name}: ${value}`}
    </text>
  );
};

const UserDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [name, setName] = useState("User");
  const [llmResponse, setLlmResponse] = useState(""); // State for LLM generated text
  const [llmLoading, setLlmLoading] = useState(false); // State for LLM loading indicator

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
      const num = parseInt(val.replace(/[^0-9]+/g, ""), 10); // Ensure robust parsing for counts
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/user-dashboard/", {
          withCredentials: true,
        });
        setUserStats(Array.isArray(response.data.user_stats) ? response.data.user_stats : []);
        setName(response.data.first_name || "User");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setUserStats([]);
      }
    };

    fetchDashboardData();
  }, []);

  if (userStats === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <span className="text-blue-700 text-lg">Loading dashboard data...</span>
      </div>
    );
  }

  // Sanitizes a string for use as a key (e.g., "Total Approved Amount" -> "total_approved_amount")
  const sanitizeKey = (str) => {
    if (!str) return "";
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  const mappedStats = userStats.map((stat) => ({
    ...stat,
    iconKey: sanitizeKey(stat.title),
  }));

  const findStatValue = (key, parser = parseMoney) => {
    const stat = mappedStats.find((s) => s.iconKey === key);
    return stat ? parser(stat.value) : 0;
  };

  const approvedAmount = findStatValue("total_approved_amount");
  const totalDue = findStatValue("total_due");
  const totalPaid = findStatValue("total_paid");
  const approvedLoansCount = findStatValue("approved", parseCount);
  const rejectedLoansCount = findStatValue("rejected", parseCount);
  const totalLoanRequests = findStatValue("total_loan_requests", parseCount);

  const barChartData = [
    { name: "Approved Amount", amount: approvedAmount },
    { name: "Paid", amount: totalPaid },
    { name: "Due Amount", amount: totalDue },
  ];

  const pieData = [
    {
      name: "Approved",
      value: approvedLoansCount,
      total: approvedLoansCount + rejectedLoansCount,
      color: COLORS_PIE[0],
    },
    {
      name: "Rejected",
      value: rejectedLoansCount,
      total: approvedLoansCount + rejectedLoansCount,
      color: COLORS_PIE[1],
    },
  ];

  // Function to call Gemini API
  const callGeminiApi = async (prompt) => {
    setLlmLoading(true);
    setLlmResponse(""); // Clear previous response

    const apiKey = "AIzaSyBWkDcaP0O0D6NfTzFhYe9FVEsMGEtRvPc"; // This is correct
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("Raw LLM API Response:", result);

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setLlmResponse(text);
      } else {
        setLlmResponse(`Error: Could not get a valid response from the LLM. Response structure unexpected. Raw result: ${JSON.stringify(result)}`);
        console.error("LLM API response structure unexpected:", result);
      }
    } catch (error) {
      setLlmResponse(`Error generating response. Please check network and console for details. Error: ${error.message}`);
      console.error("Error calling LLM API:", error);
    } finally {
      setLlmLoading(false);
    }
  };

  // ✨ Feature 1: Get User Loan Summary
  const handleGetUserLoanSummary = () => {
    const prompt = `Provide a concise summary of the loan data for the user named ${name}. Include:
    - Total Approved Amount: $${approvedAmount.toLocaleString()}
    - Total Paid Amount: $${totalPaid.toLocaleString()}
    - Total Due Amount: $${totalDue.toLocaleString()}
    - Number of Approved Loans: ${approvedLoansCount.toLocaleString()}
    - Number of Rejected Loans: ${rejectedLoansCount.toLocaleString()}
    - Total Loan Requests Made: ${totalLoanRequests.toLocaleString()}

    Highlight any significant points, such as a high due amount or a large number of approved loans. Offer a brief positive closing remark encouraging good financial practices.`;
    callGeminiApi(prompt);
  };

  // ✨ Feature 2: Advice on Managing Due Amount
  const handleAdviceOnDueAmount = () => {
    const prompt = `The user, ${name}, has a total due amount of $${totalDue.toLocaleString()}. Provide 3-4 actionable and friendly tips on how they can effectively manage or reduce their outstanding loan amount. Focus on practical advice.`;
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

        {/* Stat Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mappedStats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center space-x-5 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
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
                    : stat.value}
                </p>
                <p className="text-xs font-semibold uppercase text-blue-500 tracking-widest truncate">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}
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
              Approved vs Paid vs Due
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
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
              Loan Approval Status
            </h3>
            {(approvedLoansCount + rejectedLoansCount) > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={140}
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={10}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-blue-600 font-medium text-center">
                No loan approval data available.
              </p>
            )}
            <p className="text-blue-700 mt-4 font-medium">
              Total loan requests: {(approvedLoansCount + rejectedLoansCount).toLocaleString()}
            </p>
          </motion.div>
        </motion.div>

        {/* ✨ New LLM-Powered Features Section */}
        <motion.div
          className="bg-white border border-blue-100 rounded-3xl shadow-2xl p-8 mt-10"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">
            AI-Powered Insights for You
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={handleGetUserLoanSummary}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              disabled={llmLoading}
            >
              ✨ Get My Loan Summary
            </button>
            <button
              onClick={handleAdviceOnDueAmount}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              disabled={llmLoading}
            >
              ✨ Advice on Due Amount
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
                className="w-full p-3 border border-blue-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
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

export default UserDashboard;
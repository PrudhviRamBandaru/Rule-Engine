import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./components/Footer";

function App() {
    const [rules, setRules] = useState([]);
    const [selectedRuleId, setSelectedRuleId] = useState("");
    const [ruleString, setRuleString] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCombinationOpen, setIsCombinationOpen] = useState(false);
    const [userData, setUserData] = useState({
        age: "",
        department: "",
        salary: "",
        experience: ""
    });
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [selectedRulesForCombination, setSelectedRulesForCombination] = useState([]);
    const [logicalOperator, setLogicalOperator] = useState("&");

    const server_url = process.env.SERVER_URL || "http://localhost:5000"

    const fetchData = () => {
        axios.get(`${server_url}/api/rules`)
            .then((response) => {
                setRules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rules:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createRule = () => {
        axios.post(`${server_url}/api/rules`, { ruleString })
            .then(() => {
                fetchData();
                setRuleString("");
            })
            .catch((error) => {
                console.error("Error creating rule:", error);
            });
    };

    const deleteRule = (id) => {
        axios.delete(`${server_url}/api/rules/${id}`)
            .then(() => {
                fetchData();
                if (selectedRuleId === id) setSelectedRuleId("");
            })
            .catch((error) => {
                console.error("Error deleting rule:", error);
            });
    };

    const evaluateRule = () => {
        axios.post(`${server_url}/api/rules/evaluate`, {
            ruleId: selectedRuleId,
            userData
        })
            .then((response) => {
                setEvaluationResult(response.data.result);
            })
            .catch((error) => {
                console.error("Error evaluating rule:", error);
            });
    };

    const combineRules = () => {
        axios.post(`${server_url}/api/rules/combine`, {
            ruleIds: selectedRulesForCombination,
            logicalOperator
        })
            .then(() => {
                fetchData(); 
                setIsCombinationOpen(false);
                setSelectedRulesForCombination([]);
            })
            .catch((error) => {
                console.error("Error combining rules:", error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRuleSelect = (ruleId) => {
        setSelectedRuleId(ruleId);
        setIsDropdownOpen(false);
    };

    const toggleRuleForCombination = (ruleId) => {
        if (selectedRulesForCombination.includes(ruleId)) {
            setSelectedRulesForCombination(prev => prev.filter(id => id !== ruleId));
        } else {
            setSelectedRulesForCombination(prev => [...prev, ruleId]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="bg-gray-800 text-white p-8 mt-4 pb-2 rounded-lg shadow-lg max-w-3xl w-full">
                <h1 className="text-5xl font-extrabold mb-8 text-center">Rule Engine</h1>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Create a Rule</h2>
                    <div className="flex items-center justify-between space-x-4">
                        <input
                            className="bg-gray-700 p-3 rounded text-white flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Enter rule string"
                            value={ruleString}
                            onChange={(e) => setRuleString(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-600 p-3 rounded transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={createRule}
                        >
                            Create Rule
                        </button>
                    </div>
                </div>

                <div className="mb-8 relative">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Select a Rule</h2>
                    <div
                        className="bg-gray-700 p-3 rounded w-full text-white cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>
                            {selectedRuleId
                                ? rules.find((rule) => rule._id === selectedRuleId)?.ruleString
                                : "Select a Rule"}
                        </span>
                        {/* Down arrow SVG */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded shadow-lg z-10">
                            {rules.map((rule) => (
                                <div
                                    key={rule._id}
                                    className={`flex items-center justify-between px-4 py-2 ${selectedRuleId === rule._id ? 'bg-gray-600' : ''} hover:bg-gray-700 cursor-pointer`}
                                    onClick={() => handleRuleSelect(rule._id)}
                                >
                                    <span>{rule.ruleString}</span>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 p-1 rounded text-white"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent dropdown selection when deleting
                                            deleteRule(rule._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Combine Rules</h2>
                    <button
                        className="bg-yellow-500 hover:bg-yellow-600 p-3 rounded transition-all duration-200 mb-4"
                        onClick={() => setIsCombinationOpen(!isCombinationOpen)}
                    >
                        {isCombinationOpen ? "Close Combination" : "Start Combining"}
                    </button>

                    {isCombinationOpen && (
                        <div className="mt-4">
                            <div className="flex flex-col space-y-2">
                                {rules.map((rule) => (
                                    <div key={rule._id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRulesForCombination.includes(rule._id)}
                                            onChange={() => toggleRuleForCombination(rule._id)}
                                            className="mr-2"
                                        />
                                        <span>{rule.ruleString}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center mt-4">
                                <label className="mr-2">Logical Operator:</label>
                                <select
                                    value={logicalOperator}
                                    onChange={(e) => setLogicalOperator(e.target.value)}
                                    className="bg-gray-700 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="&">AND</option>
                                    <option value="|">OR</option>
                                </select>
                            </div>
                            <button
                                className="mt-4 bg-green-500 hover:bg-green-600 p-3 rounded transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={combineRules}
                            >
                                Combine Selected Rules
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">User Data</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="age"
                            placeholder="Age"
                            value={userData.age}
                            onChange={handleInputChange}
                            className="bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            name="department"
                            placeholder="Department"
                            value={userData.department}
                            onChange={handleInputChange}
                            className="bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            name="salary"
                            placeholder="Salary"
                            value={userData.salary}
                            onChange={handleInputChange}
                            className="bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            name="experience"
                            placeholder="Experience"
                            value={userData.experience}
                            onChange={handleInputChange}
                            className="bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <button
                        className="bg-purple-500 hover:bg-purple-600 p-3 rounded transition-all duration-200"
                        onClick={evaluateRule}
                    >
                        Evaluate Selected Rule
                    </button>
                </div>

                {evaluationResult !== null && (
                    <div className="mt-4 text-center">
                        <h3 className="text-xl font-semibold">Evaluation Result:</h3>
                        <p className="text-lg">{evaluationResult ? "Matched" : "Not Matched"}</p>
                    </div>

                )}
            </div>

            <Footer />
        </div>
    );
}

export default App;

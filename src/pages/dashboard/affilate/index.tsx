// components/Affiliate.tsx
import React, { useState } from "react";
import { UserOutlined, SearchOutlined, PlusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import type { IAffiliateCustomerData, IAffiliateVoucher, IAffiliateTransaction, IEarnPointsResponse } from "./affilate.interface";
import { getAffiliateCustomer, addAffiliatePoints, redeemAffiliateVoucher } from "../../../api/admin/index";
import { useEffect } from "react";
const Affiliate = () => {
    const [customerData, setCustomerData] = useState<IAffiliateCustomerData | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState("");
    const [loading, setLoading] = useState(false);
    const [pontsResponse, setPointsResponse] = useState<IEarnPointsResponse | null>(null)
    const [RedeemVoucher, setRedeemVoucher] = useState(null)
    const handleSearch = async () => {
        console.log("search value :", searchValue)
        if (!searchValue.trim()) return;
        try {
            setLoading(true);
            const data = await getAffiliateCustomer(searchValue);
            setCustomerData(data);
            console.log("AFFILATE CUSTOMER DATA :", data)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPoints = async () => {
        if (!transactionAmount || !customerData) return;
        try {
            setLoading(true);
            const amount = parseFloat(transactionAmount);
            setPointsResponse(await addAffiliatePoints(customerData.memberInfo.phone, amount));
            // refresh customer data
            const data = await getAffiliateCustomer(customerData.memberInfo.phone);
            setCustomerData(data);
            setTransactionAmount("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemVoucher = async () => {
        if (!selectedVoucher || !customerData) return;
        try {
            setLoading(true);
            const redeemResult = await redeemAffiliateVoucher(
                customerData.memberInfo.phone,
                selectedVoucher
            );
            setRedeemVoucher(redeemResult);

            // ✅ Refresh data trực tiếp
            const refreshedData = await getAffiliateCustomer(customerData.memberInfo.phone);
            setCustomerData(refreshedData);

            // Reset selected voucher sau khi redeem thành công
            setSelectedVoucher("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // const pointsToAward = transactionAmount ? Math.floor(parseFloat(transactionAmount) * 2.55) : 0;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center py-8 px-4">
            <div className="w-full max-w-3xl flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-900">Counter Loyalty Terminal</h1>
                </div>

                {/* Customer Lookup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold mb-2">Customer Lookup</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="e.g., (555) 123-4567"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base disabled:bg-gray-100"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
                        >
                            <SearchOutlined />
                        </button>
                    </div>
                </div>

                {/* Customer Info */}
                {customerData && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                            <div className="rounded-full w-14 h-14 bg-gray-200 flex items-center justify-center">
                                <UserOutlined className="text-2xl text-gray-500" />
                            </div>
                            <div>
                                <div className="text-xl font-bold">{customerData.memberInfo.name}</div>
                                <div className="text-sm text-gray-500">Current Loyalty Points</div>
                                <div className="text-3xl font-bold text-blue-500 mt-1">
                                    {customerData.memberInfo.totalPoints ?? 0} Points
                                </div>
                            </div>
                        </div>

                        {/* Add Points & Redeem Voucher */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                                <h3 className="text-lg font-bold mb-4">Add Points</h3>
                                <input
                                    type="number"
                                    value={transactionAmount}
                                    onChange={(e) => setTransactionAmount(e.target.value)}
                                    placeholder="Transaction Amount"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 disabled:bg-gray-100"
                                />
                                <div className="bg-blue-50 rounded-md p-4 text-center mb-3">
                                    <div className="text-sm text-gray-600 mb-1">Amount to be awarded:</div>
                                    <div className="text-3xl font-bold text-blue-500">{transactionAmount} VND</div>
                                </div>
                                <button
                                    onClick={handleAddPoints}
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                                >
                                    <PlusCircleOutlined />
                                    Add Points
                                </button>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-bold mb-4">Redeem Voucher</h3>
                                    <select
                                        value={selectedVoucher}
                                        onChange={(e) => setSelectedVoucher(e.target.value)}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md mb-3 disabled:bg-gray-100"
                                    >
                                        <option value="">Select a voucher...</option>
                                        {customerData.availableVouchers.map((v: IAffiliateVoucher) => (
                                            <option key={v._id} value={v._id}>{v.title}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleRedeemVoucher}
                                        disabled={loading || !selectedVoucher}
                                        className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                                    >
                                        <SyncOutlined />
                                        Redeem & Generate Code
                                    </button>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                                <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
                                    {customerData.pointHistory.map((tx: IAffiliateTransaction) => (
                                        <div key={tx._id} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{tx.description}</div>
                                                <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className={`text-base font-bold ml-4 ${tx.type === "earn" ? "text-green-600" : "text-red-600"}`}>
                                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Affiliate;

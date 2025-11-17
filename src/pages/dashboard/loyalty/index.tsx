import React, {  useState } from "react";
import { UserOutlined, SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { getPublicLoyalty } from "@/api/dashboard";
import type { ILoyaltyData } from "./loyalty.interface"
import { showMessage } from "@/utils/showMessages";
const Loyalty = () => {
    const [customerData, setCustomerData] = useState<ILoyaltyData | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState(false)


    const handleSearch = async () => {
        setCustomerData(null);
        setLoading(true)
        if (searchValue.trim()) {
            try {
                const res = await getPublicLoyalty(searchValue);
                console.log("api result:", res);
                setLoading(false)
                if (res && res.memberInfo) {
                    setCustomerData(res);
                } else {
                    console.error("No data returned from API");
                }
            } catch (err) {
                console.error(err);
                setLoading(false)
            }
        } else {
            showMessage("error", "Vui lòng nhập số điện thoại!!!")
        }
        setLoading(false)
    };


    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-8 md:px-20 lg:px-40 xl:px-60 py-5">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between border border-gray-200 bg-white rounded-lg shadow-sm items-center px-6 py-4">
                    <div className="text-lg font-semibold text-gray-800">Loyalty Program Management</div>
                    {customerData && (
                        <div className="flex gap-3 items-center">
                            <div className="text-base font-medium ">{customerData?.memberInfo.name}</div>
                            <div className="flex justify-center items-center rounded-full bg-blue-500 w-10 h-10">
                                <UserOutlined className="text-white text-lg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Customer Lookup */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold text-gray-900">Customer Lookup</h3>
                        <p className="text-sm text-gray-500">Enter a customer's phone number to view their loyalty information</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-700">Customer Phone Number</p>
                        <div className="flex gap-2">
                            <input
                                type="text"

                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="e.g., (555) 123-4567"
                                className={`flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base${loading ? "bg-gray-100 cursor-not-allowed text-gray-600 hover:" : ""} `}
                            />
                            <button
                                onClick={handleSearch}
                                className={`px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium${loading ? "bg-blue-200" : "bg-blue-500"}`}
                            >
                                <SearchOutlined />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center text-4xl h-56">{<LoadingOutlined />}</div>
                ) : (
                    <div className="flex flex-col gap-7">

                        {/* Customer Info Card - Only show when searched */}
                        {customerData && customerData.memberInfo && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full w-16 h-16 bg-gray-200 flex items-center justify-center">
                                        <UserOutlined className="text-3xl text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {customerData.memberInfo.name}
                                        </div>
                                        <div className="text-sm text-gray-500">Current Loyalty Points</div>
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-blue-500">
                                    {customerData.memberInfo.redeemablePoints.toLocaleString()} Points
                                </div>
                            </div>
                        )}

                        {/* Vouchers and History */}
                        {customerData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Available Vouchers */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Vouchers</h3>
                                    <div className="flex flex-col gap-3">
                                        {customerData.availableVouchers.map((voucher) => (
                                            <div
                                                key={voucher._id}
                                                className="border border-gray-200 rounded-md p-4 hover:border-blue-400 hover:shadow-sm transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="text-base font-semibold text-gray-900">
                                                            {voucher.voucherId.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-0.5">
                                                            Code: {voucher.voucherCode}
                                                        </div>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-500 ml-3">
                                                        {voucher.pointsSpent} Pts
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent History</h3>
                                    <div className="flex flex-col gap-2">
                                        {customerData.PointTransactionHistory.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.description}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`text-base font-bold ${item.type === "earn" ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {item.type === "earn" ? "+" : "-"}{Math.abs(item.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loyalty;
import axios from "axios";
import React from "react";

const URL = "https://loyaty-be.onrender.com";


export const getPublicLoyalty = async(phone :string)=>{

    const publicURL = `${URL}/api/public/loyalty/${phone}`
    try {
        const res = await axios.get(publicURL);
        console.log("PUBLIC DATA :", res.data?.data);
        return res.data?.data;
    } catch (error) {
        console.log("ERROR GET PUBLIC LOYALTY: ", error);
        throw error;
    }
    
}








// interface iToken {
//     token:string | null
// }
// export const getLoyaltyProfile = async({token}:iToken)=>{
//     const ProfileUrl = `${URL}/api/loyalty/profile`;
//     const config = {
//     headers: { Authorization: `Bearer ${token}` }
//     };
//     try {
//         const res = await axios.get(ProfileUrl,config);
//         console.log("Profile SUCCESS: ", res.data);
//         return res.data;
//     } catch (error) {
//         console.log("Profile FAILED: ", error);
//         throw error;
//     }

// }
// export const postLoyaltyCheckreward = async({token}:iToken)=>{
//     const ProfileUrl = `${URL}/api/loyalty/check-rewards`;
//     const config = {
//     headers: { Authorization: `Bearer ${token}` }
//     };
//     try {
//         const res = await axios.post(ProfileUrl,config);
//         console.log("CheckReward SUCCESS: ", res.data);
//         return res.data;
//     } catch (error) {
//         console.log("CheckReward FAILED: ", error);
//         throw error;
//     }

// }
// interface iRedeem {
//     token:string,
//     voucherId:string
// }
// export const postLoyaltyRedeem = async({token,voucherId}:iRedeem)=>{
//     const ProfileUrl = `${URL}/api/loyalty/redeem`;
//     const config = {
//     headers: { Authorization: `Bearer ${token}` }
//     };
//     const payload = {
//         voucherId: voucherId
//     }
//     try {
//         const res = await axios.post(ProfileUrl,payload,config);
//         console.log("Redeem SUCCESS: ", res.data);
//         return res.data;
//     } catch (error) {
//         console.log("Redeem FAILED: ", error);
//         throw error;
//     }

// }

// export const getMyVoucher = async({token}:iToken)=>{
//     const ProfileUrl = `${URL}/api/loyalty/my-voucher`;
//     const config = {
//     headers: { Authorization: `Bearer ${token}` }
//     };
//     try {
//         const res = await axios.get(ProfileUrl,config);
//         console.log("MYVOUCHER SUCCESS: ", res.data);
//         return res.data;
//     } catch (error) {
//         console.log("MYVOUCHER FAILED: ", error);
//         throw error;
//     }

// }
// export const getOrder = async({token}:iToken)=>{
//     const ProfileUrl = `${URL}/api/loyalty/order`;
//     const config = {
//     headers: { Authorization: `Bearer ${token}` }
//     };
//     try {
//         const res = await axios.get(ProfileUrl,config);
//         console.log("Order SUCCESS: ", res.data);
//         return res.data;
//     } catch (error) {
//         console.log("Order FAILED: ", error);
//         throw error;
//     }

// }


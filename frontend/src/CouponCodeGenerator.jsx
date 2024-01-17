// CouponCodeGenerator.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";

const CouponCodeGenerator = () => {
  // const backendURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [numCoupons, setNumCoupons] = useState(1);
  const [couponCodes, setCouponCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCoupons();
  }, []); // Fetch coupons when the component mounts

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/coupons`);
      setCouponCodes(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCodes = async () => {
    try {
      setLoading(true);
      const generatedCouponCodes = [];
      for (let i = 0; i < numCoupons; i++) {
        const { data } = await axios.post(
          `${window.location.origin}/api/coupons`,
          generateCouponData()
        );
        generatedCouponCodes.push(data);
      }
      setCouponCodes((prevCodes) => [...prevCodes, ...generatedCouponCodes]);
    } catch (error) {
      alert("Error generating coupons");
      console.error("Error generating coupons:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCouponData = () => {
    const couponCode = generateUniqueCouponCode();
    const link = `https://epitight1.myshopify.com/pages/coupon?couponCode=${couponCode}`;
    return { couponCode, link, used: false };
  };

  const generateUniqueCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;

    let couponCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters[randomIndex];
    }

    return couponCode;
  };

  return (
    <div className="w-11/12 mx-auto">
      {loading ? (
        <div className="h-screen z-50 w-full flex justify-center items-center fixed top-0 left-0 bg-white text-7xl text-black text-center flex-col gap-8">
          <UseAnimations animation={loading2} size={86} />
        </div>
      ) : (
        <>
          <h1 className="text-center mt-16">Sunchem Coupon Code Generator</h1>
          <div className="w-full gap-8 h-auto py-16 my-16 flex flex-col justify-center items-center bg-white rounded-2xl p-4 text-black">
            <div className="flex gap-4">
              <label className="block mb-2 text-2xl">
                Number of coupons you want to generate:
              </label>
              <input
                type="number"
                placeholder="Enter Number"
                className="text-center w-full p-2 border rounded-full placeholder:pl-4 border-gray-300 text-[#f6f6f6] placeholder:text-[#f6f6f6] placeholder:opacity-50 mb-4"
                value={numCoupons}
                onChange={(e) => setNumCoupons(e.target.value)}
              />
            </div>

            <div className="flex gap-8 justify-center items-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-full"
                onClick={generateCouponCodes}
              >
                Generate Coupon Codes
              </button>
              <Link
                className="rounded-full text-white hover:text-white"
                to="/codes"
              >
                <button className="rounded-full">See All Codes</button>
              </Link>
            </div>
          </div>
          <div className="my-16">
            <p>Total coupon codes generated till now: {couponCodes.length}</p> 
            <p>
              <b className="text-red-700">Used</b> coupon codes:{" "}
              {couponCodes.filter((coupon) => coupon.used).length}
            </p>
            <p>
              <b className="text-green-700">Not Used</b> coupon codes:{" "}
              {couponCodes.filter((coupon) => !coupon.used).length}
            </p>
          </div>

          <h2 className="text-4xl">
            All Generated coupon codes and their status
          </h2>
          <div className="justify-center mt-8 flex flex-wrap">
            {couponCodes.map(
              ({ qrCode, link, couponCode, used, _id }, index) => (
                <div
                  key={index}
                  className="mr-4 mb-4 p-4 bg-[#f6f6f6] text-black rounded-2xl text-wrap"
                >
                  <p className="text-center mt-2">
                    Coupon {index + 1} : {couponCode}
                  </p>
                  <p
                    className={`text-center mt-2 ${
                      used ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {used ? "Status : Used" : "Status : Not Used"}
                  </p>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CouponCodeGenerator;

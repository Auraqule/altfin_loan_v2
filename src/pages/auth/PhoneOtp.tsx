import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useLoan";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import {
  // setIsVerified,
  setIsLoggedIn,
} from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
const PhoneOtp = () => {
  const [otp, setOtp] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [confirmObj, setConfirmObj] = useState<any>({});
  // REDUX
  const dispatch = useAppDispatch();
  const userReg = useAppSelector((state) => state.user.user);

  const phoneOTP = `+234${userReg.phoneNo?.toString().slice(0)}`;

  const navigate = useNavigate();

  const setUpRecaptcha = () => {
    console.log(phoneOTP);

    const recaptcha = new RecaptchaVerifier("recaptcha-container", {}, auth);
    recaptcha.render();
    return signInWithPhoneNumber(auth, phoneOTP, recaptcha);
  };
  const getOTP = async (e: any) => {
    e.preventDefault();
    try {
      const response = await setUpRecaptcha();
      //   console.log(phoneOTP);
      //   console.log(response.verificationId);
      setConfirmObj(response);
      if (response.verificationId) setIsCaptchaChecked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOTP = async (e: any) => {
    e.preventDefault();
    if (otp === " " || otp === null) return;
    try {
      await confirmObj.confirm(otp);
      dispatch(setIsLoggedIn(true));
      navigate("/loan");
      setOtp("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="bg-blue h-screen w-screen flex items-center justify-center">
      <div
        className="bg-white px-8 py-8 rounded-xl shadow-md w-[50vw]  max-w-sm min-h-[40vh] "
        style={{ minWidth: "300px" }}
      >
        <h1 className="font-bold pb-2">Hi {userReg.fullname}</h1>
        <p>
          Your account is currently being created{" "}
          <span className="font-bold">Successfully</span>
        </p>
        {!isCaptchaChecked && (
          <p>Click on Get OTP below to receive your OTP via SMS</p>
        )}
        {isCaptchaChecked && (
          <p>
            An <span className="font-semibold"> OTP</span> number has been sent
            to <span className="font-bold">0{userReg.phoneNo}</span>
          </p>
        )}
        <div className="flex align-middle justify-between h-10 mt-4 mb-4">
          <form
            onSubmit={verifyOTP}
            className="flex align-middle justify-between h-10 mt-4 mb-4"
          >
            <input
              className="py-2 px-2 max-w-[200px] block w-1/2"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            {isCaptchaChecked && (
              <button
                className="bg-green-500 p-2 rounded-lg hover:font-semibold"
                type="submit"
              >
                Verify OTP
              </button>
            )}
            {!isCaptchaChecked && (
              <button
                type="button"
                className="bg-green-500 p-2 rounded-lg hover:font-semibold"
                onClick={getOTP}
              >
                Get OTP
              </button>
            )}
          </form>
        </div>

        {!isCaptchaChecked && (
          <div
            className="w-52"
            style={{ transform: "scale(0.8)" }}
            id="recaptcha-container"
          />
        )}
      </div>
    </section>
  );
};

export default PhoneOtp;

import React from "react";
import "./App.css";
import LoanCalculator from "./components/LoanCalculator";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Auth from "./Layouts/Auth";
import Login from "./pages/auth/Login";
import AccountCreatedSuccess from "./pages/auth/AccountCreatedSuccess";
import { useAppSelector } from "./hooks/useLoan";
import UserProfile from "./pages/auth/UserProfile";
import Contact from "./pages/auth/Contact";
import PrivacyPolicy from "./pages/auth/PrivacyPolicy";
import PhoneOtp from "./pages/auth/PhoneOtp";
import Home from "./pages/auth/Home";

function App() {
  // const current = false;
  const userReg = useAppSelector((state) => state.user.user);
  const RequireAuth = ({ children }: any) => {
    return userReg.isLoggedIn ? children : <Navigate to="/login" />;
  };
  // const RequireAuth2 = ({ children }: any) => {
  //   return userReg.isLoggedIn ? children : <Navigate to="/login" />;
  // };
  // console.log(userReg.isLoggedIn);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/" element={<Auth />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="success" element={<AccountCreatedSuccess />} />
      <Route path="otp-verify" element={<PhoneOtp />} />
      <Route
        path="user-profile"
        element={
          <RequireAuth>
            {" "}
            <UserProfile />{" "}
          </RequireAuth>
        }
      />
      {/* <Route path="user-profile" element={<UserProfile />} /> */}

      {/* <Route path="register" element={<Register />} /> */}
      <Route path="contact" element={<Contact />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="loan"
        element={
          <RequireAuth>
            {" "}
            <LoanCalculator />{" "}
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;

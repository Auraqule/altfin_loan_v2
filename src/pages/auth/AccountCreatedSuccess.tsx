import React from "react";
import { useAppSelector } from "../../hooks/useLoan";

const AccountCreatedSuccess = () => {
  const userReg = useAppSelector((state) => state.user.user);

  return (
    <section className="bg-blue h-screen flex items-center justify-center">
      <div
        className="bg-white px-8 py-8 rounded-xl shadow-md w-[50vw]  max-w-sm min-h-[40vh]"
        style={{ minWidth: "318px" }}
      >
        <h1 className="font-bold pb-2">Hi {userReg.fullname}</h1>
        <p>
          Your account has been <span className="font-bold">Successfully</span>{" "}
          created!
        </p>
        <p>
          kindly check your email{" "}
          <span className="font-bold">{userReg.email}</span> to verify your
          registration email ✔
        </p>
      </div>
    </section>
  );
};

export default AccountCreatedSuccess;

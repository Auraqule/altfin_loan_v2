import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useLoan";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const UserProfile = () => {
  const navigate = useNavigate();
  const userReg = useAppSelector((state) => state.user.user);
  const userLoan = useAppSelector((state) => state.loanReducer.userLoan);

  const goBackHandler = () => {
    navigate("/loan");
  };

  return (
    <section className="bg-blue h-screen flex items-center justify-center">
      <div
        className="bg-white px-8 py-8 flex-col  justify-center rounded-xl shadow-md w-[50vw]  min-h-[50vh]  max-w-sm h-[40vh]"
        style={{ minWidth: "318px" }}
      >
        <h1 className="font-bold text-blue -mt-2 pb-2 text-center">
          Altin Loan{" "}
        </h1>
        <div className="mb-2 flex items-center justify-start space-x-16 ">
          <IconButton>
            <Avatar alt={userReg.fullname} src={userReg.passport} />
          </IconButton>
          <h1 className="bg-green-500 p-1 font-semibold text-xs rounded-md ">
            Loan Status:{" "}
            <Tooltip title="Click to process your loan" placement="top" arrow>
              <span
                style={{
                  background: userLoan.isApproved ? "transparent" : " white",
                }}
                onClick={goBackHandler}
                className="text-black  p-1 w-full hover:bg-green-200 cursor-pointer "
              >
                {userLoan.isApproved ? "Active Loan" : "No Active Loan"}
              </span>
            </Tooltip>
          </h1>
        </div>
        <h1 className="pb-2 underline underline-offset-2">User Details</h1>
        <h1 className="font-bold">
          Name: <span className="font-normal">{userReg.fullname} </span>
        </h1>
        <h1 className="font-bold">
          Zone: <span className="font-normal">{userReg.zone} </span>
        </h1>
        <h1 className="font-bold">
          Zone Leader:{" "}
          <span className="font-normal">{userReg.zoneLeader} </span>
        </h1>
        <h1 className="font-bold">
          Home Address:{" "}
          <span className="font-normal">{userReg.homeAddress} </span>
        </h1>
        <h1 className="font-bold">
          Work Address:{" "}
          <span className="font-normal">{userReg.workAddress} </span>
        </h1>
        <h1 className="font-bold">
          Email: <span className="font-normal">{userReg.email} </span>
        </h1>

        <div
          onClick={goBackHandler}
          className="font-bold hover:cursor-pointer hover:opacity-80 mt-8 relative -top-4"
        >
          <IconButton>
            <KeyboardBackspaceIcon />
          </IconButton>
          <span className="text-blue">back</span>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;

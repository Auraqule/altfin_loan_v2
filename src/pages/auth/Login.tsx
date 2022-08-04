import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { useAppDispatch, useAppSelector } from "../../hooks/useLoan";
import {
  setIsVerified,
  setIsLoggedIn,
  login,
} from "../../redux/slices/userSlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 320,
  width: "30vw",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const userReg = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  // MODAL FOR INVALID CREDENTIALS
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [currentUser, setCurrentUser] = useState<any>("");

  const loginHandler: any = (e: any) => {
    e.preventDefault();
    // console.log(currentUser);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // const uEmail: string | null = user.email;
        // console.log(user);
        dispatch(setIsVerified(user.emailVerified));
        dispatch(login({ ...userReg, email: user.email }));
        dispatch(setIsLoggedIn(true));
        // console.log(userReg.isVerified);
        // console.log(user.emailVerified);
        return user;
        // ...
      })
      .then((user) => {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            // setCurrentUser(docSnap.data());
            const {
              fullname,
              email,
              phoneNo,
              password,
              bvn,
              acctNo,
              acctName,
              bank,
              zone,
              zoneLeader,
              votersCard,
              passport,
              homeAddress,
              workAddress,
              isLoggedIn,
              agreeWithTerms,
              isVerified,
              timeStamp,
            } = docSnap.data();
            // const date = new Timestamp(
            //   timeStamp?.seconds,
            //   timeStamp?.nanoseconds
            // )
            //   .toDate()
            //   .toDateString();

            dispatch(
              login({
                ...userReg,
                fullname,
                email,
                phoneNo,
                password,
                bvn,
                acctNo,
                acctName,
                bank,
                zone,
                zoneLeader,
                votersCard,
                passport,
                isLoggedIn: !isLoggedIn,
                agreeWithTerms,
                isVerified,
                homeAddress,
                workAddress,
                timeStamp,
              })
            );
          } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
          }
        });

        if (userReg.isVerified || user.emailVerified) {
          navigate("/loan");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (
          errorMessage.includes(
            "Access to this account has been temporarily disabled"
          )
        ) {
          invalidCredentialHandler(errorMessage);
        } else if (errorMessage.includes("network-request-failed")) {
          invalidCredentialHandler(errorCode);
        } else {
          invalidCredentialHandler("Invalid Username or Password");
        }
      });
  };
  const forgotPasswordHandler = () => {
    sendPasswordResetEmail(auth, email, { url: "https://altfin.loans/login" })
      .then(() => {
        dispatch(setIsVerified(userReg.isVerified));
        console.log("password reset email sent");

        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        invalidCredentialHandler(errorCode);
        // ..
      });
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    // localStorage.setItem("user", JSON.stringify(userReg));
  }, [userReg]);

  const invalidCredentialHandler = (errorMessage: string) => {
    handleOpen();
    setErrMsg(errorMessage);
    if (
      errorMessage.includes(
        "Access to this account has been temporarily disabled"
      )
    ) {
      const start = errorMessage.indexOf(":");
      setErrMsg(errorMessage.slice(start + 1));
    } else {
      const start = errorMessage.indexOf("/");
      setErrMsg(errorMessage.slice(start + 1));
    }
  };

  return (
    <div className="h-screen bg-blue flex justify-center items-center w-full">
      {errMsg && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p id="modal-modal-title">{errMsg}</p>
            <Link to="/contact">
              <p className="text-md font-semibold text-blue">Contact Support</p>
            </Link>
            <div className="mt-4">
              <Button onClick={handleClose} color="error" variant="contained">
                OK
              </Button>
            </div>
          </Box>
        </Modal>
      )}

      {/* <Navbar /> */}
      <form className="self-center" onSubmit={loginHandler}>
        <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">
              Login
            </h1>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Email
              </label>
              <input
                value={email}
                required
                onChange={handleEmailChange}
                id="email"
                type="email"
                placeholder="eg. user@gmail.com"
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Password
              </label>
              <input
                value={password}
                onChange={handlePasswordChange}
                placeholder="▪▪▪▪▪▪▪▪▪▪▪"
                type="password"
                minLength={6}
                required
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
              />
            </div>
            <p
              onClick={forgotPasswordHandler}
              className=" text-sm font-semibold text-blue  hover:underline cursor-pointer hover:opacity-95"
            >
              forgot password?
            </p>
          </div>
          <button
            type="submit"
            className="mt-4 w-full disabled:cursor-not-allowed text-indigo-100 py-2 text-base rounded-md tracking-wide bg-black hover:bg-slate-600  transition duration-300 ease-in-out"
          >
            Login
          </button>
          <p className="text-sm font-semibold text-blue pt-2">
            Don't have an account yet?{" "}
            <span className="hover:underline cursor-pointer hover:opacity-95 ">
              <Link className="font-bold" to="/">
                Register
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

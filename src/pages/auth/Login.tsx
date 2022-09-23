import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../../firebase";
// import { getDoc, doc, query } from "firebase/firestore";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { useAppDispatch, useAppSelector } from "../../hooks/useLoan";
import {
  setIsVerified,
  setIsLoggedIn,
  login,
} from "../../redux/slices/userSlice";
import {
  Switch,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Zoom,
} from "@mui/material";
// import { Label } from "@mui/icons-material";
import styled from "@emotion/styled";

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
  // "&.Mui-selected": {
  //   border: "none",
  //   outline: "none",
  // },
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "2px 2px  6px rgba(0,0,0,.1)",
    fontSize: 11,
  },
}));

const Login = () => {
  const userReg = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  // MODAL FOR INVALID CREDENTIALS
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errMsg, setErrMsg] = useState("");

  // LOGIN WITH PHONE NO
  // const [userId, setUserId] = useState("");
  // const [userInfo, setUserInfo] = useState<any>({});
  // SWITCH TO LOGIN WITH PHONE
  const [isLoginWithPhone, setIsLoginWithPhone] = useState(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  //   const [currentUser, setCurrentUser] = useState<any>("");

  // FETCH USER DATA TO LOGIN WITH PHONE
  async function getUserInfo() {
    // const phoneWithCode = `+234${tel?.toString().slice(1)} `;
    const q = query(
      collection(db, "users"),
      where("phoneNo", "==", tel),
      where("password", "==", password)
      // where("verificationType", "==", true)
    );
    try {
      let phoneExists;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc: any) => {
        phoneExists = true;
        // console.log(doc.data());
        // doc.data() is never undefined for query doc snapshots
        // setUserId(doc.id);
        // setUserInfo(doc.data());

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
        } = doc.data();
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

        navigate("/loan");

        // console.log(doc.id);
        // console.log(doc.data().hasRequestedLoan);
        // console.log(doc.id, " => ", doc.data());
      });
      if (!phoneExists) {
        notify();
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setIsLoading(false);
    }
  }

  const loginHandler: any = (e: any) => {
    e.preventDefault();
    // console.log(currentUser);
    if (isLoginWithPhone) {
      getUserInfo();
      return;
    }
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
    if (email === "" || !email.length || email.trimEnd().trimStart() === " ") {
      handleOpen();
      setErrMsg("Kindly Enter your registered email and try again");
      return;
    }
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
  const handleTelChange = (e: any) => {
    e.target.value.charAt(0) === "0" ? setTel(e.target.value) : setTel("");
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
  const notify = () => toast("Invalid Login Credentials");

  return (
    <div className="min-h-screen bg-blue flex justify-center items-center w-full">
      <Toaster
        toastOptions={{
          style: {
            font: "bold",
            color: "#dc143c",
            background: "",
          },
        }}
      />
      {errMsg && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p id="modal-modal-title">{errMsg}</p>
            <Link target="_blank" to="/contact">
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
        <div className="bg-white relative px-10 py-8 rounded-xl w-[340px] min-w-[90vw] sm:min-w-[340px] sm:w-screen shadow-md  max-w-sm">
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">
              Login
            </h1>
            <div className="absolute right-16 top-14">
              <LightTooltip
                title={
                  isLoginWithPhone ? "Login via Email" : "Login via Phone-no"
                }
                TransitionComponent={Zoom}
                arrow
                placement="top"
              >
                <Switch
                  checked={isLoginWithPhone}
                  onChange={() => setIsLoginWithPhone(!isLoginWithPhone)}
                  // {...Label}
                  // defaultChecked
                  size="small"
                />
              </LightTooltip>
            </div>
            {!isLoginWithPhone && (
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
            )}
            {isLoginWithPhone && (
              <div>
                <label
                  htmlFor="tel"
                  className="block mb-1 text-gray-600 font-semibold"
                >
                  Phone No
                </label>
                <input
                  value={tel}
                  required
                  onChange={handleTelChange}
                  id="tel"
                  type="tel"
                  placeholder="eg. 07038248976"
                  className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-gray-600 font-semibold"
              >
                Password
              </label>
              <input
                value={password}
                id="password"
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

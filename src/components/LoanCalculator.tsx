import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import underline from "../assets/underline.png";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";
import { useAppDispatch, useAppSelector } from "../hooks/useLoan";
import { logout } from "../redux/slices/userSlice";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  calculateLoan,
  chooseDurationOption,
  singleDurationFunction,
  updateOthers,
} from "../redux/slices/loanCalculatorSlice";
// import { truncate } from "fs";

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

const LoanCalculator = () => {
  const navigate = useNavigate();
  const userLoan = useAppSelector((state) => state.loanReducer.userLoan);
  const userReg = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [reqAmount, setReqAmount] = useState<number>(100000);
  const [reqDuration, setReqDuration] = useState<number>(5);
  const [message, setMessage] = useState<any>({});
  const [messageCount, setMessageCount] = useState(0);
  const [userId, setUserId] = useState<any>();
  const [userLoanInfo, setUserLoanInfo] = useState<any>();
  //   const [proceedBtn, setProceedBtn] = useState(true);
  const [userData, setUserData] = useState({
    durationOption: {
      daily: false,
      weekly: false,
      monthly: false,
      yearly: false,
    },
    singleDurationOpt: "",
    hasPaidBack: false,
    isApproved: false,
    hasRequestedLoan: false,
    timeStamp: "",
    reqDuration: 0,
    reqAmount: 0,
  });
  // MODAL FOR MESSAGE NOTIFIICATIONS
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // MODAL FOR LOAN PENDING STATUS
  const [openPending, setOpenPending] = React.useState(false);
  const handleOpenPending = () => {
    setOpenPending(true);
  };
  const handleClosePending = () => setOpenPending(false);

  // MODAL FOR APPROVED LOAN
  const [openApproved, setOpenApproved] = React.useState(false);
  const handleOpenApproved = () => setOpenApproved(true);
  const handleCloseApproved = () => setOpenApproved(false);

  const LoanCalculatorHandler = () => {
    dispatch(singleDurationFunction());
    dispatch(
      calculateLoan({
        reqAmount,
        reqDuration,
      })
    );
  };
  const durationOptionHandler = (value: any): any => {
    const monthly = value === "monthly";
    const yearly = value === "yearly";
    const daily = value === "daily";
    const weekly = value === "weekly";

    dispatch(
      chooseDurationOption({
        monthly,
        yearly,
        daily,
        weekly,
      })
    );
  };
  // console.log(process.env.REACT_APP_AURAQULE_ALTFIN_FIREBASE_API_KEY);

  const handleLogout: any = () => {
    dispatch(logout);
    // console.log("logged out");
    navigate("/login");
  };
  const handleViewUserProfile = () => {
    navigate("/user-profile");
  };
  const handleLoanProceedCheckout = async () => {
    const templateParams = {
      from_name: userReg.fullname,
      to_name: "Altfin Loans",
      message: `Hloo, ${userReg.fullname} | ${userReg.email} | ${userReg.phoneNo}, has Requested a Loan of, #${userLoan.reqAmount}`,
      actionMessage: "Kindly review and disburse loan if qualified",
    };
    const serviceID: string | any = process.env.REACT_APP_MY_SERVICE_ID;
    const templateID: string | any = process.env.REACT_APP_MY_TEMPLATE_ID;
    const public_key: string | any = process.env.REACT_APP_MY_PUBLIC_KEY;
    try {
      setIsLoading(true);
      emailjs.send(serviceID, templateID, templateParams, public_key).then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
      const docRef = await addDoc(collection(db, "userLoans"), {
        ...userLoan,
        hasRequestedLoan: true,
        name: userReg.fullname,
        email: userReg.email,
        phone: userReg.phoneNo,
        timeStamp: serverTimestamp(),
      });
      dispatch(
        updateOthers({
          hasRequestedLoan: userData.hasRequestedLoan,
          hasPaidBack: userData.hasPaidBack,
          isApproved: userData.isApproved,
          timeStamp: userData.timeStamp,
        })
      );
      //   setProceedBtn(false);
      setMessageCount(() => messageCount + 1);
      setMessage({
        status: "Success",
        msg: "Your loan request has been sumbitted, will be reviewed and approved shortly!",
      });
      localStorage.setItem("userID", JSON.stringify(docRef.id));
      //   console.log("Document written with ID: ", docRef.id);

      // setDoc(doc(db, "userLoans", user.uid), {
      //     fullname,
      //     email,
      //     phoneNo,

      //     timestamp: serverTimestamp(),
      //   });
      //   console.log(userLoan);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaybackLoan = () => {
    handleOpenApproved();
    console.log("Payback loan");
  };

  const handleDoNothing = () => {
    // This function is only here prevent the user from being able to click the email, immediaely when they are logged in and have not yet made any request
  };

  //   setUserData(userLoan);
  useEffect(() => {
    const retrievedUserId: any = localStorage.getItem("userID");
    const userKey = JSON.parse(retrievedUserId);
    setIsLoading(true);
    if (retrievedUserId) {
      if (userId) {
        handleFetchUserLoan(userKey);
        return;
      }
    }
    if (!retrievedUserId) {
      getUserInfo();
      if (userId) {
        handleFetchUserLoan(userId);
        return;
      }
    }

    async function getUserInfo() {
      const q = query(
        collection(db, "userLoans"),
        where("email", "==", userReg.email),
        where("hasRequestedLoan", "==", true)
      );
      try {
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot);
        querySnapshot.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshots
          setUserId(doc.id);
          setUserLoanInfo(doc.data());

          // console.log(doc.id);
          // console.log(doc.data().hasRequestedLoan);
          // console.log(doc.id, " => ", doc.data());
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getUserInfo();

    async function handleFetchUserLoan(_userId: string) {
      if (retrievedUserId || !retrievedUserId) {
        try {
          const unsub = onSnapshot(doc(db, "userLoans", _userId), (doc) => {
            // console.log(_userId);
            // console.log(userKey, "From inside ..");
            // console.log("Current data: ", doc.data());
            // console.log(doc.data());

            if (doc.data()?.durationOption !== undefined) {
              const {
                durationOption,
                hasPaidBack,
                isApproved,
                hasRequestedLoan,
                timeStamp,
                reqDuration,
                reqAmount,
                singleDurationOpt,
              }: any = doc.data();
              if (durationOption || (hasRequestedLoan && reqAmount)) {
                // This part gave me problem, reqAmount was refusing to update
                setReqAmount(reqAmount);
                const date = new Timestamp(
                  timeStamp.seconds,
                  timeStamp.nanoseconds
                )
                  .toDate()
                  .toDateString();
                setUserData({
                  durationOption,
                  hasPaidBack,
                  isApproved,
                  hasRequestedLoan,
                  timeStamp: date,
                  reqDuration,
                  reqAmount,
                  singleDurationOpt,
                });
              }

              setIsLoading(false);
            }
            if (!userData.hasRequestedLoan) {
              setIsLoading(false);
            }
            setIsLoading(false);

            // dispatch(
            //   calculateLoan({
            //     ...userLoan,
            //     ...durationOption,
            //     hasPaidBack,
            //     isApproved,
            //     hasRequestedLoan,
            //     reqDuration,
            //     timeStamp,
            //   })
            // );
            // lll
          });
          return () => {
            unsub();
          };
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    if (userId) {
      handleFetchUserLoan(userId);
    }

    // const smth: any = localStorage.getItem("user");
    // const currentUser: any = JSON.parse(smth) || null;
    // if (!currentUser.isLoggedIn) {
    //   <Navigate to="/login" />;
    // } else {
    //   <Navigate to="/loan" />;
    // }

    // console.log(userLoan);
  }, [
    messageCount,
    userData.hasRequestedLoan,
    userData.timeStamp,
    userId,
    userReg.email,
    userLoanInfo,
  ]);

  useEffect(() => {
    const { reqDuration, reqAmount } = userData;
    if (reqDuration && reqAmount) {
      dispatch(
        calculateLoan({
          reqDuration,
          reqAmount,
        })
      );

      dispatch(
        updateOthers({
          hasRequestedLoan: userData.hasRequestedLoan,
          hasPaidBack: userData.hasPaidBack,
          isApproved: userData.isApproved,
          timeStamp: userData.timeStamp,
        })
      );

      dispatch(
        chooseDurationOption({
          daily: userData?.durationOption?.daily,
          weekly: userData?.durationOption?.weekly,
          monthly: userData?.durationOption?.monthly,
          yearly: userData?.durationOption?.yearly,
        })
      );
    }

    if (userData.isApproved) {
      setMessageCount(1);
      setMessage({
        status: "Success",
        msg: "Congratulations!, Your loan has been Successfully Approved",
      });
    }
    dispatch(singleDurationFunction());
  }, [userData, userData.hasRequestedLoan]);

  return (
    <section className="w-screen h-auto flex gap-16 flex-col py-10 px-10 md:flex-row  lg:flex-row md:h-screen justify-evenly items-center bg-blue relative overflow-hidden">
      {/* landscape:flex-row landscape:overflow-scroll md:landscape:overflow-hidden landscape:w-auto md:landscape:w-screen landscape:gap-20 md:landscape:gap-16 landscape:h-auto md:landscape:h-screen landscape:py-32 md:landscape:py-10  landscape:pl-20 md:landscape:pl-0 */}

      <div className=" basis-1/3  flex flex-col items-center justify-center h-[70vh] ">
        {/* landscape:basis-1/2 */}
        <div className="left-wrapper max-w-[50vh]  text-white font-semibold">
          {/* landscape:w-[60vw] */}
          <h1 className="text-4xl lg:text-5xl lg:leading-snug font-bold pb-6 leading-snug ">
            Loan company like no other!
          </h1>
          <p className="pb-10 text-slate-400">
            We are here to give your business that immediate financial aid and
            support to keep it alive
          </p>
          <div className="loan-box flex justify-between">
            <div className="loan-amount ">
              <p className="text-slate-400 ">loan amount</p>
              <input
                value={reqAmount}
                onChange={(e) =>
                  !isNaN(Number(e.target.value)) &&
                  setReqAmount(Number(e.target.value))
                }
                maxLength={7}
                type="text"
                className="block bg-transparent border-none outline-none text-2xl lg:text-3xl pb-2 pt-2 text-left lg:text-center w-32 font-bold"
              />
              <hr className="w-24 lg:w-32 mb-6" />
            </div>
            <div className="loan-term text-slate-400">
              <p className="pl-2">loan term</p>
              <div className="loan-term-inner flex justify-between pt-2">
                <input
                  value={reqDuration}
                  onChange={(e) =>
                    !isNaN(Number(e.target.value)) &&
                    setReqDuration(Number(e.target.value))
                  }
                  type="text"
                  maxLength={2}
                  className="w-10 bg-transparent border-none outline-none text-white text-2xl lg:text-3xl pb-2 text-center block mr-2"
                />
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    name="monthly"
                    onClick={(e) => durationOptionHandler(e.currentTarget.name)}
                    style={{
                      background: userLoan.durationOption.monthly
                        ? "black"
                        : "",
                      color: userLoan.durationOption.monthly ? "white" : "",
                    }}
                    type="button"
                    className="py-1 px-2 text-sm font-medium text-gray-900 bg-transparent rounded-l-md  border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10  focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Months
                  </button>
                  <button
                    name="yearly"
                    onClick={(e) => durationOptionHandler(e.currentTarget.name)}
                    style={{
                      background: userLoan.durationOption.yearly ? "black" : "",
                      color: userLoan.durationOption.yearly ? "white" : "",
                    }}
                    type="button"
                    className="py-1 px-2 text-sm font-medium text-gray-900 bg-transparent rounded-r-md  border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10  focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Years
                  </button>
                </div>
              </div>

              <hr className="w-10 pb-6" />
            </div>
          </div>
          <div className="interest-rate-calculator flex justify-between">
            <div className="interest-rate">
              <p className="text-slate-400 text-sm lg:text-base">
                interest rate per month
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold pb-2">
                {userLoan.interestRate * 100}%
              </h1>
              <hr className="w-8 lg:w-16" />
            </div>
            <button
              onClick={LoanCalculatorHandler}
              disabled={userData.hasRequestedLoan && !userData.hasPaidBack}
              type="button"
              className="text-black disabled:opacity-80 disabled:cursor-not-allowed h-12 lg:h-14 font-bold bg-amber-400 hover:bg-green-600 transition duration-500 focus:ring-4 focus:ring-blue-300  rounded-lg text-sm px-3 lg:px-5  mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Calculate loan
            </button>
          </div>
        </div>
      </div>
      <div className="right basis-1/3 flex flex-col items-center justify-center h-[70vh]">
        <div className="w-[25vw] min-w-[50vh]  h-full bg-white z-20 py-16 lg:p-16 flex flex-col items-center relative">
          {isLoading && (
            <div className="absolute top-4">
              <Box sx={{ display: "flex" }}>
                <CircularProgress color="secondary" size={30} />
              </Box>
            </div>
          )}
          {/* landscape:min-w-[50vw] lg:landscape:min-w-[50vh] */}
          {/* landscape:w-[40vw] md:landscape:w-[25vw] landscape:h-auto */}
          <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            {/* MODAL FOR SUCCESSFULL SUBMISSION */}

            {userData.hasRequestedLoan && (
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Notification
                  </Typography>
                  {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
                  <div className="mt-2">
                    {message.msg}
                    <h2 className="text-blue font-semibold pt-4">
                      <span className="text-black">Request:</span>{" "}
                      {message.status}
                    </h2>{" "}
                    <h2
                      className="font-semibold"
                      style={{ color: !userData.isApproved ? "red" : "green" }}
                    >
                      <span className="text-black">Status:</span>
                      {userData.hasRequestedLoan && userData.isApproved
                        ? " Approved"
                        : " Pending"}
                    </h2>{" "}
                    <h2 onClick={handleClose} className="mt-4">
                      <Button color="success" variant="contained">
                        OK
                      </Button>
                    </h2>
                  </div>

                  {/* </Typography> */}
                </Box>
              </Modal>
            )}
            {/* MODAL FOR PENDING LOAN */}
            {userData.hasRequestedLoan && !userData.isApproved && (
              <Modal
                open={openPending}
                onClose={handleClosePending}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Notification
                  </Typography>
                  <div className="mt-2">
                    Please checkback, your loan is still being processed
                    <h2 className=" font-semibold">
                      Status:{" "}
                      <span className="text-blue hover:cursor-pointer">
                        Pending
                      </span>{" "}
                    </h2>{" "}
                    <div onClick={handleClosePending} className="mt-4">
                      <Button color="error" variant="contained">
                        OK
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
            {/* MODAL FOR APROVED LOAN */}
            {userData.isApproved && (
              <Modal
                open={openApproved}
                onClose={handleCloseApproved}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Notification
                  </Typography>
                  <div className="mt-2">
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
                    Congratulations! your loan has been successfully Approved
                    <h2 className=" font-semibold">
                      Status:{" "}
                      <span className="text-blue hover:cursor-pointer">
                        {userData.isApproved ? "Approved" : ""}
                      </span>{" "}
                    </h2>{" "}
                    <p className="py-4">
                      Kindly ensure to make payments as at when expected, to
                      avoid legal charges against you and overall
                      disqualifications from taking further loans.
                    </p>
                    <p className="text-sm">Thanks,</p>
                    <p className="text-sm  font-semibold">Altfin Cares!</p>
                    <h2 onClick={handleCloseApproved} className="mt-4">
                      <Button color="success" variant="contained">
                        OK
                      </Button>
                    </h2>
                    {/* </Typography> */}
                  </div>
                </Box>
              </Modal>
            )}
          </div>

          <div
            onClick={
              userData.hasRequestedLoan && messageCount
                ? handleOpen
                : handleDoNothing
            }
            className="logout absolute top-0 left-0 p-4"
          >
            <Tooltip title="Notifications" placement="top" arrow>
              <IconButton>
                <Badge color="secondary" badgeContent={messageCount}>
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </div>
          <div
            onClick={handleLogout}
            className="logout absolute top-0 right-0 p-4"
          >
            <Tooltip title="Logout" placement="top" arrow>
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div onClick={handleViewUserProfile} className="-mt-4">
            <Tooltip title="View Profile info" placement="top" arrow>
              <IconButton>
                <Avatar sx={{ bgcolor: "#2e1aae" }}>
                  {userReg?.fullname?.slice(0, 1)}
                  {userReg?.fullname?.split(" ")[1]?.slice(0, 1)}
                </Avatar>
                {/* <p className="font-bold p-2 px-4 bg-blue text-white hover:opacity-80 transition duration-300 cursor-pointer rounded-full -mt-4">
                {userReg?.fullname?.slice(0, 1)}
                {userReg?.fullname?.split(" ")[1].slice(0, 1)}
            </p> */}
              </IconButton>
            </Tooltip>
          </div>

          <h1 className="font-semibold">your monthly payment</h1>
          <div className="monthly-payback ">
            <h1 className="text-5xl font-bold pb-6">
              #{userLoan.monthlyPayment}
            </h1>
            <img src={underline} alt="" className="relative bottom-4 left-2" />
          </div>
          <div className="principal">
            <h2 className="">
              Total principal{" "}
              <span className="ml-12 font-bold">#{reqAmount}</span>
            </h2>
            <hr className="mt-6 bg-slate-200 h-1 w-full" />
          </div>
          <div className="interest mt-4">
            <h2 className="">
              Monthly interest{" "}
              <span className="ml-10 font-bold">
                #{userLoan.monthlyInterest}
              </span>
            </h2>
          </div>
          <div className="loan-duration mt-4">
            <h2 className="">
              Loan duration:
              <span className="ml-10 font-bold">
                {userLoan.reqDuration}{" "}
                {userLoan.singleDurationOpt === "monthly"
                  ? "Months"
                  : userLoan.singleDurationOpt === "yearly"
                  ? "Years"
                  : userLoan.singleDurationOpt === "weekly"
                  ? "Weeks"
                  : userLoan.singleDurationOpt === "daily"
                  ? "Days"
                  : ""}
              </span>
            </h2>
          </div>
          <div className="others max-w-full">
            {!userData.hasRequestedLoan && (
              <button
                onClick={handleLoanProceedCheckout}
                className="py-2 px-28 bg-black max-w-full text-white mt-16 hover:bg-gray-700 transition duration-500"
              >
                {/* landscape:px-20 */}
                Proceed
              </button>
            )}
            {userData.hasRequestedLoan && !userData.isApproved && (
              <button
                onClick={handleOpenPending}
                className="py-2 px-28 bg-red-600 max-w-full text-white mt-16 hover:bg-gray-700 transition duration-500"
              >
                {/* landscape:px-20 */}
                Pending
              </button>
            )}

            {userData.hasRequestedLoan &&
              userData.isApproved &&
              !userData.hasPaidBack && (
                <button
                  onClick={handlePaybackLoan}
                  className="py-2 px-28 bg-green-600 max-w-full text-white text-center mt-16 hover:bg-gray-700 transition duration-500"
                >
                  {/* landscape:px-20 */}
                  Payback
                </button>
              )}
          </div>
        </div>
      </div>
      <div className="absolute hidden lg:block top-0 right-0 w-1/2 h-full">
        <div className="patterns  relative w-full h-full bg-blue z-10">
          <div className="circle-up-left h-[40vh] w-[40vh]  rounded-full relative -top-20 bg-amber-400"></div>
          <div className="circle-bottom-left h-[30vh] w-[30vh]  rounded-full relative -bottom-52 bg-amber-400"></div>
          <div className="circle-big h-[50vh] w-[50vh]  rounded-full absolute top-0 right-0 bg-red-600">
            <div className="circle-big-semi h-1/2 w-full absolute bottom-0  rounded-tf-full rounded-tr -full rounded-br-full rounded-bl-full bg-blue"></div>
          </div>
          <div
            className="box w-1/2 h-[32vh] right-0  absolute bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl flex "
            style={{ bottom: "8.9rem" }}
          >
            {/* <svg
              className="w-40 h-40 text-gray-300 m-auto ml-44"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg> */}
          </div>
          <div
            className="circle-big h-[50vh] w-[50vh]  rounded-full absolute  rotate-90 right-0 bg-red-600"
            style={{ bottom: "-14.8rem" }}
          >
            {" "}
            <div className="circle-big-semi h-1/2 w-full absolute bottom-0  rounded-tf-full rounded-tr -full rounded-br-full rounded-bl-full bg-blue"></div>
          </div>
          {/* <div className="circle-big h-[50vh] w-[50vh]  rounded-full absolute -bottom-60 rotate-90 right-4 bg-red-600">
            <div className="circle-big-semi h-1/2 w-full absolute bottom-0  rounded-tf-full rounded-tr -full rounded-br-full rounded-bl-full bg-blue"></div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;

import React, { useEffect, useState } from "react";
import RegisterPage2 from "./RegisterPage2";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useLoan";
import { login, setIsVerified } from "../../redux/slices/userSlice";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// layout for page
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { auth, db, storage } from "../../firebase";

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

export default function Login() {
  const userReg = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // nextpage state helps to switch between register page 1 && register page 2
  const [nextPage, setNextPage] = useState(false);
  // These are the user registration states
  const [fullname, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zone, setZone] = useState("");
  const [zoneLeader, setZoneLeader] = useState("");
  const [sex, setSex] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [bvn, setBvn] = useState("");
  const [acctNo, setAcctNo] = useState("");
  const [acctName, setAcctName] = useState("");
  const [bank, setBank] = useState("");
  const [passport, setPassport] = useState<{} | any>("");
  const [votersCard, setVotersCard] = useState<{} | any>("");
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  const [perc, setPerc] = useState<any>(null);
  const [isPasswordVisisble, setIsPasswordVisible] = useState(false);
  const [userData, setUserData] = useState<any>({});

  // MODAL FOR INVALID CREDENTIALS
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errMsg, setErrMsg] = useState("");

  const nextPageHandler = (e?: any) => {
    if (e) {
      e.preventDefault();
    }
    setNextPage(() => !nextPage);
  };

  useEffect(() => {
    let download: any;
    const uploadFile = () => {
      const name = new Date().getTime() + passport.name;

      console.log(name);
      const storageRef = ref(storage, passport.name);
      const uploadTask = uploadBytesResumable(storageRef, passport);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);

            // setPassportImg(downloadURL);
            setUserData((prev: any) => ({
              ...prev,
              passport: downloadURL,
              votersCard: download,
            }));
            // dispatch(login({ ...userReg, passport: downloadURL }));
          });
        }
      );
    };

    // UPLOAD FILE 2 BEGINS HERE
    const uploadFile2 = () => {
      const name = new Date().getTime() + votersCard.name;

      console.log(name);
      const storageRef = ref(storage, votersCard.name);
      const uploadTask = uploadBytesResumable(storageRef, votersCard);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            download = downloadURL;

            // setVotersCardImg(downloadURL);
            setUserData((prev: any) => ({ ...prev, votersCard: downloadURL }));

            // dispatch(login({ ...userReg, passport: downloadURL }));
          });
        }
      );
    };

    // END OF UPLOAD FILE 2(VOTERS CARD)
    passport && uploadFile();
    votersCard && uploadFile2();
  }, [passport, votersCard]);
  const registerHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserData({
      fullname,
      phoneNo: Number(phoneNo),
      email,
      password,
      zone,
      zoneLeader,
      sex,
      bvn: Number(bvn),
      acctNo: Number(acctNo),
      acctName,
      bank,
      passport: passport.name,
      votersCard: votersCard.name,
      homeAddress,
      workAddress,
      isLoggedIn: true,
      agreeWithTerms,
      isVerified: userReg.isVerified,
    });
    // addDoc function was initially here

    // console.log("Document written with ID: ", docRef.id);

    // Push user registration info to database
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Add a new user document without an auto-generated id. but an ID coming from the authentication phase
        // const docRef =
        setDoc(doc(db, "users", user.uid), {
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
          sex,
          passport: userData.passport,
          votersCard: userData?.votersCard,
          agreeWithTerms,
          homeAddress,
          workAddress,
          timestamp: serverTimestamp(),
        });
        dispatch(
          login({
            fullname,
            phoneNo: Number(phoneNo),
            email,
            password,
            zone,
            zoneLeader,
            sex,
            bvn: Number(bvn),
            acctNo: Number(acctNo),
            acctName,
            bank,
            passport: passport.name,
            votersCard: votersCard.name,
            homeAddress,
            workAddress,
            isLoggedIn: true,
            agreeWithTerms,
            timeStamp: "",
            isVerified: userReg.isVerified,
          })
        );
        dispatch(setIsVerified(user.emailVerified));

        sendEmailVerification(user, {
          url: "https:/altfin.loans/login",
        }).then(() => dispatch(setIsVerified(true)));
        console.log("successFully Done");
        navigate("/success");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        invalidCredentialHandler(errorCode);
        setNextPage(() => !nextPage);

        // ..
      });
  };
  const invalidCredentialHandler = (errorCode: string) => {
    handleOpen();
    const start = errorCode.indexOf("/");
    setErrMsg(errorCode.slice(start + 1));
  };
  useEffect(() => {}, [zone, zoneLeader, email]);
  //   I used this 👇 to be able to make use of react-select when typescript rejected the onChange function
  // This is a very interesting & powerful concept I came up with especially when working with typescript
  const selectZoneHandler: any = (value: any) => {
    setZone(value.label);
    return;
  };

  const selectLeaderHandler: any = (value: any) => {
    setZoneLeader(() => value.label);
    return;
  };
  const selectSexHandler: any = (value: any) => {
    setSex(() => value.label);
    return;
  };
  const passwordVisibilityHandler = () => {
    setIsPasswordVisible(!isPasswordVisisble);
  };

  return (
    <section className="bg-blue h-auto">
      {errMsg && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {errMsg}
            </Typography>
            <Link to="contact">
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
      {!nextPage && (
        <div className="h-screen bg-blue flex justify-center items-center w-full">
          {/* <Navbar /> */}
          <form className="self-center" onSubmit={nextPageHandler}>
            <div className="bg-white px-10 py-8 mb-2 rounded-xl w-screen shadow-md max-w-sm">
              <div className="space-y-4">
                <h1 className="text-center text-2xl font-semibold text-gray-600">
                  Register
                </h1>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-gray-600 font-semibold"
                  >
                    Fullname
                  </label>
                  <input
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    required
                    placeholder="eg. Christian Peters"
                    className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tel"
                    className="block mb-1 text-gray-600 font-semibold"
                  >
                    Phone No
                  </label>
                  <input
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    id="tel"
                    type="tel"
                    required
                    placeholder="eg. 08033485678"
                    className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-gray-600 font-semibold"
                  >
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    required
                    placeholder="example@gmail.com"
                    className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full focus:outline-blue"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-gray-600 font-semibold"
                  >
                    Password
                  </label>
                  <div className="flex ">
                    <input
                      value={password}
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="▪▪▪▪▪▪▪▪▪▪▪"
                      type={isPasswordVisisble ? "text" : "password"}
                      required
                      className="bg-indigo-50  focus:bg-indigo-100 px-4 py-2 outline-none focus:outline-none w-full border-none "
                    />
                    <span
                      onClick={passwordVisibilityHandler}
                      className="bg-indigo-50 relative pr-4  py-2 h-full"
                    >
                      {isPasswordVisisble && <VisibilityIcon />}
                      {!isPasswordVisisble && <VisibilityOffIcon />}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full  text-indigo-100 py-2 text-base rounded-md tracking-wide bg-black hover:bg-slate-600  transition duration-300 ease-in-out"
              >
                Proceed
              </button>
              <p className="text-sm font-semibold text-blue py-2 ">
                Already have an account?{" "}
                <span className="hover:underline cursor-pointer hover:opacity-95">
                  <Link className=" font-bold" to="/login">
                    Login
                  </Link>
                </span>
              </p>
            </div>
          </form>
          <Footer />
        </div>
      )}
      {nextPage && (
        <section className="py-6">
          <RegisterPage2
            nextPageHandler={nextPageHandler}
            registerHandler={registerHandler}
            zone={zone}
            zoneLeader={zoneLeader}
            bvn={bvn}
            setBvn={setBvn}
            acctNo={acctNo}
            setAcctNo={setAcctNo}
            acctName={acctName}
            setAcctName={setAcctName}
            bank={bank}
            setBank={setBank}
            setPassport={setPassport}
            setVotersCard={setVotersCard}
            homeAddress={homeAddress}
            setHomeAddress={setHomeAddress}
            workAddress={workAddress}
            setWorkAddress={setWorkAddress}
            agreeWithTerms={agreeWithTerms}
            setAgreeWithTerms={setAgreeWithTerms}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectZoneHandler={selectZoneHandler}
            selectLeaderHandler={selectLeaderHandler}
            selectSexHandler={selectSexHandler}
            sex={sex}
            perc={perc}
          />
        </section>
      )}
    </section>
  );
}

// Login.layout = Auth;

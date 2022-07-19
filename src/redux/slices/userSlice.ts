import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
interface User {
  fullname: string;
  email: string | null;
  //   userID?: string;
  phoneNo: number | null;
  password: string;
  bvn: number | null;
  acctNo: number | null;
  bank: string;
  acctName: string;
  zone: string;
  zoneLeader: string;
  sex: string;
  homeAddress: string;
  workAddress: string;
  passport: string;
  votersCard: string;
  isLoggedIn: boolean | any;
  agreeWithTerms: boolean;
  isVerified: boolean;
  timeStamp?: any;
}
// This is made to PERSIST an authenticated user logged ACTIVELY into the system regardless of PAGE REFRESH👇
// const smth: any = localStorage.getItem("user");
// const currentUser: any = JSON.parse(smth) || null;
// console.log(`currentUser from redux ${currentUser}`);

const initialState: User = {
  fullname: "",
  email: "",
  //   userID: "",
  phoneNo: null,
  password: "",
  bvn: null,
  acctNo: null,
  bank: "",
  acctName: "",
  zone: "",
  zoneLeader: "",
  sex: "",
  homeAddress: "",
  workAddress: "",
  passport: "",
  votersCard: "",
  isLoggedIn: false,
  agreeWithTerms: false,
  isVerified: false,
  timeStamp: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: { user: initialState },
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      const {
        fullname,
        email,
        phoneNo,
        password,
        bvn,
        acctNo,
        bank,
        acctName,
        zone,
        zoneLeader,
        sex,
        votersCard,
        passport,
        isLoggedIn,
        agreeWithTerms,
        isVerified,
        homeAddress,
        workAddress,
        timeStamp,
      } = action.payload;
      state.user = {
        ...state.user,
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
        votersCard,
        passport,
        homeAddress,
        workAddress,
        isLoggedIn,
        agreeWithTerms,
        isVerified,
        timeStamp,
      };
      //   console.log(action.payload);

      //   console.log(` From redux ${state.user.fullname}`);
    },
    logout: (state) => {
      state.user = {
        fullname: "",
        email: "",
        phoneNo: null,
        password: "",
        bvn: null,
        acctNo: null,
        bank: "",
        acctName: "",
        zone: "",
        zoneLeader: "",
        sex: "",
        homeAddress: "",
        workAddress: "",
        passport: "",
        votersCard: "",
        isLoggedIn: false,
        agreeWithTerms: false,
        isVerified: state.user.isVerified,
        timeStamp: "",
      };
    },
    // setUserID: (state, action) => {
    //   state.user = { ...state.user, userID: action.payload };
    // },
    setIsVerified: (state, action) => {
      state.user = { ...state.user, isVerified: action.payload };
    },
    setIsLoggedIn: (state, action) => {
      state.user = { ...state.user, isLoggedIn: action.payload };
    },
  },
});

export const { login, logout, setIsVerified, setIsLoggedIn } =
  userSlice.actions;

export const selectCount = (state: RootState) => state.loanReducer;

export default userSlice.reducer;

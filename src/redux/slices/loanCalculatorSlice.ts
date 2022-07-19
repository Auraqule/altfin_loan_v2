import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Loan {
  interestRate: number;
  reqAmount: number | string;
  reqDuration: number;
  durationOption: DurationOption;
  singleDurationOpt: any;
  totalPaybackAmt: number;
  monthlyInterest: number;
  monthlyPayment: number;
  hasPaidBack: boolean;
  hasRequestedLoan: boolean;
  isApproved: boolean;
  timeStamp?: any;
}
interface DurationOption {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  yearly: boolean;
}
interface UserLoan {
  reqAmount: number;
  reqDuration: number;
}
const initialState: Loan = {
  interestRate: 0.06,
  reqAmount: 100000,
  reqDuration: 5,
  singleDurationOpt: "monthly",
  durationOption: { daily: false, weekly: false, monthly: true, yearly: false },
  totalPaybackAmt: 130000,
  monthlyInterest: 6000,
  monthlyPayment: 26000,
  hasRequestedLoan: false,
  isApproved: false,
  hasPaidBack: false,
  timeStamp: "",
};

const loanCalculatorSlice = createSlice({
  name: "loan",
  initialState: { userLoan: initialState },
  reducers: {
    calculateLoan: (state, action: PayloadAction<UserLoan>) => {
      const { reqAmount, reqDuration } = action.payload;
      const intrst = reqAmount * state.userLoan.interestRate;
      const totalPayback =
        reqAmount +
        intrst *
          (state.userLoan.singleDurationOpt === "monthly"
            ? reqDuration
            : reqDuration * 12);
      state.userLoan = {
        ...state.userLoan,
        reqAmount,
        reqDuration,
        monthlyInterest: intrst,
        totalPaybackAmt: totalPayback,
        monthlyPayment: Math.ceil(
          totalPayback /
            (state.userLoan.singleDurationOpt === "monthly"
              ? reqDuration
              : reqDuration * 12)
        ),
      };
    },
    chooseDurationOption: (state, action: PayloadAction<DurationOption>) => {
      const { daily, weekly, monthly, yearly } = action.payload;
      state.userLoan.durationOption = {
        daily,
        weekly,
        monthly,
        yearly,
      };
      //   console.log(state.userLoan.durationOption);
    },
    updateOthers: (state, action: any) => {
      const { hasPaidBack, isApproved, timeStamp, hasRequestedLoan } =
        action.payload;

      state.userLoan = {
        ...state.userLoan,
        hasPaidBack,
        isApproved,
        timeStamp,
        hasRequestedLoan,
      };
    },
    singleDurationFunction: (state) => {
      //   state.userLoan.singleDurationOpt = action.payload;
      state.userLoan.singleDurationOpt = Object.keys(
        state.userLoan.durationOption
      ).find(
        (key) =>
          state.userLoan.durationOption[key as keyof DurationOption] === true
      );
      //   console.log(state.userLoan.singleDurationOpt);
    },
  },
});

export const {
  calculateLoan,
  chooseDurationOption,
  singleDurationFunction,
  updateOthers,
} = loanCalculatorSlice.actions;

export const selectCount = (state: RootState) => state.loanReducer;

export default loanCalculatorSlice.reducer;

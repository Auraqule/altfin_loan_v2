import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Switch, Tooltip, Zoom } from "@mui/material";

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

interface IProps {
  nextPageHandler: Function;
  registerHandler: Function;
  zone: string | null;
  bvn: string;
  setBvn: (value: string) => void;
  acctNo: string;
  setAcctNo: (value: string) => void;
  bank: string;
  setBank: (value: string) => void;
  acctName: string;
  setAcctName: (value: string) => void;
  zoneLeader: string | null;
  sex: string;
  homeAddress: string;
  setHomeAddress: (value: string) => void;
  workAddress: string;
  setWorkAddress: (value: string) => void;
  agreeWithTerms: boolean;
  setAgreeWithTerms: (value: boolean) => void;
  setPassport: any;
  setVotersCard: any;
  selectedOption: any;
  setSelectedOption: any;
  selectZoneHandler: any;
  selectLeaderHandler: any;
  selectSexHandler: any;
  perc: any;
  isRegisterWithPhone: any;
  setIsRegisterWithPhone: any;
}

const leaderOptions = [
  { value: "def", label: "Select your zone leader" },
  { value: "ojo-alabere", label: "Ojo Alabere" },
  { value: "dupe-akin", label: "Dupe Akin" },
  { value: "ogunsinakawsara", label: "Ogunsina Kawsara" },
  { value: "none", label: "None" },
];
const zoneOptions = [
  { value: "def", label: "Select your zone" },
  { value: "bodija", label: "Bodija" },
  { value: "dugbe", label: "Dugbe" },
  { value: "akobo", label: "Akobo" },
  { value: "sango", label: "Sango" },
  { value: "none", label: "None" },
];

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Others" },
];

const RegisterPage2: React.FC<IProps> = ({
  nextPageHandler,
  registerHandler,
  zone,
  zoneLeader,
  sex,
  bvn,
  setBvn,
  acctNo,
  setAcctNo,
  acctName,
  setAcctName,
  bank,
  setBank,
  setPassport,
  setVotersCard,
  homeAddress,
  setHomeAddress,
  workAddress,
  setWorkAddress,
  agreeWithTerms,
  setAgreeWithTerms,
  selectedOption,
  setSelectedOption,
  selectZoneHandler,
  selectLeaderHandler,
  selectSexHandler,
  perc,
  isRegisterWithPhone,
  setIsRegisterWithPhone,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const agreeWithTermsHandler: any = () => {
    setAgreeWithTerms(!agreeWithTerms);
  };
  const setPassportHandler = (e: any) => {
    setPassport(e.target.files[0]);
  };
  const setVotersCardtHandler = (e: any) => {
    setVotersCard(e.target.files[0]);
  };
  const setErrortHandler = (e: any) => {
    e.preventDefault();
    handleOpen();
  };
  return (
    <div className="max-w-2xl mx-auto bg-white p-16  relative">
      {(!sex || !zone || !zoneLeader) && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p>{!sex && "Select your Sex"}</p>
            <p>{!zone && "Select your zone"}</p>
            <p>{!zoneLeader && "Select your zone leader"}</p>
            <Link to="contact">
              <p className="text-sm mt-2 font-semibold text-blue">
                Contact Support
              </p>
            </Link>
            <div className="mt-4">
              <Button onClick={handleClose} color="error" variant="contained">
                OK
              </Button>
            </div>
          </Box>
        </Modal>
      )}

      <h2
        onClick={(e) => nextPageHandler(e)}
        className="text-blue font-bold absolute right-20 cursor-pointer hover:underline top-8"
      >
        back
      </h2>
      <form
        onSubmit={
          zone && zoneLeader && sex
            ? (e) => registerHandler(e)
            : (e) => setErrortHandler(e)
        }
      >
        <div className="grid gap-6  lg:grid-cols-2">
          <div>
            <label
              htmlFor="zone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Zone
            </label>
            <Select
              defaultValue={selectedOption}
              onChange={selectZoneHandler}
              options={zoneOptions}
            />
          </div>
          <div>
            <label
              htmlFor="zone-leader"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Zone Leader
            </label>
            <Select
              defaultValue={selectedOption}
              onChange={selectLeaderHandler}
              options={leaderOptions}
            />
          </div>
          <div>
            <label
              htmlFor="bvn"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              BVN
            </label>
            <input
              required
              pattern=".{11,11}"
              title="Enter a valid BVN"
              minLength={11}
              maxLength={11}
              value={bvn}
              onChange={(e) => setBvn(e.target.value)}
              type="text"
              id="bvn"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="224566776544"
            />
          </div>
          <div>
            <label
              htmlFor="acct-no"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Acct No
            </label>
            <input
              required
              pattern=".{10,10}"
              title="Enter a valid Acct No"
              minLength={10}
              maxLength={10}
              value={acctNo}
              onChange={(e) => setAcctNo(e.target.value)}
              type="text"
              id="acct-no"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0044554436"
            />
          </div>
          <div>
            <label
              htmlFor="acct-name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Acct name
            </label>
            <input
              required
              value={acctName}
              onChange={(e) => setAcctName(e.target.value)}
              type="text"
              id="acct-name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Saraki Belo"
            />
          </div>
          <div>
            <label
              htmlFor="bank"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Bank
            </label>
            <input
              required
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              type="text"
              id="bank"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Zenith"
            />
          </div>
          <div>
            <label
              htmlFor="passport"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 "
            >
              Passport/Image
            </label>
            <input
              //   value={passport}
              onChange={setPassportHandler}
              required
              type="file"
              id="passport"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            />
          </div>

          <div>
            <label
              htmlFor="voters-card"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Voters Card
            </label>
            <input
              //   value={votersCard}
              onChange={setVotersCardtHandler}
              required
              type="file"
              id="voters-card"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            />
          </div>
        </div>
        <div className="flex gap-6 lg:grid-cols-2 ">
          <div className="mb-4 mt-2 w-full">
            <label
              htmlFor="home-address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Home Address
            </label>
            <input
              required
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              type="text"
              id="home-address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="home address ..."
            />
          </div>
          <div className="w-3/6 mb-4 mt-2">
            <label
              htmlFor="zone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Sex
            </label>
            <Select
              // placeholder="Sex"
              defaultValue={selectedOption}
              onChange={selectSexHandler}
              options={sexOptions}
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="work-address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Work Address
          </label>
          <input
            value={workAddress}
            required
            onChange={(e) => setWorkAddress(e.target.value)}
            type="text"
            id="work-address"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="work address ..."
          />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              required
              onChange={agreeWithTermsHandler}
              checked={agreeWithTerms}
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium block text-gray-900 dark:text-gray-400"
          >
            I agree with the{" "}
            <Link
              target="_blank"
              to="/privacy-policy"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              terms and conditions
            </Link>
            .
          </label>
        </div>
        <div className="absolute bottom-6 right-4">
          <Tooltip
            title={isRegisterWithPhone ? "Verify via Email" : "Verify via OTP"}
            TransitionComponent={Zoom}
            arrow
            placement="top"
          >
            <Switch
              checked={isRegisterWithPhone}
              onChange={() => setIsRegisterWithPhone(!isRegisterWithPhone)}
              // {...Label}
              // defaultChecked
              size="small"
            />
          </Tooltip>
        </div>
        <button
          type="submit"
          disabled={!agreeWithTerms && perc < 100}
          //   && perc !== nul
          className=" disabled:opacity-80 disabled:cursor-not-allowed text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage2;

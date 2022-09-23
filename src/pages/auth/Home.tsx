import React, { useEffect, useState } from "react";
import hero from "../../assets/hero.png";
import lady from "../../assets/girl-money.jpg";
import world from "../../assets/service.png";
// import pattern from "../../assets/pattern.png";
// import "../../App.css";
import { loanPackages } from "../../data";
import DataUsageRoundedIcon from "@mui/icons-material/DataUsageRounded";

import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import ClearIcon from "@mui/icons-material/Clear";
import { useScrollDirection } from "./useScroll";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import Faqs from "../../components/Faqs";
import Clients from "../../components/Clients";

export enum LoanPackage {
  package_1 = "Coporate loan",
  package_2 = "Personal loan",
  package_3 = "SME loan",
}

const Home = () => {
  const scrollValue = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [loanPackage, setLoanPackage] = useState({});
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      return;
    }
    if (!isMenuOpen) {
      document.body.style.overflow = "unset";
      return;
    }
  }, [isMenuOpen]);
  const handleSideBarClose = () => {
    setIsMenuOpen(!isMenuOpen);
    // setIsModalActive(true);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loanPackageHandler = (_package: any) => {
    setIsModalActive(true);
    setLoanPackage(_package);
  };
  const loanPackageHandlerMobile = (_package: any) => {
    handleSideBarClose();
    loanPackageHandler(_package);
  };

  return (
    <>
      <Modal
        loanType={loanPackage}
        active={isModalActive}
        setIsModalActive={setIsModalActive}
      />
      <header
        className={`${
          scrollValue >= 16
            ? "bg-[#ffffff]/80 fixed z-[90] w-full py-4"
            : "bg-[#dfdacd] py-5"
        }   transition-all duration-800 ease-linear backdrop-blur-md`}
      >
        <nav
          className={`flex items-center ${
            scrollValue >= 16 ? "#16002c" : "#16002c"
          }  justify-between md:justify-around px-8 md:px-0 relative z-[80]`}
          // style={ scrollValue >= 16 && {color: "#ffffff"}}
        >
          <Link to="/">
            <div
              className={`logo font-bold ${
                scrollValue >= 16 && "text-[1.5rem]"
              } text-[2rem] transition-all cursor-pointer duration-500 text-[rgb(22, 0, 44)]`}
            >
              altfin
            </div>
          </Link>
          <ul className="self-end hidden md:flex space-x-8">
            <li
              onClick={() => loanPackageHandler(loanPackages[0])}
              className="relative hover:-translate-y-1 duration-500 cursor-pointer before:absolute pb-2 delay-75 before:h-1 before:transition-all before:duration-300 before:-left-[9999px] hover:before:left-0 before:w-full before:bottom-0 before:bg-blue hover:before:border-b-2"
            >
              Coporate loan
            </li>
            <li
              onClick={() => loanPackageHandler(loanPackages[2])}
              className="relative hover:-translate-y-1 duration-500 cursor-pointer before:absolute pb-2 delay-75 before:h-1 before:transition-all before:duration-300 before:-left-[9999px] hover:before:left-0 before:w-full before:bottom-0 before:bg-blue hover:before:border-b-2"
            >
              Personal loan
            </li>
            <li
              onClick={() => loanPackageHandler(loanPackages[1])}
              className="relative hover:-translate-y-1 duration-500  cursor-pointer before:absolute pb-2 delay-75 before:h-1 before:transition-all before:duration-300 before:-right-[9999px] hover:before:right-0 before:w-full before:bottom-0 before:bg-blue hover:before:border-b-2"
            >
              SME loan
            </li>
          </ul>
          <div className="hidden md:flex  ">
            <Link to="/register">
              <button className="bg-[#16002c] py-2 px-6 rounded-full text-sm font-semibold hover:bg-blue transition-all duration-500 text-white">
                Sign In
              </button>
            </Link>
          </div>
          <div
            className="block md:hidden transition-all duration-700 ease-linear"
            onClick={handleToggleMenu}
          >
            {!isMenuOpen && (
              <div className="transition duration-300 relative z-[200] ease-out rotate-180">
                <ViewHeadlineIcon fontSize="large" />
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* THE HERO SECTION GOES HERE */}
      <section className="bg-[#dfdacd] ">
        <main className="hero text-[#16002c] block space-y-6  md:flex justify-between items-center p-16 px-6 md:px-16">
          {isMenuOpen && (
            <>
              <div
                className={`fixed h-screen top-0 z-[60] w-1/2  ${
                  isMenuOpen ? "right-0" : "-right-[1000px]"
                }  transition duration-700  bg-[#16002c]`}
              >
                <div className="relative w-full h-full">
                  <ul className=" flex-col mx-auto left-9 sm:left-24 sm:space-y-5 tracking-widest space-y-4 absolute top-20 text-white">
                    <li
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:border-b-2 cursor-pointer hover:py-1 transition-all duration-200 hover:border-white"
                    >
                      Home
                    </li>
                    <li
                      onClick={() => loanPackageHandlerMobile(loanPackages[0])}
                      className="hover:border-b-2 cursor-pointer hover:py-1 transition-all duration-200 hover:border-white"
                    >
                      Coporatives
                    </li>
                    <li
                      onClick={() => loanPackageHandlerMobile(loanPackages[1])}
                      className="hover:border-b-2 cursor-pointer hover:py-1 transition-all duration-200 hover:border-white"
                    >
                      SME
                    </li>
                    <li
                      onClick={() => loanPackageHandlerMobile(loanPackages[2])}
                      className="hover:border-b-2  cursor-pointer hover:py-1 transition-all duration-200 hover:border-white"
                    >
                      Personal
                    </li>
                    <li className="py-2 px-3 rounded-full hover:bg-green-500 transition-all duration-200 cursor-pointer hover:text-white text-[#16002c] text-sm text-center relative right-4 font-semibold bg-slate-100">
                      <Link to="/register">Get Started</Link>
                    </li>
                  </ul>
                  <div
                    className="transition absolute duration-300  z-[100] left-4 top-6 text-white ease-linear rotate-90"
                    onClick={handleToggleMenu}
                  >
                    <ClearIcon fontSize="large" color="inherit" />
                  </div>
                </div>
              </div>
              <div
                className="fixed  h-screen top-0 z-[58] left-0 right-0 bg-{#dfdacd}/80 backdrop-blur-sm "
                onClick={handleToggleMenu}
              />
            </>
          )}

          <div className="right py-12 relative order-2 xl:shadow-xl w-full md:w-1/2">
            <div className="absolute w-full md:left-20 rounded-t-full top-0 bg-blue z-10  md:rounded-b-full md:w-1/2 h-full" />
            <img
              src={hero}
              className="w-[200%] relative  -bottom-12 right-12  z-30"
              alt="hero"
            />
          </div>
          <div className="left  text-4xl w-full md:w-1/2 md:max-w-xl">
            <div className=" text-5xl md:text-6xl md:scale-105 font-bold leading-tight">
              Loan company like no other.
            </div>
            <div className="text-xl pt-6 pb-4">
              Giving you that swift loan options and delivery like no other,
              altfin is the loan app where friends invest and build strategies
              together. Watch your buddies’ moves, chat about strategy and grow
              your investments together.
            </div>
            <div className="text-xl pt-2">
              Make that loan request today and save yourself
            </div>
            <Link to="/register">
              <button
                className="text-lg rounded-full mt-8 hover:bg-blue transition-all duration-700 text-white bg-[#16002c] py-2 px-8"
                type="button"
              >
                Get Started
              </button>
            </Link>
          </div>
        </main>
      </section>

      {/* SECTION 2 BEGINS HERE */}
      <section>
        <main className="text-[#16002c] block md:flex md:space-x-8 space-y-6 mt-32 px-6 md:px-14 items-center justify-between">
          <div className="left w-full md:w-1/2 ">
            <img
              src={lady}
              className=" w-full md:w-[90%] rounded-3xl"
              alt="lady holding money"
            />
          </div>
          <div className="right w-full md:w-1/2">
            <div className="super-text text-4xl md:text-5xl font-bold leading-tight">
              We are here to deliver convenience, simplicity & ease.
            </div>
            <div className="minor-text py-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              sequi accusantium impedit officiis, atque magnam deleniti sapiente
              consequuntur aliquid cum vitae rem aperiam voluptatem, dicta
              perferendis quidem enim, quae assumenda!
            </div>
            <button
              className="text-lg rounded-full hover:bg-[#44869e] transition-all duration-500 mt-8 text-white bg-[#16002c] py-2 px-8"
              type="button"
            >
              Get Started
            </button>
          </div>
        </main>
      </section>
      {/* CLIENTS SECTION BEGINS HERE */}

      <Clients />

      {/* FEATURES SECTION BEGINS HERE */}
      <section>
        <main className="w-[94%] text-[#16002c] rounded-3xl mx-auto features block md:flex bg-[#f2f0eb] mt-32 px-6 py-8 space-y-6 md:px-14 items-center justify-between">
          <div className="left-text w-full md:w-1/2">
            <div className="sub "></div>
            <div className="super-text text-4xl md:text-5xl font-bold leading-tight">
              Place your loan request today and get credited in no time.
            </div>
            <div className="minor-text py-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              sequi accusantium impedit officiis, atque magnam deleniti sapiente
              consequuntur aliquid cum vitae rem aperiam voluptatem, dicta
              perferendis quidem enim, quae assumenda!
            </div>
            <button
              className="text-lg rounded-full mt-8 hover:bg-[#ff725e] transition-all duration-500 text-white bg-[#16002c] py-2 px-8"
              type="button"
            >
              Get Started
            </button>
          </div>
          <div className="img-right w-full md:w-1/2">
            <img src={world} className="w-full" alt="feature" />
          </div>
        </main>
      </section>
      {/* LOAN PRODUCT/PACKAGE SECTION BEGINS HERE */}
      <section>
        <main className="grid text-[#ffffff] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-32 gap-4 px-4 md:px-14">
          {loanPackages.map(({ title, name, interestRate, loanType, info }) => (
            <div
              key={name}
              className="w-full hover:-translate-y-2 transition-all duration-500 h-[320px] bg-[#16002c] rounded-md p-8 "
            >
              <DataUsageRoundedIcon />
              <h4 className="py-4">{loanType} </h4>
              <p className="pb-2 text-slate-300">{info}</p>
              <p>Interest Rate : {interestRate}</p>
            </div>
          ))}
        </main>
      </section>
      {/* CALL TO ACTION SECTION BEGINS HERE */}
      <section>
        <main className="call-to-action text-[#16002c] block md:flex w-[90%] rounded-3xl mx-auto bg-[#dfdacd] h-[320px] mt-32 px-6 md:px-14 space-y-6 items-center justify-between">
          <div className=" w-full md:w-1/3 flex items-center justify-center">
            <button
              className="text-lg rounded-full hover:bg-[#16002c] transition-all duration-700 mt-8 order-last text-white bg-blue py-4 font-semibold px-12"
              type="button"
            >
              Get Started
            </button>
          </div>

          <div className="super-text text-4xl order-first w-full md:w-2/3 md:text-5xl font-bold leading-tight max-w-[800px]">
            Place your loan request today and get credited in no time!
          </div>
        </main>
      </section>
      {/* FAQS SECTION BEGINS HERE */}
      <section className="w-[86%] md:w-[80%] mx-auto mt-20 bg-[#2b193c] text-[#16002c]">
        <h2 className="text-lg font-semibold text-white  py-4 px-6">
          Frequently Asked Questions
        </h2>
        <Faqs />
      </section>
      {/* FOOTER SECTION BEGINS HERE */}
      <footer className="bg-[#16002c]">
        <main
          // style={{
          //   backgroundImage:
          //     "url(" +
          //     "https://assets-global.website-files.com/5e6a544cadf84b1393e2e022/60f419726af51c01fac88c67_e80n-hteQ8K3yiKF1wxwei6KPjnjiAZoYR-WhU4EHXApKclQt8KvlnAWDPgBcI3fYvi3K9djUdgCcu-YD_LZoiAsoYgB-OVQ4Hd92UDkiERasUIbRNUm5Wrm3l3lDXpazksdiYgg.png" +
          //     ")",
          // }}
          className={`footer  text-white text-[14px] sm:text-[18px] px-6 md:px-14 py-8 items-center mt-16 flex justify-between`}
        >
          <h4 className="p-4 bg-blue rounded-full cursor-pointer hover:bg-white hover:text-[#16002c] hover:-translate-y-2 transition-all duration-500 text-slate-200 ">
            altfin
          </h4>
          <ul className="grid text-[16px] grid-cols-3 gap-9 ">
            <li className="text-end md:text-center cursor-pointer hover:-translate-y-2 transition-all duration-500">
              Twitter
            </li>
            <li className=" cursor-pointer hover:-translate-y-2 transition-all duration-500">
              Instagram
            </li>
            <li className="cursor-pointer hover:-translate-y-2 transition-all duration-500">
              Facebook
            </li>
            {/* <li>LinkedIn</li> */}
          </ul>
          {/* <div className="text-center">altfin.loans</div> */}
        </main>
        <div className="bg-[#16002c] text-[#16002c] pb-6">
          <div className="bg-slate-300 h-1/2 w-[80%] mx-auto py-2">
            <p className="text-center mx-auto text-sm sm:text-[16px]">
              {" "}
              Copyright 2022 &#169;. Altfin loans. All rights reserved
            </p>
          </div>
        </div>
      </footer>
      {/* FOOTER */}
    </>
  );
};

export default Home;

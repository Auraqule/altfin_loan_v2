import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer
        className={(true ? " bg-inherit sm:pt-16" : "relative ") + " pb-6"}
      >
        <div className="container mx-auto px-4 ">
          <hr className="mb-4 hidden sm:block border-b-1 border-blueGray-600" />
          <div className="flex  flex-wrap items-center md:justify-center justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm portrait:hidden text-gray-300 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <Link
                  to=""
                  className="text-white hover:text-blueGray-300 text-sm font-semibold py-1"
                ></Link>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <Link
                    to="contact"
                    className="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="https://altfinglobal.com"
                    rel="noreferrer"
                    target="_blank"
                    className="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://altfinglobal.com"
                    rel="noreferrer"
                    target="_blank"
                    className="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
                  >
                    News
                  </a>
                </li>
                <li>
                  <Link
                    to="privacy-policy"
                    className="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
                  >
                    Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

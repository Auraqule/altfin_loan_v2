import React from "react";
import { Outlet } from "react-router-dom";
// components
import img from "../assets/bg.png";

import Navbar from "../components/Navbar";

export default function Auth() {
  return (
    <>
      <main>
        <section>
          <Navbar />
          <div
            style={{
              backgroundImage: `url(${img})`,
            }}
          ></div>
          <Outlet />
        </section>
      </main>
    </>
  );
}
// import React from "react";
// import { Outlet } from "react-router-dom";
// const Auth = () => {
//   return (
//     <div className="App">
//       <Outlet />
//     </div>
//   );
// };

// export default Auth;

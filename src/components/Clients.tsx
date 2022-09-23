import React from "react";

const Clients = () => {
  const clientsData = [
    { id: "brand_1", brandName: "brand 1", logo: "" },
    { id: "brand_2", brandName: "brand 2", logo: "" },
    { id: "brand_3", brandName: "brand 3", logo: "" },
    { id: "brand_4", brandName: "brand 4", logo: "" },
  ];

  return (
    <section className="mt-16 -mb-16 sm:mt-24 sm:-mb-8">
      {/* <p className="text-[30px]">Our Clients</p> */}
      <div className="bg-slate-100 grid grid-cols-4  gap-4 px-4 sm:px-16 py-12 max-w-full justify-center text-center">
        {clientsData.map((client) => (
          <div
            key={client.id}
            className="hover:opacity-50 cursor-pointer shadow-lg transition-all duration-300 text-[#16002c] "
          >
            <h2 className=" bg-[#ffffff] py-3 px-3  sm:text-[24px]">
              {client.brandName}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;

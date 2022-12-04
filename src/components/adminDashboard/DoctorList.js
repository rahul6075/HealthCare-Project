import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorListCompo from "./DoctorListCompo";
const DoctorList = (props) => {
  const navigate = useNavigate();
  
  return (
    <div className="m-4 mt-4 font-poppins col-span-10">
      <div>
        <h1 className="font-bold text-xl ml-16 mt-16">Patient List</h1>
      </div>
      <div className="grid grid-rows-2 mt-8 m-14 mr-12  bg-white rounded shadow p-6 gap-4">
        <div className="grid grid-cols-9 font-bold">
          <h1>Sr.No.</h1>
          <h1 className="col-span-2">Doctor Name</h1>
          <h1 className="col-span-2">Hospital Name</h1>
          <h1 className="col-span-0">Speciality</h1>
          <h1 className="col-span-2">Contact</h1>
          <h1>Action</h1>
        </div>
        <hr></hr>
        <div className="flex justify-center items-center">
            No Doctors are Found on System
          </div>
      </div>
    </div>
  );
};

export default DoctorList;

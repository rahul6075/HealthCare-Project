import Footer from "../landingPage/Footer";
import PatientHistoryCompoDoctorView from "./PatientHistoryCompoDoctorView";
import doctor_profile from "../../assets/img/dashboard/doctor2.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PatientHistoryDoctorView = (props) => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("01/01/2006");
  const [patient, setPatient] = useState({});
  const [prescriptions, setPrescriptions] = useState([{}]);



  return (
    <div className="col-span-10">
  
        <div className=" px-12">
          <div className="h-screen">
            <div className="font-poppins   mainf">
              <Link to="/doctor/profile">
                <div className="flex bg-white rounded shadow  px-4   ml-auto h-14 w-1/5 mr-8 mt-8">
                  <img
                    src={doctor_profile}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                    <div className="font-bold font-poppins text-base flex my-2">
                      <h1>Dr.</h1>
                      <h1 className="ml-2">
                        Dr. Rakesh
                      </h1>
                    </div>
                    <div className="">
                      <h2 className="text-sm my-2">
                        Physio
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex justify-between m-8">
                <div className="font-bold text-xl ml-4">
                  <h1>Patient Reports</h1>
                </div>
              </div>
              <div className="bg-white m-4 rounded-lg ">
                <div className="grid grid-rows-2 p-6 gap-2 shadow">
                  <div className="grid grid-cols-4 font-bold ">
                    <div>
                      <h1>Date</h1>
                    </div>
                    <div>
                      <h1>Doctor Name</h1>
                    </div>
                    <div>
                      <h1>Diagnosis</h1>
                    </div>
                    <div>
                      <h1>Prescription</h1>
                    </div>
                    <hr></hr>
                    <hr></hr>
                    <hr></hr>
                    <hr></hr>
                  </div>

                  <div className="font-bold mt-3 mx-auto">
                    No Record Found...
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
     
      {/* <div className="text-xl flex justify-center items-center font-bold my-80 py-4 flex-col ">
        <div>Search Patient to see Reports</div>
        <Link
          to="/doctor/dashboard"
          className="text-md py-1 px-4 bg-primary rounded mt-3"
        >
          Return to DashBoard
        </Link>
      </div> */}
      <div className="-mt-20 mb-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default PatientHistoryDoctorView;

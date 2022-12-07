import doctor_profile from "../assets/img/dashboard/doctor2.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import add_pre_logo from "../assets/img/dashboard/add_prescription_logo.png";
import Footer from "../components/landingPage/Footer";
import eye from "../assets/img/dashboard/eye.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contract from "../../src/abis/HealthCare.json"
import ReactLoading from "react-loading";
const DoctorDashboard = ({user}) => {
  const [doctorData, setDocterData] = useState(null);


   const getProfile = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const TaskContract = new ethers.Contract(
					contract.networks[5777].address,
					contract.abi,
					signer
				)
        console.log('user', user);
				const userInfo = await TaskContract.getDoctorInfo(user[0]);
				console.log('userInfo Docter', userInfo)
        setDocterData(userInfo);
			} else {
				console.log("Ethereum object doesn't exist");
			}
		} catch (error) {
			console.log("Login error", error.message);
		}
	}
	useEffect(() => {
		getProfile()
	}, [])

 
  

 

  return (
    <div className="full-body col-span-10 h-screen">
      <div className="body-without-footer   bg-bgprimary ">
        <div className="main    m-2  ">
          {/* dashboard today start */}
          <div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4 ">
              <div>
                <h1 className="text-2xl font-poppins font-bold p-2 ">
                  Docter DashBoard 
                </h1>
              </div>

              <div className="flex ml-20  h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img src={search} className=" h-6 mt-2  " alt="search"></img>
                </div>
              </div>

              <Link to="/doctor/profile">
                <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                  <img
                    src={doctor_profile}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                    <div className="font-bold font-poppins text-base">
                      <h1 className="">
                       Dr. Rakesh Jhaa
                      </h1>
                    </div>
                    <div className="">
                      <h2 className="text-sm">
                        Neuro Surgen
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* dashboard today end */}

          {/* <form
            onSubmit={searchPatient}
            className="grid grid-cols-9 bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"
          >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl font-poppins font-bold p-2 ">
                Search Patient By Health Id :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Health ID"
                className="bg-bgsecondary rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={props.healthID}
                onChange={(e) => {
                  props.setHealthID(e.target.value);
                }}
              ></input>
            </div>
            {Loading ? (
              <div className="grid col-start-8  h-10 ml-4">
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"45%"}
                  width={"45%"}
                />
              </div>
            ) : (
              <div className=" grid col-start-8  h-10 ml-4  bg-primary  rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary  ">
                <div className="flex py-2 px-4 items-center ">
                  <img src={search} className=" h-4  " alt="search"></img>
                  <button className="ml-2 flex  rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary   ">
                    Search
                  </button>
                </div>
              </div>
            )}
            <div className="grid col-start-9  h-10 ml-4  bg-primary  rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary  ">
              <div className="flex py-2 px-4 items-center ">
                <div
                  className="ml-2 flex cursor-pointer rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary "
                  onClick={() => {
                    props.setHealthID("");
                  }}
                >
                  Remove
                </div>
              </div>
            </div>
          </form> */}
             <div className="text-xl flex justify-center items-center font-bold my-60">
              Search Patient to Add Diagnosis
            </div>

          {/* {Object.keys(patient).length !== 0 ? (
            <div className="font-poppins m-4  ">
              <div className="flex justify-between m-8">
                <div className="font-bold text-xl ml-4">
                  <h1>Patient Dashboard</h1>
                </div>
                <Link to="/doctor/addDiagno">
                  <div className=" flex  bg-primary pl-0 pr-3 py-1 items-center justify-items-center  rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary   ">
                    <img
                      src={add_pre_logo}
                      className="h-3 mx-3"
                      alt="adddiagno"
                    ></img>

                    <button className="font-semibold">Add New Diagnosis</button>
                  </div>
                </Link>
              </div>
              <div className="bg-white m-4 rounded-lg ">
                <div className="grid grid-rows-2 p-6 gap-2 shadow">
                  <div className="grid grid-cols-4 font-bold  border-b-2">
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
                  </div>

                  <div className="mx-auto mt-3">No Records Found...</div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )} */}
        </div>
      </div>
      <div className="mt-16 mb-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default DoctorDashboard;

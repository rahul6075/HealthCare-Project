import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {ethers} from "ethers";
import contract from "../../abis/HealthCare.json"

export default function Register(props) {
  const [patient, setPatient] = useState({
    name: "",
    age: null,
    id: null,
  });

  const handleSubmit = (e) => {
      e.preventDefault();
      // console.log('patient', Number(patient.age))
      createPaitent(patient)
  }

  const  createPaitent = async(patient) => {
    try {
      const {ethereum} = window
  
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          contract.networks[5777],
          contract.abi,
          signer
        )
         const {name, age} = 
         await TaskContract.signupPatient(name, Number(patient.age));
         console.log( 'Signup ')     
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="body overflow-hidden">
      <Navbar></Navbar>
      <div className="bg-secoundry w-full">
        <div className="">
          <form
            className="font-poppins lg:ml-60  lg:px-8 lg:py-4 bg-white shadow-lg rounded max-w-screen-lg mt-8 mb-4 "
          >
            <div className="flex   mt-2 bg-bgsecondary w-fit  justify-between rounded mx-auto">
              <button
                className={
                  "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                }
              >
                Patient
              </button>

            </div>
            <div
              className={
                "h-10 p-2 flex flex-col justify-center "}
            >
            </div>

            <div>
              <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-4 gap-2">
                <label className="font-bold lg:text-xl font-poppins px-4 my-4 ">
                  Name
                </label>
                <div>
                  <input
                    className="bg-blue-100 rounded lg:h-10 lg:pl-4 mt-4 lg:text-md text-sm h-8 px-2"
                    required
                    placeholder="Full Name"
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.name = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                </div>

              </div>
              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-4 ">
                  Age {" "}
                </label>

                <input
                  type="number"
                  placeholder="Age"
                  required
                  className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  onChange={(e) => {
                    let temppatient = { ...patient };
                    temppatient.age = e.target.value;
                    setPatient(temppatient);
                  }}
                ></input>
              </div>

              <div className=" aadhar lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-4 ">
                  Address Id{" "}
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Identification Id"
                    required
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                    onChange={(e) => {
                      let temppatient = { ...patient };
                      temppatient.id = e.target.value;
                      setPatient(temppatient);
                    }}
                  ></input>
                </div>
              </div>



              {/* <div className="grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="  lg:text-xl font-bold px-4">
                  Blood Group
                </label>
                <div className="">
                  <select
                    className="pl-4 lg:w-1/2 bg-blue-100 lg:h-10  rounded  h-8"
                    id="blood-group"

                  >
                    <option id="select">select</option>
                    <option id="A+">A+</option>
                    <option id="A-">A-</option>
                    <option id="B+">B+</option>
                    <option id="B-">B-</option>
                    <option id="AB+">AB+</option>
                    <option id="AB-">AB-</option>
                    <option id="O+">O+</option>
                    <option id="O-">O-</option>
                  </select>
                </div>
              </div>  */}
            </div>
            <div className="grid  place-items-center">
              <button
                type="button"
                className="text-lg mt-10  bg-primary py-1 px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary"
                onClick={(e) => handleSubmit(e)}
              >
                Register
              </button>
            </div>

          </form>

          <div className="mt-auto relative bottom-0">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </div>
  );
}

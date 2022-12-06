import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { ethers } from "ethers";
import contract from "../../abis/HealthCare.json"

export default function Register(props) {
  const [toggle, setToggle] = useState("Patient");
  const [formData, setFormData] = useState({
    name: "",
    email: null,
    phone: null,
    type_name: "",
    address: ""
  });
  const [currentAccount, setCurrentAccount] = useState('');
  const conenctWalletHandler = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (toggle === 'Patient') {
      console.log('formData', formData)
      createPaitent(formData)
    } else if (toggle === 'Doctor') {
      console.log('formData', formData)
      createDoctor(formData);
    }

  }


  const createDoctor = async (patient) => {
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
        const { name, phone, email, type_name, address } = patient;
        const data = await TaskContract.addDoctor(name, email, Number(phone), type_name, address);
        console.log('Doctor Signup Sucessfull', data);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const createPaitent = async (patient) => {
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
        const { name, phone, email } = patient;
        let phoneNum = Number(phone);
        const data = await TaskContract.addPatient(name, phoneNum, email);
        const transactionReceipt = await data.wait();
        if (transactionReceipt.status !== 1) {
          alert('error message');
          return;
        }
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    conenctWalletHandler();
  }, [currentAccount]);




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
                onClick={() => setToggle("Patient")}
                className={
                  toggle === "Patient"
                    ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                    : "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-bgsecondary"
                }
              >
                Patient
              </button>
              <button
                onClick={() => setToggle("Doctor")}
                className={
                  toggle === "Doctor"
                    ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
                    : "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-bgsecondary"
                }
              >
                Doctor
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
                      let temppatient = { ...formData };
                      temppatient.name = e.target.value;
                      setFormData(temppatient);
                    }}
                  ></input>
                </div>

              </div>

              <div className="lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-4 ">
                  Email Id {" "}
                </label>

                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                  onChange={(e) => {
                    let temppatient = { ...formData };
                    temppatient.email = e.target.value;
                    setFormData(temppatient);
                  }}
                ></input>
              </div>

              <div className="aadhar lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                <label className="font-bold lg:text-xl px-4 ">
                  Mobile No.{" "}
                </label>
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    required
                    className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                    onChange={(e) => {
                      let temppatient = { ...formData };
                      temppatient.phone = e.target.value;
                      setFormData(temppatient);
                    }}
                  ></input>
                </div>
              </div>
              {toggle === 'Doctor' &&
                (
                  <div>
                    <div className="lg:grid lg:grid-cols-4 lg:gap-2 mt-4 mr-4 grid grid-cols-4 gap-2">
                      <label className="font-bold lg:text-xl font-poppins px-4 my-4 ">
                        Designation
                      </label>
                      <div>
                        <input
                          className="bg-blue-100 rounded lg:h-10 lg:pl-4 mt-4 lg:text-md text-sm h-8 px-2"
                          required
                          placeholder="Enter Your Designation"
                          onChange={(e) => {
                            let temppatient = { ...formData };
                            temppatient.type_name = e.target.value;
                            setFormData(temppatient);
                          }}
                        ></input>
                      </div>
                    </div>
                    <div className="aadhar lg:grid grid-cols-4 gap-2 mt-4 mr-4">
                      <label className="font-bold lg:text-xl px-4 ">
                        Location {" "}
                      </label>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter Your Address"
                          required
                          className="pl-4 bg-blue-100 lg:h-10  rounded h-8"
                          onChange={(e) => {
                            let temppatient = { ...formData };
                            temppatient.address = e.target.value;
                            setFormData(temppatient);
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>
                )

              }
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

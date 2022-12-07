import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/img/landingPage/logo.png";
import { Link } from "react-router-dom";
import contract from "../../abis/HealthCare.json";
import { ethers } from "ethers";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(
     localStorage.getItem("isAuth")
  );
  const [role, setRole] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const conenctWalletHandler = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log(accounts)
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        await LoginHandler();
      } else {
        console.log('No Found account');
      }
    } catch (error) {
      console.log('Error connecting to metamask', error.message)
    }
  }

  const LoginHandler = async () => {
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
        const userInfo = await TaskContract.Login();
        setRole(userInfo.role)
        setAuthenticated(true);
        console.log('userInfo', userInfo.role);
        if (userInfo) {
          // toast.success("User Successfully Registered.");

          // localStorage.setItem("isAuth", true);
          switch (role) {
            case "Patient":
              navigate("/patient/dashboard");
              break;
            case "Doctor":
              navigate("/doctor/dashboard");
              break;
            case "Admin":
              navigate("/admin/dashboard");
              break;
            default:
              break;
          }
        }

      } else {
        toast.warn("Ethereum object doesn't exist");
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    conenctWalletHandler();
  }, [])
  return (
    <nav className="lg:bg-white lg:w-screen lg:h-14 shadow-sm lg:px-16 lg:py-3 flex justify-items-center items-center  w-full ">
      <img
        src={logo}
        alt="logo"
        className="lg:h-10 lg:pr-3 h-10 pr-4 pl-2 mt-2"
      />
      <h1 className="font-poppins font-bold text-sm lg:text-xl mt-2 mb-2">
        <Link to="/">Healthcare Management System</Link>
      </h1>
      <ul className="flex ml-auto lg:w-60 justify-evenly  font-lato font-semibold w-64 ">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About us</Link>
        </li>
        <li>
          <Link to="/contact">Contact us</Link>
        </li>
      </ul>

      {isAuthenticated ? (
        <>
        <button className="bg-primary lg:py-2 lg:px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary py-1 px-2 mr-2" onClick={LoginHandler}>
          <Link to="/">Login</Link>
        </button>
        <button className="bg-primary lg:py-2 lg:px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary py-1 px-2 mr-2">
          <Link to="/register">Register</Link>
        </button>
      </>  
      ) : (
        <button className="bg-primary lg:py-2 lg:px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary py-1 px-2 mr-2" onClick={LoginHandler}>
        <Link to="/patient/dashboard">Dashboard</Link>
      </button>
      )}



      {/* <button className="bg-primary lg:py-2 lg:px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary py-1 px-2 mr-2">
            {location.pathname === "/register" ? (
              <Link to="/">Login</Link>
            ) : (
              <Link to="/register">Register</Link>
            )}
          </button> */}

    </nav>
  );
}

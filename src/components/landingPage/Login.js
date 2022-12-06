import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/img/landingPage/profile.png";
import { ethers } from "ethers";
import contract from "../../abis/HealthCare.json"

const addressContract = '0xE6773e3D8C979B4CaCAd2510759655Be5b076630'

export default function Login(props) {
	const navigate = useNavigate();
	const [Toggle, setToggle] = useState(null);
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
				setRole(userInfo.role);
				console.log('userInfo', userInfo.role);
				if (userInfo) {
					localStorage.setItem("userInfo", JSON.stringify(userInfo));
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
				console.log("Ethereum object doesn't exist");
			}
		} catch (error) {
			console.log("Login error", error.message);
		}
	}
	useEffect(() => {
		conenctWalletHandler()
	}, [])

	return (
		<div className="bg-white flex flex-col justify-items-center items-center py-4 px-4 rounded shadow-md lg:w-3/4 w-full my-7 ml-auto ">
			<h1 className="text-3xl font-bold font-poppins text-primary py-5">
				Login
			</h1>
			<div className="flex bg-bgsecondary w-fit justify-between rounded">
				<button
					className={
						Toggle === "Patient"
							? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
							: "py-2 px-8 text-lg font-poppins font-medium text-primary cursor-pointer rounded"
					}
					onClick={() => {
						setToggle("Patient");
					}}
				>
					Patient
				</button>
				<button
					onClick={() => {
						setToggle("Doctor");
					}}
					className={
						Toggle === "Doctor"
							? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
							: "py-2 px-8 text-lg font-poppins font-medium text-primary cursor-pointer rounded"
					}
				>
					Doctor
				</button>
				<button
					onClick={() => {
						setToggle("Admin");
					}}
					className={
						Toggle === "Admin"
							? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary"
							: "py-2 px-8 text-lg font-poppins font-medium text-primary cursor-pointer rounded"
					}
				>
					Admin
				</button>
			</div>
			<img
				src={profile}
				alt="profile pic"
				className="h-20 my-6 border-2 rounded-full"
			/>
			<form className="flex flex-col w-full px-8">

				<button
					type="button"
					className="text-lg mt-10  bg-primary py-1 px-3 rounded font-semibold font-poppins shadow-sm hover:bg-bgsecondary"
					onClick={conenctWalletHandler}
				>
					Login
				</button>
			</form>
			<h1 className="font-poppins text-base pt-5">
				New User, <Link to="/Register">Register here</Link>
			</h1>
		</div>
	);
}

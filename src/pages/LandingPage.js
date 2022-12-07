import React from 'react';
import { Link } from 'react-router-dom'
import Navbar from '../components/landingPage/Navbar';
import Vector from '../assets/img/landingPage/cover.jpg';
import Footer from '../components/landingPage/Footer';

export default function LandingPage() {


  return (
    <div className='h-screen max-h-min flex flex-col'>
      <Navbar />
      <div className='body lg:flex px-16 w-full lg:h-5/6 '>
        <img
          src={Vector}
          alt='Graphics'
          className='lg:w-1/2 lg:my-auto lg:mx-auto mt-24'
        />
        <div className='lg:ml-auto lg:w-1/2 w-screen'>
          <div class="w-4/6 mt-20">
            <h1 class="text-primary text-4xl md:text-6xl tracking-tight leading-none font-extrabold text-grey-500">Decentralize HealthCare Plateform</h1>
            <p class="text-xl text-gray-500 mt-2">
              Healthcare Plateform for the  health  related problem via the prevention, diagnosis, treatment, amelioration or cure of disease, illness, injury, and other physical and mental impairments in people.
              It is  also delivered by health professionals and allied health fields and End to user Encryption with help with  blockchain technologices.
            </p>
            <Link to="/About" class="inline-block bg-primary hover:bg-blue-300 mt-3 px-6 py-3 rounded-md text-white">More AboutUs..</Link>
          </div>
        </div>
      </div>
      <div className='mt-auto relative bottom-0'>
        <Footer />
      </div>
    </div>
  );
}

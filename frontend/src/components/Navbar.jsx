import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
// import { Menu, X } from "lucide-react";
import FadeIn from './FadeIn';
import { Link } from 'react-router-dom';
import UserProfileIcon from './ui/UserProfileIcon';
import useAuth from '@/utils/auth';
import Sidebar from './Sidebar';

function Navbar() {
  const { isLoggedIn, user } = useAuth();

  return (
    <FadeIn direction="down" delay={0.1} fullWidth zIndex={10}>
      <div className="relative flex flex-row w-full h-[10vh] min-h-[60px] bg-[#05140D] items-center justify-between px-4 md:px-5 lg:px-10">
        {/* Hamburger Menu for Mobile */}
        <div className="sm:hidden flex items-center cursor-pointer">
          <Sidebar />
        </div>

        {/* Logo */}
        <Link to="/" className="flex flex-row items-center justify-center cursor-pointer">
          <img
            className="md:h-[50px] h-[40px] pr-0"
            src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png"
            alt="Logo"
          />
          <h1 className="md:text-4xl text-3xl font-semibold text-white cursor-pointer">harovest</h1>
        </Link>

        {/* Navigation Links */}
        <ul className={`hidden sm:static sm:flex flex-col sm:flex-row items-center sm:top-0 left-0 md:left-auto md:w-auto`}>
          <li className="text-lg text-white p-4 cursor-pointer hover-effect">
            <Link to="/">Home</Link>
          </li>
          {isLoggedIn? (
            <li className="text-lg text-white p-4 cursor-pointer hover-effect">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          ):null};
          
          <li className="text-lg text-white p-4 cursor-pointer hover-effect">
            <Link to="/posts">Posts</Link>
          </li>
          <li className="text-lg text-white p-4 cursor-pointer hover-effect">
            <Link to="/projects">Projects</Link>
          </li>
        </ul>

        {/* Login / Sign Up Button */}
        {isLoggedIn ? (
          <FadeIn direction="left" delay={0.2}>
            <UserProfileIcon />
          </FadeIn>
        ) : (
          <Link to="/signup">
            <Button variant="custom" size="lg" className="md:block m-0">
              Sign Up
            </Button>
          </Link>
        )}
      </div>
    </FadeIn>
  );
}

export default Navbar;

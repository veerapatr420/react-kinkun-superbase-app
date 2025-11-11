import React, { useState } from "react";
import burger from "./../assets/burger.png";
import { BsFacebook } from "react-icons/bs";
import { FaLine, FaGithub, FaInstagram } from "react-icons/fa";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  const [secureCode, setSecureCode] = useState("");
  const navigate = useNavigate();

  const handleAccessAppClick = () => {
    if (secureCode.trim() === "") {
      Swal.fire({
        icon: "warning",
        iconColor: "#f6c23e",
        title: "Please enter the secure code.",
        showConfirmButton: true,
        confirmButtonColor: "#1cc88a",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (secureCode.toUpperCase() === "SAU") {
      navigate("/ShowAllKinkun");
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid secure code.",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAccessAppClick();
    }
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md my-14 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          บันทึกการกิน
        </h1>

        <img src={burger} alt="Burger" className="block mx-auto w-30 mt-5" />

        <input
          type="text"
          placeholder="Enter secure code"
          value={secureCode}
          onChange={(e) => setSecureCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="p-3 border border-gray-400 rounded-md mt-5 w-full"
        />

        <button
          onClick={handleAccessAppClick}
          className="w-full bg-blue-700 p-3 rounded-md text-white mt-5 hover:bg-blue-800 cursor-pointer"
        >
          เข้าใช้งาน
        </button>

        <div className="mt-5 flex justify-center gap-5">
          <a href="#">
            <BsFacebook className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
          <a href="#">
            <FaLine className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
          <a href="#">
            <FaGithub className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
          <a href="#">
            <FaInstagram className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

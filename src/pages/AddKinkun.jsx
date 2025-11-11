import React from "react";
import food from "../assets/burger.png";
import Footer from "./footer";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "./../lib/supabaseClient";

export default function AddKinKun() {
  const [Food_name, setFood_name] = React.useState("");
  const [Food_where, setFood_where] = React.useState("");
  const [Food_pay, setFood_pay] = React.useState("");
  const [Foodfile, setFoodfile] = React.useState(null);
  const [FoodName, setFoodname] = React.useState("");

  // ✅ ฟังก์ชันแสดงตัวอย่างรูป
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodfile(file);
      setFoodname(URL.createObjectURL(file));
    } else {
      setFoodfile(null);
      setFoodname("");
    }
  };

  // ✅ SweetAlert ฟังก์ชันแจ้งเตือน
  const warningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      iconColor: "yellow",
      title: msg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ตกลง",
    });
  };

  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      iconColor: "green",
      title: msg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ตกลง",
    });
  };

  // ✅ ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลก่อน
    if (Food_name.trim().length === 0) {
      warningAlert("กรุณากรอกข้อมูล กินอะไร ?");
      return;
    } else if (Food_where.trim().length === 0) {
      warningAlert("กรุณากรอกข้อมูล กินที่ไหน ?");
      return;
    } else if (Food_pay === undefined || Food_pay === "") {
      warningAlert("กรุณากรอกข้อมูล กินไปเท่าไหร่ ?");
      return;
    }

    let food_image_Url = "";

    // ✅ ถ้ามีไฟล์รูป -> อัปโหลดไป Supabase Storage ก่อน
    if (Foodfile) {
      const newfileName = Date.now() + "_" + Foodfile.name;
      const { error: uploadError } = await supabase.storage
        .from("kinkun_bk")
        .upload(newfileName, Foodfile);

      if (uploadError) {
        warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      // ✅ ดึง URL ของไฟล์หลังอัปโหลด
      const { data } = await supabase.storage
        .from("kinkun_bk")
        .getPublicUrl(newfileName);

      food_image_Url = data.publicUrl;
    }

    // ✅ บันทึกข้อมูลลงตาราง
    const { error } = await supabase.from("kinkun_tb").insert([
      {
        food_name: Food_name,
        food_where: Food_where,
        food_pay: Food_pay,
        food_image_url: food_image_Url,
      },
    ]);

    if (error) {
      warningAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      return;
    }

    // ✅ แสดงข้อความสำเร็จ
    successAlert("บันทึกข้อมูลการกินเรียบร้อยแล้ว");

    // ✅ ล้างฟอร์ม
    setFood_name("");
    setFood_where("");
    setFood_pay("");
    setFoodfile(null);
    setFoodname("");

    // ✅ กลับไปหน้าแสดงข้อมูล
    setTimeout(() => {
      document.location = "/showAllkinkun";
    }, 1500);
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลบันทึกการกิน
        </h1>
        <img src={food} alt="กินกัน" className="block mx-auto w-20 mt-5 mb-5" />

        <form onSubmit={handleSubmit}>
          <div>
            <label>กินอะไร ?</label>
            <input
              value={Food_name}
              onChange={(e) => setFood_name(e.target.value)}
              placeholder="เช่น Pizza, KFC, ...."
              type="text"
              className="border border-gray-400 w-full p-2 mt-1 rounded"
            />
          </div>
          <div className="mt-3">
            <label>กินที่ไหน ?</label>
            <input
              value={Food_where}
              onChange={(e) => setFood_where(e.target.value)}
              placeholder="เช่น KFC หนองแขม, Pizza หน้ามอเอเชีย, ...."
              type="text"
              className="border border-gray-400 w-full p-2 mt-1 rounded"
            />
          </div>
          <div className="mt-3">
            <label>กินไปเท่าไหร่ ?</label>
            <input
              value={Food_pay}
              onChange={(e) => setFood_pay(e.target.value)}
              placeholder="เช่น 100, 299.50, ...."
              type="number"
              className="border border-gray-400 w-full p-2 mt-1 rounded"
            />
          </div>

          <div className="mt-3">
            <label className="block">รูปภาพอาหาร</label>
            <input
              onChange={handleSelectImageAndPreview}
              type="file"
              className="hidden"
              id="selectImage"
            />
            <label
              htmlFor="selectImage"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-900 cursor-pointer text-white rounded text-center block"
            >
              เลือกรูปภาพ
            </label>
            <div className="mt-3">
              {FoodName && (
                <img
                  src={FoodName}
                  alt="รูปตัวอย่างอาหาร"
                  className="block mx-auto w-30 mt-5 mb-5"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 w-full hover:bg-green-900 text-white py-3 px-6 rounded mt-5 mx-auto block cursor-pointer"
          >
            บันทึกข้อมูลการกิน
          </button>

          <div className="text-center mt-4 text-blue-600 hover:text-blue-900">
            <Link to="/showAllkinkun" className="hover:underline">
              ย้อนกลับไปหน้าข้อมูลบันทึกการกิน
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

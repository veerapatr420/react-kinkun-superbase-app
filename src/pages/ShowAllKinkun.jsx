import burger from "./../assets/burger.png";
import { Link } from "react-router-dom";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient";
import Swal from "sweetalert2";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  // ✅ ฟังก์ชันแจ้งเตือนเมื่อสำเร็จ
  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // ✅ ฟังก์ชันลบข้อมูล
  const handleDeleteClick = async (id, food_image_url) => {
    const confirmResult = await Swal.fire({
      icon: "question",
      iconColor: "red",
      title: "คุณแน่ใจหรือไม่ที่ต้องการลบข้อมูลนี้?",
      text: "เมื่อลบแล้วจะไม่สามารถกู้คืนได้",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (confirmResult.isConfirmed) {
      // ✅ ลบรูปใน Supabase Storage ถ้ามี
      if (food_image_url && food_image_url !== "") {
        const image_name = food_image_url.split("/").pop(); // ดึงชื่อไฟล์จาก URL
        const { error: deleteImageError } = await supabase.storage
          .from("kinkun_bk")
          .remove([image_name]);

        if (deleteImageError) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการลบรูปภาพ",
            text: deleteImageError.message,
          });
          return;
        }
      }

      // ✅ ลบข้อมูลจากตาราง
      const { error } = await supabase.from("kinkun_tb").delete().eq("id", id);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการลบข้อมูล",
          text: error.message,
        });
        return;
      }

      // ✅ แจ้งเตือนสำเร็จ และอัปเดต state
      successAlert("ลบข้อมูลเรียบร้อยแล้ว");
      setKinkuns((prev) => prev.filter((k) => k.id !== id));
    }
  };

  // ✅ โหลดข้อมูลจาก Supabase
  useEffect(() => {
    const fetchKinkuns = async () => {
      try {
        const { data, error } = await supabase
          .from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            text: error.message,
          });
        } else {
          setKinkuns(data);
        }
      } catch (ex) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: ex.message,
        });
      }
    };

    fetchKinkuns();
  }, []);

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-4 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลการกิน
        </h1>

        <img src={burger} alt="Burger" className="block mx-auto w-20 mt-5" />

        <div className="my-8 flex justify-end">
          <Link
            to="/AddKinkun"
            className="bg-blue-700 p-3 rounded hover:bg-blue-800 text-white"
          >
            เพิ่มบันทึกการกิน
          </Link>
        </div>

        <table className="w-full border border-gray-700 text-sm border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-700 p-2">รูป</th>
              <th className="border border-gray-700 p-2">กินอะไร</th>
              <th className="border border-gray-700 p-2">กินที่ไหน</th>
              <th className="border border-gray-700 p-2">กินไปเท่าไหร่</th>
              <th className="border border-gray-700 p-2">กินเมื่อไหร่</th>
              <th className="border border-gray-700 p-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {kinkuns.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center border border-gray-700 p-3 text-gray-500"
                >
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              kinkuns.map((k) => (
                <tr key={k.id}>
                  <td className="border border-gray-700 p-2 text-center">
                    {!k.food_image_url ? (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    ) : (
                      <img
                        src={k.food_image_url}
                        alt="food"
                        className="w-16 h-16 mx-auto rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="border border-gray-700 p-2">{k.food_name}</td>
                  <td className="border border-gray-700 p-2">{k.food_where}</td>
                  <td className="border border-gray-700 p-2">{k.food_pay}</td>
                  <td className="border border-gray-700 p-2">
                    {new Date(k.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="border border-gray-700 p-2 text-center">
                    <Link to={`/EditKinkun/${k.id}`} className="text-green-600 hover:underline cursor-pointer">แก้ไข |</Link>
                    <button
                      className="text-red-600 hover:underline cursor-pointer"
                      onClick={() => handleDeleteClick(k.id, k.food_image_url)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

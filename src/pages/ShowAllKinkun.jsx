import burger from "./../assets/burger.png";
import { Link } from "react-router-dom";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient"; // ✅ ใช้ {}

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(() => {
    const fetchKinkuns = async () => {
      try {
        const { data, error } = await supabase
          .from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
          console.log("fetch error:", error);
        } else {
          setKinkuns(data);
        }
      } catch (ex) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
        console.log("Error fetching data:", ex);
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
          บันทึกการกิน
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
                    {k.food_image_url === "" || k.food_image_url === null ? (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    ) : (
                      <img
                        src={k.food_image_url}
                        alt="food"
                        className="w-16 h-16 mx-auto"
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
                    <button className="text-red-600 hover:underline">ลบ</button>
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

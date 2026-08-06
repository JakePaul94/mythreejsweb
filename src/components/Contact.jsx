import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('send')
    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Trinh",
          from_email: form.email,
          to_email: "trinhbk501@gmail.com",
          message: form.message
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Cảm ơn bạn. Tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.");

          setForm({
            name: "",
            email: "",
            message: ""
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      );
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex  -row flex-col gap-10 overflow-hidden`}
    >
      <p className={styles.sectionSubText}>Kết nối với tôi</p>
      <h3 className={styles.sectionHeadText}>Liên hệ.</h3>

      <form
        onSubmit={handleSubmit}
        className="mt-12 flex flex-col p-4 pt-8 border-2 border-blue-500 transparent shadow-3xl rounded-2xl gap-8"
      >
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">Tên của bạn</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Bạn tên là gì?"
            className="bg-blue-800 py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">Email của bạn</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Địa chỉ email của bạn?"
            className="bg-blue-800 py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">Lời nhắn</span>
          <textarea
            rows={7}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Bạn muốn nhắn gửi điều gì?"
            className="bg-blue-800 py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>

        <button
          type="submit"
          className="bg-[rgba(255,255,255,0.01)] py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-blue-300primary"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
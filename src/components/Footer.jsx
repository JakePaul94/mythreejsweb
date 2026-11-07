import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Clickable from "./Clickable"; // 👉 Import Clickable

const Footer = () => {
  return (
    <footer className="text-slate-200 py-6 relative z-30">
      <div className="container mx-auto text-center">
        <p className="mb-3 text-sm">&copy; 2024 Copyright by Trình DC</p>
        
        {/* Các nút mạng xã hội */}
        <div className="flex items-center justify-center gap-4 my-3">
          <Clickable
            as="a"
            href="https://www.facebook.com/trinh.ao.cong?locale=vi_VN"
            target="_blank"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-blue-600/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </Clickable>

          <Clickable
            as="a"
            href="https://github.com/JakePaul94"
            target="_blank"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-slate-700/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} />
          </Clickable>

          <Clickable
            as="a"
            href="mailto:trinhbk501@gmail.com"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Email"
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Clickable>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Email:{" "}
          <Clickable
            as="a"
            href="mailto:trinhbk501@gmail.com"
            className="hover:underline text-cyan-400 inline"
          >
            trinhbk501@gmail.com
          </Clickable>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
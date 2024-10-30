import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGithub ,faGoogle } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  return (
    <footer className=" text-slate-200 py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">&copy; 2024 Copyright by Trình DC</p>
        <div>
                    <a href="https://trinhdc.id.vn" className="hover:underline mx-2" aria-label="Facebook">
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href="https://trinhdc.id.vn" className="hover:underline mx-2" aria-label="GitHub">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a href="https://trinhdc.id.vn" className="hover:underline mx-2" aria-label="Zalo">
                        <FontAwesomeIcon icon={faGoogle} />
                    </a>
                </div>
        <p className="mt-2">
          Email:{" "}
          <a href="mailto:info@yourcompany.com" className="hover:underline">
            trinhbk501@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

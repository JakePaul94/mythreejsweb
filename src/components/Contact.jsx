import React, { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";

const EMAIL = "trinhbk501@gmail.com";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <div>
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p className="text-sm text-secondary">
          Feel free to reach out by email.
        </p>

        <p className="mt-2 break-all font-medium text-white">{EMAIL}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Mail size={16} />
            Send email
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
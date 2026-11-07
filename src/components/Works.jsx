import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import Clickable from "./Clickable"; // 👉 Import Clickable

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", (index % 3) * 0.2, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="w-full sm:w-[360px] min-w-0"
    >
      <div className="bg-[rgba(0,222,255,0.07)] shadow-2xl p-5 rounded-2xl w-full border border-white/5">
        <div className="relative w-full h-[200px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full shadow-lg object-cover bg-white rounded-2xl"
          />

          {source_code_link && (
            <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
              {/* 👉 DÙNG CLICKABLE CHO NÚT GITHUB */}
              <Clickable
                onClick={() => window.open(source_code_link, "_blank", "noopener,noreferrer")}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center shadow-md hover:scale-110 active:scale-95 transition-all"
                title="View Source Code"
              >
                <img
                  src={github}
                  alt="source code"
                  className="w-1/2 h-1/2 object-contain"
                />
              </Clickable>
            </div>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px] break-words">
            {name}
          </h3>
          <p className="mt-2 text-secondary text-[14px] leading-relaxed break-words">
            {description}
          </p>
        </div>

        {source_code_link && (
          <p className="mt-3 text-[13px] text-secondary truncate">
            Source:{" "}
            {/* 👉 DÙNG CLICKABLE CHO LINK TEXT */}
            <Clickable
              as="a"
              href={source_code_link}
              target="_blank"
              className="text-cyan-400 hover:underline inline"
            >
              {source_code_link.replace(/^https?:\/\//, "")}
            </Clickable>
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]">
          My Work
        </p>
        <h2 className={`${styles.sectionHeadText}`}>Featured Projects.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-3 text-slate-200 text-[17px] max-w-3xl leading-[30px]"
        >
          The following projects showcase my technical skills and real-world
          experience. Each project is briefly outlined with direct links to its
          repository. They demonstrate my problem-solving ability, hands-on
          experience with diverse technologies, and end-to-end project
          execution.
        </motion.p>
      </div>

      <div className="mt-20 w-full flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
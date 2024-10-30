import {  Contact, Experience,  Works } from "./components";
import { bg, bg2, bg3 } from "./assets";
import Footer from "./components/Footer";


// Định nghĩa một styled component với chiều cao động

const Contents = () => {


  return (
    <div className="relative  flex flex-col lg:hidden  bg-primary">
      <div className={`absolute w-full h-[calc(var(--vh)*100)] z-10`}></div>

      <div id="checkid" className="h-[calc(var(--vh)*100)] w-full">
        <div
        id="check"
          className="w-full h-[calc(var(--vh)*100)]"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover"
          }}
        ></div>
      </div>
      <div className="h-[calc(var(--vh)*100)] w-full">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${bg2})`,
            backgroundSize: "cover",
            backgroundPosition:"bottom"
          }}
        ></div>
      </div>
      <div className="h-auto z-50 bg-black-200 w-full"  style={{
            backgroundImage: `url(${bg3})`,
            backgroundSize: "cover",
            backgroundPosition:"top"
          }}>
        <Experience/>
        <Works/>
        <Contact/>
        <Footer/>
      </div>
      
    </div>
  );
};

export default Contents;

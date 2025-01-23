import { CanvasLoader, GlobalCanvas, Navbar } from "./components";
import { useScrollAuto } from "./hooks/useScrollTracker";
import { useAtom } from "jotai";
import { isLoadedAtom, typeOSAtom } from "./atoms/globalAtoms";
import { useEffect, useState } from "react";
import Contents from "./Contents";
import { useFixHeight } from "./hooks/useFixHeight";
import MobileDetect from "mobile-detect";
import AudioPlayer from "./components/Audio";
function DisableScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}
const App = () => {
  const [typeOS, setTypeOS] = useAtom(typeOSAtom);
  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    setTypeOS(md.os());
  }, []);
  const [isLoaded] = useAtom(isLoadedAtom);
  DisableScrollRestoration();
  useFixHeight();
  useScrollAuto();

  return (  
      <div className="w-full md:hidden h-auto">
        <Navbar />
        <CanvasLoader />
        <GlobalCanvas />
        {isLoaded && <Contents />}
      </div>
  );
};

export default App;

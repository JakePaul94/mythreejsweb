import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  useAnimations,
  Environment,
  Points,
  PointMaterial,useTexture, Box
} from "@react-three/drei";
import CanvasLoader from "../Loader";
import * as random from "maath/random/dist/maath-random.esm";
import { LoopOnce } from "three";
import { technologies } from "../../constants";


const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(15000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, -Math.PI / 4, -Math.PI / 4]} position={[0, 0, 2]}>
      <Points
        ref={ref}
        positions={sphere}
        scale={2}
        stride={3}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#e9e9e9"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const TechPlanet = ({colomap,idtech}) =>{
  const ref = useRef();
  const [xnega,setXnega] = useState(-1||1)
  const [ynega,setYnega] = useState(-1||1)
  const [znega,setZnega] = useState(-1||1)
  useFrame((state, delta) => {
    ref.current.rotation.x -= 1 / 222;
    ref.current.rotation.y -= 1 / 333;
    if (ref.current.position.x<0.4) {setXnega(1)} else if (ref.current.position.x>1) {setXnega(-1)}
    if (ref.current.position.y<1) {setYnega(1)} else if (ref.current.position.y>2) {setYnega(-1)}
    if (ref.current.position.z<0.4) {setZnega(1)} else if (ref.current.position.z>1) {setZnega(-1)}
    ref.current.position.x +=  xnega/1222;
    ref.current.position.y +=  ynega/1222;
    ref.current.position.z +=  znega/1222;
    
  })
  const colorMap = useTexture(colomap)
 
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
  return (
    <>
        <mesh ref={ref} onClick={()=>{alert(id)}} scale={0.04}  position={[getRandom(0.4,1),getRandom(0.4,1),getRandom(-2,1)]} rotate={[Math.PI/idtech,Math.PI/idtech,0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    </>
  )
}

const Computers = ({ isMobile, scrollY, island }) => {
  const { scene, animations } = useGLTF("./model.glb");
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    
    !island ? actions.idle.play() : (actions.land.setLoop(LoopOnce),actions.idle.setLoop(LoopOnce),actions.land.play());
  }, [island]);
  return (
    <group ref={group} dispose={null} scale={island?0.7:1}>
      {/* <hemisphereLight intensity={0.15} groundColor='black' /> */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[0, 3, -3]}
        angle={Math.PI / 2}
        penumbra={1.5}
        intensity={0.4}
        castShadow
        color={"white"}
        shadow-mapSize={1024}
      />
      {/* <pointLight intensity={0} /> */}
      <primitive
        object={scene}
        scale={isMobile ? 0.7 : 0.75}
        position={
          isMobile
            ? [0, 0 + scrollY / 200, 0]
            : [0.7, 0 + scrollY / 200, 0]
        }
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

const ComputersCanvas = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [playland, setPlayland] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight) {
        const scrollTop = window.scrollY;
        setScrollY(scrollTop);
        setPlayland(false);
      } else {
        setScrollY(0);
        setPlayland(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      <Canvas
        shadows
        dpr={[2, 2]}
        camera={{ position: [0,1, 2], fov: 45, rotation: [-0.17, 0, 0] }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stars />
          <Computers isMobile={isMobile} scrollY={scrollY} island={playland} />
          {technologies.map((props,id)=><TechPlanet key={id} idtech={id} colomap={props.icon} />)}
        
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default ComputersCanvas;

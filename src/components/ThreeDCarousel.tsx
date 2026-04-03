import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  MotionValue 
} from "motion/react";
import * as React from "react";
import { Plus } from "lucide-react";

const IMAGES = [
  "https://picsum.photos/seed/art1/800/1200",
  "https://picsum.photos/seed/art2/800/1200",
  "https://picsum.photos/seed/art3/800/1200",
  "https://picsum.photos/seed/art4/800/1200",
  "https://picsum.photos/seed/art5/800/1200",
  "https://picsum.photos/seed/art6/800/1200",
  "https://picsum.photos/seed/art7/800/1200",
  "https://picsum.photos/seed/art8/800/1200",
  "https://picsum.photos/seed/art9/800/1200",
  "https://picsum.photos/seed/art10/800/1200",
  "https://picsum.photos/seed/art11/800/1200",
  "https://picsum.photos/seed/art12/800/1200",
  "https://picsum.photos/seed/art13/800/1200",
  "https://picsum.photos/seed/art14/800/1200",
  "https://picsum.photos/seed/art15/800/1200",
  "https://picsum.photos/seed/art16/800/1200",
  "https://picsum.photos/seed/art17/800/1200",
  "https://picsum.photos/seed/art18/800/1200",
  "https://picsum.photos/seed/art19/800/1200",
  "https://picsum.photos/seed/art20/800/1200",
  "https://picsum.photos/seed/art21/800/1200",
  "https://picsum.photos/seed/art22/800/1200",
  "https://picsum.photos/seed/art23/800/1200",
  "https://picsum.photos/seed/art24/800/1200",
  "https://picsum.photos/seed/art25/800/1200",
  "https://picsum.photos/seed/art26/800/1200",
  "https://picsum.photos/seed/art27/800/1200",
  "https://picsum.photos/seed/art28/800/1200",
];

export default function ThreeDCarousel() {
  const [radius, setRadius] = React.useState(386);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRadius(280);
      } else {
        setRadius(386);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rotation = useMotionValue<number>(0);
  const tilt = useMotionValue<number>(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startRotation, setStartRotation] = React.useState(0);

  const { scrollYProgress } = useScroll();
  const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const scrollIndicatorHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  React.useEffect(() => {
    const unsubscribe = scrollRotation.on("change", (v) => {
      if (!isDragging) {
        rotation.set(v);
      }
    });
    return () => unsubscribe();
  }, [scrollRotation, isDragging, rotation]);

  // Mouse parallax for background text
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      tilt.set(-y);
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMoveGlobal);
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal);
  }, [tilt]);

  // Smooth rotation and tilt with spring
  const smoothRotation = useSpring(rotation, {
    stiffness: 40,
    damping: 25,
    mass: 1,
  });

  const smoothTilt = useSpring(tilt, {
    stiffness: 50,
    damping: 30,
  });

  const smoothRadius = useSpring(radius, {
    stiffness: 50,
    damping: 30,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartRotation(rotation.get());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    rotation.set(startRotation + delta);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto-rotate effect
  React.useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      rotation.set(rotation.get() - 0.15);
    }, 16);
    return () => clearInterval(interval);
  }, [isDragging, rotation]);

  const count = IMAGES.length;
  
  // Spiral (Helix) distribution logic
  const items = React.useMemo(() => {
    const total = IMAGES.length;
    const spiralHeight = 1800; // Refined for perfect vertical gap
    const rotations = 3; // 3 full rotations
    
    return IMAGES.map((src, index) => {
      const progress = index / (total - 1);
      const angle = progress * 360 * rotations;
      const yOffset = (progress - 0.5) * spiralHeight;
      
      return {
        src,
        ry: angle,
        rx: 0, // Upright images as in reference
        yOffset: yOffset,
        index,
      };
    });
  }, []);

  // Parallax background text based on rotation and mouse
  const bgParallaxX = useTransform<number, number>(smoothRotation, (r) => (r % 360) * 0.5 + mousePos.x);
  const bgParallaxY = useTransform<number, number>(smoothRotation, (r) => (r % 360) * 0.2 + mousePos.y);

  return (
    <motion.div 
      className="fixed inset-0 w-full h-screen flex items-center justify-center overflow-hidden bg-black cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Dynamic Vignette */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Background Typography with Parallax */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]"
        style={{ x: bgParallaxX, y: bgParallaxY }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-20">
          <Plus className="text-white w-12 h-12" />
        </div>
        <h1 className="text-[25vw] font-black text-white leading-[0.8] tracking-tighter uppercase whitespace-nowrap font-display">
          Expert Digital
        </h1>
        <h1 className="text-[25vw] font-black text-white leading-[0.8] tracking-tighter uppercase whitespace-nowrap font-display">
          Production
        </h1>
      </motion.div>

      <div className="absolute top-1/2 left-12 -translate-y-1/2 z-50">
        <p className="text-white font-black text-2xl tracking-tighter uppercase font-display">Dialect</p>
      </div>

      <div className="absolute top-1/2 right-12 -translate-y-1/2 z-50 flex flex-col items-end gap-8">
        <div className="flex items-center gap-8 text-[10px] text-white/60 font-mono tracking-widest uppercase">
          <span>X : 919</span>
          <span>Y : 1</span>
        </div>
        <button className="px-6 py-2 bg-white text-black text-[10px] tracking-[0.3em] uppercase font-bold">
          [ Menu ]
        </button>
      </div>

      <div className="relative w-full h-full perspective-[3000px] flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ 
            transformStyle: "preserve-3d",
            rotateY: smoothRotation,
            rotateX: smoothTilt,
            z: -1200, 
          }}
        >
          {items.map((item, index) => {
            // Calculate depth-based opacity (fog effect)
            // We use the item's rotation relative to the current rotation
            const itemRotation = (item.ry + rotation.get()) % 360;
            const normalizedRotation = Math.abs((itemRotation + 360) % 360 - 180) / 180;
            const depthOpacity = 0.4 + normalizedRotation * 0.6;
            const depthScale = 0.9 + normalizedRotation * 0.1;
            const depthBlur = (1 - normalizedRotation) * 2;

            return (
              <motion.div
                key={index}
                className="absolute w-[180px] h-[280px] md:w-[260px] md:h-[380px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/5 bg-neutral-900"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  filter: `drop-shadow(0 0 20px rgba(255,255,255,${(normalizedRotation - 0.5) * 0.1})) blur(${depthBlur}px)`,
                }}
                initial={{ opacity: 0, scale: 0.5, y: 500 }}
                animate={{
                  opacity: depthOpacity,
                  scale: depthScale,
                  transform: `translateY(${item.yOffset}px) rotateY(${item.ry}deg) rotateX(${item.rx}deg) translateZ(${radius}px)`,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  zIndex: 100,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 20,
                  delay: index * 0.02,
                  transform: { type: "spring", stiffness: 40, damping: 25 } 
                }}
              >
                <img 
                  src={item.src} 
                  alt={`Art ${index}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">Case Study</span>
                  <p className="text-white font-bold tracking-tight uppercase text-lg leading-none">Project {index + 1}</p>
                </div>

                {/* Dynamic Glare/Lighting */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(${itemRotation}deg, rgba(255,255,255,${(1 - normalizedRotation) * 0.1}) 0%, transparent 50%, rgba(0,0,0,${(1 - normalizedRotation) * 0.3}) 100%)`,
                    opacity: 0.5 + normalizedRotation * 0.5,
                  }}
                />
                
                {/* Smooth Edge Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-sm" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* UI Elements removed as they are now positioned in the center-sides */}

      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 text-center pointer-events-none">
        <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest">
          Award-winning motion design and interactive experiences that connect culture, technology, and contemporary aesthetics.
        </p>
      </div>

      <div className="absolute bottom-12 left-12 flex items-center gap-4">
        <div className="w-12 h-[1px] bg-white/40" />
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-medium">
          Scroll or Drag to Explore
        </p>
      </div>

      <div className="absolute top-12 right-12">
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-4 text-[10px] text-white/40 font-mono tracking-widest">
            <span>X: 884</span>
            <span>Y: 130</span>
          </div>
          <button className="flex flex-col items-end gap-1 group cursor-pointer">
            <span className="text-white text-xs tracking-widest uppercase font-bold border-b border-white pb-1">Menu</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2">
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-white"
            style={{ height: scrollIndicatorHeight }}
          />
        </div>
        <p className="text-white/40 text-[10px] tracking-widest uppercase">Scroll</p>
      </div>
    </motion.div>
  );
}

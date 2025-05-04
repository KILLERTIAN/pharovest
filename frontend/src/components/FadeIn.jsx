import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const FadeIn = ({ children, delay = 0, direction = "none", fullWidth = false, padding = false, zIndex = 5 }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} className={`${fullWidth ? "w-full" : "w-auto"} ${padding ? "px-10" : "px-0"} flex items-center justify-center`} style={{ zIndex }}>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            x: direction === "right" ? -80 : direction === "left" ? 80 : 0,
            y: direction === "up" ? 40 : direction === "down" ? -20 : 0
          },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
          },
        }}
        initial="hidden"
        animate={controls}
        transition={{
          duration: 1.25,
          type: "tween",
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="w-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default FadeIn;

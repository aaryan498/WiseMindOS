import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.6;
      ringY += (mouseY - ringY) * 0.6;
      if (ringRef.current) {
        const size = ringRef.current.offsetWidth;
        ringRef.current.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      ringRef.current?.classList.add("opacity-100", "border-violet-400", "w-12", "h-12");
      ringRef.current?.classList.remove("opacity-60", "border-violet-600", "w-9", "h-9");
    };
    const onLeave = () => {
      ringRef.current?.classList.remove("opacity-100", "border-violet-400", "w-12", "h-12");
      ringRef.current?.classList.add("opacity-60", "border-violet-600", "w-9", "h-9");
    };

    const interactiveEls = document.querySelectorAll("a, button, [data-cursor-hover]");

    document.addEventListener("mousemove", onMove);
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      interactiveEls.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-violet-600 pointer-events-none z-[9999] will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-violet-600 pointer-events-none z-[9998] will-change-transform opacity-60 transition-[width,height,opacity,border-color] duration-200"
      />
    </>
  );
}
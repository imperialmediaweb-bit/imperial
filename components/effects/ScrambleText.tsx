"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#";

// Text scramble — litere care se amestecă apoi se revelează.
// Activ la primul viewport intersect.
export function ScrambleText({
  text,
  className = "",
  speed = 35,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        obs.disconnect();

        let i = 0;
        const end = text.length;
        const timer = setInterval(() => {
          let next = "";
          for (let j = 0; j < end; j++) {
            if (j < i) next += text[j];
            else if (text[j] === " ") next += " ";
            else next += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          setOut(next);
          i += 0.5;
          if (i >= end) {
            setOut(text);
            clearInterval(timer);
          }
        }, speed);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}

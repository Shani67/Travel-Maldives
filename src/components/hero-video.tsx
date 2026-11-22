"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background video that respects WCAG 2.2.2 (Pause, Stop, Hide): it has a visible pause
 * button, and it does not autoplay for people who ask for reduced motion.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      // play() can be refused (for example in power saving mode); the poster stays visible.
      video.play().catch(() => undefined);
    }
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.webp"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 bottom-4 z-10 rounded-full bg-ocean/80 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean"
      >
        {playing ? "Pause video" : "Play video"}
      </button>
    </>
  );
}

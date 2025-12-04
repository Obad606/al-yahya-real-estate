"use client";

import * as React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/luxury-real-estate-development-aerial-view.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-16 md:pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
            <>
              نبني المستقبل
              <br />
              <span className="text-accent">بتميز وإبداع</span>
            </>
          </h1>

          <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed text-pretty max-w-2xl">
            شركة رائدة في التطوير العقاري تقدم مشاريع استثنائية تجمع بين الجودة والابتكار والاستدامة
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-180 hover:scale-105 hover:rotate-2"
            >
              <Link href="/projects">استكشف مشاريعنا</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-180 hover:scale-105 bg-transparent"
            >
              <Link href="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; // ✅ أضف هذا السطر إن لم يكن موجود

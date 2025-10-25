import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface StatItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: number;
  suffix?: string;
  approximate?: boolean;
  compact?: boolean;
}

interface StatsShowcaseProps {
  items: StatItem[];
  glowColorRGB?: string; // e.g. '132, 0, 255'
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function formatNumber(value: number, compact: boolean) {
  if (!compact) return value.toLocaleString();
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

const StatCard: React.FC<{
  item: StatItem;
  glowColorRGB: string;
  index: number;
}> = ({ item, glowColorRGB, index }) => {
  const { icon: Icon, label, value, suffix, approximate, compact } = item;
  const [displayValue, setDisplayValue] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || typeof value !== 'number') return;
    let raf = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = () => {
      const now = performance.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setDisplayValue(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const showNumber = typeof value === 'number';
  const numberText = useMemo(() => {
    if (!showNumber) return '';
    const base = inView ? displayValue : 0;
    const formatted = formatNumber(base, !!compact);
    return `${approximate ? '~' : ''}${formatted}${suffix || ''}`;
  }, [showNumber, displayValue, inView, suffix, approximate, compact]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md p-6 sm:p-8 will-change-transform transition-transform duration-300 hover:-translate-y-1"
      style={{
        animation: `fadeInUp 0.8s ease-out ${index * 0.12}s both`,
      }}
    >
      <div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `radial-gradient(220px circle at 50% 0%, rgba(${glowColorRGB}, 0.25), transparent 60%)`,
          opacity: 0,
          transition: 'opacity 300ms ease',
        }}
      />
      <div className="relative flex flex-col items-center text-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-white/35">
            <Icon className="w-7 h-7 text-white/85" />
          </div>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 40px rgba(${glowColorRGB}, 0.25)`,
              opacity: 0,
              transition: 'opacity 400ms ease',
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          {showNumber ? (
            <div className="relative">
              <div
                className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95), rgba(${glowColorRGB}, 0.9))`,
                }}
              >
                {numberText}
              </div>
              <div
                className="absolute -inset-x-6 -bottom-3 h-8 blur-2xl"
                style={{ background: `radial-gradient(60% 60% at 50% 0%, rgba(${glowColorRGB}, 0.25), transparent)` }}
              />
            </div>
          ) : null}
          <p className="text-white/90 text-base sm:text-lg font-medium leading-tight">
            {label}
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      <style>
        {`
          .group:hover > div:first-child { opacity: 1; }
        `}
      </style>
    </div>
  );
};

const StatsShowcase: React.FC<StatsShowcaseProps> = ({ items, glowColorRGB = '132, 0, 255' }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/6 blur-2xl" />
      <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-white/6 blur-2xl" />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <StatCard key={i} item={item} glowColorRGB={glowColorRGB} index={i} />
        ))}
      </div>
    </div>
  );
};

export default StatsShowcase;



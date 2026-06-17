import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Editorial warm redesign of the home page (preview at /home-v2).
 * Full-bleed terracotta canvas with sage decorative geometry,
 * script wordmark, and a teal pill CTA. Mobile-first.
 */
const HomeV2 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#C4724A' }}
    >
      {/* Decorative geometry — purely visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[32%] -right-[28%] h-[78vw] w-[78vw] rounded-full md:h-[44vw] md:w-[44vw]"
        style={{ backgroundColor: '#7A9E7E' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[40%] -left-[30%] h-[88vw] w-[88vw] rounded-full md:h-[50vw] md:w-[50vw]"
        style={{ backgroundColor: '#2D5F6B' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[18%] left-[8%] h-20 w-20 rounded-full opacity-80 md:h-28 md:w-28"
        style={{ backgroundColor: '#D4A5A5' }}
      />

      {/* Top wordmark */}
      <header className="relative z-10 px-8 pt-10 md:pt-14">
        <span
          className="text-3xl md:text-4xl text-white tracking-wide"
          style={{ fontFamily: '"Caveat", "Dancing Script", cursive', fontWeight: 500 }}
        >
          Norte
        </span>
      </header>

      {/* Main editorial card */}
      <main className="relative z-10 flex min-h-[calc(100vh-7rem)] items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-sm rounded-[36px] px-8 py-14 text-center shadow-xl backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(45, 95, 107, 0.92)' }}
        >
          <p
            className="mb-5 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: '#D4A5A5', fontFamily: '"DM Sans", sans-serif' }}
          >
            A quiet compass
          </p>

          <h1
            className="mb-6 text-3xl leading-tight text-white md:text-4xl"
            style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}
          >
            Find what you actually live for.
          </h1>

          <p
            className="mb-10 text-[15px] leading-relaxed text-white/80"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Fifteen honest trade-offs. Eight values. One map of what your choices already say.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="rounded-full px-10 py-4 text-base text-white shadow-md transition-opacity hover:opacity-95"
            style={{
              backgroundColor: '#5BA89E',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
            }}
          >
            Begin
          </motion.button>

          <p
            className="mt-8 text-[11px] uppercase tracking-[0.28em] text-white/50"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            5 minutes · no signup
          </p>
        </motion.div>
      </main>

      {/* Bottom byline */}
      <footer
        className="absolute bottom-6 left-0 right-0 z-10 text-center text-[11px] uppercase tracking-[0.3em] text-white/70"
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      >
        Based on ACT &amp; Schwartz
      </footer>
    </div>
  );
};

export default HomeV2;

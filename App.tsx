import React, { useState, useEffect, useRef, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  AnimatePresence,
  Variants,
  useReducedMotion
} from 'framer-motion';
import { 
  Menu, 
  X, 
  ArrowDown, 
  ArrowUp,
  Star, 
  Droplet, 
  Wheat, 
  Leaf, 
  Activity,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

// --- Constants ---
// URL para el fondo del Hero (WebP animado/secuencia) - Preload crítico
const HERO_BG_URL = "https://okxintkomeixksptlpcz.supabase.co/storage/v1/object/sign/beer/ezgif-3df9302db7a1e426.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMGUzZmZjNy1mMDYyLTQyNjMtOGExMS00YWEwZjdhMzYyNjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWVyL2V6Z2lmLTNkZjkzMDJkYjdhMWU0MjYud2VicCIsImlhdCI6MTc2ODE3MDg2NSwiZXhwIjoxNzY4Nzc1NjY1fQ.UCkfWQfWw9QhZTeB6nu88WOKuqxAlwacnD5PrBqOeAY";

// Nueva URL específica para la sección de Producto (JPEG) - Lazy load
const PRODUCT_IMG_URL = "https://okxintkomeixksptlpcz.supabase.co/storage/v1/object/sign/beer/Image_202601111917.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMGUzZmZjNy1mMDYyLTQyNjMtOGExMS00YWEwZjdhMzYyNjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWVyL0ltYWdlXzIwMjYwMTExMTkxNy5qcGVnIiwiaWF0IjoxNzY4MTczMDM1LCJleHAiOjE3Njg3Nzc4MzV9.YyTxQ_TX2X7aEqHMFaiiqumJR0KBlFGIG41zbhAIfH4";


const NAV_LINKS = [
  { name: 'Product', href: '#product' },
  { name: 'Ingredients', href: '#ingredients' },
  { name: 'Nutrition', href: '#nutrition' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'FAQ', href: '#faq' },
];

// --- Animation Variants ---
// Modern easing curves for smooth, elegant animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for smooth motion
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

// New animation variants for modern interactions
const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

// --- Components ---

// 1. Loading Screen - Memoizado para evitar re-renders
const LoadingScreen = memo(({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = 'hidden';
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            document.body.style.overflow = 'unset';
            onComplete();
          }, prefersReducedMotion ? 0 : 800); 
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-betsa-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="relative">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-9xl font-display font-bold text-white tracking-widest opacity-20 select-none"
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          BETSA
        </motion.h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-lg sm:text-xl md:text-2xl font-body text-betsa-white font-light tracking-widest"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {Math.min(100, progress)}%
          </motion.span>
        </div>
      </div>
      <div className="w-48 sm:w-56 md:w-64 h-[2px] bg-gray-900/50 mt-6 sm:mt-8 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div 
          className="h-full bg-gradient-to-r from-white/80 via-white to-white/80"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

// 2. Navigation - Memoizado y optimizado
const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Throttle scroll handler para mejor performance
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    // Usar requestAnimationFrame para mejor performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Manejador de scroll manual - memoizado
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 50; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${scrolled ? 'bg-betsa-black/95 backdrop-blur-xl py-3 md:py-4 border-b border-white/10 shadow-2xl shadow-black/50' : 'bg-transparent py-4 md:py-6'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <motion.a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
            className="text-xl md:text-2xl font-display font-bold text-white tracking-wider z-50 relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            BETSA
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {NAV_LINKS.map((link, index) => (
              <motion.a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-bold font-body text-gray-300 hover:text-white uppercase tracking-[0.2em] cursor-pointer relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          <motion.button 
            className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/10"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Order Now"
          >
            Order Now
          </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            className="md:hidden text-white z-50 relative p-2 focus:outline-none rounded-lg hover:bg-white/10 transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay - Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-betsa-black/98 backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
          >
             <motion.div 
               className="flex flex-col space-y-6 text-center p-6 w-full"
               initial="hidden"
               animate="visible"
               variants={staggerContainer}
             >
              {NAV_LINKS.map((link, index) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-2xl sm:text-3xl font-display font-bold text-white hover:text-gray-300 uppercase tracking-widest transition-colors cursor-pointer py-2"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div 
                className="pt-6"
                variants={fadeInUp}
              >
                <motion.button 
                    className="bg-white text-black px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest w-full max-w-xs mx-auto shadow-lg shadow-white/20"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Order Now
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';

// 3. Hero Section - Optimizado con memoización
const HeroSection = memo(() => {
  const targetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 60, 
    damping: 20,
    // Reducir animaciones si el usuario prefiere movimiento reducido
    ...(prefersReducedMotion && { stiffness: 100, damping: 30 })
  });
  
  // Transforms - deben llamarse directamente, no dentro de useMemo
  const videoOpacity = useTransform(smoothProgress, [0, 0.6], [0, 1]); 
  const videoScale = useTransform(
    smoothProgress, 
    [0, 1], 
    prefersReducedMotion ? [1, 1] : [1.2, 1]
  ); 
  const videoY = useTransform(
    smoothProgress, 
    [0, 1], 
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "5%"]
  );
  const textY = useTransform(
    smoothProgress, 
    [0, 1], 
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "-20%"]
  );
  const contentOpacity = useTransform(smoothProgress, [0, 0.4], [0, 1]);

  // Height set to 100vh to eliminate black space gap
  return (
    <div ref={targetRef} className="relative h-screen w-full bg-betsa-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
            style={{ opacity: useTransform(smoothProgress, [0, 0.15], [1, 0]) }}
        >
            <p className="text-white/40 font-display text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase mb-4 animate-pulse text-center px-4">
                Scroll to Reveal
            </p>
            <ArrowDown className="text-white/40 animate-bounce" size={20} />
        </motion.div>

        <motion.div 
          style={{ opacity: videoOpacity, scale: videoScale, y: videoY }}
          className="absolute inset-0 z-0 w-full h-full"
        >
            <img 
              src={HERO_BG_URL} 
              alt="Betsa Stout Background - Dark liquid being poured" 
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
              loading="eager"
              sizes="100vw"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-betsa-black/60 via-transparent to-betsa-black/90"></div>
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        </motion.div>

        <div className="absolute inset-0 z-10 flex flex-col justify-between items-center w-full h-full px-4 sm:px-6 py-16 sm:py-20 md:py-16 pointer-events-none">
            <motion.div 
                style={{ y: textY, opacity: contentOpacity }}
                className="flex-1 flex flex-col items-center justify-center mix-blend-overlay"
            >
                <motion.h1 
                    className="text-[18vw] sm:text-[20vw] md:text-[22vw] font-display font-bold text-white/80 leading-none tracking-tighter select-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    BETSA
                </motion.h1>
                <motion.p 
                    className="text-white/90 font-display text-base sm:text-lg md:text-3xl tracking-[0.3em] sm:tracking-[0.5em] md:tracking-[0.8em] -mt-1 sm:-mt-2 md:-mt-8 uppercase pl-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    Cerveza
                </motion.p>
            </motion.div>
            
            <motion.div 
                style={{ opacity: contentOpacity }}
                className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 sm:gap-8 pointer-events-auto text-center md:text-left px-4 sm:px-0"
            >
                 <motion.div 
                     className="max-w-md w-full"
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                 >
                     <h2 className="text-white font-display text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3">The Midnight Stout</h2>
                     <p className="text-gray-300 font-body text-xs sm:text-sm leading-relaxed md:border-l-2 md:border-white/20 md:pl-4 border-l-0">
                        Brewed for the depths of the night. <br className="hidden md:block"/>
                        Rich, creamy, and infinite.
                     </p>
                 </motion.div>
                 
                 <motion.div 
                     className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 >
                     <motion.button 
                         className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-white font-body text-xs font-bold uppercase tracking-[0.2em] w-full sm:w-auto relative overflow-hidden group"
                         whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ type: "spring", stiffness: 400, damping: 17 }}
                     >
                         <span className="relative z-10">Explore</span>
                         <motion.div 
                             className="absolute inset-0 bg-white"
                             initial={{ x: "-100%" }}
                             whileHover={{ x: 0 }}
                             transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                         />
                         <motion.span 
                             className="absolute inset-0 flex items-center justify-center text-black z-20"
                             initial={{ opacity: 0 }}
                             whileHover={{ opacity: 1 }}
                         >
                             Explore
                         </motion.span>
                     </motion.button>
                     <motion.button 
                         className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-black font-body text-xs font-bold uppercase tracking-[0.2em] w-full sm:w-auto shadow-[0_0_25px_rgba(255,255,255,0.2)] relative overflow-hidden group"
                         whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(255,255,255,0.3)" }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ type: "spring", stiffness: 400, damping: 17 }}
                     >
                         <span className="relative z-10">Buy Now</span>
                         <motion.div 
                             className="absolute inset-0 bg-gray-100"
                             initial={{ scale: 0 }}
                             whileHover={{ scale: 1 }}
                             transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                         />
                     </motion.button>
                 </motion.div>
            </motion.div>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

// 4. Content Sections - Memoizado
const ProductSection = memo(() => {
  return (
    <section id="product" className="relative py-16 sm:py-20 md:py-32 bg-betsa-charcoal border-t border-white/5 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
        <motion.div 
          className="order-2 md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-50px" }}
          variants={staggerContainer}
        >
             <motion.span 
               variants={fadeInUp} 
               className="text-blue-400 font-display text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 block"
             >
                Flavor Profile
             </motion.span>
             <motion.h3 
               variants={fadeInUp} 
               className="text-3xl sm:text-4xl md:text-6xl font-display text-white mb-4 sm:mb-6 leading-tight"
             >
                Dark. Bold. <br/>Infinite.
             </motion.h3>
             <motion.p 
               variants={fadeInUp} 
               className="text-gray-400 font-body leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm md:text-base"
             >
               Betsa isn't just a beer; it's an experience. We use roasted barley and chocolate malt to create a deep, complex flavor profile with notes of espresso, dark chocolate, and a hint of vanilla bean. The nitrogen infusion creates a cascading pour and a creamy mouthfeel that lingers.
             </motion.p>
             <motion.div 
               variants={fadeInUp} 
               className="grid grid-cols-2 gap-6 sm:gap-8 border-t border-white/10 pt-6 sm:pt-8"
             >
               <motion.div
                 whileHover={{ scale: 1.05, x: 5 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                  <div className="text-2xl sm:text-3xl font-display text-white mb-1">6.5%</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest">ABV</div>
               </motion.div>
               <motion.div
                 whileHover={{ scale: 1.05, x: 5 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                  <div className="text-2xl sm:text-3xl font-display text-white mb-1">45</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest">IBU</div>
               </motion.div>
             </motion.div>
        </motion.div>
        
        {/* Updated Image with new URL and Masking */}
        <motion.div 
          className="order-1 md:order-2 flex justify-center relative py-6 sm:py-8 md:py-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scaleIn}
        >
           <motion.div 
            className="relative w-full max-w-[250px] sm:max-w-[300px] md:max-w-lg aspect-square"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
           >
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
                }}
              >
                <img 
                  src={PRODUCT_IMG_URL} 
                  alt="Betsa Stout Product Shot" 
                  className="w-[120%] max-w-none h-[120%] object-cover scale-110" 
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, 512px"
                />
              </div>
              
              {/* Enhanced glow effect - Solo animar si está en viewport */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-blue-900/30 blur-[60px] md:blur-[80px] -z-10 rounded-full"
                initial={{ scale: 1, opacity: 0.3 }}
                whileInView={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
           </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

ProductSection.displayName = 'ProductSection';

const IngredientsSection = memo(() => {
  // Memoizar array de ingredientes para evitar recreación
  const ingredients = useMemo(() => [
    { icon: <Droplet />, title: "Glacial Water", desc: "Sourced from deep aquifers." },
    { icon: <Wheat />, title: "Roasted Barley", desc: "For that signature dark color." },
    { icon: <Leaf />, title: "Noble Hops", desc: "Subtle bitterness to balance." },
    { icon: <Activity />, title: "Nitrogen", desc: "The secret to the velvet texture." },
  ], []);

  return (
    <section id="ingredients" className="py-16 sm:py-20 md:py-32 bg-betsa-black relative overflow-hidden z-20">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-10 sm:mb-12 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display text-white mb-3 sm:mb-4">Pure Ingredients</h3>
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: 80 }} 
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto" 
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {ingredients.map((item, index) => (
            <motion.div 
              key={index}
              className="group p-6 sm:p-8 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-500 rounded-2xl hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-900/20 text-center md:text-left relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Animated background gradient on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <motion.div 
                className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto md:mx-0 relative z-10 border border-white/10"
                whileHover={{ scale: 1.15, rotate: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {item.icon}
              </motion.div>
              <h4 className="text-lg sm:text-xl font-body font-bold text-white mb-2 relative z-10">{item.title}</h4>
              <p className="text-gray-400 text-xs sm:text-sm relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

IngredientsSection.displayName = 'IngredientsSection';

const ReviewSection = memo(() => {
  return (
    <section id="reviews" className="py-16 sm:py-20 md:py-32 bg-white text-black z-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }} 
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp} 
            className="flex justify-center mb-6 sm:mb-8 text-betsa-black space-x-1 sm:space-x-2"
          >
            {[1,2,3,4,5].map(i => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Star fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.h3 
            variants={fadeInUp} 
            className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 sm:mb-8 px-2"
          >
            "Like drinking velvet in a can. The most sophisticated stout I've ever tasted."
          </motion.h3>
          
          <motion.div 
            variants={fadeInUp} 
            className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <motion.div 
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img 
                src="https://picsum.photos/100/100" 
                alt="User" 
                className="w-full h-full object-cover" 
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </motion.div>
            <div className="text-center sm:text-left">
              <div className="font-bold text-base sm:text-lg font-body">Julian V.</div>
              <div className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Certified Cicerone</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

ReviewSection.displayName = 'ReviewSection';

const FAQSection = memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Memoizar FAQs
  const faqs = useMemo(() => [
    { q: "Do I need to pour it hard?", a: "Yes. For the full nitrogen cascade effect, invert the can completely and pour vigorously into a glass." },
    { q: "Does it contain lactose?", a: "No. Betsa is dairy-free and vegan friendly." },
    { q: "What is the serving temperature?", a: "We recommend 42-48°F (6-9°C) to unlock the full chocolate notes." },
  ], []);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-32 bg-betsa-black z-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h3 
          className="text-2xl sm:text-3xl md:text-5xl font-display text-white mb-10 sm:mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          FAQ
        </motion.h3>
        
        <motion.div 
          className="space-y-3 sm:space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
            >
              <motion.button
                onClick={() => toggleFAQ(i)}
                className="w-full p-4 sm:p-6 flex items-center justify-between text-left cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white pr-4">
                  {faq.q}
                </h4>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0"
                >
                  <ArrowDown className="text-white/60 group-hover:text-white transition-colors" size={20} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 text-sm sm:text-base px-4 sm:px-6 pb-4 sm:pb-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

const Footer = memo(() => {
  return (
    <footer className="py-10 sm:py-12 md:py-20 bg-black border-t border-white/10 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 sm:gap-8">
        <motion.div 
          className="mb-4 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-display font-bold text-white tracking-widest mb-3 sm:mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            BETSA
          </motion.h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">© 2024 Betsa Brewing Co. <br className="hidden sm:block"/> Please Drink Responsibly.</p>
        </motion.div>
        
        <motion.div 
          className="flex space-x-4 sm:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </motion.a>
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </motion.a>
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

// Scroll Progress Indicator
const ScrollProgress = memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-[100] origin-left"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress';

// Back to Top Button
const BackToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label="Volver arriba"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

BackToTop.displayName = 'BackToTop';

// --- Main App ---
const App = () => {
  const [loading, setLoading] = useState(true);
  
  // Preload imagen crítica del hero
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector(`link[href="${HERO_BG_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = HERO_BG_URL;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
  }, []);
  
  // Memoizar callback para evitar recreación
  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      
      {!loading && (
        <main className="bg-betsa-black min-h-screen overflow-x-hidden">
          <ScrollProgress />
          <Navbar />
          <HeroSection />
          <ProductSection />
          <IngredientsSection />
          <ReviewSection />
          <FAQSection />
          <Footer />
          <BackToTop />
        </main>
      )}
    </>
  );
};

export default App;
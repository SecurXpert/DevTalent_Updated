import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import problem1 from '../assests/P1.png';
import problem2 from '../assests/P2.png';
import problem3 from '../assests/P3.png';
import problem4 from '../assests/P4.png';
import problem5 from '../assests/P1.png';
import logo from '../assests/logo.png';
// import solution1 from '../assets/solutions/solution1.png';
// import solution2 from '../assets/solutions/solution2.png';
// import solution3 from '../assets/solutions/solution3.png';

interface DevTalentComponentProps {
  productName?: string;
  brandLogo?: string;
}

const DevTalentComponent: React.FC<DevTalentComponentProps> = ({ productName = 'Dev Talent', brandLogo = 'logo.png' }) => {
  const [currentScene, setCurrentScene] = useState(1);
  const totalScenes = 4;
  const sceneDuration = 4000; // 4 seconds per scene

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScene((prev) => (prev < totalScenes ? prev + 1 : 1));
    }, sceneDuration);

    return () => clearTimeout(timer);
  }, [currentScene]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const productVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: 'easeOut' } }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' }
    })
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.5 }
    })
  };

  const slideInVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const solutions = [
    { name: 'Automated Grading', icon: '🤖' },
    { name: 'Secure Proctoring', icon: '🔒' },
    { name: 'AI-Driven Insights', icon: '🧠' },
    { name: 'Scalable Platform', icon: '☁️' }
  ];

  const problems = [
    { image: problem1, name: 'Manual Grading Delays' },
    { image: problem2, name: 'Cheating Risks' },
    { image: problem3, name: 'Inaccurate Assessments' },
    { image: problem4, name: 'Scalability Issues' }
  ];

  return (
    <div className="w-screen h-screen flex justify-center items-center font-sans overflow-hidden relative" style={{ background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full h-full flex flex-col justify-center items-center p-5 box-border scene"
        >
          {currentScene === 1 && (
            <motion.div className="flex flex-col justify-center items-center" variants={containerVariants}>
              <motion.div className="mb-5 product" variants={productVariants}>
                <div className="product-icon">📱</div> {/* Placeholder for Dev Talent platform icon */}
              </motion.div>
              <motion.div className="books-elements absolute top-1/4 left-1/4 text-6xl opacity-30" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                📚 📖 📚
              </motion.div>
              <motion.div className="books-elements absolute bottom-1/4 right-1/4 text-6xl opacity-30" animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}>
                📖 📚 📖
              </motion.div>
              <motion.h2 variants={slideInVariants} initial="hidden" animate="visible" className="text-5xl text-white text-center m-0 drop-shadow-lg">
                {productName}
              </motion.h2>
              <motion.p className="text-xl text-blue-100 text-center mt-2 drop-shadow-md">Revolutionary Exam Platform for Developer Talent</motion.p>
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div className="flex flex-col justify-center items-center relative w-full h-full" variants={containerVariants}>
              <motion.h3 variants={slideInVariants} initial="hidden" animate="visible" className="text-4xl text-white text-center mb-8 drop-shadow-lg z-10">
                Common Pain Points
              </motion.h3>
              <div className="u-shape-container relative w-full max-w-4xl h-96 flex items-end justify-around z-10">
                {/* Bottom left */}
                <motion.div
                  className="problem-item absolute bottom-0 left-10 flex flex-col items-center p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ width: '200px' }}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <img src={problems[0].image} alt={problems[0].name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="m-0 text-sm text-white text-center">{problems[0].name}</p>
                </motion.div>
                {/* Bottom right */}
                <motion.div
                  className="problem-item absolute bottom-0 right-10 flex flex-col items-center p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ width: '200px' }}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <img src={problems[1].image} alt={problems[1].name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="m-0 text-sm text-white text-center">{problems[1].name}</p>
                </motion.div>
                {/* Top left */}
                <motion.div
                  className="problem-item absolute top-10 left-10 flex flex-col items-center p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ width: '200px' }}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <img src={problems[2].image} alt={problems[2].name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="m-0 text-sm text-white text-center">{problems[2].name}</p>
                </motion.div>
                {/* Top right */}
                <motion.div
                  className="problem-item absolute top-10 right-10 flex flex-col items-center p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ width: '200px' }}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <img src={problems[3].image} alt={problems[3].name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="m-0 text-sm text-white text-center">{problems[3].name}</p>
                </motion.div>
              </div>
              <motion.p className="text-xl text-blue-100 text-center mt-8 drop-shadow-md z-10 max-w-2xl">
                Overcome these challenges with our innovative platform designed for seamless developer assessments.
              </motion.p>
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div className="flex flex-col md:flex-row justify-center items-start p-10 w-full gap-10" variants={containerVariants}>
              <div className="left-side flex-1 flex flex-col gap-5 items-center">
                <h3 className="text-4xl text-white self-center drop-shadow-lg">Our Solutions</h3>
                {solutions.map((sol, i) => (
                  <motion.div
                    key={sol.name}
                    className="solution-item flex flex-col items-center p-6 bg-white/20 rounded-xl shadow-lg min-w-[180px] backdrop-blur-sm"
                    variants={slideInVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <div className="icon text-6xl mb-2.5">{sol.icon}</div>
                    <p className="m-0 text-lg text-white text-center">{sol.name}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div className="right-side flex-1 flex justify-center items-center" variants={productVariants}>
                <div className="hand-product flex items-center">
                  <div className="hand text-8xl mr-2.5 text-white">✋</div>
                  <div className="product-icon text-white">📱</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div className="flex flex-col justify-center items-center relative" variants={containerVariants}>
              <motion.div className="mb-5 product" variants={productVariants} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="product-icon">📱</div>
              </motion.div>
              <motion.div className="floating-elements absolute top-1/4 left-1/10 text-4xl pointer-events-none z-10 text-white opacity-70" animate={{ y: [-10, 10] }} transition={{ duration: 3, repeat: Infinity, yoyo: true }}>
                <span className="block m-2.5">💻</span>
                <span className="block m-2.5" style={{ animationDelay: '1s' }}>🔍</span>
                <span className="block m-2.5" style={{ animationDelay: '2s' }}>⭐</span>
              </motion.div>
              <motion.h1 className="tagline text-6xl text-white text-center m-5 font-bold drop-shadow-lg" variants={fadeInVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                Assess. Hire. Excel.
              </motion.h1>
              <motion.div className="cta flex flex-col items-center gap-2.5" variants={fadeInVariants} initial="hidden" animate="visible" transition={{ delay: 1 }}>
                <img src={brandLogo} alt="Brand Logo" className="logo w-25 h-auto filter brightness-0 invert" />
                <p className="text-xl text-blue-100 drop-shadow-md">Discover Top Developer Talent Today.</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="scene-indicator absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 text-white px-5 py-2.5 rounded-full text-sm">
        Scene {currentScene} of {totalScenes}
      </div>

      <style jsx>{`
        .product-icon {
          font-size: 100px;
          background: rgba(255, 255, 255, 0.2);
          width: 150px;
          height: 150px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .floating-elements span {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          .flex-row {
            flex-direction: column;
          }
          .u-shape-container {
            height: 80vh;
            flex-direction: column;
            justify-content: space-around;
          }
          .problem-item {
            position: static !important;
            width: 100% !important;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default DevTalentComponent;
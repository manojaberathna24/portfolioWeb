import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useMemo } from "react";

const ParticleBackground = () => {
  const options = useMemo(() => ({
    background: { color: { value: "#0a192f" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: "#64ffda" },
      links: {
        color: "#64ffda",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 0.8,
        straight: false
      },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="fixed top-0 left-0 w-full h-full z-0"
    />
  );
};

export default ParticleBackground;
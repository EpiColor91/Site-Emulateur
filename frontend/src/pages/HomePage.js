import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Gamepad2 } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get(`${API}/platforms`);
      setPlatforms(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des plateformes:", error);
    } finally {
      setLoading(false);
    }
  };

  const platformImages = {
    nes: "https://images.unsplash.com/photo-1591462391994-cb7614f54aff",
    snes: "https://images.unsplash.com/photo-1654648662327-5d4d32cf67bd",
    gb: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
    gbc: "https://images.unsplash.com/photo-1593078165-e5a5d1ec2c9f",
    gba: "https://images.unsplash.com/photo-1614735723656-457e1d9df39c"
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] retro-grid">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b-4 border-[#8BAC0F]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1b] via-[#1a1a2e] to-[#232342] opacity-90"></div>
        <div className="crt-effect absolute inset-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-8">
            <Gamepad2 className="w-16 h-16 md:w-24 md:h-24 text-[#8BAC0F]" strokeWidth={1.5} />
          </div>
          
          <h1 
            className="font-['Press_Start_2P'] text-4xl md:text-6xl lg:text-7xl text-[#8BAC0F] neon-text mb-6 leading-tight"
            data-testid="hero-title"
          >
            RETROCADE X
          </h1>
          
          <p className="font-['Space_Mono'] text-lg md:text-xl text-[#A0A0B0] max-w-2xl mx-auto mb-8">
            Rejouez aux classiques légendaires de Nintendo et Game Boy directement dans votre navigateur
          </p>
          
          <div className="inline-block px-6 py-3 bg-[#232342] border-2 border-[#00F0FF] text-[#00F0FF] font-['VT323'] text-2xl">
            INSÉREZ UNE PIÈCE POUR COMMENCER
          </div>
        </div>
      </header>

      {/* Platforms Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 
          className="font-['Press_Start_2P'] text-2xl md:text-4xl text-center text-white mb-12"
          data-testid="platforms-heading"
        >
          CHOISISSEZ VOTRE CONSOLE
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block font-['Press_Start_2P'] text-xl text-[#8BAC0F] animate-pulse">
              CHARGEMENT...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                onClick={() => navigate(`/library/${platform.id}`)}
                className="group relative bg-[#1a1a2e] border-2 border-white/10 hover:border-[#8BAC0F] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,172,15,0.4)]"
                data-testid={`platform-card-${platform.id}`}
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={platformImages[platform.id] || platformImages.nes}
                    alt={platform.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-['Press_Start_2P'] text-sm md:text-base text-[#8BAC0F] mb-3 leading-relaxed">
                    {platform.name}
                  </h3>
                  
                  <div className="flex justify-between items-center font-['VT323'] text-lg text-[#A0A0B0]">
                    <span>{platform.year}</span>
                    <span className="px-3 py-1 bg-[#8BAC0F]/20 border border-[#8BAC0F] text-[#8BAC0F]">
                      {platform.game_count} JEUX
                    </span>
                  </div>
                </div>

                {/* Pixel Shadow Effect */}
                <div className="absolute inset-0 pointer-events-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group-hover:shadow-[8px_8px_0px_0px_rgba(139,172,15,0.3)] transition-all"></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-['VT323'] text-xl text-[#606070]">
            © 2026 RETROCADE X - MADE WITH ❤️ FOR RETRO GAMERS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
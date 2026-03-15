import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { ArrowLeft, Search } from "lucide-react";

const LibraryPage = () => {
  const { platform } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGames();
  }, [platform]);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API}/games/platform/${platform}`);
      setGames(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des jeux:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const platformNames = {
    nes: "Nintendo (NES)",
    snes: "Super Nintendo (SNES)",
    gb: "Game Boy",
    gbc: "Game Boy Color",
    gba: "Game Boy Advance"
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] retro-grid">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b-4 border-[#8BAC0F] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-['Space_Mono'] text-[#8BAC0F] hover:text-[#9BBC0F] transition-colors mb-4"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            RETOUR
          </button>
          
          <h1 
            className="font-['Press_Start_2P'] text-2xl md:text-4xl text-[#8BAC0F] mb-6"
            data-testid="library-title"
          >
            {platformNames[platform]}
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#606070]" />
            <input
              type="text"
              placeholder="RECHERCHER UN JEU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono'] placeholder:text-white/30 outline-none transition-colors"
              data-testid="search-input"
            />
          </div>
        </div>
      </header>

      {/* Games Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block font-['Press_Start_2P'] text-xl text-[#8BAC0F] animate-pulse">
              CHARGEMENT...
            </div>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-['Press_Start_2P'] text-xl text-[#606070]">
              {searchTerm ? "AUCUN JEU TROUVÉ" : "AUCUN JEU DISPONIBLE"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="group relative bg-[#1a1a2e] border border-white/10 hover:border-[#8BAC0F] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(139,172,15,0.3)]"
                data-testid={`game-card-${game.id}`}
              >
                {/* Game Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#232342]">
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Game Info */}
                <div className="p-3 md:p-4">
                  <h3 className="font-['Press_Start_2P'] text-xs leading-relaxed text-white mb-2 line-clamp-2">
                    {game.title}
                  </h3>
                  
                  <div className="flex items-center justify-between font-['VT323'] text-base text-[#A0A0B0]">
                    <span>{game.year}</span>
                    <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-white/90 uppercase text-sm">
                      {game.genre}
                    </span>
                  </div>
                </div>

                {/* Retro Shadow */}
                <div className="absolute inset-0 pointer-events-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] group-hover:shadow-[6px_6px_0px_0px_rgba(139,172,15,0.2)] transition-all"></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryPage;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { ArrowLeft, Play, Calendar, Tag } from "lucide-react";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API}/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement du jeu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center">
        <div className="font-['Press_Start_2P'] text-xl text-[#8BAC0F] animate-pulse">
          CHARGEMENT...
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Press_Start_2P'] text-xl text-[#FF0055] mb-8">
            JEU NON TROUVÉ
          </p>
          <button
            onClick={() => navigate("/")}
            className="font-['Press_Start_2P'] text-xs px-6 py-4 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
          >
            RETOUR À L'ACCUEIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1b] retro-grid">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b-4 border-[#8BAC0F]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(`/library/${game.platform}`)}
            className="flex items-center gap-2 font-['Space_Mono'] text-[#8BAC0F] hover:text-[#9BBC0F] transition-colors"
            data-testid="back-to-library-button"
          >
            <ArrowLeft className="w-5 h-5" />
            RETOUR À LA BIBLIOTHÈQUE
          </button>
        </div>
      </header>

      {/* Game Detail */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Game Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden border-4 border-[#8BAC0F] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
              <img
                src={game.image_url}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="crt-effect absolute inset-0"></div>
            </div>
          </div>

          {/* Game Info */}
          <div className="flex flex-col justify-center">
            <h1 
              className="font-['Press_Start_2P'] text-3xl md:text-5xl text-[#8BAC0F] mb-8 leading-tight"
              data-testid="game-title"
            >
              {game.title}
            </h1>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 font-['Space_Mono'] text-lg text-[#E0E0E0]">
                <Calendar className="w-5 h-5 text-[#00F0FF]" />
                <span>Année: <strong>{game.year}</strong></span>
              </div>
              
              <div className="flex items-center gap-3 font-['Space_Mono'] text-lg text-[#E0E0E0]">
                <Tag className="w-5 h-5 text-[#00F0FF]" />
                <span>Genre: <strong>{game.genre}</strong></span>
              </div>

              {game.publisher && (
                <div className="font-['Space_Mono'] text-lg text-[#E0E0E0]">
                  Éditeur: <strong>{game.publisher}</strong>
                </div>
              )}
            </div>

            <p className="font-['Space_Mono'] text-base leading-relaxed text-[#A0A0B0] mb-8">
              {game.description}
            </p>

            {/* Play Button */}
            <button
              onClick={() => navigate(`/play/${game.id}`)}
              className="inline-flex items-center justify-center gap-3 font-['Press_Start_2P'] text-sm px-8 py-6 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all w-full md:w-auto"
              data-testid="play-game-button"
            >
              <Play className="w-6 h-6" fill="currentColor" />
              JOUER MAINTENANT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetailPage;
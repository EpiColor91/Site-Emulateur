import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { ArrowLeft, Maximize, Minimize, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmulatorPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleSaveState = async () => {
    try {
      // Simuler la sauvegarde pour le moment
      const saveData = btoa(JSON.stringify({ gameId, timestamp: Date.now() }));
      await axios.post(`${API}/saves`, {
        game_id: gameId,
        save_data: saveData
      });
      
      toast({
        title: "Partie sauvegardée !",
        description: "Votre progression a été enregistrée.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la partie.",
        variant: "destructive"
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center">
        <div className="font-['Press_Start_2P'] text-xl text-[#8BAC0F] animate-pulse">
          CHARGEMENT DU JEU...
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
            className="font-['Press_Start_2P'] text-xs px-6 py-4 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[4px_4px_0px_0px_#000]"
          >
            RETOUR À L'ACCUEIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Theater Mode Controls */}
      <div className="bg-[#1a1a2e] border-b-2 border-[#8BAC0F] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/game/${gameId}`)}
            className="flex items-center gap-2 font-['Space_Mono'] text-sm text-[#8BAC0F] hover:text-[#9BBC0F] transition-colors"
            data-testid="exit-emulator-button"
          >
            <ArrowLeft className="w-4 h-4" />
            QUITTER
          </button>
          
          <span className="font-['Press_Start_2P'] text-xs text-white hidden md:block">
            {game.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveState}
            className="flex items-center gap-2 px-4 py-2 border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black font-['Space_Mono'] text-sm transition-all"
            data-testid="save-state-button"
          >
            <Save className="w-4 h-4" />
            SAUVEGARDER
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] font-['Space_Mono'] text-sm transition-all"
            data-testid="fullscreen-button"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? "NORMAL" : "PLEIN ÉCRAN"}</span>
          </button>
        </div>
      </div>

      {/* Emulator Container */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 60px)' }}>
        {/* CRT Effect Overlay */}
        <div className="crt-effect absolute inset-0 pointer-events-none z-10"></div>
        
        {/* Emulator Placeholder */}
        <div className="relative max-w-4xl w-full aspect-[4/3] bg-[#1a1a2e] border-4 border-[#8BAC0F] shadow-[0_0_50px_rgba(139,172,15,0.3)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8">
              <img
                src={game.image_url}
                alt={game.title}
                className="w-48 h-auto mx-auto opacity-50"
              />
            </div>
            
            <p className="font-['Press_Start_2P'] text-sm md:text-base text-[#8BAC0F] mb-4 leading-relaxed">
              ÉMULATEUR EN COURS
            </p>
            
            <p className="font-['Space_Mono'] text-sm text-[#A0A0B0] max-w-md leading-relaxed">
              L'émulateur JavaScript sera intégré ici avec EmulatorJS pour jouer à {game.title}.
              Fichier ROM: {game.rom_filename}
            </p>
            
            <div className="mt-8 font-['VT323'] text-lg text-[#606070]">
              <p>Contrôles:</p>
              <p>CLAVIER: Flèches + Z (A) + X (B) + Entrée (Start) + Shift (Select)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmulatorPage;
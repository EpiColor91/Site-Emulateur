import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { ArrowLeft, Maximize, Minimize, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const EmulatorPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [emulatorUrl, setEmulatorUrl] = useState("");
  const [romExists, setRomExists] = useState(false);
  const [checkingRom, setCheckingRom] = useState(true);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (game) {
      checkRomFile();
    }
  }, [game]);

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

  const checkRomFile = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/roms/${game.rom_filename}`, {
        method: 'HEAD'
      });
      
      if (response.ok) {
        setRomExists(true);
        
        // Mapper la plateforme au core EmulatorJS
        const coreMap = {
          'nes': 'nes',
          'snes': 'snes',
          'gb': 'gb',
          'gbc': 'gbc',
          'gba': 'gba'
        };
        
        const core = coreMap[game.platform] || 'nes';
        const romUrl = `${backendUrl}/api/roms/${game.rom_filename}`;
        
        // Construire l'URL de l'émulateur avec les paramètres
        const url = `/emulator.html?core=${core}&gameUrl=${encodeURIComponent(romUrl)}`;
        setEmulatorUrl(url);
      } else {
        setRomExists(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la ROM:", error);
      setRomExists(false);
    } finally {
      setCheckingRom(false);
    }
  };

  const handleSaveState = async () => {
    try {
      const saveData = btoa(JSON.stringify({ gameId, timestamp: Date.now() }));
      await axios.post(`${API}/saves`, {
        game_id: gameId,
        save_data: saveData
      });
      
      toast.success("Partie sauvegardée !", {
        description: "Votre progression a été enregistrée.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur", {
        description: "Impossible de sauvegarder la partie.",
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
          {romExists && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Emulator Container */}
      <div className="relative" style={{ height: 'calc(100vh - 60px)' }}>
        {checkingRom ? (
          <div className="flex items-center justify-center h-full">
            <div className="font-['Press_Start_2P'] text-sm text-[#8BAC0F] animate-pulse">
              VÉRIFICATION DE LA ROM...
            </div>
          </div>
        ) : !romExists ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="max-w-2xl bg-[#1a1a2e] border-4 border-[#FF0055] p-8 text-center">
              <AlertCircle className="w-16 h-16 text-[#FF0055] mx-auto mb-6" />
              
              <h2 className="font-['Press_Start_2P'] text-xl text-[#FF0055] mb-6 leading-relaxed">
                ROM MANQUANTE
              </h2>
              
              <p className="font-['Space_Mono'] text-base text-white mb-4 leading-relaxed">
                Le fichier ROM pour <strong>{game.title}</strong> n'existe pas encore.
              </p>
              
              <p className="font-['Space_Mono'] text-sm text-[#A0A0B0] mb-6 leading-relaxed">
                Fichier attendu: <code className="bg-black/40 px-2 py-1">{game.rom_filename}</code>
              </p>
              
              <div className="bg-black/40 border-2 border-[#8BAC0F] p-6 mb-6 text-left">
                <p className="font-['VT323'] text-lg text-[#8BAC0F] mb-3">
                  COMMENT AJOUTER UNE ROM:
                </p>
                <ol className="font-['Space_Mono'] text-sm text-white space-y-2 list-decimal list-inside">
                  <li>Obtenez une ROM légale (homebrew, domaine public, ou dump de votre cartouche)</li>
                  <li>Accédez à la page <span className="text-[#8BAC0F]">/admin</span></li>
                  <li>Uploadez votre fichier ROM avec ce jeu ou créez-en un nouveau</li>
                </ol>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/admin')}
                  className="font-['Press_Start_2P'] text-xs px-6 py-4 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  ALLER À L'ADMIN
                </button>
                <button
                  onClick={() => navigate(`/game/${gameId}`)}
                  className="font-['Space_Mono'] text-white hover:text-[#8BAC0F] transition-colors"
                >
                  Retour au jeu
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-['Space_Mono'] text-xs text-[#606070]">
                  💡 Consultez le fichier <code>ROMS_GUIDE.md</code> pour trouver des ROMs légales
                </p>
              </div>
            </div>
          </div>
        ) : emulatorUrl ? (
          <iframe
            src={emulatorUrl}
            className="w-full h-full border-0"
            title="EmulatorJS"
            allowFullScreen
            data-testid="emulator-iframe"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="font-['Press_Start_2P'] text-sm text-[#8BAC0F]">
              CHARGEMENT DE L'ÉMULATEUR...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmulatorPage;
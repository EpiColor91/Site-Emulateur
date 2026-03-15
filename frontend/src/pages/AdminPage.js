import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Upload, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    platform: "nes",
    year: new Date().getFullYear(),
    genre: "",
    image_url: "",
    description: "",
    publisher: "",
    file: null
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API}/games`);
      setGames(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des jeux:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('platform', formData.platform);
      uploadFormData.append('year', formData.year);
      uploadFormData.append('genre', formData.genre);
      uploadFormData.append('image_url', formData.image_url);
      uploadFormData.append('description', formData.description);
      if (formData.publisher) {
        uploadFormData.append('publisher', formData.publisher);
      }

      await axios.post(`${API}/upload-rom`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("ROM uploadée avec succès !");
      setShowUploadForm(false);
      setFormData({
        title: "",
        platform: "nes",
        year: new Date().getFullYear(),
        genre: "",
        image_url: "",
        description: "",
        publisher: "",
        file: null
      });
      fetchGames();
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de l'upload de la ROM");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce jeu ?")) return;

    try {
      await axios.delete(`${API}/games/${gameId}`);
      toast.success("Jeu supprimé avec succès");
      fetchGames();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du jeu");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] retro-grid">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b-4 border-[#8BAC0F] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/")}
                className="font-['Space_Mono'] text-sm text-[#8BAC0F] hover:text-[#9BBC0F] transition-colors mb-2"
              >
                ← RETOUR À L'ACCUEIL
              </button>
              <h1 className="font-['Press_Start_2P'] text-2xl md:text-4xl text-[#8BAC0F]">
                ADMINISTRATION
              </h1>
            </div>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex items-center gap-2 font-['Press_Start_2P'] text-xs px-6 py-4 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[4px_4px_0px_0px_#000] transition-all"
              data-testid="toggle-upload-form"
            >
              <Plus className="w-4 h-4" />
              AJOUTER ROM
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-[#1a1a2e] border-2 border-[#8BAC0F] p-6 mb-8">
            <h2 className="font-['Press_Start_2P'] text-xl text-white mb-6">
              UPLOADER UNE ROM
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">Titre du jeu *</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                    placeholder="Ex: Super Mario Bros"
                  />
                </div>

                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">Plateforme *</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                    <SelectTrigger className="bg-black/40 border-2 border-white/10 text-white font-['Space_Mono']">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nes">NES</SelectItem>
                      <SelectItem value="snes">SNES</SelectItem>
                      <SelectItem value="gb">Game Boy</SelectItem>
                      <SelectItem value="gbc">Game Boy Color</SelectItem>
                      <SelectItem value="gba">Game Boy Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">Année *</Label>
                  <Input
                    required
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                  />
                </div>

                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">Genre *</Label>
                  <Input
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                    placeholder="Ex: Platformer, RPG, Action"
                  />
                </div>

                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">URL de l'image *</Label>
                  <Input
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label className="font-['Space_Mono'] text-white mb-2 block">Éditeur</Label>
                  <Input
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                    placeholder="Ex: Nintendo"
                  />
                </div>
              </div>

              <div>
                <Label className="font-['Space_Mono'] text-white mb-2 block">Description *</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                  rows={3}
                  placeholder="Description du jeu..."
                />
              </div>

              <div>
                <Label className="font-['Space_Mono'] text-white mb-2 block">Fichier ROM *</Label>
                <Input
                  required
                  type="file"
                  onChange={handleFileChange}
                  accept=".nes,.smc,.sfc,.gb,.gbc,.gba"
                  className="bg-black/40 border-2 border-white/10 focus:border-[#8BAC0F] text-white font-['Space_Mono']"
                />
                <p className="text-xs text-[#606070] mt-1 font-['Space_Mono']">
                  Formats acceptés: .nes, .smc, .sfc, .gb, .gbc, .gba
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 font-['Press_Start_2P'] text-xs px-6 py-4 bg-[#8BAC0F] text-[#0f380f] hover:bg-[#9BBC0F] shadow-[4px_4px_0px_0px_#000] disabled:opacity-50 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "UPLOAD EN COURS..." : "UPLOADER"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="font-['Space_Mono'] text-white hover:text-[#8BAC0F] transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Games List */}
        <div className="bg-[#1a1a2e] border-2 border-white/10 p-6">
          <h2 className="font-['Press_Start_2P'] text-xl text-white mb-6">
            JEUX ({games.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="font-['Press_Start_2P'] text-sm text-[#8BAC0F] animate-pulse">
                CHARGEMENT...
              </p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-['Space_Mono'] text-[#606070]">
                Aucun jeu. Commencez par uploader une ROM.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 bg-black/20 border border-white/10 hover:border-[#8BAC0F] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={game.image_url}
                      alt={game.title}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <h3 className="font-['Press_Start_2P'] text-xs text-white mb-1">
                        {game.title}
                      </h3>
                      <p className="font-['Space_Mono'] text-sm text-[#A0A0B0]">
                        {game.platform.toUpperCase()} - {game.year} - {game.genre}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="p-2 text-[#FF0055] hover:bg-[#FF0055] hover:text-white transition-colors"
                    data-testid={`delete-game-${game.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
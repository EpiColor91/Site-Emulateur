# 🎮 RetroCade X - Plateforme de Jeux Rétro

**RetroCade X** est une application web complète permettant de jouer à des jeux rétro Nintendo et Game Boy directement dans votre navigateur grâce à EmulatorJS.

![RetroCade X](https://images.unsplash.com/photo-1591462391994-cb7614f54aff?w=800)

## ✨ Fonctionnalités

### 🕹️ Catalogue de Jeux
- **5 plateformes supportées**: NES, SNES, Game Boy, Game Boy Color, Game Boy Advance
- **15 jeux classiques pré-configurés** (métadonnées uniquement)
- Recherche et filtrage par plateforme
- Fiches détaillées pour chaque jeu

### 🎯 Émulateur Intégré
- **EmulatorJS** pour émulation dans le navigateur
- Support complet des 5 plateformes rétro
- Contrôles clavier et gamepad
- Mode plein écran
- Sauvegarde d'états de jeu

### 🎨 Design Rétro Authentique
- Police **"Press Start 2P"** pour les titres
- Couleurs GameBoy (#8BAC0F)
- Effets CRT scanlines
- Esthétique arcade nostalgique des années 80-90

### ⚙️ Administration
- Interface d'upload de ROMs
- Gestion de la bibliothèque de jeux
- Suppression de jeux

## 🚀 Démarrage Rapide

L'application est déjà en cours d'exécution sur: `https://retro-gaming-portal.preview.emergentagent.com`

### Pages Disponibles

1. **Page d'accueil** `/` - Sélection des plateformes
2. **Bibliothèque** `/library/:platform` - Liste des jeux par console
3. **Détails du jeu** `/game/:gameId` - Informations complètes
4. **Émulateur** `/play/:gameId` - Jouer au jeu
5. **Administration** `/admin` - Gérer les ROMs

## 📁 Structure du Projet

```
/app/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── seed_games.py      # Script de seed de la DB
│   ├── roms/              # Dossier des fichiers ROM
│   └── requirements.txt   # Dépendances Python
├── frontend/
│   ├── public/
│   │   ├── emulator.html  # EmulatorJS standalone
│   │   └── index.html
│   └── src/
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── LibraryPage.js
│       │   ├── GameDetailPage.js
│       │   ├── EmulatorPage.js
│       │   └── AdminPage.js
│       ├── App.js
│       ├── App.css
│       └── index.css
└── ROMS_GUIDE.md          # Guide d'utilisation des ROMs
```

## 🎮 Ajouter des Jeux

### Option 1: Via l'Interface Admin

1. Accédez à `/admin`
2. Cliquez sur **"+ AJOUTER ROM"**
3. Remplissez le formulaire:
   - Titre du jeu
   - Plateforme (NES/SNES/GB/GBC/GBA)
   - Année de sortie
   - Genre
   - URL de l'image
   - Description
   - Fichier ROM
4. Cliquez sur **"UPLOADER"**

### Option 2: Manuellement

1. Copiez votre fichier ROM dans `/app/backend/roms/`
2. Ajoutez l'entrée dans MongoDB via le script Python ou l'API POST `/api/games`

**Formats acceptés:**
- NES: `.nes`
- SNES: `.smc`, `.sfc`
- Game Boy: `.gb`
- Game Boy Color: `.gbc`
- Game Boy Advance: `.gba`

## 🔧 API Endpoints

### Jeux
- `GET /api/games` - Liste tous les jeux
- `GET /api/games/platform/:platform` - Jeux par plateforme
- `GET /api/games/:id` - Détails d'un jeu
- `POST /api/games` - Créer un jeu
- `DELETE /api/games/:id` - Supprimer un jeu
- `POST /api/upload-rom` - Upload ROM + création de jeu

### Plateformes
- `GET /api/platforms` - Liste des plateformes avec compteurs

### ROMs
- `GET /api/roms/:filename` - Télécharger un fichier ROM

### Sauvegardes
- `POST /api/saves` - Créer une sauvegarde
- `GET /api/saves/:game_id` - Récupérer les sauvegardes

## 🎯 Contrôles de Jeu

### Clavier
- **Flèches directionnelles**: D-Pad
- **Z**: Bouton A
- **X**: Bouton B
- **Entrée**: Start
- **Shift**: Select

### Gamepad
Les manettes USB sont automatiquement détectées.

## ⚠️ Note Légale sur les ROMs

**RetroCade X** est un logiciel d'émulation légal. Cependant:

- ❌ Le téléchargement de ROMs commerciales que vous ne possédez pas est **illégal**
- ✅ Vous pouvez légalement utiliser des ROMs de jeux que vous possédez
- ✅ Les jeux **homebrew** sont gratuits et légaux
- ✅ Certains jeux anciens sont dans le **domaine public**

**Consultez le fichier `ROMS_GUIDE.md` pour plus d'informations sur les options légales.**

## 🛠️ Technologies Utilisées

### Backend
- **FastAPI** - Framework Python moderne
- **Motor** - Driver MongoDB asynchrone
- **Python 3.x**

### Frontend
- **React 19** - Framework JavaScript
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **Sonner** - Notifications toast
- **EmulatorJS** - Émulation via CDN

### Base de Données
- **MongoDB** - Base NoSQL pour les jeux et sauvegardes

### Émulation
- **EmulatorJS** - Émulateur JavaScript multi-plateformes

## 📊 Base de Données

### Collection `games`
```javascript
{
  id: "string",
  title: "string",
  platform: "nes|snes|gb|gbc|gba",
  year: number,
  genre: "string",
  image_url: "string",
  rom_filename: "string",
  description: "string",
  publisher: "string"
}
```

### Collection `saves`
```javascript
{
  id: "string",
  game_id: "string",
  save_data: "string", // Base64
  timestamp: "datetime"
}
```

## 🎨 Design System

- **Fonts**: Press Start 2P (titres), VT323, Space Mono (corps)
- **Couleurs principales**:
  - GameBoy Green: `#8BAC0F`
  - Background: `#0f0f1b`, `#1a1a2e`
  - Neon Cyan: `#00F0FF`
  - Neon Pink: `#FF0055`
- **Effets**: CRT scanlines, pixel shadows, neon glow

## 🔍 Améliorations Futures

- [ ] Support de plus de plateformes (N64, GBA, etc.)
- [ ] Système d'authentification utilisateur
- [ ] Leaderboards et high scores
- [ ] Multijoueur en ligne (netplay)
- [ ] Upload d'images pour les jeux
- [ ] Traductions multilingues
- [ ] Mode sombre/clair
- [ ] Support mobile amélioré

## 📝 Licence

Ce projet est fourni "tel quel" à des fins éducatives. Les jeux rétro et leurs ROMs sont protégés par des droits d'auteur. Utilisez uniquement des ROMs légales.

## 🤝 Contribution

Cette application a été créée avec **Emergent AI** pour démontrer les capacités d'émulation web moderne.

---

**Bon jeu! 🎮✨**

Pour toute question, consultez le fichier `ROMS_GUIDE.md` ou la documentation d'EmulatorJS: https://emulatorjs.org/docs/

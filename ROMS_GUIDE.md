# 🎮 Guide d'utilisation des ROMs - RetroCade X

## ⚠️ Note Importante sur les ROMs

**RetroCade X** est un émulateur fonctionnel, mais vous devez fournir vos propres fichiers ROM pour jouer aux jeux.

### Qu'est-ce qu'une ROM ?
Une ROM est une copie numérique d'un jeu de console rétro. Pour des raisons légales, nous ne pouvons pas fournir de ROMs de jeux commerciaux.

## ✅ Options Légales pour Obtenir des ROMs

### 1. Dumper vos propres cartouches
Si vous possédez des cartouches de jeu originales, vous pouvez les dumper légalement avec du matériel spécialisé:
- **Retrode** (pour SNES, Genesis, Game Boy, etc.)
- **INLretro** (pour NES)
- **GBxCart RW** (pour Game Boy/GBC/GBA)

### 2. Jeux Homebrew Gratuits et Légaux
Des développeurs indépendants créent des jeux gratuits pour consoles rétro:

**Sites recommandés:**
- [itch.io - NES/GB Homebrew](https://itch.io/games/tag-nes)
- [PDRoms](https://pdroms.de/) - Jeux homebrew pour toutes plateformes
- [Zophar's Domain](https://www.zophar.net/pdroms.html) - Section Public Domain

**Exemples de jeux homebrew NES:**
- Alter Ego
- Micro Mages
- Haunted Halloween '85/'86

### 3. Jeux du Domaine Public
Quelques jeux comme ceux de **Wisdom Tree** sont dans le domaine public:
- Exodus: Journey to the Promised Land
- Joshua & the Battle of Jericho
- Spiritual Warfare

## 📁 Comment Ajouter vos ROMs

### Méthode 1: Via le Backend (Développeur)
1. Copiez vos fichiers ROM dans `/app/backend/roms/`
2. Ajoutez les jeux dans la base de données via le script seed:

```python
# Exemple d'ajout de jeu
{
    "id": "custom-game-1",
    "title": "Mon Jeu Homebrew",
    "platform": "nes",  # nes, snes, gb, gbc, gba
    "year": 2024,
    "genre": "Action",
    "image_url": "URL de l'image",
    "rom_filename": "mon_jeu.nes",  # Nom du fichier dans /roms/
    "description": "Description du jeu",
    "publisher": "Homebrew"
}
```

### Méthode 2: Upload via l'Interface (À venir)
Une fonctionnalité d'upload de ROM sera ajoutée prochainement pour faciliter l'ajout de jeux.

## 🎯 Formats de ROM Supportés

| Plateforme | Extensions | Core EmulatorJS |
|------------|------------|-----------------|
| **NES** | `.nes` | `nes` |
| **SNES** | `.smc`, `.sfc` | `snes` |
| **Game Boy** | `.gb` | `gb` |
| **Game Boy Color** | `.gbc` | `gbc` |
| **Game Boy Advance** | `.gba` | `gba` |

## 🕹️ Contrôles de Jeu

### Clavier
- **Flèches directionnelles**: D-Pad
- **Z**: Bouton A
- **X**: Bouton B
- **Entrée**: Start
- **Shift**: Select

### Gamepad
Les manettes USB sont automatiquement détectées et configurées par EmulatorJS.

## 🔧 Dépannage

### "Download Game Data" reste affiché
- Le fichier ROM n'existe pas ou est corrompu
- Vérifiez que le fichier est dans `/app/backend/roms/`
- Vérifiez que le nom correspond à celui dans la base de données

### L'émulateur ne démarre pas
- Vérifiez que le format de ROM correspond à la plateforme
- Essayez avec une ROM de test homebrew connue

### Sauvegarde ne fonctionne pas
- Les sauvegardes sont gérées par EmulatorJS en local
- Utilisez le bouton "SAUVEGARDER" pour créer des save states

## 📚 Ressources Utiles

- [EmulatorJS Documentation](https://emulatorjs.org/docs/)
- [Guide des ROMs Légales](https://www.howtogeek.com/262758/is-downloading-retro-video-game-roms-ever-legal/)
- [Homebrew Games Database](https://www.romhacking.net/homebrew/)

## ⚖️ Avertissement Légal

**RetroCade X** est un logiciel d'émulation légal. Cependant, le téléchargement de ROMs de jeux commerciaux que vous ne possédez pas est illégal dans la plupart des pays. 

Nous encourageons fortement l'utilisation de:
- Vos propres dumps de cartouches
- Jeux homebrew gratuits
- Jeux du domaine public

**Respectez les droits d'auteur et les lois de votre pays.**

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample games data with real retro game images
games_data = [
    # NES Games
    {
        "id": "nes-mario-1",
        "title": "Super Mario Bros",
        "platform": "nes",
        "year": 1985,
        "genre": "Platformer",
        "image_url": "https://m.media-amazon.com/images/I/71wLUApbQQL.jpg",
        "rom_filename": "super_mario_bros.nes",
        "description": "Le jeu de plateforme classique qui a défini le genre. Aidez Mario à sauver la Princesse Peach du méchant Bowser à travers 8 mondes fantastiques.",
        "publisher": "Nintendo"
    },
    {
        "id": "nes-zelda-1",
        "title": "The Legend of Zelda",
        "platform": "nes",
        "year": 1986,
        "genre": "Action-Adventure",
        "image_url": "https://www.gamecash.fr/thumbnail-600/zelda-eu-e107762.jpg",
        "rom_filename": "zelda.nes",
        "description": "Embarquez dans une quête épique pour sauver la Princesse Zelda et vaincre Ganon. Explorez des donjons, résolvez des énigmes et découvrez des secrets.",
        "publisher": "Nintendo"
    },
    {
        "id": "nes-metroid",
        "title": "Metroid",
        "platform": "nes",
        "year": 1986,
        "genre": "Action-Adventure",
        "image_url": "https://upload.wikimedia.org/wikipedia/en/5/5d/Metroid_boxart.jpg",
        "rom_filename": "metroid.nes",
        "description": "Incarnez Samus Aran dans une aventure de science-fiction. Explorez la planète Zebes et affrontez les Space Pirates.",
        "publisher": "Nintendo"
    },
    {
        "id": "nes-megaman-2",
        "title": "Mega Man 2",
        "platform": "nes",
        "year": 1988,
        "genre": "Action",
        "image_url": "https://www.gamecash.fr/thumbnail-600/mega-man-2-e15659.jpg",
        "rom_filename": "megaman2.nes",
        "description": "Le jeu d'action classique avec Mega Man. Battez 8 Robot Masters et volez leurs armes pour vaincre Dr. Wily.",
        "publisher": "Capcom"
    },
    
    # SNES Games
    {
        "id": "snes-mario-world",
        "title": "Super Mario World",
        "platform": "snes",
        "year": 1990,
        "genre": "Platformer",
        "image_url": "https://www.romstation.fr/romstation/resources/games/snes/cover/36343.jpg?1677873431",
        "rom_filename": "super_mario_world.smc",
        "description": "Mario et Yoshi partent à l'aventure dans Dinosaur Land. Un chef-d'œuvre de plateforme avec des niveaux secrets et des power-ups innovants.",
        "publisher": "Nintendo"
    },
    {
        "id": "snes-zelda-lttp",
        "title": "The Legend of Zelda: A Link to the Past",
        "platform": "snes",
        "year": 1991,
        "genre": "Action-Adventure",
        "image_url": "https://m.media-amazon.com/images/I/71wfmH16Z8L.jpg",
        "rom_filename": "zelda_alttp.smc",
        "description": "L'un des meilleurs jeux Zelda de tous les temps. Voyagez entre le Monde de la Lumière et le Monde des Ténèbres dans cette aventure épique.",
        "publisher": "Nintendo"
    },
    {
        "id": "snes-super-metroid",
        "title": "Super Metroid",
        "platform": "snes",
        "year": 1994,
        "genre": "Action-Adventure",
        "image_url": "https://www.nintendo.com/eu/media/images/10_share_images/games_15/super_nintendo_5/H2x1_SNES_SuperMetroid.jpg",
        "rom_filename": "super_metroid.smc",
        "description": "Le chef-d'œuvre atmosphérique de la série Metroid. Explorez la planète Zebes dans cette aventure non-linéaire captivante.",
        "publisher": "Nintendo"
    },
    
    # Game Boy Games
    {
        "id": "gb-tetris",
        "title": "Tetris",
        "platform": "gb",
        "year": 1989,
        "genre": "Puzzle",
        "image_url": "https://www.cdiscount.com/pdt2/2/7/7/1/700x700/nin0045496730277/rw/tetris-game-boy.jpg",
        "rom_filename": "tetris.gb",
        "description": "Le jeu de puzzle addictif qui a fait du Game Boy un succès mondial. Empilez les blocs et complétez les lignes !",
        "publisher": "Nintendo"
    },
    {
        "id": "gb-pokemon-red",
        "title": "Pokémon Red",
        "platform": "gb",
        "year": 1996,
        "genre": "RPG",
        "image_url": "https://www.rpgamers.fr/images/rpgs/Pokemon-Version-Rouge-50225170525-1828-titre.jpg",
        "rom_filename": "pokemon_red.gb",
        "description": "Attrapez-les tous ! Le début du phénomène Pokémon. Devenez le meilleur Dresseur Pokémon de Kanto.",
        "publisher": "Nintendo"
    },
    {
        "id": "gb-zelda-la",
        "title": "The Legend of Zelda: Link's Awakening",
        "platform": "gb",
        "year": 1993,
        "genre": "Action-Adventure",
        "image_url": "https://www.retroplace.com/pics/gameboy/packshots/133172--the-legend-of-zelda-links-awakening.png",
        "rom_filename": "zelda_la.gb",
        "description": "Link se réveille sur une île mystérieuse. Une aventure Zelda unique et mémorable sur Game Boy.",
        "publisher": "Nintendo"
    },
    
    # Game Boy Color Games
    {
        "id": "gbc-pokemon-crystal",
        "title": "Pokémon Crystal",
        "platform": "gbc",
        "year": 2000,
        "genre": "RPG",
        "image_url": "https://www.gamecash.fr/thumbnail-400-450/pokemon-cristal-e57728.jpg",
        "rom_filename": "pokemon_crystal.gbc",
        "description": "La version améliorée de Pokémon Or et Argent avec des animations et la possibilité de choisir un personnage féminin.",
        "publisher": "Nintendo"
    },
    {
        "id": "gbc-zelda-oracle-ages",
        "title": "The Legend of Zelda: Oracle of Ages",
        "platform": "gbc",
        "year": 2001,
        "genre": "Action-Adventure",
        "image_url": "https://image.jeuxvideo.com/images/gb/z/e/zelagb0f.jpg",
        "rom_filename": "zelda_oracle_ages.gbc",
        "description": "Voyagez dans le temps pour résoudre des énigmes complexes dans cette aventure Zelda innovante.",
        "publisher": "Nintendo"
    },
    
    # Game Boy Advance Games
    {
        "id": "gba-pokemon-emerald",
        "title": "Pokémon Emerald",
        "platform": "gba",
        "year": 2004,
        "genre": "RPG",
        "image_url": "https://i.ebayimg.com/images/g/kz0AAOSwC19ix-V4/s-l1200.jpg",
        "rom_filename": "pokemon_emerald.gba",
        "description": "Explorez la région de Hoenn et affrontez les équipes Magma et Aqua dans cette version améliorée de Pokémon Rubis et Saphir.",
        "publisher": "Nintendo"
    },
    {
        "id": "gba-mario-3",
        "title": "Super Mario Advance 4",
        "platform": "gba",
        "year": 2003,
        "genre": "Platformer",
        "image_url": "https://m.media-amazon.com/images/I/71BYQp0fZ1L.jpg",
        "rom_filename": "mario_advance4.gba",
        "description": "Le remake de Super Mario Bros. 3 avec des graphismes améliorés et de nouveaux niveaux.",
        "publisher": "Nintendo"
    },
    {
        "id": "gba-metroid-fusion",
        "title": "Metroid Fusion",
        "platform": "gba",
        "year": 2002,
        "genre": "Action-Adventure",
        "image_url": "https://image.jeuxvideo.com/images/ga/m/e/mefuga0f.jpg",
        "rom_filename": "metroid_fusion.gba",
        "description": "Samus Aran affronte un parasite X mortel dans cette suite atmosphérique et terrifiante.",
        "publisher": "Nintendo"
    },
]

async def seed_database():
    """Populate database with sample games"""
    try:
        # Clear existing games
        await db.games.delete_many({})
        print("Base de données nettoyée")
        
        # Insert new games
        await db.games.insert_many(games_data)
        print(f"✅ {len(games_data)} jeux ajoutés avec succès !")
        
        # Print summary
        platforms = {}
        for game in games_data:
            platform = game['platform']
            platforms[platform] = platforms.get(platform, 0) + 1
        
        print("\nRésumé:")
        for platform, count in platforms.items():
            print(f"  {platform.upper()}: {count} jeux")
        
    except Exception as e:
        print(f"❌ Erreur lors du seed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("🎮 Démarrage du seed de la base de données...\n")
    asyncio.run(seed_database())
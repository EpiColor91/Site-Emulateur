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

async def update_mario_rom():
    """Update Super Mario Bros to use the real ROM file"""
    result = await db.games.update_one(
        {"id": "nes-mario-1"},
        {"$set": {"rom_filename": "super_mario_bros_world.nes"}}
    )
    
    if result.modified_count > 0:
        print("✅ Super Mario Bros mis à jour avec la vraie ROM!")
        game = await db.games.find_one({"id": "nes-mario-1"}, {"_id": 0})
        print(f"   Jeu: {game['title']}")
        print(f"   ROM: {game['rom_filename']}")
    else:
        print("❌ Aucune modification effectuée")
    
    client.close()

if __name__ == "__main__":
    print("🎮 Mise à jour de Super Mario Bros...")
    asyncio.run(update_mario_rom())

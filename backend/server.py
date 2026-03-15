from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Game(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    platform: str  # nes, snes, gb, gbc, gba
    year: int
    genre: str
    image_url: str
    rom_filename: str
    description: str
    publisher: Optional[str] = None

class GameCreate(BaseModel):
    title: str
    platform: str
    year: int
    genre: str
    image_url: str
    rom_filename: str
    description: str
    publisher: Optional[str] = None

class SaveState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    game_id: str
    save_data: str  # Base64 encoded save state
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SaveStateCreate(BaseModel):
    game_id: str
    save_data: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "RetroCade API"}

@api_router.get("/games", response_model=List[Game])
async def get_all_games():
    """Get all games"""
    games = await db.games.find({}, {"_id": 0}).to_list(1000)
    return games

@api_router.get("/games/platform/{platform}", response_model=List[Game])
async def get_games_by_platform(platform: str):
    """Get games by platform (nes, snes, gb, gbc, gba)"""
    games = await db.games.find({"platform": platform.lower()}, {"_id": 0}).to_list(1000)
    return games

@api_router.get("/games/{game_id}", response_model=Game)
async def get_game(game_id: str):
    """Get a specific game by ID"""
    game = await db.games.find_one({"id": game_id}, {"_id": 0})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@api_router.post("/games", response_model=Game)
async def create_game(game_data: GameCreate):
    """Create a new game"""
    game = Game(**game_data.model_dump())
    doc = game.model_dump()
    await db.games.insert_one(doc)
    return game

@api_router.get("/roms/{rom_filename}")
async def get_rom(rom_filename: str):
    """Serve ROM files"""
    rom_path = ROOT_DIR / "roms" / rom_filename
    if not rom_path.exists():
        raise HTTPException(status_code=404, detail="ROM not found")
    return FileResponse(rom_path)

@api_router.post("/saves", response_model=SaveState)
async def create_save(save_data: SaveStateCreate):
    """Save a game state"""
    save = SaveState(**save_data.model_dump())
    doc = save.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.saves.insert_one(doc)
    return save

@api_router.get("/saves/{game_id}", response_model=List[SaveState])
async def get_saves(game_id: str):
    """Get all saves for a game"""
    saves = await db.saves.find({"game_id": game_id}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    
    # Convert ISO string timestamps back to datetime objects
    for save in saves:
        if isinstance(save['timestamp'], str):
            save['timestamp'] = datetime.fromisoformat(save['timestamp'])
    
    return saves

@api_router.get("/platforms")
async def get_platforms():
    """Get all available platforms with game counts"""
    platforms = [
        {"id": "nes", "name": "Nintendo (NES)", "year": "1983"},
        {"id": "snes", "name": "Super Nintendo (SNES)", "year": "1990"},
        {"id": "gb", "name": "Game Boy", "year": "1989"},
        {"id": "gbc", "name": "Game Boy Color", "year": "1998"},
        {"id": "gba", "name": "Game Boy Advance", "year": "2001"}
    ]
    
    # Add game counts
    for platform in platforms:
        count = await db.games.count_documents({"platform": platform["id"]})
        platform["game_count"] = count
    
    return platforms

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
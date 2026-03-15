import requests
import sys
from datetime import datetime

class RetroCadeAPITester:
    def __init__(self, base_url="https://retro-gaming-portal.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Print response data for verification
                if method == 'GET' and response.content:
                    try:
                        json_response = response.json()
                        if isinstance(json_response, list):
                            print(f"   Response: Found {len(json_response)} items")
                            if json_response and len(json_response) > 0:
                                print(f"   First item keys: {list(json_response[0].keys()) if isinstance(json_response[0], dict) else 'Not a dict'}")
                        elif isinstance(json_response, dict):
                            print(f"   Response keys: {list(json_response.keys())}")
                    except:
                        print(f"   Response length: {len(response.content)} bytes")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json() if response.content else "No response content"
                    print(f"   Error detail: {error_detail}")
                except:
                    print(f"   Raw response: {response.text[:200]}")

            return success, response.json() if success and response.content else {}

        except requests.exceptions.ConnectTimedError:
            print(f"❌ Failed - Connection timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_api(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API",
            "GET",
            "",
            200
        )
        return success

    def test_get_platforms(self):
        """Test platforms API"""
        success, response = self.run_test(
            "Get Platforms",
            "GET",
            "platforms",
            200
        )
        if success:
            platforms = response
            expected_platforms = ['nes', 'snes', 'gb', 'gbc', 'gba']
            found_platforms = [p['id'] for p in platforms]
            print(f"   Found platforms: {found_platforms}")
            print(f"   Game counts: {[(p['id'], p['game_count']) for p in platforms]}")
            
            if set(expected_platforms) == set(found_platforms):
                print(f"   ✅ All expected platforms found")
            else:
                print(f"   ⚠️  Missing platforms: {set(expected_platforms) - set(found_platforms)}")
        
        return success

    def test_get_all_games(self):
        """Test get all games API"""
        success, response = self.run_test(
            "Get All Games",
            "GET",
            "games",
            200
        )
        if success:
            games = response
            platforms = {}
            for game in games:
                platform = game.get('platform', 'unknown')
                platforms[platform] = platforms.get(platform, 0) + 1
            print(f"   Games by platform: {platforms}")
            print(f"   Total games found: {len(games)}")
        
        return success, response if success else []

    def test_get_games_by_platform(self, platform="nes"):
        """Test get games by platform"""
        success, response = self.run_test(
            f"Get Games by Platform ({platform})",
            "GET",
            f"games/platform/{platform}",
            200
        )
        if success:
            games = response
            print(f"   Found {len(games)} games for platform {platform}")
            if games:
                print(f"   First game: {games[0].get('title', 'No title')}")
        
        return success, response if success else []

    def test_get_specific_game(self, game_id):
        """Test get specific game by ID"""
        success, response = self.run_test(
            f"Get Specific Game ({game_id})",
            "GET",
            f"games/{game_id}",
            200
        )
        if success:
            game = response
            print(f"   Game: {game.get('title', 'No title')} ({game.get('year', 'No year')})")
            print(f"   Platform: {game.get('platform', 'No platform')}")
            print(f"   Genre: {game.get('genre', 'No genre')}")
        
        return success, response if success else {}

    def test_create_save(self, game_id):
        """Test creating a save state"""
        save_data = {
            "game_id": game_id,
            "save_data": "dGVzdCBzYXZlIGRhdGE="  # Base64 encoded "test save data"
        }
        
        success, response = self.run_test(
            "Create Save State",
            "POST",
            "saves",
            200,
            data=save_data
        )
        if success:
            save = response
            print(f"   Save ID: {save.get('id', 'No ID')}")
            print(f"   Game ID: {save.get('game_id', 'No game ID')}")
        
        return success, response if success else {}

    def test_get_saves(self, game_id):
        """Test getting saves for a game"""
        success, response = self.run_test(
            f"Get Saves for Game ({game_id})",
            "GET",
            f"saves/{game_id}",
            200
        )
        if success:
            saves = response
            print(f"   Found {len(saves)} saves for game {game_id}")
        
        return success

def main():
    print("🎮 RetroCade X Backend API Testing")
    print("=" * 50)
    
    # Initialize tester
    tester = RetroCadeAPITester()
    
    # Test 1: Root API
    if not tester.test_root_api():
        print("\n❌ Root API failed, stopping tests")
        return 1

    # Test 2: Platforms API
    if not tester.test_get_platforms():
        print("\n❌ Platforms API failed, stopping tests")
        return 1

    # Test 3: Get All Games
    success, all_games = tester.test_get_all_games()
    if not success:
        print("\n❌ Get all games failed, stopping tests")
        return 1

    # Get a sample game ID for further testing
    sample_game_id = None
    if all_games:
        sample_game_id = all_games[0].get('id')
        print(f"\nUsing sample game ID for testing: {sample_game_id}")

    # Test 4: Get Games by Platform (test each platform)
    platforms_to_test = ['nes', 'snes', 'gb', 'gbc', 'gba']
    for platform in platforms_to_test:
        success, platform_games = tester.test_get_games_by_platform(platform)
        if not success:
            print(f"\n⚠️ Get games for platform {platform} failed")

    # Test 5: Get Specific Game
    if sample_game_id:
        success, game_detail = tester.test_get_specific_game(sample_game_id)
        if not success:
            print(f"\n⚠️ Get specific game {sample_game_id} failed")

        # Test 6: Create Save State
        if success:
            save_success, save_response = tester.test_create_save(sample_game_id)
            if not save_success:
                print(f"\n⚠️ Create save state failed")

            # Test 7: Get Saves
            if save_success:
                if not tester.test_get_saves(sample_game_id):
                    print(f"\n⚠️ Get saves failed")

    # Test Results
    print(f"\n📊 Test Results")
    print("=" * 30)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All tests passed! Backend APIs are working correctly.")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
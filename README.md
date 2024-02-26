# Node.js Websocket Battleship

### Installation

#### 1. Clone repository
```
git clone https://github.com/andre-sm/nodejs-websocket-battleship.git
```
####  2. Go to the project directory
```
cd websockets-ui
```
####  3. Switch to `dev` branch
```
git checkout dev
```
####  4. Install dependencies
```
npm install
```
####  5. Rename .env.example file to .env and modify PORT if needed
####  6. Run the app
```
# development mode
npm run start:dev

# production mode
npm run start
```

####  7. Play the game at http://localhost:8181

### Notes
- By default WebSocket client tries to connect to the 3000 port
- Each player can create several game rooms. but when the game starts, all rooms created by players are deleted
- When the player shoots at a cell that already consists of a damaged or killed ship, the player has one more try. But if the shoot was made into an already missed cell, the turn of the shoot passes to the opponent

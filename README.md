# ⚓ Battleship Game

A fully functional, modern web implementation of the classic Battleship naval combat game built with Next.js and TypeScript. Play against an intelligent AI opponent with a clean, responsive interface.

## 🎮 Game Features

### Core Gameplay
- **Classic Battleship Rules**: Standard 10x10 grid with traditional fleet composition
- **Fleet Composition**: 
  - Carrier (5 squares)
  - Battleship (4 squares) 
  - Cruiser (3 squares)
  - Submarine (3 squares)
  - Destroyer (2 squares)
- **Player vs AI**: Intelligent computer opponent with strategic targeting
- **Turn-based Combat**: Clear visual feedback for hits, misses, and sunk ships

### Ship Placement Phase
- **Interactive Placement**: Click-to-place interface with visual validation
- **Ship Rotation**: Toggle between horizontal and vertical orientations
- **Random Placement**: One-click random fleet setup
- **Visual Feedback**: Prevents overlapping ships and out-of-bounds placement
- **Progress Tracking**: Shows ships placed vs. total required

### Battle Phase
- **Dual Grid Display**: Separate defensive and offensive grids
- **Visual Indicators**: 
  - 🟦 Empty ocean cells
  - ⚫ Your ships (defensive grid only)
  - 💥 Hit markers with pulse animation
  - • Miss markers
  - ☠ Sunk ship indicators
- **Turn Management**: Clear indication of current player's turn
- **Real-time Updates**: Immediate visual feedback for all actions

### AI Opponent
- **Smart Targeting**: AI doesn't cheat - no knowledge of player ship positions
- **Hunt Mode**: After scoring a hit, AI searches adjacent squares intelligently
- **Random Strategy**: Random firing when no active targets
- **Balanced Difficulty**: Challenging but beatable gameplay

### User Interface
- **Modern Design**: Clean, ocean-themed interface with Tailwind CSS
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and hover effects
- **Clear Instructions**: Built-in game guidance and status displays
- **Accessibility**: Semantic HTML with ARIA labels

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or npm/yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd battleship-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

## 🌐 Deployment to Vercel

### One-Click Deployment
1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and connect your GitHub repository
4. Vercel will automatically detect the Next.js configuration
5. Click "Deploy" - your game will be live in minutes!

### Manual Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   vercel
   ```

3. Follow the prompts to deploy your application

### Environment Variables
No environment variables required - this is a client-side only application!

## 📁 Project Structure

```
battleship-game/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css        # Global styles and Tailwind
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Main game component
│   ├── components/            # React components
│   │   ├── Grid.tsx           # Game grid component
│   │   ├── ShipPlacement.tsx  # Ship placement interface
│   │   └── BattlePhase.tsx    # Battle phase interface
│   ├── lib/                   # Game logic
│   │   ├── gameLogic.ts       # Core game mechanics
│   │   └── aiLogic.ts         # AI opponent logic
│   └── types/                 # TypeScript definitions
│       └── index.ts           # Game type definitions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🎯 How to Play

1. **Ship Placement Phase**
   - Select a ship from the left panel
   - Choose orientation (horizontal/vertical)
   - Click on the grid to place your ship
   - Use "Random Placement" for quick setup
   - Place all 5 ships to start the battle

2. **Battle Phase**
   - Click on the enemy grid (right) to fire
   - Red cells indicate hits, gray cells indicate misses
   - Your ships are visible on your grid (left)
   - Take turns with the AI until one fleet is destroyed

3. **Winning the Game**
   - Sink all enemy ships to win
   - Protect your fleet from destruction
   - Start a new game anytime with the restart button

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Build Tool**: Next.js built-in optimization
- **Deployment**: Vercel (static export)

## 🎨 Design Features

- **Ocean Theme**: Custom color palette with ocean blues
- **Responsive Grid**: Adapts to different screen sizes
- **Micro-interactions**: Hover effects and transitions
- **Visual Hierarchy**: Clear focus on game elements
- **Accessibility**: Semantic HTML and ARIA support

## 🔧 Configuration

### Tailwind CSS
Custom theme with ocean-inspired colors:
- `ocean-50` to `ocean-900`: Blue gradient palette
- `ship-gray`, `ship-hit`, `ship-miss`: Game-specific colors
- Custom animations: `pulse-slow`, `bounce-subtle`

### Next.js
- Static export for optimal performance
- Image optimization disabled (no external images)
- Trailing slash enabled for proper routing

## 🐛 Known Limitations

- **Sound Effects**: Not implemented (can be added with Web Audio API)
- **Drag & Drop**: Click-to-place only (drag & drop could be added)
- **Multiplayer**: Single player vs AI only
- **Persistent Scores**: No score tracking or leaderboards
- **Ship Animations**: Basic CSS transitions (could enhance with more complex animations)

## 🚀 Future Improvements

- **Sound System**: Hit/miss sound effects with mute toggle
- **Enhanced AI**: Multiple difficulty levels
- **Statistics**: Track wins, losses, and accuracy
- **Animations**: Ship sinking animations and water effects
- **Multiplayer**: Real-time multiplayer with WebSockets
- **Themes**: Multiple visual themes (space, desert, etc.)
- **Tutorials**: Interactive tutorial for new players

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please:
- Check the [Issues](../../issues) page
- Create a new issue with detailed information
- Include browser and device information for bugs

---

**Enjoy the game! ⚓🎮**

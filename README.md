# Cursor Simple Games

A collection of simple web games created with Cursor vibe code. These games are built using TypeScript, HTML5 Canvas, and modern web technologies for a smooth gaming experience.

## 🎮 Available Games

### 1. Galaxian Game

A classic arcade-style space shooter game inspired by the 1979 Namco classic.

<img width="1512" height="822" alt="image" src="https://github.com/user-attachments/assets/2da16608-619c-4fd0-8c43-a25c45f79597" />

**Features:**

- 🚀 Classic spaceship design
- 👾 Three types of aliens (Yellow, Red, Purple)
- 🎯 Diving alien attacks
- 💥 Explosive visual effects
- ⭐ Dynamic starfield background
- 🏆 High score system

**How to Play:**

- Use **← →** arrow keys to move
- Press **Spacebar** to shoot
- Clear all aliens to advance to the next level

### 2. Gomoku Game

A modern implementation of the classic Five in a Row board game.

<img width="919" height="822" alt="image" src="https://github.com/user-attachments/assets/d445f6d0-fa10-4d58-8205-49c82915b9a5" />


**Features:**

- 🎮 Two-player gameplay
- 🖱️ Mouse and keyboard controls
- 🎨 Modern gradient interface
- 📱 Responsive design
- ⚡ Real-time cursor display

**How to Play:**

- Black goes first, White goes second
- Place stones on a 15x15 board
- First to connect 5 stones in a row (horizontal, vertical, or diagonal) wins
- Use mouse clicks or arrow keys + spacebar to place stones

## 🛠️ Technology Stack

All games are built with:

- **TypeScript** - Type-safe JavaScript development
- **HTML5 Canvas** - Game rendering and graphics
- **CSS3** - Modern styling and animations
- **Vite** - Fast development and build tooling
- **No external frameworks** - Pure vanilla implementation

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ric2k1/cursor-simple-games.git
cd cursor-simple-games
```

2. Navigate to any game directory:

```bash
cd galaxian-game
# or
cd gomoku-game
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

5. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## 📁 Project Structure

```
cursor-simple-games/
├── galaxian-game/          # Classic space shooter
│   ├── src/
│   │   ├── game.ts        # Game logic
│   │   ├── renderer.ts    # Rendering engine
│   │   ├── ui.ts          # UI management
│   │   ├── audioManager.ts # Audio system
│   │   ├── types.ts       # TypeScript types
│   │   ├── main.ts        # Entry point
│   │   └── style.css      # Game styles
│   ├── public/            # Static assets (audio files)
│   └── README.md          # Game-specific documentation
├── gomoku-game/           # Five in a Row board game
│   ├── src/
│   │   ├── game.ts        # Game logic
│   │   ├── renderer.ts    # Canvas renderer
│   │   ├── ui.ts          # User interface
│   │   ├── types.ts       # TypeScript types
│   │   ├── main.ts        # Application entry
│   │   └── style.css      # Styles
│   ├── public/            # Static assets
│   └── README.md          # Game-specific documentation
└── README.md              # This file
```

## 🎯 Development Commands

For each game, you can use the following commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌟 Features

### Cross-Platform Compatibility

- Works on desktop browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for different screen sizes
- Touch-friendly controls for mobile devices

### Performance Optimized

- 60 FPS smooth gameplay
- Efficient Canvas rendering
- Optimized audio management
- Minimal bundle size

### Developer Friendly

- TypeScript for type safety
- Modular code structure
- Easy to customize and extend
- Comprehensive documentation

## 🎨 Customization

Each game can be easily customized by modifying:

- Game configuration in the main entry file
- Visual styles in `style.css`
- Game logic in the respective game files
- Audio files in the `public` directory

## 🤝 Contributing

Feel free to contribute to these games by:

- Adding new features
- Improving existing gameplay
- Fixing bugs
- Enhancing the UI/UX
- Adding new games to the collection

## 📄 License

This project is licensed under the MIT License - see the individual game README files for more details.

## 🙏 Acknowledgments

- **Galaxian Game**: Inspired by the 1979 Namco classic arcade game
- **Gomoku Game**: Based on the traditional Five in a Row board game
- Built with ❤️ using Cursor vibe code

---

**Enjoy playing these simple yet engaging games!** 🎮

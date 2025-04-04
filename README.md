# Football Player Guessing Game

A daily interactive football player guessing game that combines visual engagement, autocomplete search, and immersive gameplay mechanics. Test your knowledge of football players by guessing the mystery player based on various attributes such as nationality, position, and club.

![Football Player Guessing Game](generated-icon.png)

## Features

- 🎮 Daily challenges with a new mystery player each day
- 🌎 Multi-language support (English, French, Spanish)
- 🏳️ Country flags displayed as emojis
- 🔍 Autocomplete player search
- 📊 Visual feedback indicators based on your guesses
- 🌓 Light and dark theme support
- 📱 Responsive design for mobile, tablet, and desktop
- 🏆 Scoring system based on your efficiency
- 🔄 Continuous mode for unlimited attempts

## Tech Stack

- React with TypeScript
- Express.js for the backend
- PostgreSQL database with Drizzle ORM
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Vite for frontend development

## Requirements

- Node.js (v18 or higher)
- npm (v8 or higher)
- PostgreSQL database (v13 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/football-player-guessing-game.git
cd football-player-guessing-game
```

2. Install dependencies:

```bash
npm install
```

3. Set up your PostgreSQL database and update the connection string in a `.env` file:

```bash
# .env
DATABASE_URL=postgresql://username:password@localhost:5432/football_game
```

4. Push the database schema to your database:

```bash
npx drizzle-kit push
```

5. Seed the database with player data:

```bash
npx tsx server/scripts/seed.ts
```

## Development

To start the development server:

```bash
npm run dev
```

This will run:
- The Express backend server
- The Vite development server for the frontend

Open your browser and navigate to `http://localhost:5000` to see the application.

## Database Management

The application uses Drizzle ORM for database interactions. The schema is defined in `shared/schema.ts`.

- To generate and apply database migrations:

```bash
npx drizzle-kit push
```

- To reset your database (caution: this will delete all data):

```bash
npx drizzle-kit drop && npx drizzle-kit push
```

## Game Logic

The application includes several key components:

- **Daily Challenge**: A new player is selected each day for users to guess
- **Player Search**: Find players by name with an autocomplete search bar
- **Feedback System**: After each guess, users receive feedback about:
  - Nationality (correct, same continent, or wrong)
  - Position (correct, same category, or wrong)
  - Club (correct, same league, or wrong)
  - Age (difference in years)
  - Height (taller, correct, or shorter)
  - Dominant foot (correct or wrong)
  - Career start (earlier, correct, or later)
- **Continuous Mode**: After using all regular attempts, users can enable continuous mode for unlimited guesses

## Internationalization

The application supports multiple languages:

- English (default)
- French
- Spanish

Language files are stored in `client/src/lib/i18n/translations.ts`.

## Deployment

To build the application for production:

```bash
npm run build
```

This will create optimized bundles in the `dist` directory. You can then deploy these files to your preferred hosting platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Player data sourced from various publicly available football databases
- Inspired by games like Wordle and other guessing games
- Icons from Lucide React
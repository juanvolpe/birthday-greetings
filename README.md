# Birthday Greetings App

A web application for creating and sharing birthday greetings with friends and family.

## Features

- Create birthday greeting campaigns
- Collect messages and photos from friends and family
- Review and approve submissions
- Beautiful presentation of birthday wishes
- Responsive design for all devices

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React
- API Routes

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/birthday-greetings.git
cd birthday-greetings
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/data` - Mock data and type definitions
- `/src/styles` - Global styles and Tailwind configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PATCH /api/campaigns/[id]` - Update campaign status
- `GET /api/greetings` - Get all greetings
- `POST /api/greetings` - Create a new greeting

## License

MIT 
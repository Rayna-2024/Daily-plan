# Daily Planning Assistant with Claude AI

An intelligent daily planning assistant based on React and Claude AI. Users can describe their tasks for the day through a chat interface, and AI will automatically generate a structured daily plan.

## Features

- 🤖 **AI-Powered**: Generate personalized daily plans using Claude AI
- 📋 **Dual-Panel Interface**: 
  - Left Panel: Display structured daily plan
  - Right Panel: Chat interaction with Claude AI
- ⏰ **Smart Time Planning**: Automatically allocate time blocks including tasks, breaks, meals, etc.
- 🎯 **Priority Management**: Tasks categorized and sorted by priority
- 📊 **Visual Display**: Clear timeline and task card presentation
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **AI Integration**: Requires backend API service (port 3001)

## Project Structure

```
deckspeed-template/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatPanel.tsx        # Chat panel component
│   │   ├── DailyPlanPanel.tsx   # Daily plan display panel
│   │   └── LoadingSpinner.tsx   # Loading animation component
│   ├── services/
│   │   └── planGenerator.ts     # API call service
│   ├── types/
│   │   └── Plan.ts              # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   ├── index.tsx                # Application entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation and Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Frontend Development Server

```bash
npm start
```

The application will open at http://localhost:3000

### 3. Backend Service (Important)

The frontend needs to connect to a backend API service running on port 3001. The backend service is responsible for calling Claude AI to generate daily plans.

**Backend API Requirements:**
- Port: 3001
- Endpoint: `POST /api/generate-plan`
- Request Body: `{ "userInput": "User's task description" }`
- Response: DailyPlan object in JSON format

## Usage

1. **Start the Application**: Ensure both frontend and backend services are running
2. **Describe Tasks**: Enter the tasks you need to complete today in the right chat panel
   - Example: "I need to finish a report, attend 2 meetings, go to the gym, and cook dinner"
3. **Generate Plan**: Click send, Claude AI will automatically generate a structured schedule
4. **View Plan**: The left panel will display detailed time blocks and task arrangements

## Example Inputs

- "I need to finish a presentation, attend 2 meetings, go to the gym, and cook dinner"
- "I have a job interview at 2pm, need to prepare for it, and want some relaxation time in the evening"
- "Help me plan a productive work day with regular breaks and time for learning something new"
- "I want to balance work tasks, personal errands, and family time"

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production version
- `npm test` - Run tests
- `npm run eject` - Eject configuration (irreversible)

## Requirements

- Node.js 16+
- npm or yarn
- Backend API service (Claude AI integration)

## Notes

1. **API Dependency**: The application requires a backend API service to function properly
2. **CORS**: package.json is configured with proxy pointing to localhost:3001
3. **Fallback**: If API is unavailable, a basic fallback plan will be displayed

## Development Roadmap

- [ ] Add schedule editing feature
- [ ] Support multi-day planning
- [ ] Add plan export feature (PDF/Calendar)
- [ ] Task completion status tracking
- [ ] More AI optimization suggestions

## License

MIT

## Contact

For questions or suggestions, please contact through GitHub Issues.

# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Start development server
npm start
```

The application will open at `http://localhost:3000`

## Running Tests

### Unit Tests (Live Watch Mode)
```bash
npm test
```

### Unit Tests (Single Run)
```bash
npm test -- --watchAll=false
```

### Specific Unit Tests
```bash
# ScoreController tests only
npm test -- --testPathPattern="ScoreController.test.js" --watchAll=false

# Quiz component tests only
npm test -- --testPathPattern="Quiz.test.js" --watchAll=false
```

### Functional Tests
```bash
# First, ensure app is running in another terminal
npm start

# In another terminal, run functional tests
npm run stests
```

## Project Structure

```
2024_simple_quiz/
├── public/               # Static files
├── src/
│   ├── components/      # React components
│   │   ├── Quiz.js      # Main quiz component
│   │   ├── Quiz.test.js # Quiz unit tests
│   │   ├── Results.js   # Results display component
│   │   └── my_state.js  # Global state
│   ├── controllers/     # Business logic
│   │   ├── ScoreController.js       # Scoring logic
│   │   └── ScoreController.test.js  # Scoring tests
│   ├── model/          # Data models
│   │   ├── MyState.js              # State model
│   │   └── basic_questions.json    # Quiz questions
│   ├── App.js          # Root component
│   ├── App.css         # App styles
│   └── index.js        # Entry point
├── test/
│   └── functional.spec.js  # Functional tests
├── package.json        # Dependencies
├── IMPLEMENTATION.md   # Implementation details
└── TESTING.md         # Testing documentation
```

## Key Components

### ScoreController
Handles all scoring logic:
- Track correct/incorrect answers
- Calculate percentages
- Reset scores

```javascript
import ScoreController from './controllers/ScoreController';
const controller = new ScoreController();
controller.incrementScore();
```

### Quiz Component
Displays quiz questions and answers:
- Renders all questions from `basic_questions.json`
- Tracks user selections
- Emits `onQuizComplete` callback with scores

### Results Component
Displays final scores:
- Shows formatted score and percentage
- Provides feedback based on performance
- Offers "Take Quiz Again" button

## Testing Overview

| Test Type | Framework | File | Run Command |
|-----------|-----------|------|------------|
| Unit - ScoreController | Jest | `src/controllers/ScoreController.test.js` | `npm test -- --testPathPattern="ScoreController"` |
| Unit - Quiz Component | Jest + React Testing Library | `src/components/Quiz.test.js` | `npm test -- --testPathPattern="Quiz"` |
| Functional | Mocha + Selenium | `test/functional.spec.js` | `npm run stests` |

## Development Workflow

1. **Make Changes**
   ```bash
   # Edit source files
   # Changes hot-reload automatically
   ```

2. **Run Tests During Development**
   ```bash
   npm test
   ```

3. **Test Specific Features**
   ```bash
   npm test -- --testPathPattern="ComponentName" --watchAll=false
   ```

4. **Test in Browser**
   - Visit `http://localhost:3000`
   - Try the quiz manually
   - Check console for errors

5. **Run Complete Test Suite**
   ```bash
   npm test -- --watchAll=false
   npm run stests
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## Common Tasks

### Add a New Question
1. Edit `src/model/basic_questions.json`
2. Follow the format:
```json
{
    "id": 4,
    "question": "Your question here?",
    "answers": [
        { "answer": "Wrong option", "isCorrect": false },
        { "answer": "Correct option", "isCorrect": true }
    ]
}
```
3. Tests will automatically use the new question

### Debug a Test
1. Use `--inspect` flag:
   ```bash
   npm test -- --inspect-brk --testPathPattern="ScoreController"
   ```
2. Open Chrome DevTools for debugging

### View Test Coverage
```bash
npm test -- --coverage --watchAll=false
```

## API Reference

### ScoreController Methods

```javascript
controller.incrementScore()      // Increment score and count
controller.incrementCount()      // Increment count only
controller.getScore()            // Get current score
controller.getCount()            // Get answered count
controller.getPercentage()       // Get percentage (0-100)
controller.getFormattedScore()   // Get "score/count" string
controller.getScoreData()        // Get all data as object
controller.reset()               // Reset to 0/0
```

### Quiz Component Props

```javascript
<Quiz 
  onQuizComplete={(scoreData) => {
    // scoreData = { score, count, percentage, formatted }
    console.log(scoreData);
  }}
/>
```

### Results Component Props

```javascript
<Results 
  scoreData={scoreData}
  onRestart={() => {
    // Handle restart action
  }}
/>
```

## Troubleshooting

### Tests Won't Run
- Clear cache: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 14+)

### App Won't Start
- Kill existing process: `lsof -ti :3000 | xargs kill -9`
- Clear build: `rm -rf build`
- Reinstall: `npm install`

### Alerts Not Showing in Tests
- Ensure `jest.spyOn(window, 'alert')` is called
- Mock alerts before triggering interactions

### Functional Tests Timeout
- Ensure app is running: `npm start`
- Check URL is `http://localhost:3000`
- Increase timeout if needed: `const TIMEOUT = 15000;`

## Next Steps

1. ✅ Run the app: `npm start`
2. ✅ Try the quiz manually
3. ✅ Run unit tests: `npm test -- --watchAll=false`
4. ✅ Run functional tests: `npm run stests`
5. ✅ Read `IMPLEMENTATION.md` for architecture details
6. ✅ Read `TESTING.md` for test strategy details

## Support

For issues or questions:
- Check `IMPLEMENTATION.md` for architecture overview
- Check `TESTING.md` for testing strategies
- Review test files for examples

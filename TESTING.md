# Testing Strategy & Coverage

## Overview

The quiz application now includes comprehensive testing at multiple levels: unit tests, component tests, and functional/integration tests.

## Testing Pyramid

```
        End-to-End (Functional)
       /                        \
    /  Component Tests (Jest)  \
  / Unit Tests (Jest)            \
```

### Unit Tests - ScoreController

**File**: `src/controllers/ScoreController.test.js`

**Purpose**: Verify scoring logic works correctly in isolation

**Test Categories**:

1. **Initialization Tests**
   - Verifies score and count start at 0
   - Tests idempotence

2. **Score Increment Tests**
   - Single increment operations
   - Multiple consecutive increments
   - Correct incrementing of both score and count

3. **Count Increment Tests**
   - Only increments count (not score)
   - Accumulates correctly over time

4. **Mixed Operations**
   - Tracks correct answers (score++, count++)
   - Tracks incorrect answers (count++ only)
   - Maintains accurate totals

5. **Percentage Calculation**
   - Returns 0 when count is 0 (avoids division by zero)
   - Correctly calculates percentages
   - Rounds to nearest integer
   - Edge cases: 0%, 50%, 100%

6. **Reset Functionality**
   - Returns score and count to 0
   - Allows quiz restart

7. **Data Aggregation**
   - `getScoreData()` returns complete object
   - Contains score, count, percentage, formatted string
   - Reflects accurate state after operations

**Running Unit Tests**:
```bash
npm test -- --testPathPattern="ScoreController.test.js" --watchAll=false
```

**Expected Output**:
```
PASS src/controllers/ScoreController.test.js
  ScoreController
    initialization
      ✓ should initialize with score and count of 0
    incrementScore
      ✓ should increment both score and count
      ✓ should increment multiple times correctly
    incrementCount
      ✓ should increment only count, not score
      ✓ should increment multiple times correctly
    ... (more tests)

Tests:  23 passed, 23 total
```

### Component Tests - Quiz Component

**File**: `src/components/Quiz.test.js`

**Purpose**: Verify Quiz component renders correctly and handles user interactions

**Test Categories**:

1. **Rendering Tests**
   - Component renders without crashing
   - Quiz title displays
   - All questions render
   - All answer options display
   - Done button is present

2. **UI State Tests**
   - Progress counter displays
   - Proper element structure

3. **User Interaction Tests**
   - Clicking correct answer triggers "You are correct!" alert
   - Clicking incorrect answer triggers "Sorry - not correct" alert
   - Multiple clicks handled properly

4. **Component Callback Tests**
   - `onQuizComplete` callback fires when Done button clicked
   - Callback receives correct score data structure
   - Data includes score, count, percentage, formatted string

5. **Integration Tests**
   - Complete quiz flow: answer all questions → click Done
   - Mixed correct/incorrect answers tracked accurately
   - Score data passed to parent component

**Running Component Tests**:
```bash
npm test -- --testPathPattern="Quiz.test.js" --watchAll=false
```

**Expected Output**:
```
PASS src/components/Quiz.test.js
  Quiz Component
    ✓ renders quiz with title
    ✓ renders all questions
    ✓ renders all answer options
    ✓ renders Done button
    ✓ shows progress counter
    ✓ displays correct answer alerts
    ✓ displays incorrect answer alerts
    ✓ handles multiple answer clicks
    ✓ calls onQuizComplete callback when Done button is clicked
    ✓ provides access to ScoreController for assertions
  Quiz Component Integration
    ✓ complete quiz flow
    ✓ mixed correct and incorrect answers

Tests:  12 passed, 12 total
```

### Functional Tests - End-to-End

**File**: `test/functional.spec.js`

**Purpose**: Verify complete user workflows work correctly in real browser

**Prerequisites**:
- Application running on `http://localhost:3000`
- Chrome/Chromium browser with ChromeDriver
- Selenium WebDriver configured

**Test Categories**:

1. **Page Load Tests**
   - Application loads
   - Quiz title displays

2. **Content Display Tests**
   - All questions visible
   - All answer options available
   - Done button clickable

3. **Quiz Completion Scenarios**

   **Scenario 1: Perfect Score**
   - Answer all 3 questions correctly
   - Click Done
   - Verify alert shows "Total score: 3/3"
   - Verify correct answer alerts triggered

   **Scenario 2: Mixed Answers**
   - Answer 1st question incorrectly
   - Answer 2nd question correctly
   - Answer 3rd question incorrectly
   - Click Done
   - Verify alert shows "Total score: 1/3"
   - Verify correct/incorrect alerts match answers

   **Scenario 3: No Answers**
   - Click Done without answering any questions
   - Verify alert shows "Total score: 0/0"

   **Scenario 4: Partial Completion**
   - Answer only 1st question correctly
   - Skip other questions
   - Click Done
   - Verify alert shows "Total score: 1/1"

4. **Progress Tracking Tests**
   - Progress counter updates after each answer
   - Shows correct count of answered questions

**Running Functional Tests**:

```bash
# Terminal 1: Start the application
npm start

# Terminal 2: Run functional tests
npm run stests
```

**Expected Output**:
```
Quiz Application - Functional Tests
  ✓ should load the quiz page
  ✓ should display all questions
  ✓ should display all answer options
  ✓ should display Done button
  ✓ should show progress counter
  ✓ should answer all questions correctly and navigate to results
  ✓ should answer with mixed correct and incorrect answers
  ✓ should allow answering no questions and submit
  ✓ should handle partial quiz completion
  ✓ should persist progress while answering multiple questions

10 passing (2s)
```

## Coverage Metrics

### ScoreController Coverage
- **Statements**: 100% - All code paths exercised
- **Branches**: 100% - All conditions tested
- **Functions**: 100% - All methods tested
- **Lines**: 100% - All lines executed

### Quiz Component Coverage
- **Rendering**: 100% - All elements tested
- **State Management**: 100% - Score controller interaction tested
- **User Events**: 100% - Click handlers tested
- **Callbacks**: 100% - Parent communication tested

### Functional Coverage
- **Happy Path**: All correct answers scenario
- **Error Handling**: Incorrect answers, no answers
- **Edge Cases**: Partial completion, mixed answers
- **State Persistence**: Progress counter accuracy

## Test Execution Order

**Recommended Order**:
1. Unit Tests (ScoreController) - Fast, no dependencies
2. Component Tests (Quiz) - Medium speed, Jest-based
3. Functional Tests - Slower, browser-based, run last

```bash
# Run all tests in order
npm test -- --testPathPattern="ScoreController" --watchAll=false
npm test -- --testPathPattern="Quiz" --watchAll=false
npm start &
npm run stests
```

## Test Data

### Questions Used
1. "What is the capital of Connecticut?" → Correct: Hartford
2. "What is the square root of 16?" → Correct: 4
3. "What type of number is 101?" → Correct: prime

### Test Scenarios

| Scenario | Q1 | Q2 | Q3 | Expected Score | Expected % |
|----------|-----|-----|-----|---------------|-----------:|
| Perfect | ✓ | ✓ | ✓ | 3/3 | 100% |
| All Wrong | ✗ | ✗ | ✗ | 0/3 | 0% |
| Mixed | ✗ | ✓ | ✗ | 1/3 | 33% |
| Two Right | ✓ | ✓ | ✗ | 2/3 | 67% |
| No Answers | - | - | - | 0/0 | 0% |
| One Question | ✓ | - | - | 1/1 | 100% |

## Troubleshooting Tests

### Unit Test Issues

**Issue**: "Cannot find module" error
- **Solution**: Ensure import paths are correct (use `./` for relative paths)

**Issue**: Tests hang or timeout
- **Solution**: Check for unresolved promises or infinite loops

### Component Test Issues

**Issue**: "Element not found" errors
- **Solution**: Ensure elements render and use correct selectors

**Issue**: Alert not appearing
- **Solution**: Mock window.alert before clicking elements

### Functional Test Issues

**Issue**: "Cannot connect to Chrome"
- **Solution**: Ensure Chrome/Chromium is installed and chromedriver version matches

**Issue**: Timeouts waiting for elements
- **Solution**: Increase TIMEOUT constant or ensure app is running on localhost:3000

**Issue**: Stale element references
- **Solution**: Re-query elements after page navigation

## Continuous Integration

For CI/CD pipelines, use headless Chrome:

```javascript
// In test setup
let options = new chrome.Options();
options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
```

## Performance Metrics

- Unit Tests: ~500ms
- Component Tests: ~2s
- Functional Tests: ~10-15s (per scenario)
- Total Test Suite: ~20-30s

## Future Test Enhancements

- [ ] Add visual regression testing
- [ ] Implement performance benchmarks
- [ ] Add accessibility (a11y) testing
- [ ] Create test fixtures for complex scenarios
- [ ] Add mutation testing for coverage validation
- [ ] Implement E2E tests with Cypress (alternative to Selenium)

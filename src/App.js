import React from 'react';
import './App.css';
import Quiz from './components/Quiz.js';
import Results from './components/Results.js';

class App extends React.Component {
  state = {
    showResults: false,
    scoreData: null
  };

  handleQuizComplete = (scoreData) => {
    this.setState({
      showResults: true,
      scoreData: scoreData
    });
  };

  handleRestart = () => {
    this.setState({
      showResults: false,
      scoreData: null
    });
    // Reset the Quiz component by re-mounting it
    window.location.reload();
  };

  render() {
    const { showResults, scoreData } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {showResults ? (
            <Results scoreData={scoreData} onRestart={this.handleRestart} />
          ) : (
            <Quiz onQuizComplete={this.handleQuizComplete} />
          )}
        </header>
      </div>
    );
  }
}

export default App;


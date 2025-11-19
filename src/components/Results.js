import React from 'react';
import quizPageStyle from '../QuizPageStyle';

const resultsStyle = {
    ...quizPageStyle,
    textAlign: 'center',
    padding: '40px'
};

const scoreBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px'
};

const scoreTextStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '10px'
};

const percentageStyle = {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#90EE90'
};

const messageStyle = {
    fontSize: '24px',
    marginBottom: '30px'
};

const buttonStyle = {
    backgroundColor: 'white',
    color: 'DodgerBlue',
    padding: '12px 30px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px'
};

const Results = ({ scoreData, onRestart }) => {
    if (!scoreData) {
        return (
            <div style={resultsStyle}>
                <h1>No Score Data Available</h1>
                <button style={buttonStyle} onClick={onRestart}>Start Over</button>
            </div>
        );
    }

    const { score, count, percentage, formatted } = scoreData;
    
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect Score! Outstanding!';
    } else if (percentage >= 80) {
        message = '👏 Great Job!';
    } else if (percentage >= 60) {
        message = '✓ Good effort!';
    } else {
        message = 'Keep practicing!';
    }

    return (
        <div style={resultsStyle}>
            <h1>Quiz Complete!</h1>
            <div style={scoreBoxStyle}>
                <div style={messageStyle}>{message}</div>
                <div style={scoreTextStyle}>{formatted}</div>
                <div style={percentageStyle}>{percentage}%</div>
                <p>You answered {score} out of {count} questions correctly.</p>
            </div>
            <button style={buttonStyle} onClick={onRestart}>
                Take Quiz Again
            </button>
        </div>
    );
};

export default Results;

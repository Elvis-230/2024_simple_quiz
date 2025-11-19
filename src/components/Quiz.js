import React from 'react';
import quizPageStyle from '../QuizPageStyle';
import ScoreController from '../controllers/ScoreController';
import my_state from './my_state';
import my_questions from '../model/basic_questions.json';


class Quiz extends React.Component {

    state = {
        isComplete: false,
        currentQuestion: 0
    };
    
    scoreController = new ScoreController();
    
    incrementScore = () => {
        this.scoreController.incrementScore();
        alert("You are correct!"); // could be executed before the setStates are done!
    };

    dontIncrementScore = () => {
       this.scoreController.incrementCount();
        alert("Sorry - not correct");
    };

    handleSubmit = () => {
        my_state.my_score = this.scoreController.getScore();
        my_state.my_count = this.scoreController.getCount();
        
        alert("Total score: " + this.scoreController.getFormattedScore());
        
        // Notify parent component that quiz is complete
        if (this.props.onQuizComplete) {
            this.props.onQuizComplete(this.scoreController.getScoreData());
        }
    }
    
    render() {
        return(
           <div style={quizPageStyle}>
            <h1>My Questions</h1>
            <p>Progress: {this.scoreController.getCount()} / {my_questions.length}</p>
                {my_questions.map((quest) => (
                <div id="outer-div" key={quest["id"]}> 
                    <h2>{quest["question"]}</h2>
                        {quest["answers"].map((ans, idx) => (
                            <div id="mid-div" key={idx}>
                                <label>
                                <input  
                                        type = "radio"
                                        name = { quest["id"] }
                                        onClick = { ans["isCorrect"] ? this.incrementScore : this.dontIncrementScore }
                                        value = { ans["isCorrect"] } /> 
                                    { ans["answer"] }
                                </label> 
                                <br />
                            </div>
                        ))}
                    
                </div>
                ))}
                 <br />
                <button onClick={this.handleSubmit} >Done</button>
        </div>
        );
    }
}

export default Quiz;
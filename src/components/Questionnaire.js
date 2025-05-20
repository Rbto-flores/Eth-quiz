import React, { useState } from "react";
import useSound from "use-sound";
import correct from "../asset/sounds/win_theme.mp3";
import finalAnswer from "../asset/sounds/final_answer_theme.mp3";
import wrong from "../asset/sounds/wrong_answer_theme.mp3";

const Questionnaire = ({
    data: { question, correct_answer, answers },
    handleAnswer,
    onAnswerClick,
    onQuit,
    setLives,
    setIsAnswerSelected
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setClassName] = useState("answer");
    const [correctAnswer, { stop: stopCorrectAnswer }] = useSound(correct);
    const [wrongAnswer, { stop: stopWrongAnswer }] = useSound(wrong);
    const [playFinalAnswer, { stop: stopFinalAnswer }] = useSound(finalAnswer, { loop: false });

    const delay = (duration, callback) => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (answer) => {
        if (onAnswerClick) onAnswerClick();
        setIsAnswerSelected(true);
        playFinalAnswer();
        setSelectedAnswer(answer);
        setClassName("answer active");
        setClassName(correct_answer.includes(answer) ? "answer correct" : "answer wrong");

        delay(3500, () => {
            stopFinalAnswer();
            if (correct_answer.includes(answer)) {
                correctAnswer();
                delay(4000, () => {
                    setSelectedAnswer(null);
                    setIsAnswerSelected(false);
                    handleAnswer(answer, true);
                    stopCorrectAnswer();
                });
            } else {
                wrongAnswer();
                delay(4000, () => {
                    setSelectedAnswer(null);
                    setIsAnswerSelected(false);
                    setLives(lives => lives - 1);
                    if (typeof setLives === 'function' && typeof handleAnswer === 'function') {
                        handleAnswer(answer, false);
                    }
                    stopWrongAnswer();
                });
            }
        });
    };

    return (
        <div className="questionnaire">
            {/* question container */}
            <div className="question row">
                <h2
                    dangerouslySetInnerHTML={{ __html: question }}
                />
            </div>

            {/* answers container */}
            <div className='answers row'>
                {answers.map((answer, idx) => {
                    return (
                        <button
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: answer }}
                            className={selectedAnswer === answer ? className : "answer"}
                            onClick={() => !selectedAnswer && handleClick(answer)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Questionnaire;
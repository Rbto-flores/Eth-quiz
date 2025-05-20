import "./App.css";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Questionnaire } from './components';

import useSound from "use-sound";
import Timer from "./components/Timer";
import Change from "./components/Change";

import Start from "./components/Start";
import Timesup from "./components/Timesup";
import DoubleTime from "./components/DoubleTime";

import mainTheme from './asset/sounds/main_theme.mp3';
import quizTheme from './asset/sounds/question_theme.mp3';




const apiUrl = '/preguntas_completas.json';

const myName = "Ethereum Bolivia";
let currentYear = new Date().getFullYear();

function App() {

  const [playMain, { stop: stopMain }] = useSound(mainTheme, { loop: false });
  const [playQuiz, { stop: stopQuiz }] = useSound(quizTheme, { loop: true });

  const pauseMusic = () => {
    stopQuiz();
  };

  const restartGame = () => {
    // Reset all game states
    setUserName(null);
    setQuestions([]);
    setCurrIndex(0);
    setQuestionNumber(1);
    setEarn(0);
    setGameOver(false);
    setTimeOut(false);
    setTimer(30);
    setLives(3);
    setDoubleTimeUsed(false);
    setChangeUsed(false);
    timeOutRef.current = false;
    setIsAnswerSelected(false);

    // Stop all music
    stopMain();
    stopQuiz();

    // Fetch new questions
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const shuffleArray = (array) => {
          return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        };

        const shuffledQuestions = shuffleArray(data.results).map((question) => ({
          ...question,
          answers: [
            question.correct_answer,
            ...question.incorrect_answers,
          ].sort(() => Math.random() - 0.5),
        }));

        setQuestions(shuffledQuestions);
      })
      .catch(error => {
        console.error('Error al cargar preguntas:', error);
      });
  };

  //tracking if the user registered or not => if not -> showing welcome screen
  const [userName, setUserName] = useState(null);

  useEffect(() => {

    const handleFirstClick = () => {
      playMain(); // Inicia música principal
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [playMain]);

  useEffect(() => {
    if (userName) {
      stopMain();
      playQuiz();
    }
  }, [userName]);



  //tracking question number, current array and currIndex of question 
  //from fatched questions's array
  const [questions, setQuestions] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);


  //tracking current earn and game status => when gameOver = true -> game is end,
  // when time is out => the player need to press btn to continue
  const [earn, setEarn] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [timer, setTimer] = useState(30);
  const [lives, setLives] = useState(3);
  const timeOutRef = useRef(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);


  // Timer and Life_Lines
  const [doubleTimeUsed, setDoubleTimeUsed] = useState(false);
  const [changeUsed, setChangeUsed] = useState(false);

  // const [fiftyFifty, setFiftyFifty] = useState(false);

  //Handle time out state changes
  useEffect(() => {
    if (timeOut !== timeOutRef.current) {
      timeOutRef.current = timeOut;
      if (timeOut) {
        // When time runs out, decrease lives
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            setGameOver(true);
            return 0;
          }
          return newLives;
        });
      }
    }
  }, [timeOut]);

  const handleTimeOutContinue = () => {
    setTimeOut(false);
    timeOutRef.current = false;
    // Change question but don't advance in pyramid
    handleNextQuestion(false);
  };

  //Reset timer and timeOut state when question changes
  useEffect(() => {
    setTimer(30);
    setTimeOut(false);
    timeOutRef.current = false;
  }, [questionNumber]);

  //Questions's earn values
  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 },
        { id: 3, amount: 300 },
        { id: 4, amount: 500 },
        { id: 5, amount: 1000 },
        { id: 6, amount: 2000 },
        { id: 7, amount: 4000 },
        { id: 8, amount: 6000 },
        { id: 9, amount: 8000 },
        { id: 10, amount: 10000 },

      ].reverse(),
    []
  );

  //Fetching the questions's API, Creating current question array and mix it
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        // Función para mezclar un array
        const shuffleArray = (array) => {
          return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        };

        const shuffledQuestions = shuffleArray(data.results).map((question) => ({
          ...question,
          answers: [
            question.correct_answer,
            ...question.incorrect_answers,
          ].sort(() => Math.random() - 0.5),
        }));

        setQuestions(shuffledQuestions);

      })
      .catch(error => {
        console.error('Error al cargar preguntas:', error);
      });
  }, []);

  //handling answer: showing the correct answer & update the earn
  const handleAnswer = (answer, shouldAdvance = true) => {
    //check for the answer
    if (answer === questions[currIndex].correct_answer) {
      //updating earn
      setEarn(moneyPyramid[10 - questionNumber].amount);
    } else if (answer === null) {
      // Player lost all lives
      setEarn(0);
      setGameOver(true);
    }

    handleNextQuestion(shouldAdvance);
  };

  const handleQuit = () => {
    setGameOver(true);
  };

  //lunching next question and stop showing corrrect answer
  const handleNextQuestion = (changeQuestion) => {
    stopQuiz(); // Stop current quiz music
    playQuiz(); // Start new quiz music
    if (questionNumber === 10) {
      setGameOver(true);
    }
    if (changeQuestion) {
      setQuestionNumber(questionNumber + 1);
    }
    // Always change the question
    setCurrIndex(currIndex + 1);
    // Reset timer and timeOut state
    setTimer(30);
    setTimeOut(false);
    timeOutRef.current = false;
    setIsAnswerSelected(false);
  }



  //rendering screens and 
  return !userName ?
    (

      <div className="startScreen">
        <header>

        </header>


        <Start setUsername={setUserName} />
        <footer>
          <p className="copyRight">Ⓒ Copyright, {myName} {currentYear}. </p></footer>
      </div>
    ) : (

      //checking if data already fetched => if not -> showing loading message
      questions.length > 0 ? (

        // Main app div
        <div className="app vh-100">

          <>

            {/* Main (Left) container: Top & Bottom containers, and if game is over => Over container  */}
            <div className="main col-9">
              {gameOver ? (
                <div className="game-over">
                  <h1>Game over! <br /> <span className="big">{userName}</span> Ganaste {earn} ₿ !</h1>
                  <button className="restart-button" onClick={restartGame}>
                    Volver a empezar
                  </button>
                </div>
              ) : timeOut ? (

                <Timesup
                  userName={userName}
                  setTimeOut={setTimeOut}
                  timeOut={timeOut}
                  setGameOver={setGameOver}
                  questionNumber={questionNumber}
                  handleNextQuestion={handleTimeOutContinue}
                />
              ) : (

                <>

                  {/* Top container: Question#, Timer, LifeLines & QuitGame button  */}
                  <div className="top">

                    <div className="timer">

                      <Timer
                        setTimeOut={setTimeOut}
                        questionNumber={questionNumber}
                        timer={timer}
                        setTimer={setTimer}
                        changeUsed={changeUsed}
                        isAnswerSelected={isAnswerSelected}
                      />

                    </div>

                    <div className="change">

                      <Change
                        changeUsed={changeUsed}
                        setChangeUsed={setChangeUsed}
                        handleNextQuestion={handleNextQuestion}
                      />

                    </div>

                    <div className="double">

                      <DoubleTime
                        doubleTimeUsed={doubleTimeUsed}
                        setDoubleTimeUsed={setDoubleTimeUsed}
                        timer={timer}
                        setTimer={setTimer}
                      />

                    </div>

                  </div>

                  {/* Bottom container: Questions & Answers container */}
                  <div className="bottom">

                    <Questionnaire
                      data={questions[currIndex]}
                      handleAnswer={handleAnswer}
                      setTimeOut={setTimeout}
                      onAnswerClick={pauseMusic}
                      onQuit={handleQuit}
                      setLives={setLives}
                      setIsAnswerSelected={setIsAnswerSelected}
                    />

                  </div>

                </>
              )}

            </div>

            {/* Pyramid (Right container): game progress & question's value */}
            <div className="pyramid col-3">
              <div className="moneyList vh-100">
                {moneyPyramid.map((m, idx) => (
                  <div
                    className={
                      questionNumber === m.id
                        ? "moneyListItem active row"
                        : "moneyListItem row"
                    }
                    key={idx}
                  >
                    <div className="moneyListItemNumber col-3 d-flex align-items-center">
                      {m.id}
                    </div>
                    <div className="moneyListItemAmount col-9 d-flex align-items-center">
                      {m.amount} ₿
                    </div>
                  </div>
                ))}
              </div>
              {/* Lives display below pyramid, above quit button */}
              <div className="lives-display">
                {[...Array(lives)].map((_, index) => (
                  <span key={index} className="heart">❤️</span>
                ))}
              </div>
              <button
                className="quit-button"
                onClick={handleQuit}
              >
                Retirarte
              </button>
            </div>

          </>

        </div>

      ) : (
        <h2 className='big'>Cargando...</h2>
      )//questions.length > 0 ?

    );//return

}//function App

export default App;

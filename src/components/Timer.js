import { useEffect, useRef } from "react";

function Timer({ setTimeOut, questionNumber, timer, setTimer, changeUsed, isAnswerSelected }) {
    const timerRef = useRef(null);

    // Reset timer when question changes or change is used
    useEffect(() => {
        setTimer(30);
        setTimeOut(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [questionNumber, changeUsed]);

    // Handle timer countdown
    useEffect(() => {
        // Don't start timer if answer is selected
        if (isAnswerSelected) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            return;
        }

        if (timer === 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setTimeOut(true);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setTimeOut(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timer, setTimeOut, isAnswerSelected]);

    return timer;
}

export default Timer;
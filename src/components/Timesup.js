import React from "react";

const Timesup = ({ userName, handleNextQuestion }) => {
    const handleClick = () => {
        handleNextQuestion();
    };

    return (
        <div className="timesup">
            <h1>Tiempo &#128336;! <span className="big">{userName}</span> Piensa Rapido!</h1>
            <h1>Pierdes una vida 😈</h1>
            <button
                className="col-6 mt-6 btn btn-success btn-lg"
                data-bs-toggle="button"
                onClick={handleClick}
            >
                Continuar
            </button>
        </div>
    );
};

export default Timesup;
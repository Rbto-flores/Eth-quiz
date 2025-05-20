const Change = ({ changeUsed, setChangeUsed, handleNextQuestion }) => {

    const handleClick = () => {
        setChangeUsed(true);
        // Change question but don't advance in pyramid
        handleNextQuestion(false);
    };

    if (!changeUsed) {
        return <button
            onClick={() => handleClick()}>&#9851;</button>
    }

    return (<div className="used">&#9851;</div>);


}

export default Change;
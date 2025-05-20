import React, { useRef, useState } from 'react';

const audioList = [
    { id: 1, name: 'Audio 1', src: '../assets/sounds/final_answer_theme.mp3' },
    { id: 2, name: 'Audio 2', src: '../assets/sounds/lets_play_theme.mp3' },
    { id: 3, name: 'Audio 3', src: '../assets/sounds/main_theme.mp3' },
    { id: 4, name: 'Audio 3', src: '../assets/sounds/question_theme.mp3' },
    { id: 5, name: 'Audio 3', src: '../assets/sounds/win_theme.mp3' },
    { id: 6, name: 'Audio 3', src: '../assets/sounds/wrong_answer_theme.mp3' },
];

function MultiAudioPlayer() {
    const audioRef = useRef(new Audio());
    const [currentAudioId, setCurrentAudioId] = useState(null);

    const toggleAudio = (audio) => {
        const audioElement = audioRef.current;

        if (currentAudioId === audio.id) {
            // Si el audio actual está reproduciéndose, pausarlo
            audioElement.pause();
            setCurrentAudioId(null);
        } else {
            // Cargar nuevo audio
            audioElement.src = audio.src;
            audioElement.play();
            setCurrentAudioId(audio.id);
        }
    };

    return (
        <div>
            {audioList.map((audio) => (
                <div key={audio.id}>
                    <button onClick={() => toggleAudio(audio)}>
                        {currentAudioId === audio.id ? 'Pausar' : `Reproducir ${audio.name}`}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MultiAudioPlayer;

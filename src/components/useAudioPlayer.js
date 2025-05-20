// useAudioPlayer.js
import { useRef } from "react";

export function useAudioPlayer(src) {
    const audioRef = useRef(new Audio(src));

    const play = () => {
        audioRef.current.loop = true;
        audioRef.current.play();
    };

    const stop = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    const pause = () => {
        audioRef.current.pause();
    };

    return { play, stop, pause };
}

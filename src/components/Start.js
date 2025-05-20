import { useRef } from "react";



export default function Start({ setUsername }) {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.value && setUsername(inputRef.current.value);
  };

  return (
    <div className="start">
      <input
        className="startInput"
        placeholder="Escribre tu nombre"
        ref={inputRef}
      />
      <button className="startButton btn btn-outline-light" onClick={handleClick}>
        Comenzar
      </button>
    </div>
  );
}
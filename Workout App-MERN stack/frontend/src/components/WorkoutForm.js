import { useRef, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = ()=>{
    const [title,setTitle] = useState("");
    const [load,setLoad] = useState("");
    const [reps,setReps] = useState("");
    const [isPublic,setIsPublic] = useState(false);
    const [error,setError] = useState(null);
    const [emptyFields,setEmptyFields] = useState([]);

    const {user} = useAuthContext();
    const titleRef = useRef();
    const {dispatch} = useWorkoutsContext()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!user) {
            setError("you must be logged in");
            return;
        }
        const workout = {title,load,reps,isPublic,email:user.email};

        const response = await fetch('/api/workouts',{
            method:'POST',
            headers:{
                "content-Type":"application/json",
                'Authorization':`Bearer ${user.token}`
            },
            body:JSON.stringify(workout)
        });
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            setError(null);
            setEmptyFields([]);
            setIsPublic(false);
            setTitle("");
            setLoad("");
            setReps("");
            dispatch({
                type:"CREATE_WORKOUT",
                payload:json
            });
            titleRef.current.focus();
        }

    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Workout!</h3>

            <label>Exersize Title:</label>
            <input
                type="text"
                onChange={(e)=>setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title')?'error':''}
                ref={titleRef}
            />
            <label>Load in (kg):</label>
            <input
                type="number"
                onChange={(e)=>setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load')?'error':''}
            />
            <label>Reps:</label>
            <input
                type="number"
                onChange={(e)=>setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps')?'error':''}
            />
            <label className="public-label">Public:</label>
            <input 
                className="public-check" 
                type="checkbox"
                onChange={()=>setIsPublic(!isPublic)}
                checked={isPublic}
            ></input>
            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm;
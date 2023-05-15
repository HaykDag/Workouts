import {useState} from 'react';
import { useAuthContext } from "../hooks/useAuthContext"; 


const EditWorkoutForm = ({workout,setEdit,dispatch})=>{
    
    const [title,setTitle] = useState(workout.title);
    const [load,setLoad] = useState(workout.load);
    const [reps,setReps] = useState(workout.reps);
    const [isPublic,setIsPublic] = useState(workout.isPublic);
    const [error,setError] = useState(null)
   
    const {user} = useAuthContext();


    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!user) {
            setError("you must be logged in");
            return;
        }
        const body = {title,load,reps,isPublic};
       
        const response = await fetch('/api/workouts/'+ workout._id,{
            method:'PATCH',
            headers:{
                "content-Type":"application/json",
                'Authorization':`Bearer ${user.token}`
            },
            body:JSON.stringify(body)
        });
        // const json = await response.json();
       
        if(response.ok){
            dispatch({
                type:'EDIT_WORKOUT',
                payload:{
                    body,
                    id:workout._id
                }
            })
            
            setEdit(false);
            setIsPublic(false);
            setTitle("");
            setLoad("");
            setReps("");
        }

    }
    return (
        <form className="edit-form" onSubmit={handleSubmit}>
            <h3>Edit the Workout!</h3>

            <input
                type="text"
                onChange={(e)=>setTitle(e.target.value)}
                value={title}
                
            />
            <input
                type="number"
                onChange={(e)=>setLoad(e.target.value)}
                value={load}
                
            />
            <input
                type="number"
                onChange={(e)=>setReps(e.target.value)}
                value={reps}
                
            />
            <div className='edit-cnt'>
            <label>Public:</label>
            <input  
                type="checkbox"
                onChange={()=>setIsPublic(!isPublic)}
                checked={isPublic}
            ></input>
            </div>
            <button>Save</button>
            <button
                onClick={()=>setEdit(false)}
            >Cancel</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default EditWorkoutForm;
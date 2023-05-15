
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons'
import { useState } from "react";
import EditWorkoutForm from "./EditWorkoutForm";

const WorkoutDetails = ({workout,dispatch})=>{

    const [edit,setEdit] = useState(false);
    const {user} = useAuthContext();

    const handleDelete = async ()=>{
        if(!user){
            return
        }
        const response = await fetch("/api/workouts/" + workout._id,{
            method:"DELETE",
            headers:{
                'Authorization':`Bearer ${user.token}`
            }
        })
        const json = await response.json();
        if(response.ok){
            dispatch({
                type:"DELETE_WORKOUT",
                payload:json._id
            })
        }else{
            throw Error("somethig went wrong")
        }
    }

    return (
        <>
        {!edit && (<div 
            className="workout-cnt"
        >
            <div className="workout-details">
                <h4>{workout.title}</h4>
                <p><strong>load</strong> (kg):{workout.load}</p>
                <p><strong>Reps:</strong> {workout.reps}</p>
                <p>{formatDistanceToNow(new Date(workout.createdAt),{ addSuffix: true })}</p>
                
                
                {(user?user.email===workout.email:false) && <DeleteOutlined
                    className="delete-btn"
                    onClick={handleDelete}
                />}
                {(user?user.email===workout.email:false) && <EditOutlined 
                    className="edit-btn"
                    onClick={()=>setEdit(!edit)}
                />}
                </div>
            </div>
            )}
             {edit &&  <EditWorkoutForm 
                    workout={workout}
                    setEdit={setEdit}
                    dispatch={dispatch}
                    
                />}
        
       </> 
    )
}

export default WorkoutDetails;
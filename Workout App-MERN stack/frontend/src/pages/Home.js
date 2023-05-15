import Header from "../components/Header";
import WorkoutDetails from "../components/WorkoutDetails";
import { useEffect} from 'react';
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";


const Home = ()=>{

    const {workouts,dispatch} = useWorkoutsContext();
    const {user} = useAuthContext();
  
  useEffect(()=>{
    const fetchWorkouts = async ()=>{
        const response = await fetch('/api/workouts',{
          headers:{
            'Authorization':`Bearer ${user.token}`
          }
        });
        const workoutData = await response.json();
        
        if(response.ok){
          dispatch({
            type:"SET_WORKOUTS",
            payload:workoutData
          });
        }else{
          console.log(response.error)
        }
      
    }
    if(user){
      fetchWorkouts();
    }
  },[dispatch,user])
    return(
        <>
            <Header />
            <div className="home">
                <div className="workouts">
                    {workouts && workouts.map(workout=>(
                        <WorkoutDetails 
                            key={workout._id}
                            workout={workout}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
                <WorkoutForm />
            </div>
        </>
    )
}

export default Home;
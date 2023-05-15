import Header from "../components/Header";
import PublicWorkoutDetails from "../components/PublicWorkoutDetails";
import { useEffect, useState} from 'react';

const PublicWorkouts = ()=>{

    const [publicWorkouts,setPublicWorkouts] = useState([])
     

    useEffect(()=>{

        const fetctPublicWorkouts = async ()=>{
            const response = await fetch('/api/workouts/public');
            const data = await response.json();

            if(response.ok){
                setPublicWorkouts(data)
            }else{
                console.log(response.error)
              }
        }
        fetctPublicWorkouts();
    },[]);

    
    return(
        <>
        <Header />
        <div className="workouts">
            {publicWorkouts.map(workout=>(
                <PublicWorkoutDetails
                    key={workout._id}
                    workout={workout}
                    publicWorkouts={publicWorkouts}
                    setPublicWorkouts={setPublicWorkouts}
                />
            ))}
        </div>
        </>
    )
}

export default PublicWorkouts;
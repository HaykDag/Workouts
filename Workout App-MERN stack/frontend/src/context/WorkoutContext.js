import { createContext, useReducer } from "react";


export const WorkoutsContext = createContext();

export const workoutsReducer = (state,action)=>{
    switch(action.type){
        case "SET_WORKOUTS":
            return {
                workouts:action.payload
            }
        case "CREATE_WORKOUT":
            return{
                workouts:[action.payload,...state.workouts]
            }
        case "DELETE_WORKOUT":
            return{
                workouts:state.workouts.filter(w=>w._id!==action.payload)
            }
        case "EDIT_WORKOUT":
                const workouts = state.workouts.map(w=>{
                    return w._id===action.payload.id?{...w,...action.payload.body}:w
                })
            return { workouts }
        default:
            return state;
    }
}

export const WorkoutsContextProvider = ({Children})=>{

    const [state,dispatch] = useReducer(workoutsReducer,{workouts:null});
    return(
        <WorkoutsContext.Provider value={{...state,dispatch}}>
            {Children}
        </WorkoutsContext.Provider>
    )
}
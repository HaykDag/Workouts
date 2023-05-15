import { useAuthContext } from './useAuthContext';
import { useWorkoutsContext } from './useWorkoutsContext';
export const useLogout = ()=>{
    const { dispatch } = useAuthContext();
    const {dispatch: WorkoutDispatch} = useWorkoutsContext();

    const logout = ()=>{
        //remove user from storage
        localStorage.removeItem('user');

        dispatch({type:"LOGOUT"});
        WorkoutDispatch({type:'SET_WORKOUTS',payload:null})
    }
    
    return {logout}
}
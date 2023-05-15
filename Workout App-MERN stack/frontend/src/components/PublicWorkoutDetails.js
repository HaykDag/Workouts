import { EditOutlined, DeleteOutlined,LikeOutlined} from '@ant-design/icons'
import EditPublicWorkoutForm from './EditPublicWorkoutForm';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PublicWorkoutDetails = ({workout,publicWorkouts,setPublicWorkouts})=>{

    const [isCommentVisible,setIsCommentVisible] = useState(false);
    const [isLikeVisible,setIsLikeVisible] = useState(false);
    const [comment,setComment] = useState("");
    const [isEdit,setIsEdit] = useState(false);
    const {user} = useAuthContext();

 
    const handleDelete = async (workout)=>{
        const response = await fetch("/api/workouts/" + workout._id,{
            method:"DELETE",
            headers:{
                'Authorization':`Bearer ${user.token}`
            }
        })
        const newWorkouts = publicWorkouts.filter(w=>w._id!==workout._id)
        if(response.ok){
            setPublicWorkouts(newWorkouts)
        }
    }
    const handleComment = async ({type,workout,i=null,e=null})=>{
        if(e) {
            e.preventDefault();
        }
        let comments;
        if(!user || !user.name){
            console.log("you must login first and Edit your account log out and login again")
            return
        }
        
        if(type==='add'){
            comments = [[user.email,user.name,comment],...workout.comments]
        }
        if(type==='del'){
            if(user.email===workout.comments[i][0] || user.email===workout.email){
                comments = [...workout.comments.slice(0,i),...workout.comments.slice(i+1,workout.comments.length)]
            }else{
                console.log("This is not your comment");
                return
            }
            
        }
         
        const response = await fetch('/api/workouts/public/'+ workout._id,{
            method:'PATCH',
            headers:{
                "content-Type":"application/json",
                'Authorization':`Bearer ${user.token}`
            },
            body:JSON.stringify(comments)
        });
        if(response.ok){
            const newWorkouts = publicWorkouts.map(w=>{
                return w._id===workout._id?{...w,comments:comments}:w
            })
            setPublicWorkouts(newWorkouts);
            setComment("");
            setIsCommentVisible(true);
        }
    }
    const handleLike = async ()=>{
        let likes = []
        if(!user){
            console.log("you must login first")
            return
        }
        //if the user already liked this workout then unlike it otherwise like it.
        if(workout.likes.includes(user.email)){
            likes = workout.likes.filter(like=>like!==user.email)
        }else{
            likes = [user.email,...workout.likes];
        }
        
        const response = await fetch('/api/workouts/public/like/'+ workout._id,{
            method:'PATCH',
            headers:{
                "content-Type":"application/json",
                'Authorization':`Bearer ${user.token}`
            },
            body:JSON.stringify(likes)
        });
        if(response.ok){
            const newWorkouts = publicWorkouts.map(w=>{
                return w._id===workout._id?{...w,likes:likes}:w
            })
            setPublicWorkouts(newWorkouts)
        }
    }
   
    return(
    <>
            {!isEdit?(
            <form key={workout._id} onSubmit={(e)=>handleComment({type:'add',workout,e})}>
                <div className="workout-details-public" >
                <h3><Link to={`/${workout.email}`}>{workout.email}</Link></h3>
                <h4>{workout.title}</h4>
                <p><strong>load</strong> (kg): {workout.load}</p>
                <p><strong>Reps:</strong> {workout.reps}</p>
                <p>{formatDistanceToNow(new Date(workout.createdAt),{ addSuffix: true })}</p>
                <LikeOutlined
                    className={(user && workout.likes.includes(user.email))?'like-btn':'unlike-btn'}
                    onClick={handleLike}
                />
                <span
                    className='likes'
                    onClick={()=>setIsLikeVisible(!isLikeVisible)}
                >{workout.likes.length} <span>&#10084;</span></span>
                {isLikeVisible && workout.likes.map((el,i)=>(
                    <Link to={`/${el}`} key={i}>
                        <p key={i} className='like-list'>{el.slice(0,el.indexOf('@'))}</p>
                    </Link>))}
                <p
                    className="comments"
                    onClick={()=>setIsCommentVisible(!isCommentVisible)}
                >{workout.comments.length} comments</p>
                {isCommentVisible && workout.comments.map((el,i)=>(
                    
                        <p 
                            key={i} 
                            className="comment-text" >{el[1] +' ~ '+ el[2]}
                             {user && <DeleteOutlined 
                                key={i+2}
                                className='del-com'
                                onClick={()=>handleComment({type:'del',workout,i})}
                            />}
                        </p>))}
                           
                {user&&<input
                    className='comment-input' 
                    placeholder='comment'
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />}
                {user&&user.email===workout.email && <DeleteOutlined
                    className="delete-btn-public"
                    onClick={()=>handleDelete(workout)}
                />}
                {user&&user.email===workout.email && <EditOutlined
                    className="edit-btn-public"
                    onClick={()=>setIsEdit(!isEdit)}
                />}
                </div>
            </form>):<EditPublicWorkoutForm
                        workout={workout}
                        setIsEdit={setIsEdit}
                        publicWorkouts={publicWorkouts}
                        setPublicWorkouts={setPublicWorkouts} 
                    />}
    </>
    )
}

export default PublicWorkoutDetails;
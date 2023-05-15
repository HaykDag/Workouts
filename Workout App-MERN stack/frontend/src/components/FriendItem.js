import { Link } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons'
import { useAuthContext } from "../hooks/useAuthContext";


const FriendItem = ({friend=null , req=null, currentUser, setCurrentUser})=>{
    const {user} = useAuthContext();

    const handleDeleteFriend = async ()=>{
        const userResponse = await fetch(`/api/user/${friend}`)
        const passivUser = await userResponse.json();
        
        if(!userResponse.ok){
            console.log(passivUser.error);
            return
        }

        //delete passivUser user from active user's frend's list
        const activeUserFriends = currentUser.friends.filter(f=>f!==friend);
        await userPatch(user,currentUser._id,{friends:activeUserFriends})
        
        //delete active user from passivUser's frend's list
        const passiveUserFriends = passivUser.friends.filter(f=>f!==currentUser.email);
        await userPatch(user,passivUser._id,{friends:passiveUserFriends})

        //keep state in sync
        setCurrentUser({...currentUser,friends:activeUserFriends})
    }
    const handleCancelFriendReq = async ()=>{
        //delete passivUser user from active user's frend's list
        const activeUserFriendReq = currentUser.friendRequest.filter(r=>r!==req);

        await userPatch(user,currentUser._id,{friendRequest:activeUserFriendReq})
        
        setCurrentUser({...currentUser,friendRequest:activeUserFriendReq})
    }

    const handleAcceptFriendReq = async ()=>{

        //First delete the Request from the Active user data
        const activeUserFriendReq = currentUser.friendRequest.filter(r=>r!==req);
        await userPatch(user,currentUser._id,{friendRequest:activeUserFriendReq})
        
        //get passiv user's friend list
        const userResponse = await fetch(`/api/user/${req}`)
        const passivUser = await userResponse.json();
        
        //add passivUser  to active user's frend's list
        const activeUserFriends = [req,...currentUser.friends];
        await userPatch(user,currentUser._id,{friends:activeUserFriends});
        
        //Add active user to passivUser's frend's list
        const passiveUserFriends = [currentUser.email,...passivUser.friends];
        await userPatch(user,passivUser._id,{friends:passiveUserFriends});
        
        setCurrentUser({...currentUser,friends:activeUserFriends,friendRequest:activeUserFriendReq})
    }
    return(
    
        <li className="friendsList">
            {!req &&
            <>
                <Link to={`/${friend}`}>
                    <span>{friend}</span>
                </Link>
                {user?.email===currentUser?.email && <span><DeleteOutlined onClick={handleDeleteFriend}/></span>}
            </>}
            
            {req && user?.email===currentUser?.email &&
            <div className="friendReq">
                <p>Friend requests</p>
                    <Link to={`/${req}`}>
                    <span>{req}</span>
                    </Link>
                <div className="friendReq2" >
                    <span
                        onClick={handleAcceptFriendReq}
                    >&#43;</span>
                    <span
                        onClick={handleCancelFriendReq}
                    >&#45;</span>
                </div>
            </div>
            }
            
        </li>
           
        
    )
}

export default FriendItem;

const userPatch = async (user,id,body)=>{
    
    const response = await fetch('/api/user/'+ id,{
        method:"PATCH",
        headers:{
            'Authorization':`Bearer ${user.token}`,
            'Content-Type':'Application/json'
            },
        body:JSON.stringify(body)
    })
    const json = await response.json();
    if(!response.ok){
        console.log(json.error);
        return;
    }
}
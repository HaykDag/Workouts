import FriendItem from "./FriendItem";

const Friends = ({currentUser, setCurrentUser })=>{
    
    return (<>
        {currentUser?.friendRequest?.map((req,i)=>(
            <ul key={i} >
                <FriendItem currentUser={currentUser}  req={req} setCurrentUser={setCurrentUser} />
            </ul>
        ))}
        {currentUser?.friends?.length>0?currentUser.friends?.map((friend,i)=>(
            <ul key={i} >
                <FriendItem currentUser={currentUser}  friend={friend} setCurrentUser={setCurrentUser} />
            </ul>
        )):
        <p className="no-friends">No friends!</p>}
        </>
    )
}

export default Friends;
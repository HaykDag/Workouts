import { useEffect, useState } from "react";
import {EditOutlined} from '@ant-design/icons'
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Friends from "../components/Friends";
import { useAuthContext } from "../hooks/useAuthContext";

const User = ()=>{
    const [isEdit,setIsEdit] = useState(false);
    const [isStatusEdit,setIsStatusEdit] = useState(false);
    const [status,setStatus] = useState("")
    const [name,setName] = useState("");
    const [lastName,setLastName] = useState("");
    const [currentUser,setCurrentUser] = useState("");
    const [sidenavWidth,setSideNavWidth] = useState("15px");
    const params = useParams();

    const { user } = useAuthContext();

    useEffect(()=>{
        const fetchUser = async ()=>{
            const response = await fetch(`/api/user/${params.email}`)
            const userData = await response.json();
            
            if(response.ok){
                setCurrentUser(userData)
                setStatus(userData.status)
                setName(userData.name)
                setLastName(userData.lastName)
            }else{
                console.log(userData.error)
            }
        }
        fetchUser();
        
    },[params.email])

    const handleEdit = async (e)=>{
        e.preventDefault();
        
        const response = await fetch('/api/user/'+ currentUser._id,{
            method:"PATCH",
            headers:{
                'Authorization':`Bearer ${user.token}`,
                'Content-Type':'Application/json'
                },
            body:JSON.stringify({name,lastName})
        })
        // const json = await response.json();
    
        if(response.ok){
            
            const newUser = {name,lastName,email:user.email,token:user.token}
            //save the user to local storage
            localStorage.setItem('user',JSON.stringify(newUser));

            setCurrentUser({...currentUser,name,lastName});
            setIsEdit(false);
            
        }else{
            console.log(response.error)
        }
    }
    const handleStatus = async (e)=>{
        e.preventDefault();

        const response = await fetch('/api/user/'+ currentUser._id,{
            method:"PATCH",
            headers:{
                'Authorization':`Bearer ${user.token}`,
                'Content-Type':'Application/json'
                },
            body:JSON.stringify({status})
        })
        if(response.ok){
            setCurrentUser({...currentUser,status});
            setIsStatusEdit(false);
        }else{
            console.log(response.err)
        }
    }

    const handleFriendReq = async ()=>{
        console.log("oh no")
        const passivUserFriendsRequest = [user.email,...currentUser.friendRequest]
        
        const response = await fetch('/api/user/'+ currentUser._id,{
            method:"PATCH",
            headers:{
                'Authorization':`Bearer ${user.token}`,
                'Content-Type':'Application/json'
                },
            body:JSON.stringify({friendRequest:passivUserFriendsRequest})
        })
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
            return;
        }
        
        setCurrentUser({...currentUser,friendRequest:passivUserFriendsRequest})
        
    }

    return(<>
        <Header />
        <div style={{width:sidenavWidth}} className="sidenav">
            <Friends currentUser={currentUser} setCurrentUser={setCurrentUser} />
                {sidenavWidth==="15px" && <button 
                    className="openbtn"
                    onClick={()=>setSideNavWidth("200px")}
                >&#11160;</button>}
                {sidenavWidth==="200px" && <button
                className="closebtn"
                onClick={()=>setSideNavWidth("15px")}
            >&#10146;</button>}
        </div>
            
        <div className="user-cnt">
            {!isEdit?<form 
                className="user-info"
                onSubmit={handleStatus}
            >
                {!isStatusEdit?<h1 className="status">
                    {currentUser.status}{user?.email===currentUser?.email && 
                    <EditOutlined
                        className="status-edit-btn" 
                        onClick={()=>setIsStatusEdit(!isStatusEdit)}
                    />}
                </h1>
                :
                <input value={status} onChange={(e)=>setStatus(e.target.value)} />}
                
                <p className="user-name">{currentUser.name}</p>
                <p className="user-name">{currentUser.lastName}</p>
                <div className="friend-req">

                    {user && user?.email!==currentUser?.email && !currentUser.friends?.includes(user?.email) && (
                            <button
                                disabled={currentUser?.friendRequest?.includes(user?.email)?true:false}    
                                onClick={handleFriendReq}
                            >'Send Friend request'</button>
                    )}
                </div>
                
                {user && user?.email===currentUser?.email && 
                <div className="edit-account-cnt">
                    <EditOutlined 
                        className="edit-icon"
                        onClick={(e)=>setIsEdit(!isEdit)}
                    />
                    <p>Edit acount</p>
                </div>}    
            </form>
            :
            <form 
                className="edit-user-info"
                onSubmit={handleEdit}

            >
                <label>Name:</label>
                 <input 
                    type="text"
                    placeholder="name"
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                />
                <label>Lastname:</label>
                 <input 
                    type="text"
                    placeholder="Lastname"
                    onChange={(e)=>setLastName(e.target.value)}
                    value={lastName}
                />
                <button>Save</button>
                <button onClick={()=>setIsEdit(!isEdit)}>Cancel</button>
            </form>}
        </div>
        </>
    )
}

export default User;


import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = ()=>{
    const {logout} = useLogout();
    const {user} = useAuthContext();
    const handleClick = ()=>{
        logout();
    }
    return (
        <header>
            <Link to='/'>
            <h1>My Workouts</h1>
            </Link>
            <Link to='/public'><h1>Public Workouts</h1></Link>
            <nav>
                {user?
                    <div>
                        <Link to={`/${user.email}`}><span>{user.email}</span></Link>
                        <button
                            onClick={handleClick}
                        >log out</button>
                    </div>
                :
                    <div>
                        <Link to='/login'>Login</Link>
                        <Link to='/signup'>Signup</Link>
                    </div>
                }
            </nav>
        </header>
    )
}

export default Header;
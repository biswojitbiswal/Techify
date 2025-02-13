import React, { useState } from 'react'
import { useAuth } from '../../Store/Auth'
import './Profile.css'
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';

function Username() {
    const {user, authorization, refreshUser} = useAuth();

    const [isEditable, setIsEditable] = useState(false)
    const [username, setUsername] = useState(user.name);

    const handleEditIcon = async() => {
        if(isEditable){
            try {
                const response = await fetch(`${BASE_URL}/api/techify/user/username`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authorization
                    },
                    body: JSON.stringify({username}),
                });
                const data = await response.json();
                console.log(data);
    
                if(response.ok){
                    setIsEditable((prev) => !prev);
                    toast.success("Username Changed");
                    refreshUser();
                }
            } catch (error) {
                console.log(error);
                setIsEditable((prev) => !prev)
            }
        } else {
            setIsEditable((prev) => !prev)
        }

    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    return (
        <div className='profile-username'>
            <input type="text" className={`username-input my-1 ${isEditable ? 'editable-input' : 'readonly-input'}`} readOnly={!isEditable} value={username} onChange={handleUsername} />
            <button onClick={handleEditIcon} className='fs-3 username-btn'>{isEditable ? '📁' : '✏️'}</button>{/* ✏️ */}
        </div>
    )
}

export default Username

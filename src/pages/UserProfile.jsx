import axios from 'axios'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'
import { BiCheck } from 'react-icons/bi'
import { UserContext } from '../context/userContext'

const UserProfile = () => {
    const [avatarTouched, setAvatarTouched] = useState(false)
    const [avatar, setAvatar] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const { currentUser } = useContext(UserContext)
    const token = currentUser?.token;

    const redirectToLogin = useCallback(() => {
        if (!token) {
            navigate('/login')
        }
    }, [navigate, token])

    useEffect(() => {
        redirectToLogin()
    }, [redirectToLogin])

    const { id } = useParams()

    const fetchUserDetails = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })
            const { name, email, avatar } = response.data
            setName(name)
            setEmail(email)
            setAvatar(avatar)
        } catch (error) {
            console.error("Error fetching user details:", error)
            setError(error.response?.data?.message || 'Impossible de charger les détails de l\'utilisateur')
        }
    }, [id, token])

    useEffect(() => {
        fetchUserDetails()
    }, [fetchUserDetails])

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        setAvatarFile(file)
        setAvatar(URL.createObjectURL(file))
        setAvatarTouched(true)
    }

    const changeAvatarHandler = async () => {
        if (!avatarFile) {
            setError('Veuillez sélectionner un fichier')
            return
        }

        try {
            const postData = new FormData()
            postData.append('avatar', avatarFile)

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            setAvatar(response.data.avatar)
            setAvatarTouched(false)
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors du changement d\'avatar')
            console.error(error)
        }
    }

    const updateUserDetail = async (e) => {
        try {
            e.preventDefault()
            const userData = new FormData()
            userData.set('name', name)
            userData.set('email', email)
            userData.set('currentPassword', currentPassword)
            userData.set('newPassword', newPassword)
            userData.set('confirmNewPassword', confirmNewPassword)

            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
                withCredentials: true, headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                navigate('/logout')
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <section className="profile">
            <div className="container profile__container">
                <Link to={`/myposts/${currentUser?.id}`} className='btn'>My Posts</Link>

                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile__avatar">
                            <img
                                src={`${process.env.REACT_APP_ASSET_URL}/uploads/${avatar}`}
                                alt="Profil"
                                onError={(e) => {
                                    console.error("Image load error", e)
                                    e.target.src = '/default-avatar.png'
                                }}
                            />
                        </div>
                        <form className='avatar__form'>
                            <input
                                type="file"
                                id='avatar'
                                name='avatar'
                                onChange={handleAvatarChange}
                                accept="image/png, image/jpg, image/jpeg"
                            />
                            <label htmlFor="avatar" onClick={() => setAvatarTouched(true)}>
                                <FiEdit />
                            </label>
                        </form>
                        {avatarTouched && (
                            <button
                                type="button"
                                className='profile__avatar-btn'
                                onClick={changeAvatarHandler}
                            >
                                <BiCheck />
                            </button>
                        )}
                    </div>

                    <h1>{name}</h1>

                    <form className='form profile__form' onSubmit={updateUserDetail}>
                        {error && <p className='form__error-message'>{error}</p>}
                        <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
                        <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder='Current Password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                        <button type="submit" className='btn primary'>Update my details</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserProfile
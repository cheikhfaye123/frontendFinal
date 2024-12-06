import { useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentUser(null)
    navigate('/login')
  }, [setCurrentUser, navigate])

  return null
}

export default Logout
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { UserContext } from '../context/userContext'

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { setCurrentUser } = useContext(UserContext)

    const changeHandler = (e) => {
        setUserData(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        })
    }

    const loginUser = async (e) => {
        e.preventDefault();
        setError('')
        setIsLoading(true)

        try {
            console.log("Tentative de connexion à:", `${process.env.REACT_APP_BASE_URL}/users/login`);
            console.log("Données envoyées:", userData);

            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/users/login`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Réponse:", response);
            const user = response.data;

            if (!user) {
                setError("Vérifiez vos identifiants");
                return;
            }

            setCurrentUser(user);
            navigate("/");
        } catch (err) {
            console.error("Erreur complète:", err);
            setError(err?.response?.data?.message || "Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="login">
            <div className="container">
                <h2>Sign In</h2>
                <form onSubmit={loginUser} className='form login__form'>
                    {error && <p className="form__error-message">{error}</p>}
                    <input
                        type="email"
                        placeholder='Email'
                        name='email'
                        value={userData.email}
                        onChange={changeHandler}
                        autoFocus
                        required
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        value={userData.password}
                        onChange={changeHandler}
                        required
                    />
                    <button
                        type="submit"
                        className='btn primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Login'}
                    </button>
                </form>
                <small>Don't have an account? <Link to="/register">sign up</Link></small>
            </div>
        </section>
    )
}

export default Login
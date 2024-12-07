import React, { useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../context/userContext';

const DeletePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const removePost = async () => {
            try {

                console.log("URL de suppression:", `${process.env.REACT_APP_BASE_URL}/posts/${id}`);
                console.log("Token:", token);

                const response = await axios({
                    method: 'delete',
                    url: `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    navigate('/');
                }
            } catch (error) {
                console.error("Erreur complète:", error);

                if (error.response) {
                    console.log("Réponse d'erreur:", error.response.data);
                }
                navigate('/');
            }
        }

        removePost();
    }, [id, token, navigate]);

    return (
        <div className="center" style={{ padding: "20px" }}>
            <h2>Suppression du post en cours...</h2>
        </div>
    );
}

export default DeletePost;
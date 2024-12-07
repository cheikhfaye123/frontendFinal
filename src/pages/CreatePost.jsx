import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Uncategorized')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { currentUser } = useContext(UserContext)
    const token = currentUser?.token;

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"]

    const createPost = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!title || !description || !thumbnail) {
            setError('Veuillez remplir tous les champs et choisir une image');
            setIsLoading(false);
            return;
        }

        const postData = new FormData();
        postData.set('title', title);
        postData.set('category', category);
        postData.set('description', description);
        postData.set('thumbnail', thumbnail);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/posts`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response?.status === 201) {
                navigate('/');
            }
        } catch (err) {
            console.error("Erreur lors de la création du post:", err);
            const errorMessage = err?.response?.data?.message;
            setError(errorMessage || "Erreur lors de la création du post. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="create-post">
            <div className="container">
                <h2>Create Post</h2>
                {error && <p className="form__error-message">{error}</p>}
                <form onSubmit={createPost} className='form create-post__form'>
                    <input
                        type="text"
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <select
                        name='category'
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        {POST_CATEGORIES.map(cat =>
                            <option key={cat}>{cat}</option>
                        )}
                    </select>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        value={description}
                        onChange={setDescription}
                    />
                    <input
                        type="file"
                        onChange={e => setThumbnail(e.target.files[0])}
                        accept="png, jpg, jpeg"
                        required
                    />
                    <button
                        type="submit"
                        className='btn primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default CreatePost
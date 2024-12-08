import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'

const PostItem = ({ postID, thumbnail, category, title, description, authorID, createdAt }) => {
    const [showFullText, setShowFullText] = useState(false);

    const truncatedDescription = description.substring(0, 100);
    const isTruncated = description.length > 100;

    return (
        <article className="post">
            <div className="post__thumbnail">
                <img src={`${process.env.REACT_APP_ASSET_URL}/uploads/${thumbnail}`} alt={title}
                    onError={(e) => {
                        console.log("Erreur de chargement de l'image:", thumbnail)
                    }} />

            </div>
            <div className="post__content">
                <Link to={`/posts/${postID}`}>
                    <h3>{title}</h3>
                </Link>

                {!showFullText ? (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: truncatedDescription }} />
                        {isTruncated && (
                            <button
                                onClick={() => setShowFullText(true)}
                                className="btn sm"
                            >
                                Lire plus
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: description }} />
                        <button
                            onClick={() => setShowFullText(false)}
                            className="btn sm"
                        >
                            Réduire
                        </button>
                    </>
                )}

                <div className="post__footer">
                    <PostAuthor authorID={authorID} createdAt={createdAt} />
                    <Link to={`/posts/${postID}`} className="btn sm">
                        Voir le post complet
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default PostItem
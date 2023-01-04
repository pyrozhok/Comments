import React from "react";
import moment from "moment";
/* import "moment/locale/ru"; */

import TComment from "src/shared/interfaces/comment";
import TAuthor from "src/shared/interfaces/author";
import "./comment.css";
moment.locale();
function Comment({
    comment,
    replies,
    authors,
}: {
    comment: TComment;
    replies: TComment[];
    authors: TAuthor[];
}) {
    const {id, created, text, author, parent, likes} = comment;
    const getAuthor = (authorId: number) => {
        return authors.find((author) => author.id === authorId);
    };

    const formatDate = (date: string) => {
        const now = moment();
        const difference = now.diff(date, "hours");
        if (difference < 24) {
            return moment(date).fromNow();
        }
        return moment(date).format("DD.MM.YYYY, HH:mm:ss");
    };

    return (
        <div className="comment">
            <div>
                Comment Id <b>{id}</b>
            </div>
            <div className="comment-author">
                Author: {getAuthor(author)?.name}
            </div>
            <div>Likes: {likes}</div>
            <div>Created at: {formatDate(created)}</div>
            <span>{text}</span>
            <div>
                Parent id: <u>{parent}</u>
            </div>
            <div>
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                replies={[]}
                                authors={authors}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;

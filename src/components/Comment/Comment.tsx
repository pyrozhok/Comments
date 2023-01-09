import React from "react";
import moment from "moment";

import TComment from "src/shared/interfaces/comment";
import TAuthor from "src/shared/interfaces/author";

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
    const {created, text, author, likes} = comment;
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
    const authorInfo = getAuthor(author);
    return (
        <div className="mt-6 flex flex-col lg:mt-8">
            <div className="relative flex flex-row">
                <div id="author-thumbnail" className="flex-none">
                    {/* Avatar */}
                    <a href="#" className="mr-5 inline-block">
                        <img
                            className="w-10 h-10 lg:w-[68px] lg:h-[68px] object-cover rounded-full"
                            src={authorInfo?.avatar}
                            alt={authorInfo?.name}
                        />
                    </a>
                </div>
                {/* Main */}
                <div id="main" className="flex flex-col flex-1">
                    <div id="header">
                        <h3 className="font-bold">
                            <a href="#">{authorInfo?.name}</a>
                        </h3>
                        <span className="text-[#8297AB]">
                            {formatDate(created)}
                        </span>
                    </div>
                    <div id="comment-text" className="inline-flex w-full">
                        {/* Workoraund TailwindCss break-words bug */}
                        <span
                            className="break-words"
                            style={{wordBreak: "break-word"}}
                        >
                            {text}
                        </span>
                    </div>
                </div>
                {/* Likes count */}
                <div id="likes">
                    <span className="before:content-['❤️'] font-bold cursor-pointer">
                        {likes}
                    </span>
                </div>
            </div>
            {/* Replies */}
            <div id="replies">
                {replies.length > 0 && (
                    <div className="mt-6 pl-5">
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

import React, {useState, useEffect, useCallback} from "react";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import Comment from "./Comment";
import axios from "axios";
import axiosRetry from "axios-retry";
import TComment from "src/shared/interfaces/comment";
import TAuthor from "src/shared/interfaces/author";
import "./listComments.css";
interface IPagination<T> {
    pagination: {
        page: number;
        size: number;
        total_pages: number;
    };
    data: T;
}
/* Workaround agains networkErrorOnce() method at useMockAdapter.ts*/
axiosRetry(axios, {
    retries: 3,
    shouldResetTimeout: true,
    retryCondition: (_error) => true, // retry no matter what
});

type CommentsAtPage = {
    page: number;
    comments: TComment[];
};

function ListComments() {
    const [displayedComments, setDisplayedComments] = useState<CommentsAtPage>({
        page: 1,
        comments: [],
    });
    const [commentsByPage, setCommentsByPage] = useState(new Map());
    const [totalCount, setTotalCount] = useState({comments: 0, likes: 0});
    const [authors, setAuthors] = useState<TAuthor[]>([]);
    const [loading, setLoading] = useState(false);

    const loadNextPage = () => {
        setDisplayedComments({
            page: displayedComments.page + 1,
            comments: [
                ...displayedComments.comments,
                ...commentsByPage.get(displayedComments.page + 1),
            ],
        });
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                setLoading(true);
                let commentsData = [] as TComment[];
                let likes = 0;

                const map = new Map();
                const res: IPagination<any> = await getCommentsRequest(1);
                if (res) {
                    commentsData = [...commentsData, ...res.data];
                    map.set(1, res.data);

                    for (let i = 2; i <= res.pagination.total_pages; i++) {
                        const resNext = await getCommentsRequest(i);
                        commentsData = [...commentsData, ...resNext.data];
                        map.set(i, resNext.data);
                    }

                    for (let comment of commentsData) {
                        likes += comment.likes;
                    }

                    setDisplayedComments({page: 1, comments: map.get(1)});
                    setTotalCount({comments: commentsData.length, likes});
                    setCommentsByPage(map);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
                if (axios.isAxiosError(error)) console.log(error.message);
            }
        };

        const getAuthors = async () => {
            try {
                setLoading(true);
                const res = await getAuthorsRequest();
                if (res) {
                    setAuthors(res);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);

                if (axios.isAxiosError(error)) console.log(error.message);
            }
        };

        getComments();
        getAuthors();
    }, []);

    const rootComments = displayedComments.comments?.filter(
        (comment) => comment.parent === null,
    ) as TComment[];

    const getReplies = (commentId: number) => {
        return displayedComments.comments
            .filter((comments) => comments.parent === commentId)
            .sort(
                (a, b) =>
                    new Date(a.created).getTime() -
                    new Date(b.created).getTime(),
            );
    };

    return (
        <div>
            <h1>
                {totalCount.comments} comments and {totalCount.likes} likes
            </h1>
            <div className="comments">
                {rootComments?.map((comment: TComment) => (
                    <Comment
                        key={comment.id}
                        authors={authors}
                        comment={comment}
                        replies={getReplies(comment.id)}
                    />
                ))}
            </div>
            {
                /* page */ displayedComments.page <= 2 && (
                    <div className="next-page">
                        <button
                            onClick={() => {
                                loadNextPage();
                            }}
                        >
                            Загрузить еще
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default ListComments;

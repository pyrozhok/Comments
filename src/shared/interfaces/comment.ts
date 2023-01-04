type TComment = {
    id: number;
    created: string;
    text: string;
    author: number;
    parent: number | null;
    likes: number;
    children?: TComment[] | null;
};
export default TComment;

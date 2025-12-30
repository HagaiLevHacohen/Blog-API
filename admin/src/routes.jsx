import App from "./components/App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Posts from "./components/Posts.jsx";
import Post from "./components/Post.jsx";
import NewPostForm from "./components/NewPostForm.jsx";
import Login from "./components/Login.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "posts/new",
        element: <NewPostForm />,
      },
      {
        path: "posts/:postId",
        element: <Post />,
      },
    ],
  },
];

export default routes;
import App from "./components/App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Home from "./components/Home.jsx";
import Posts from "./components/Posts.jsx";
import Post from "./components/Post.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            element: <Posts />,
          },
          {
            path: ":postId",
            element: <Post />,
          },
        ],
      },
    ],
  },
];

export default routes;
import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Codes from './Codes.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<App />),
  },
  {
    path: "/codes",
    element: (<Codes />),
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

import React from "react";
import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import IndexPage from "./Pages/Index";
import ClientePage from "./Pages/Cliente";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
      <Route exact path="/" element={<IndexPage/>}/>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/cliente/:id" element={<ClientePage/>}/>
    </Routes>
	</BrowserRouter>
);

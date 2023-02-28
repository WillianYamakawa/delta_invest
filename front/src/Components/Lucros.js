import React, { useEffect, useState } from "react";
import "./lucros.css";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";
import { CircularProgress } from "@mui/material";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";

export default function Lucros() {
	const [state, setState] = useState("loading");
	const navigate = useNavigate();

	useEffect(() => {
		async function a() {
			const res = await fetcher("/lucro/get");
			if (res.err) {
				if (res.err === 401) {
					navigate("/");
				} else {
					setState("error");
				}
			} else {
				setState({ data: res.result });
			}
		}
		a();
	}, []);

	console.log(state);

	return state === "error" ? (
		<div className="modal-error lucro-error">
			<ReportGmailerrorredSharpIcon fontSize="inherit" />
			<p>Houve um erro! Por favor informe um administrador urgente!</p>
		</div>
	) : state === "loading" ? (
		<div className="modal-loading lucro-loading">
			<CircularProgress size={70} />
		</div>
	) : (
		<div className="container-lucros">
			<h1>Histórico de Lucros</h1>
			<div className="lucro-container">
				<ul>
					{state?.data.map((el) => (
						<li key={el.id}>
							<div className="lucro-item">
								<TrendingUpIcon fontSize="inherit" />
								<h3>{el.date}</h3>
								<p>Rendeu {el.valor.toFixed(2)}%</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

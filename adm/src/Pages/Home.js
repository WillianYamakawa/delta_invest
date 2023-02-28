import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import ListItem from "../Components/ListItem";
import fetcher from "../data/fetcher";
import Lucro from "../Components/Lucro";
import { CircularProgress } from "@mui/material";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";

export default function HomePage() {
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		a();
	}, []);

	async function a() {
		const res = await fetcher("/cliente/all");
		if (res.err) {
			if (res.err === 401) {
				return navigate("/");
			} else {
				return setData("error");
			}
		}
		console.log(res.result);
		setData(res.result);
	}

	function logout() {
		sessionStorage.removeItem("clientToken");
		navigate("/");
	}

	function setError() {
		setData("error");
	}

	return (
		<div className="main">
			<nav>
				<div className="nav-img-container">
					<img src="./dec.png" alt="" />
				</div>
				<Lucro />
				<div className="account-nav" onClick={logout}>
					<p className="user-name">Logout</p>
					<LogoutIcon />
				</div>
			</nav>
			{data == null ? (
				<div className="div-flex">
					<CircularProgress size={100} />
				</div>
			) : data === "error" ? (
				<div className="div-flex">
					<ReportGmailerrorredSharpIcon fontSize="inherit" />
					<p>Erro! Por favor avise um administrador urgente!</p>
				</div>
			) : (
				<div className="content">
					<p>Usuarios</p>
					<Link to="/cliente/new">
						<button className="new-user">Novo Usuario</button>
					</Link>

					<ul>
						{data.map((el) => (
							<ListItem
								key={el.id}
								name={el.nome}
								CPF={el.CPF}
								active={Boolean(el.ativo)}
								userId={el.id}
								pending={Boolean(el.pedidos)}
								onError={setError}
								onSuccess={a}
								saldo={el.saldo}
								PIX={el.PIX}
								banco={`${el.agencia_banco}-${el.conta_banco}`}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

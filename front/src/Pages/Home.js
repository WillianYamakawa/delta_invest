import React, { useEffect, useState } from "react";
import "./home.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import Home from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import {
	Area,
	AreaChart,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Modal } from "@mui/material";
import Lucros from "../Components/Lucros";
import SaqueNav from "../Components/SaqueNav";
import fetcher from "../data/fetcher";
import { CircularProgress } from "@mui/material";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";

export default function HomePage() {
	const [data, setData] = useState(null);
	const [period, setPeriod] = useState("month");
	const [modalLucro, setModalLucro] = useState(false);

	const navigate = useNavigate();


	useEffect(() => {
		async function a() {
			let dEth = null;
			let ethPrice = null;

			try {
				const rawEth = await fetcher("/eth");
				const jsonEth = rawEth.result;
				const rawDolar = await fetch(
					"https://economia.awesomeapi.com.br/json/last/USD-BRL,ETH-BRL"
				);
				const jsonDolar = await rawDolar.json();
				const dolar = jsonDolar.USDBRL.bid;
				ethPrice = jsonDolar.ETHBRL.bid;
				dEth = formatData(jsonEth, dolar);
			} catch (e) {
				console.log("Erro ao carregar TP API: " + e);
			}

			const res = await fetcher("/cliente/info");
			let info = null;
			if (res.err) {
				if (res.err === 401) {
					navigate("/");
				} else {
					return setData("error");
				}
			} else {
				info = res.result;
			}

			const d = {
				eth: dEth,
				ethPrice: ethPrice || 0,
				info: info,
			};

			setData(d);
		}

		a();
	}, []);

	const data_contrato = new Date(data?.info?.data_inicio_contrato);

	function setWeek() {
		setPeriod("week");
	}

	function setMonth() {
		setPeriod("month");
	}

	function setYear() {
		setPeriod("year");
	}

	function openModalLucro() {
		setModalLucro(true);
	}
	function closeModalLucro() {
		setModalLucro(false);
	}

	function formatData(data, dolar) {
		const formatted = data.result["3600"].map((el) => {
			return { t: el[0], valor: el[4] * dolar };
		});
		const now = new Date();
		const lastWeek = now.setDate(now.getDate() - 7) / 1000;
		const lastMonth = now.setMonth(now.getMonth() - 1) / 1000;
		return {
			w: formatted
				.filter((el) => el.t >= lastWeek)
				.map((el) => {
					return {
						valor: Math.floor(el.valor),
						t: new Date(el.t * 1000).toLocaleString("pt-br"),
					};
				}),
			m: formatted
				.filter((el) => el.t >= lastMonth)
				.map((el) => {
					return {
						valor: Math.floor(el.valor),
						t: new Date(el.t * 1000).toLocaleDateString("pt-br"),
					};
				}),
			y: formatted.map((el) => {
				return {
					valor: Math.floor(el.valor),
					t: new Date(el.t * 1000).toLocaleDateString("pt-br"),
				};
			}),
		};
	}

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<p className="valor">{`R$${payload[0].value}.00`}</p>
					<p className="label">{label}</p>
				</div>
			);
		}

		return null;
	};

	function logout() {
		sessionStorage.removeItem("clientToken");
		navigate("/");
	}

	let dataEth = [];
	if (data?.eth) {
		dataEth =
			period === "week"
				? data.eth.w
				: period === "month"
				? data.eth.m
				: data.eth.y;
	}

	return data == null ? (
		<>
			<div className="div-center">
				<CircularProgress size={100}/>
			</div>
		</>
	) : data === "error" ? (
		<>
			<div className="div-center div-center-error">
				<ReportGmailerrorredSharpIcon fontSize="inherit"/>
				<p>Houve um erro! Por favor informe um administrador urgente!</p>
			</div>
		</>
	) : (
		<>
			<Modal open={modalLucro} onClose={closeModalLucro}>
				<div className="modal-lucro">
					<Lucros />
				</div>
			</Modal>
			<div className="left" id="left-scape">
				<img className="d" src="./d.png" alt="" />
				<img className="detail-left" src="./det.png" alt="" />
				<Home className="home-icon" fontSize="large" />
			</div>
			<div className="main">
				<nav>
					<div className="div-logo-mobile">
						<img className="logo-mobile" src="./d.png" alt="" />
					</div>

					<h2 className="welcome">
						Bem vindo, {data.info.nome.split(" ")[0]}!
					</h2>
					<SaqueNav />
					<div className="account-nav" onClick={logout}>
						<p className="user-name">Logout</p>
						<LogoutIcon />
					</div>
				</nav>
				<div className="content">
					<p className="mercado top">Visão geral</p>
					<div className="cards">
						<div className="card">
							<div className="card-icon">
								<div className="card-icon-container">
									<AccountBalanceWalletOutlinedIcon fontSize="inherit" />
								</div>
							</div>
							<div className="card-content">
								<h1 className="card-title">R$ {data.info.saldo.toFixed(2)}</h1>
								<p className="card-sub">Saldo atual</p>
							</div>
						</div>
						<div className="card">
							<div className="card-icon">
								<div className="card-icon-container">
									<PaidOutlinedIcon fontSize="inherit" />
								</div>
							</div>
							<div className="card-content">
								<h1 className="card-title">R$ {data.info.rendeu.toFixed(2)}</h1>
								<p className="card-sub">Valor ja rendido</p>
							</div>
						</div>
						<div className="card">
							<div className="card-icon">
								<div className="card-icon-container">
									<RequestPageOutlinedIcon fontSize="inherit" />
								</div>
							</div>
							<div className="card-content">
								<h1 className="card-title">
									R$ {data.info.valor_contrato.toFixed(2)}
								</h1>
								<p className="card-sub">Valor Contrato</p>
							</div>
						</div>
						<div className="card">
							<div className="card-icon">
								<div className="card-icon-container">
									<DateRangeOutlinedIcon fontSize="inherit" />
								</div>
							</div>
							<div className="card-content">
								<h1 className="card-title">{`${data_contrato?.getDate()}/${data_contrato?.getMonth() + 1}/${data_contrato?.getFullYear()}`}</h1>
								<p className="card-sub">Data Inicio Contrato</p>
							</div>
						</div>
					</div>
					<div className="eth-header">
						<div className="opt-text">
							<p className="mercado">Resumo Mercado</p>
							<p className="mercado-eth">
								Ethereum: R${(data.ethPrice * 1000).toFixed(2)}
							</p>
						</div>
						<div className="opt-period">
							<div className="buttons-period">
								<button
									onClick={setWeek}
									className={
										"btn-period btn-1" + (period === "week" ? " active" : "")
									}
								>
									Week
								</button>
								<button
									onClick={setMonth}
									id="focus-scape"
									className={
										"btn-period btn-2" + (period === "month" ? " active" : "")
									}
								>
									Month
								</button>
								<button
									onClick={setYear}
									className={
										"btn-period btn-3" + (period === "year" ? " active" : "")
									}
								>
									Year
								</button>
							</div>
						</div>
					</div>
					<div className="graph">
						{data.eth == null ? (
							<div className="erro-graph">
								<h1>
									Erro ao Carregar o grafico, por favor avise o administrador
									imediatamente!
								</h1>
							</div>
						) : (
							<ResponsiveContainer
								width="100%"
								height={window.innerWidth > 1000 ? 500 : 250}
							>
								<AreaChart
									data={dataEth}
									margin={{ top: 10, right: 0, left: -60, bottom: 0 }}
								>
									<defs>
										<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#0081dd" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#0081dd" stopOpacity={0} />
										</linearGradient>
									</defs>
									<Tooltip content={<CustomTooltip />} />
									<XAxis dataKey="t" display="none" />
									<YAxis
										domain={["dataMin - 500", "dataMax + 100"]}
										display="none"
									/>
									<Area
										isAnimationActive={window.innerWidth > 1000 ? true : false}
										type="monotone"
										dataKey="valor"
										stroke="#0081dd"
										fillOpacity={1}
										fill="url(#colorUv)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>
				<button onClick={openModalLucro} className="botao-lucros">
					histórico de Lucros
				</button>
			</div>
		</>
	);
}

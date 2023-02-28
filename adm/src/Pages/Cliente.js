import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./cliente.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { CircularProgress, TextField } from "@mui/material";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";

export default function ClientePage() {
	const params = useParams();
	let state = null;
	let id = null;
	if (params.id === "new") {
		state = "new";
	} else {
		id = Number(params.id);
		state = "edit";
	}

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState({});

	useEffect(() => {
		if (state == "new") return;
		async function a() {
			const res = await fetcher("/cliente/id/" + id);
			if (res.err) {
				if (res.err === 401) {
					return navigate("/");
				} else {
					return setError(true);
				}
			}
			res.result.password = undefined;
			setData(res.result);
		}
		a();
	}, []);

	async function submit() {
		if(loading) return
		if(data.password?.length == 0){
			delete data.password;
		}
		const res = await fetcher(
			state == "new" ? "/cliente/insert" : "/cliente/update",
			"POST",
			state == "new" ? { cliente: data } : { cliente: data, id: id },
			false
		);
		if (res.err) {
			if (res.err === 401) {
				return navigate("/");
			} else {
				return setError(true);
			}
		}
		navigate("/home");
	}

	function check() {
		if (
			Boolean(data.user) &&
			Boolean(state == "new" ? data.password : true) &&
			Boolean(data.nome) &&
			Boolean(data.CPF) &&
			Boolean(data.celular) &&
			Boolean(data.nascimento) &&
			Boolean(data.endereco) &&
			Boolean(data.email) &&
			Boolean(data.valor_contrato) &&
			Boolean(data.PIX) &&
			Boolean(data.agencia_banco) &&
			Boolean(data.conta_banco)
		) {
			return true;
		}
		return false;
	}

	const infos = [
		{
			section: "Credenciais de Login",
			rows: [
				[
					{ label: "Username", maxLength: 45, name: "user", capitalize: false },
					{
						label: "Senha",
						maxLength: 50,
						name: "password",
						capitalize: false,
						helperText:state == "new" ? "" : "Deixe em branco para deixar como estava"
					},
				],
			],
		},
		{
			section: "Informacoes pessoais",
			rows: [
				[
					{ label: "Nome", maxLength: 45, name: "nome" },
					{ label: "CPF", maxLength: 15, name: "CPF" },
				],
				[
					{ label: "Celular", maxLength: 45, name: "celular" },
					{
						label: "Data Nascimento",
						helperText: "YYYY/MM/DD",
						maxLength: 45,
						name: "nascimento",
					},
				],
				[
					{
						label: "Endereco",
						maxLength: 300,
						helperText:
							"PAIS?, [ESTADO], [CIDADE], [BAIRRO], [LOGRADOURO], [NUMERO], CEP?",
						name: "endereco",
					},
				],
				[{ label: "E-mail", maxLength: 100, name: "email", capitalize: false }],
			],
		},
		{
			section: "Financeiro",
			rows: [
				[
					{
						label: "Valor do Contrato",
						type: "number",
						helperText: "Em reais. Ex: 1500.00",
						name: "valor_contrato",
					},
					{ label: "PIX", maxLength: 45, name: "PIX" },
				],
				[
					{
						label: "Agencia Banco",
						maxLength: 4,
						type: "number",
						name: "agencia_banco",
					},
					{
						label: "Conta Banco",
						maxLength: 6,
						type: "number",
						name: "conta_banco",
					},
				],
			],
		},
	];

	return (
		<>
			<nav>
				<div className="nav-img-container">
					<img src="./dec.png" alt="" />
				</div>
				<Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
					<button className="btn-back">
						<KeyboardBackspaceIcon />
						<p>Voltar</p>
					</button>
				</Link>
			</nav>
			{error ? (
				<>Error</>
			) : (
				<div className="content-new">
					<h2>Adicionar novo Usuario</h2>
					{infos.map((section, indexSection) => (
						<div key={indexSection}>
							<p>{section.section}</p>
							<div className="section-user">
								{section.rows.map((row, indexRow) => (
									<div key={indexRow} className="flex">
										{row.map((input, indexInput) => (
											<div
												key={indexInput}
												className="text-input-user"
												style={{ width: "100%" }}
											>
												<TextField
													onChange={(e) => {
														const old = Object.assign({}, data);
														old[input.name] = e.target.value;
														setData(old);
													}}
													id="filled-basic"
													label={input.label}
													variant="filled"
													inputProps={{
														style: {
															fontFamily: "Rajdhani",
															fontSize: 20,
															textTransform:
																input.capitalize === false ? "" : "capitalize",
															background: "inherit",
														},
														maxLength: input.maxLength ?? 200,
														selected: true
													}}
													InputLabelProps={{
														style: {
															fontFamily: "Rajdhani",
															fontSize: 20,
															color: "inherit",
														},
													}}
													FormHelperTextProps={{
														style: { fontFamily: "Rajdhani", fontSize: 15 },
													}}
													fullWidth
													autoComplete="off"
													helperText={input.helperText ?? ""}
													type={input.type ?? "text"}
													value={data[input.name] ?? ''}
												/>
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					))}
					{loading ? (
						<div className="circular-new">
							<CircularProgress />
						</div>
					) : (
						check() && <button onClick={submit}>Salvar</button>
					)}
				</div>
			)}
		</>
	);
}

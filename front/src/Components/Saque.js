import { CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import "./saque.css";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';
import fetcher from '../data/fetcher'

export default function Saque({ randomText}) {
	const [typed, setTyped] = useState("");
	const [status, setStatus] = useState("none");

	const error = !randomText.startsWith(typed.toUpperCase());
	const done = typed.toUpperCase() == randomText;

	function setLoading(){
		setStatus("loading");
	}

	if(status === 'loading'){
		handleSubmit();
	}

	async function handleSubmit(){
		const res = await fetcher("/saque/request", "POST", null, false);
		if(res.err){
			return setStatus("error")
		}
		setStatus("success")
	}

	return status == "loading" ? (
			<div className="modal-loading">
				<CircularProgress size={50}/>
			</div>
	) : status == "none" ? (
		<div className="modal-saque">
			<h1>Solicitação de Saque</h1>
			<p>Para confirmar digite o texto abaixo:</p>
			<p className="random-text">{randomText}</p>
			<TextField
				onChange={(e) => setTyped(e.target.value)}
				fullWidth
				autoFocus={true}
				sx={{ marginBottom: 2 }}
				id="filled-basic-password"
				label="Código de Verificação"
				variant="filled"
				error={error}
				InputProps={{ disableUnderline: !error, autoComplete: "off" }}
				inputProps={{ style: { textTransform: "uppercase" } }}
			/>
			{done && <button onClick={setLoading}>CONFIRMAR</button>}
		</div>
	) : status == 'success' ? (
        <div className="modal-success saque-success">
            <CheckCircleOutlineRoundedIcon fontSize="inherit"/>
            <p>Solicitação feita com sucesso!
            Dentro de algumas horas o saldo será depositado na sua conta!</p>
        </div>
    ) : (
        <div className="modal-error saque-error">
            <ReportGmailerrorredSharpIcon fontSize="inherit"/>
            <p>Houve um erro! Por favor informe um administrador urgente!</p>
        </div>
    );
}

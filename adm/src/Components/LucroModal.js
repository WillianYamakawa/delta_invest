import { CircularProgress, OutlinedInput, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import "./lucromodal.css";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";

export default function LucroModal({ randomText }) {
	const navigate = useNavigate();
	const [status, setStatus] = useState("none");
	const [value, setValue] = useState("");

    const error = !Boolean(Number(value));

    const now = new Date();
	const able = now.getDate() === 1;

	function setLoading(){
		setStatus("loading")
	}

	async function submit(){
		const res = await fetcher("/lucro/apply", "POST", {valor: Number(value)}, false)
        if(res.err){
            if(res.err === 401){
                navigate("/")
            }else{
                return setStatus("error");
            }
        }
        setStatus("success")
	}

	if(status == "loading"){
		submit();
	}

	return status == "loading" ? (
		<div className="modal-loading">
			<CircularProgress size={50} />
		</div>
	) : status == "none" ? (
		<div className="modal-lucro">
			<h1>Aplicar Lucro</h1>
            {!able && <div className="div-aviso"><ReportGmailerrorredSharpIcon fontSize="inherit"/><p className="aviso-lucro">Aplicar apenas no dia primeiro de cada mes!</p></div>}
            
			<p>Digite a porcentagem:</p>
			<p className="random-text"></p>
			<OutlinedInput
            autoFocus={true}
            sx={{width: 100}}
				id="outlined-adornment-weight"
                onChange={(e) => setValue(e.target.value)}
				endAdornment={<InputAdornment position="end">%</InputAdornment>}
                value={value}
                error={error}
				aria-describedby="outlined-weight-helper-text"
				inputProps={{
					"aria-label": "Porcentagem",
				}}
                autoComplete="off"
			/>
            {!error &&<p>Porcentagem: {value == "" ? "0" : value}%</p>}
			{!error && <button onClick={setLoading}>CONFIRMAR</button>}
		</div>
	) : status == "success" ? (
		<div className="modal-success saque-success">
			<CheckCircleOutlineRoundedIcon fontSize="inherit" />
			<p>
				Lucro de {value}% aplicado com sucesso 
			</p>
		</div>
	) : (
		<div className="modal-error saque-error">
			<ReportGmailerrorredSharpIcon fontSize="inherit" />
			<p>Houve um erro! Por favor informe um administrador urgente!</p>
		</div>
	);
}

import React, { useState } from "react";
import './pendingmodal.css'
import { CircularProgress } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";


export default function PendingModal(props) {
    const navigate = useNavigate()
    const [status, setStatus] = useState("none");


    function setLoading(){
		setStatus("loading")
	}

	async function submit(){
		const res = await fetcher("/saque/payedblind", "POST", {id: props.userId}, false)
        if(res.err){
            if(res.err === 401){
                navigate("/")
            }else{
                return setStatus("error");
            }
        }
        props.onSuccess()
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
		<div className="modal-pending">
			<h2>Confirmar Pagamento</h2>
			<h3>Valor: R${props.saldo.toFixed(2)}</h3>
			<p>PIX: {props.PIX}</p>
			<p>Banco: {props.banco}</p>
			<button onClick={setLoading}>CONFIRMAR</button>
		</div>
	) : status == "success" ? (
		<div className="modal-success saque-success">
			<CheckCircleOutlineRoundedIcon fontSize="inherit" />
			<p>
				Confirmado com sucesso!
			</p>
		</div>
	) : (
		<div className="modal-error saque-error">
			<ReportGmailerrorredSharpIcon fontSize="inherit" />
			<p>Houve um erro! Por favor informe um administrador urgente!</p>
		</div>
	);
}

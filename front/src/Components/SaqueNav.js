import React, { useEffect, useState } from "react";
import "./saquenav.css";
import { Modal } from "@mui/material";
import Saque from "./Saque";
import ReportGmailerrorredSharpIcon from "@mui/icons-material/ReportGmailerrorredSharp";
import { CircularProgress } from "@mui/material";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";

export default function SaqueNav() {
	const [modalSaque, setModalSaque] = useState(false);
	const [state, setState] = useState("loading");
	const navigate = useNavigate();

	useEffect(() => {
		a();
	}, []);

	async function a() {
		const res = await fetcher("/saque/allowed");
		if (res.err) {
			if (res.err === 401) {
				navigate("/");
			} else {
				setState("error");
			}
		} else {
			const allowed = res.result.allowed;
			if (allowed === true) {
				setState("none");
			} else {
				setState("not");
			}
		}
	}

	function openModalSaque() {
		setModalSaque(true);
	}
	function closeModalSaque() {
		setModalSaque(false);
		a();
	}

	function generateRandomText(length) {
		const aText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let text = "";
		for (let i = 0; i < length; i++) {
			text += aText[Math.floor(Math.random() * aText.length)];
		}
		return text;
	}

	return state === "loading" ? (
		<div className="saquenav-loading">
			<CircularProgress></CircularProgress>
		</div>
	) : state === "error" ? (
		<div className="saquenav-error">
			<ReportGmailerrorredSharpIcon fontSize="inherit" />
			<p>Erro! Avise um ADM!</p>
		</div>
	) : state === "none" ? (
		<>
			<Modal open={modalSaque} onClose={closeModalSaque}>
				<div>
					<Saque randomText={generateRandomText(6)} />
				</div>
			</Modal>
			<div className="saque-nav">
				<p className="p-blue">Seu saque está disponivel!</p>
				<button
					onClick={openModalSaque}
					style={{ display: "flex", alignItems: "center" }}
					className="btn-saque"
				>
					Sacar Agora
				</button>
			</div>
		</>
	) : (
		<div className="not">
			<p>Saque Todo Dia 10!</p>
		</div>
	);
}

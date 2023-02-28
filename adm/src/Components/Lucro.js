import { Modal } from "@mui/material";
import React, {useState} from "react";
import "./lucro.css";
import LucroModal from "./LucroModal";

export default function Lucro() {
    const [modalLucro, setModalLucro] = useState(false)

	return (
		<>
			<div className="lucro-nav">
				<button onClick={() => setModalLucro(true)}>Aplicar Lucro</button>
			</div>
			<Modal open={modalLucro} onClose={() => setModalLucro(false)}><div><LucroModal/></div></Modal>
		</>
	);
}

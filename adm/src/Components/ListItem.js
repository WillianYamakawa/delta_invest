import React, { useState } from "react";
import "./listitem.css";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import fetcher from "../data/fetcher";
import { Link, useNavigate } from "react-router-dom";
import PendingModal from "./PendingModal";

export default function ListItem(props) {
	const navigate = useNavigate();
	const [el, setEl] = useState(null);
	const [modal, setModal] = useState(false);
	const open = Boolean(el);

	async function changeActive() {
		const b = props.active ? "/deactivate" : "/activate";
		const res = await fetcher(
			"/cliente" + b,
			"POST",
			{ id: props.userId },
			false
		);
		if (res.err) {
			if (res.err === 401) {
				navigate("/");
			} else {
				return props.onError();
			}
		}
		setEl(null);
		props.onSuccess();
	}

	return (
		<>
			<Modal open={modal} onClose={() => setModal(false)}>
				<div>
					<PendingModal
						saldo={props.saldo}
						PIX={props.PIX}
						banco={props.banco}
						userId={props.userId}
						onSuccess={props.onSuccess}
					/>
				</div>
			</Modal>
			<li className={`list-item ${props.active ? "" : "disabled"}`}>
				<div className="user-info">
					<div className="user-icon">
						<AccountBalanceWalletOutlinedIcon fontSize="inherit" />
					</div>

					<div className="user-info-sub">
						<h2>{props.name}</h2>
						<p>{props.CPF}</p>
					</div>
					{props.pending && (
						<div className="pending" onClick={() => setModal(true)}>
							<PendingActionsIcon fontSize="inherit" />
							<p>Aguardando pagamento</p>
						</div>
					)}
				</div>
				<div className="opt-user-icon" onClick={(e) => setEl(e.currentTarget)}>
					<MoreVertIcon fontSize="inherit" />
				</div>
			</li>
			<Menu anchorEl={el} open={open} onClose={() => setEl(null)}>
				<MenuItem>
					<Link to={`/cliente/${props.userId}`} style={{textDecoration:"none", color: "inherit"}}>
						<div className="menu-container edit">
							<EditIcon fontSize="inherit" />
							<p>Editar</p>
						</div>
					</Link>
				</MenuItem>
				{props.active ? (
					<MenuItem onClick={changeActive}>
						<div className="menu-container delete">
							<CloseIcon fontSize="inherit" />
							<p>Desativar Usuario</p>
						</div>
					</MenuItem>
				) : (
					<MenuItem onClick={changeActive}>
						<div className="menu-container activate">
							<LockOpenIcon fontSize="inherit" />
							<p>Ativar Usuario</p>
						</div>
					</MenuItem>
				)}
			</Menu>
		</>
	);
}

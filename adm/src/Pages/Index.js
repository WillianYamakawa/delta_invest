import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import "./index.css";
import {
	CircularProgress,
	TextField,
} from "@mui/material";
import fetcher from "../data/fetcher";
import { useNavigate } from "react-router-dom";

function IndexPage() {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const bg = useRef(null);

	function login() {
		if (!user.length || !password.length) return;
		setLoading(true);
		fetcher("/login/adm", "POST", { user: user, password: password }).then(
			(res) => {
				if (res.err) {
					if (res.err === 500) {
						console.log("Server error");
					} else {
						setError(true);
					}
				} else {
					const token = res.result?.token;
					console.log(res);
					sessionStorage.setItem("admToken", token);
					navigate("/home");
				}
				setLoading(false);
			}
		);
	}

	useEffect(() => {
		const net = NET({
			el: bg.current,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			scale: 1.0,
			scaleMobile: 1.0,
			color: 0xffffff,
			backgroundColor: 0x181818,
			points: 16.0,
			maxDistance: 26.0,
			spacing: 20.0,
		});

		return () => {
			net && net.destroy();
		};
	}, []);

	return (
		<>
			<div className="background-vanta" ref={bg}></div>
			<div className="shade" />
			<div className="container">
				<div className="one">
					<img alt="logo" src="./delta.png" />
				</div>
				<div className="two">
					<div className="login">
						<h1 className="h1-title-login">
							Admin <span className="span-blue">Page</span>
						</h1>
						<TextField
							onChange={(e) => setUser(e.target.value)}
							error={error}
							sx={{ marginBottom: 3 }}
							fullWidth
							id="filled-basic-user"
							label="Nome de usuario"
							variant="filled"
							InputProps={{ disableUnderline: !error, autoComplete: "off" }}
							helperText={error && "Usuário ou senha inválidos"}
						/>
						<TextField
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							sx={{ marginBottom: 2 }}
							id="filled-basic-password"
							error={error}
							label="Senha"
							type="password"
							variant="filled"
							InputProps={{ disableUnderline: !error, autoComplete: "off" }}
						/>
						<br />
						{loading ? (
							<CircularProgress />
						) : (
							<button className="submit" onClick={login}>
								ENTRAR
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default IndexPage;

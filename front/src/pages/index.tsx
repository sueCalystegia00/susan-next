import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const HomePage = () => {
	const { user } = useContext(AuthContext);

	return (
		<>
			<div style={{ marginTop: "20%" }}>
				<h1 style={{ fontSize: "2rem", marginBottom: 8, textAlign: "center" }}>
					ようこそ、LIFFの世界へ
				</h1>

				<table style={{ margin: "auto" }}>
					<tbody>
						<tr>
							<td>userUid</td>
							<td>：{user ? user.userUid : "undefined"}</td>
						</tr>
						<tr>
							<td>token</td>
							<td>：{user ? user.token : "undefined"}</td>
						</tr>
						<tr>
							<td>position</td>
							<td>：{user ? user.position : "undefined"}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};

export default HomePage;

import "./App.css";
const crypto = require("crypto"); // crypto comes with Node.js

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
	// Prevent time sync issue between client signature generation and zoom
	var signature;
	const timestamp = new Date().getTime() - 30000;
	try {
		const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString("base64");
		const hash = crypto.createHmac("sha256", apiSecret).update(msg).digest("base64");
		signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString("base64");
	} catch (e) {
		console.log(" gen error :" + e);
	}

	return signature;
}

declare var ZoomMtg;

ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.5/lib", "/av");

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

function App() {
	// setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js

	var apiKey = "dkTOd-IzS2emVPW89C7qUg";
	var meetingNumber = 93649830507;
	var role = 0;
	var leaveUrl = "http://localhost:3000";
	var userName = "RUCHIKA";
	var userEmail = "bhaisareruchika@gmail.com";
	var passWord = "c1hFCu";
	var signatureEndpoint = "";

	console.log(signatureEndpoint);

	// function getSignature(e) {
	// 	e.preventDefault();

	// 	fetch(signatureEndpoint, {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			meetingNumber: meetingNumber,
	// 			role: role,
	// 		}),
	// 	})
	// 		.then((res) => res.json())
	// 		.then((response) => {
	// 			startMeeting(response.signature);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// }

	function startMeeting() {
		document.getElementById("zmmtg-root").style.display = "block";

		signatureEndpoint = generateSignature(apiKey, "FaJdZc5L6ILEZgKx6mylKCui2KDHo6vtMAaa", meetingNumber, role);

		ZoomMtg.init({
			leaveUrl: leaveUrl,
			isSupportAV: true,
			success: (success) => {
				console.log(success);

				ZoomMtg.join({
					signature: signatureEndpoint,
					meetingNumber: meetingNumber,
					userName: userName,
					apiKey: apiKey,
					userEmail: userEmail,
					passWord: passWord,
					success: (success) => {
						console.log(success);
					},
					error: (error) => {
						console.log(error);
					},
				});
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	return (
		<div className="App">
			<main>
				<h1>Zoom WebSDK Sample React</h1>

				<button onClick={startMeeting}>Join Meeting</button>
			</main>
		</div>
	);
}

export default App;

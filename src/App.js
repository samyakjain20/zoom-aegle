import "./App.css";
import React from 'react';
const crypto = require("crypto"); // crypto comes with Node.js

// https://github.com/zoom/zoom-api-jwt
const jwt = require('jsonwebtoken');
const rp = require('request-promise');
var apiKey = "WkLcrPpYTD2LAI9MN5fybw";
var apiSecret = "pYqRltSNafNnGaLc4ZbN20ffSe66u3BZ6iQu";
var email = "samyak.21810494@viit.ac.in" //doctor's Email
//Use the ApiKey and APISecret from above
const payload = {
    iss: apiKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, apiSecret);

var options = {
    //You can use a different uri if you're making an API call to a different Zoom endpoint.
    uri: "https://api.zoom.us/v2/users/"+email, 
    qs: {
        status: 'active' 
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
};

// function meetingGenerate(options) {
// 	//printing the response on the console
// 	try{
// 		console.log('User has',options); //console.log(typeof response);
  
// 		resp = rp.; //Adding html to the page
// 		res.send(JSON.stringify(resp, null, 2) );
//   	} catch (err) {
// 		// API call failed...
// 		console.log('API call failed, reason ', err);
//   	};
// }

function meetingGenerate(options){

 	var response = rp(options)
	return JSON.stringify(response, null, 2);
 
    // try{
    //   //printing the response on the console
    //     console.log('User has', response);
    //     //console.log(typeof response);
    //     var resp = response
    //     //Adding html to the page
    //     //Prettify the JSON format using pre tag and JSON.stringify
    //     // var result = title + '<code><pre style="background-color:#aef8f9;">'+JSON.stringify(resp, null, 2)+ '</pre></code>'
    //     // res.send(result1 + '<br>' + result);
	// 	return JSON.stringify(resp, null, 2);
 
    // }
    // catch (err) {
    //     // API call failed...
    //     console.log('API call failed, reason ', err);
    // };
}
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
	
	var meetingDetails = meetingGenerate(options);
	var meetingNumber = meetingDetails.pmi;
	var role = meetingDetails.role_name;
	var leaveUrl = "http://localhost:3000";
	var userName = meetingDetails.first_name + meetingDetails.last_name ;
	var userEmail = "samyak.21810494@viit.ac.in";
	var passWord = "zre6aX";
	var signatureEndpoint = "";

	console.log(signatureEndpoint);

	function startMeeting() {
		document.getElementById("zmmtg-root").style.display = "block";

		signatureEndpoint = generateSignature(apiKey, apiSecret, meetingDetails.pmi, role);

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

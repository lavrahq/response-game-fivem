const g = require("graphqurl");

// HTTP Server Port
const URL = GetConvar("response_url", "responseurlhere");
const PORT = GetConvar("response_port", 8080);

async function ResponseRequest({ query, variables, name, callback }) {
	const r = await g.query({ query, variables, name, endpoint: "https://countries.trevorblades.com/graphql" });
	setImmediate(() => {
		if (callback) {
			callback(r);
		}
	})
}

on("Response:Request", ResponseRequest);
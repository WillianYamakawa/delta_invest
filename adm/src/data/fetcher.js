const config = {
	url: "https://api.deltainvest.tech",
};

export default async function save (path, method = "GET", body = null, expectResponse=true) {


	const fetch_config = {
		method: method,
		headers: {
			Authorization: "Bearer " + sessionStorage.getItem("admToken") ?? "TOKEN",
			"Content-Type": "application/json",
		},
	};

    if(body != null){
        fetch_config.body = JSON.stringify(body)
    }
	try{
		const res = await fetch(config.url + path, fetch_config);
		if (res.status === 200) {
			return { err: null, result: !expectResponse ? null :await res.json() };
		} else {
			return { err: res.status, result: null };
		}
	}catch(e){
		console.log(e)
		return { err: 404, result: null };
	}

}

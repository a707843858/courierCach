const CFetch = function (input: RequestInfo, init?: RequestInit):Promise<Response> {
	return new Promise((resolve, reject) => {
		const request = input instanceof Request ? input : new Request(input, init);

		const xhr = new XMLHttpRequest();

		xhr.onload = function () {
			//Headers
			const headers = new Headers(),
				rowHeaders = xhr.getAllResponseHeaders();
			const rowHeadersArr = rowHeaders.trim().split(/[\r\n]+/);
			rowHeadersArr.forEach(function (line) {
				const parts = line.split(': ');
				const header = parts.shift(),
					value = parts.join(': ');
				header && value && headers.append(header, value);
			});

			const options = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: headers,
				url: 'responseURL' in xhr ? xhr.responseURL : headers.get('X-Request-URL'),
			};

			const body = xhr.response || xhr.responseText ;

			resolve(new Response(body, options));
		};

		xhr.onerror = function () {
			reject(new TypeError('Network request failed'));
		};

		xhr.ontimeout = function () {
			reject(new TypeError('Network request failed'));
		};

		xhr.onabort = function () {
			reject(new DOMException('Network request has been Aborted', 'AbortError'));
		};

		xhr.open(request.method, request.url, true);

		xhr.withCredentials = request.credentials === 'include' ? true : false;

		
		//responseType

		//headers
		request.headers.forEach((value:any, name:string) => {
			xhr.setRequestHeader(name, value);
		});

		//abort
		if (request.signal) {
			xhr.addEventListener('abort', function () {
				xhr.abort();
			});

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					xhr.removeEventListener('abort', function () {
						xhr.abort();
					});
				}
			};
		}

		//send
		xhr.send(request.body === undefined ? null : request.body);
	});
};

export { CFetch };

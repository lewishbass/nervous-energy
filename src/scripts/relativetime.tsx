const relTimeFormat = (now: Date, date: Date) : string => {
		const nowtimestamp = now.getTime();
		const datetimestamp = date.getTime();

		const deltaTime = Math.abs(nowtimestamp - datetimestamp	);
		var output = '';

		if (Math.abs(deltaTime) < 1000) {
			output = 'just now';
		}else if (deltaTime < 60*1000) {
			output = (deltaTime/1000).toFixed(0) + 's';
		}else if (deltaTime < 60*60*1000) {
			output = (deltaTime/(60*1000)).toFixed(1) + 'm';
		}else if (deltaTime < 24*60*60*1000) {
			output = (deltaTime/(60*60*1000)).toFixed(1) + 'h';
		}else if (deltaTime < 7*24*60*60*1000) {
			output = (deltaTime/(24*60*60*1000)).toFixed(1) + 'd';
		}

		if(output !=='')return ((deltaTime < -1000) ? 'in ' : '') + output + ((deltaTime > 1000) ? ' ago' : '');
		return new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' })
	};

	export default relTimeFormat;
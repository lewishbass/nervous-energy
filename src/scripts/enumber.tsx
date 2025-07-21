const Enumber = (num: number) => {
	if (num === 0) return '0.00';
	const place = Math.floor(Math.log10(Math.abs(num)));
	return place >= 3 || place <= -3 ? (
		(num / Math.pow(10, place)).toFixed(1) + 'e' + place.toFixed(0)
	) : (
		place < 0 ? (
			num.toFixed(2)
		) : (
			num.toFixed(2 - place)
		)
	)
}

export default Enumber;
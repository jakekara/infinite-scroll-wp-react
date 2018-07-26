function dateline(dt){

    // var dayNames = ['Sunday', 'Monday', 'Tuesday',
    // 		    'Wednesday', 'Thursday', 'Friday',
    // 		    'Saturday'];
    var monthNames = ['Jan.', 'Feb.', 'March', 'April',
		      'May', 'June', 'July', 'Aug.',
		      'Sept.', 'Oct.', 'Nov.', 'Dec.'];

    var ampm = "a.m."

    if (dt.getHours() >= 12) {
	ampm = "p.m."
    }

    var time = (1 + dt.getHours() % 12)
	+ ":"
	+ dt.getMinutes();

    if (dt.getMinutes() === 0){
	time = (1 + dt.getHours() % 12)
    }

    else if (dt.getMinutes() < 10){
	time = (1 + dt.getHours() % 12)
	    + ":0"
	    + dt.getMinutes();
    }


    return monthNames[dt.getMonth()]
	+ " "
	+ dt.getDate()
	+ ", "
	+ dt.getFullYear()
	+" @ "
	+ time
	+ " "
	+ ampm;
}

export { dateline }

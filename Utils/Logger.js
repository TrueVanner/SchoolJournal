/**
Important note: this logger does not belong to me. It was made by user @Setredid.
*/


// How to call logger
// Logger.<TYPE OF ERROR>(<PARAMS>);

// Error builder
// <TIME> | <TYPE> | <PARAMS>

// Logger example
// 22-01-2022 23:48:30 | ERROR | Failed connection to DataBase

// Get Date of logger output
function getDate() {
	const now = new Date;
	let day = now.getDate();
	if(day < 10)
	day = "0" + day;
	let month = now.getMonth() + 1;
	if(month < 10)
		month = "0" + month;
	let year = now.getFullYear();

	let hour = now.getHours();
	if(hour < 10)
		hour = "0" + hour;
	let minutes = now.getMinutes();
	if(minutes < 10)
		minutes = "0" + minutes;
	let seconds = now.getSeconds();
	if(seconds < 10)
		seconds = "0" + seconds;

	let date = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
	
	return date;
}

class Logger{    
	// ERROR is an unexpected event and could impact the functionality of your app
	static error(infoAboutError){
		let date = getDate();

		console.log(`\n\x1b[31m${date} | ERROR | ${infoAboutError}\n\x1b[0m`);
	}

	// WARN includes logs that may become errors and that you detected unusual and unexpected app behavior
	static warn(infoAboutWarn){
		let date = getDate();

		console.log(`\n\x1b[33m${date} | WARN | ${infoAboutWarn}\n\x1b[0m`);
	}

	// INFO logs reflect normal application behavior
	static info(infoAboutInfo){
		let date = getDate();

		console.log(`\n\x1b[34m${date} | INFO | ${infoAboutInfo}\n\x1b[0m`);
	} 

	// DEBUG logs are particularly useful during debugging
	static debug(infoAboutDebug){
		let date = getDate();

		console.log(`\n\x1b[37m${date} | DEBUG | ${infoAboutDebug}\n\x1b[0m`);
	}

	// SERVER log that shows 
	static serverStart(PORT){
		let date = getDate();

		console.log(`\n\x1b[36m${date} | SERVER | PORT:${PORT}\n\x1b[0m`);
	}

	// TEST 5 types of logs
	static tester(){
		Logger.error("Failed connection to DataBase");
		Logger.warn("Connection to DataBase is too long");
		Logger.info("New admin added");
		Logger.debug("Code works up to this place");
		Logger.serverStart(3000);
	}
}

// Export 'Logger' to project   
module.exports = Logger;

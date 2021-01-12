const readline 		=	require('readline');
const fs 			= 	require('fs');
const { google } 	=	require('googleapis');
const config 		= 	require('../../config.json');

// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets' ];
const CREDENTIALS = 'credentials.json';
const TOKEN_PATH = 'token.json';

const test = (data) => data ? console.log('API ready') : console.log('there\'s a problem with the api');

/* 
* how to use:
sheetsapi.getData('range', (data) => {
	// do something
});

* get multiple ranges
sheets.spreadsheets.values.batchGet({
	spreadsheetId: sheets_id,
	ranges: ['dkfjwi', 'fkjwkew']
}, callback)

const rows1 = res.data.valueRanges[0].values;
*/

// filter function
const filterNewLine = (rows=Array) => {
	return rows.map(row => row.map(column => {
		return column.replace('\n', ' ')
	}));
}

module.exports.getData = (range='A1:B2', cb=Function) => {
	let request = (auth) => {
		const sheets = google.sheets({ version: 'v4', auth });
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: config.sheets_id,
				range: range
			}, (err, res) => {
				if (err) return console.log('The API returned an error: ' + err);
				var rows = filterNewLine(res.data.values);
				if (rows.length) {
					cb(rows);
				} else {
					console.log('No data found.');
				}
			}
		);
	}
	
	fs.readFile(CREDENTIALS, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		return authorize(JSON.parse(content), request);
	});
}

module.exports.removeBreakTime = (rows=Array) => {
	rows.splice(0,1);
	return rows.map((row) => {
		row.splice(3,1);
		row.splice(5,1);
		row.splice(7,1);
		row.splice(0,1);
		return row
	})
}

// DON'T TOUCH IT FFS

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		return callback(oAuth2Client);
	});
}

/*
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 */

function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}
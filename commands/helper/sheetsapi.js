const readline 		=	require('readline');
const fs 			= 	require('fs');
const { google } 	=	require('googleapis');
const config 		= 	require('../../config.json');

// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets' ];
const TOKEN_PATH = 'token.json';

class APICall {
	constructor(range, cb) {
		this.range = range;
		this.cb = cb;

		this.request = this.request.bind(this);
	}

	request(auth) {
		const sheets = google.sheets({ version: 'v4', auth });
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: config.sheets_id,
				range: this.range
			},
			this.cb
		);
	}
}

const testAPI = new APICall('A1:E5', (err, res) => {
	if (err) return console.log('The API returned an error: ' + err);
	console.log('sheets api is ready');
});

module.exports.authorize = (CRED_PATH, cb=testAPI) => {
	fs.readFile(CRED_PATH, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		return authorize(JSON.parse(content), cb.request);
    });
}

// Print columns A and E, which correspond to indices 0 and 4.
// rows[0] = A, rows[4] = E

module.exports.listData = (range) => {
	return new APICall(range, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		var rows = res.data.values;
		if (rows.length) {
			rows = rows.map((row) => {
				return row.map((column) => column.replace('\n', ' '));
			});
			console.log(rows);
			return rows
		} else {
			console.log('No data found.');
		}
	});
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
		callback(oAuth2Client);
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
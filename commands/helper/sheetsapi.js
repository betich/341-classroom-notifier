const https = require('https');

module.exports.callAPI = (sheet_number, range='A1:A1', cb=Function) => {
    const url = `https://spreadsheets.google.com/feeds/cells/1dr00FcWgeZVLsFP_959YtQ6GGNgoPaRUNbaIu7ujY50/${sheet_number}/public/values?alt=json`
    const req = https.request(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        })
        
        res.on('end', () => {
            data = JSON.parse(data);

            // start format data
            [start, end] = range.split(':');

            [colstart, rowstart] = cellsplit(start);
            [colend, rowend] = cellsplit(end);

            colstart = toIndex(colstart);
            colend = toIndex(colend);

            rowend = Number(rowend);
            rowstart = Number(rowstart);

            let test = new Array(rowend-rowstart+1);
            for (let i = 0 ; i < test.length ; i++) {
                test[i] = new Array(colend-colstart+1);
            }
            data.feed.entry.forEach(element => {
                row = Number(element['gs$cell']['row']);
                col = Number(element['gs$cell']['col']);
                if (row >= rowstart && row <= rowend && col >= colstart && col <= colend) {
                    test[row-rowstart][col-colstart] = element['gs$cell']['$t'];
                }
            });
            // end format data
            
            let ret = {};
            ret.title = data.feed.title['$t'];
            ret.data = test;
            cb(ret);
        })

        req.on('error', e => {
            throw e;
        })

    })
    req.end();
}

cellsplit = (a) => {
    const pat = /[A-Z,a-z]+/g;
    const n = pat.exec(a);
    return [ n[0], a.slice(n[0].length, a.length ) ];
}

toIndex = (a) => {
    let x = 0;
    const array = a.split('');
    array.forEach(element => {
        x *= 26;
        x += (element.charCodeAt(0) - 64);
    });
    return x;
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

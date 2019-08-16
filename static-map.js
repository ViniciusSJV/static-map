//npm i express
//npm i ejs
//npm i webshot

//http://localhost:8080/static-map/?lat=-23.552349&long=-46.653309&zoom=18

const url = require('url');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const fs = require('fs');
const webshot = require('webshot');

const options = {
    siteType: 'html',
    screenSize: {
		width: 400,
	    height: 300
	}, 
	shotSize: {
		width: 400,
		height: 300
	},
    userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' +
        ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

router.get('/static-map', (req,res) => {
	const urlP = url.parse(req.url, true);	
	const urlData = urlP.query; 
	
	let mapZoom = 18
	  if (urlData.zoom)
		  mapZoom = urlData.zoom
	  
	let mapLat = urlData.lat
    let mapLong = urlData.long		
	
	app.render(path.join(__dirname+'/static-map.html'), {lat: mapLat, long: mapLong, zoom: mapZoom}, (err, html) => {
		webshot(html, 'static-map.png', options, (err) => {
			if (err) return console.log(err);
			
			fs.readFile('static-map.png', (err, data) => {
			  if (err) return console.log(err);
			  
			  res.writeHead(200, {'Content-Type': 'image/jpeg'});
			  res.end(data);	

			  fs.unlinkSync('static-map.png')		
			});
		}); 
	});
});

app.use('/', router);
app.listen(process.env.port || 8080);

console.log('Porta: 8080');
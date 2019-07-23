/*

 ___________  _________________ _   _ _   _ _____ 
|_   _| ___ \/  ___| ___ \ ___ \ | | | \ | |  _  |
  | | | |_/ /\ `--.| |_/ / |_/ / | | |  \| | | | |
  | | |  __/  `--. \ ___ \    /| | | | . ` | | | |
 _| |_| |    /\__/ / |_/ / |\ \| |_| | |\  \ \_/ /
 \___/\_|    \____/\____/\_| \_|\___/\_| \_/\___/ 
 
 Tool: subdomains-finder
 Date: 23/07/2019
 
Command line:
node index.js --target=google.com 


Optional params:
--threads=1000
--wordlist=wordlist.txt
--output=logs.txt
*/
const request = require('request');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const dns = require('dns');


const wordlistArray = fs.readFileSync(argv.wordlist ? argv.wordlist : 'wordlist.txt').toString().split('\n');
const maxThreads = argv.threads ? argv.threads : 500
const outputFile = argv.output ? argv.output : "logs.txt";
const portscanner = require('portscanner')


var threads = 0;

var url = argv.target;

if (!url) {
	return console.log('Use: index.js --target=google.com');
}



var atualList = 0


subdomain('')

setTimeout(function () {
	setInterval(function () {
		if (threads < maxThreads && atualList < wordlistArray.length) {
			threads++; 
			subdomain(wordlistArray[atualList].trim())
			atualList++;
		}
		if(atualList == wordlistArray.length) {
			atualList++;
			return console.log("FINALIZADO");
		}
	}, 1)
}, 2000);



function subdomain(domain) {
	let finalUrl = domain + "." + url;
	dns.resolve4(finalUrl, (err, addresses) => {
		threads--;
		if (!err) {	
			console.log("Domain: ", finalUrl);	
			if(outputFile) fs.appendFileSync(outputFile, finalUrl+"\r\n")
		}
		if(argv.verbose) {
			console.log(atualList+"/"+wordlistArray.length);
		}
	})
}

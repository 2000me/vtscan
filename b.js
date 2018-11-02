function dl(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			var responseJSON = JSON.parse(this.responseText);
			var permalink = responseJSON.permalink;
			if (permalink.match(/^https:\/\/www.virustotal.com\/([a-z]{2}\/)?url\/[0-9a-f]{64}\/analysis\/[0-9]{10}\/$/)) {
				browser.windows.create({
					type: "detached_panel",
					url: permalink
				});
			} else {
				browser.notifications.create({
					"type": "basic",
					"title": "VirusTotal",
					"message": "unexpected permalink"
				});
			}
		}
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

var urlPrefix = "https://www.virustotal.com/vtapi/v2/url/report?" +
	"apikey=4771394c63f176c44ecbb9a14398041adc349096c072e72158ddf88be13ba164&scan=1&resource=";

browser.contextMenus.create({
    id: "vtscan@gmx.de",
    title: "VirusTotal Scan",
    contexts: ["link"],
	"icons": {
		"16": "i.svg"
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "vtscan@gmx.de") {
		dl(urlPrefix + info.linkUrl);
	}
});


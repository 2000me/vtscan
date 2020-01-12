'use strict';

class ResponseError extends Error {
    constructor(response) {
        super(response.status);
        this.name = this.constructor.name;
        this.response = response;
    }
};

function notifyUsingBasicNotification(msg) {
    console.log('vtscan: ' + msg);
    browser.notifications.clear(NOTIFIDATION_ID)
    browser.notifications.create(
        NOTIFIDATION_ID,
        {
            'type': 'basic',
            'title': browser.i18n.getMessage('extensionName'),
            'message': msg
        }
    );
};

function notifyResponseError(error) {
    var msg;
    if (error.response.status == 204) {
        msg = browser.i18n.getMessage('notifyStillQueuedStoppedPolling');
    } else {
        msg = browser.i18n.getMessage('notifyUnexpectedResponse');
    };
    notifyUsingBasicNotification(msg);
};

function ok(response) {
    if (response.status == 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new ResponseError(response));
    };
};

function json(response) {
    return response.json();
};

function pollReport(responseJson, reportUrl, i) {
    if (typeof responseJson['positives'] === 'undefined') {
        if (i == 1) {
            notifyUsingBasicNotification(
                browser.i18n.getMessage(
                    'notifyQueuedAndPolling',
                    POLL_INTERVAL_SECONDS
                )
            )
        }
        if (i <= MAX_POLLS) {
            setTimeout(() => {
                fetch(reportUrl)
                    .then(ok)
                    .then(json)
                    .then(responseJson => pollReport(responseJson, reportUrl, ++i))
                    .catch(error => notifyResponseError(error))
            }, POLL_INTERVAL_MILLISECONDS);
        } else {
            notifyUsingBasicNotification(
                browser.i18n.getMessage('notifyStillQueuedStoppedPolling')
            );
        }
    } else {
        var id = responseJson.scan_id.substring(0, 64);
        if (id.match(/^[0-9a-f]{64}$/)) {
            var pUrl = DETECTION_URL_PREFIX + id + DETECTION_URL_SUFFIX
            if (localStorage.getItem("TabOrWindow") == "w") {
                browser.windows.create({url: pUrl});
            } else {
                browser.tabs.create({url: pUrl});
            }
        } else {
            notifyUsingBasicNotification(
                browser.i18n.getMessage('notifyUnexpectedResponse')
            )
        }
    }
}

function scan(scanUrl, reportUrl) {
    fetch(scanUrl)
        .then(ok)
        .then(json)
        .then(responseJson => pollReport(responseJson, reportUrl, 1))
        .catch(error => notifyResponseError(error));
};

const API_KEY = '4771394c63f176c44ecbb9a14398041adc349096c072e72158ddf88be13ba164';
const API_REPORT_URL = 'https://www.virustotal.com/vtapi/v2/url/report';
const DETECTION_URL_PREFIX = 'https://www.virustotal.com/#/url/';
const DETECTION_URL_SUFFIX = '/detection';
const MAX_POLLS = 4;
const NOTIFIDATION_ID = 'vtscan';
const POLL_INTERVAL_SECONDS = 5;
const POLL_INTERVAL_MILLISECONDS = POLL_INTERVAL_SECONDS * 1000;
const SCAN_URL_PREFIX = API_REPORT_URL + '?apikey=' + API_KEY + '&scan=1&resource=';
const REPORT_URL_PREFIX = API_REPORT_URL + '?apikey=' + API_KEY + '&resource=';

browser.contextMenus.create({
    id: "vtscan@gmx.de",
    title: browser.i18n.getMessage('extensionName'),
    contexts: ["link"],
	"icons": {
		"16": "i.svg"
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "vtscan@gmx.de") {
        scan(SCAN_URL_PREFIX +  info.linkUrl, REPORT_URL_PREFIX + info.linkUrl);
	}
});

if (localStorage.getItem("TabOrWindow") == null) {
  localStorage.setItem("TabOrWindow", "w");
};

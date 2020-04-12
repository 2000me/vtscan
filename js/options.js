browser.storage.local.get("TabOrWindow").then(result => {
    if (typeof result.TabOrWindow === "undefined") {
        if (localStorage.getItem("TabOrWindow") != null) {
            if (localStorage.getItem("TabOrWindow") == "t") {
                document.getElementById("optionTab").checked = true;
            } else {
                document.getElementById("optionWindow").checked = true;
            }
            browser.storage.local.set({"TabOrWindow": localStorage.getItem("TabOrWindow")});
            localStorage.removeItem("TabOrWindow");
        } else {
            browser.storage.local.set({"TabOrWindow": "w"});
            document.getElementById("optionWindow").checked = true;
        }
    } else {
        if (result.TabOrWindow == "t") {
          document.getElementById("optionTab").checked = true;
        } else {
          document.getElementById("optionWindow").checked = true;
        }
    }
});

document.getElementById("optionTab").addEventListener("click", function(){
  browser.storage.local.set({"TabOrWindow": "t"});
});

document.getElementById("optionWindow").addEventListener("click", function(){
  browser.storage.local.set({"TabOrWindow": "w"});
});

if (localStorage.getItem("TabOrWindow") == null) {
  localStorage.setItem("TabOrWindow", "w");
}

if (localStorage.getItem("TabOrWindow") == "w") {
  document.getElementById("optionWindow").checked = true;
} else {
  document.getElementById("optionTab").checked = true;
}

document.getElementById("optionTab").addEventListener("click", function(){
  localStorage.setItem("TabOrWindow", "t");
});
document.getElementById("optionWindow").addEventListener("click", function(){
  localStorage.setItem("TabOrWindow", "w");
});

// page loading stuff
console.log("Advanced features:");
console.log(
	'Set local storage "origin" to 0 to run the emulator hosted on this domain, and 1 to run it from GitHub.'
);
console.log(
	'Set session storage "emuWidth" and "emuHeight" to set a custom size for EmulatorJS.'
);

getId("coretoggle").className +=
	" " + (localStorage.oldCores == "1" ? "active" : "inactive");

getId("emulatortoggle").textContent = "EmulatorJS";

let linknames, linknamelist;
let page = 0;
let games = [];
let matches = [];
let filteredsites = [];

const linksperpage = 200;

const div = document.createElement("div");
div.className = "webcontent";
const a = document.createElement("a");
a.className = "weblinks";
a.setAttribute("target", "_blank");
const p = document.createElement("p");
p.className = "domainname";

div.appendChild(a);
div.appendChild(p);

linknamelist = Object.keys(links.names).sort();
linknames = links.names;

delete links.names; // delete this so we can iterate through the object without this being there

addSiteSelectors();

sessionStorage.origin = 0;
sessionStorage.oldCores = 0;

getLocalStorage();

updateTabs(localStorage.openTab);

const domain = document.createElement("a");
for (const site in links) {
	let sitelist = links[site];
	for (const game of sitelist) {
		domain.href = game[1];
		games.push([game[0], game[1], site, domain.hostname]);
	}
}
games.sort();

sortLinks();

renderLinks();

// essential functions
function getId(id) {
	return document.getElementById(id);
}

function getClass(className) {
	return document.getElementsByClassName(className);
}

function remove(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

// major functions
function getLocalStorage() {
	if (!localStorage.openTab) localStorage.openTab = "NES";
}

function addSiteSelectors() {
	let main = document.getElementById("siteselector");
	let btn = document.createElement("button");
	btn.className = "toggle inactive";
	btn.setAttribute("onclick", "togglesites(event);");
	linknamelist.forEach((element) => {
		btn.textContent = linknames[element];
		btn.setAttribute("data", element);
		main.appendChild(btn.cloneNode(true));
	});
}

function updateTabs(tab) {
	// updates the tabs and buttons
	sessionStorage.openTab = tab;
	let tabcontent = getClass("tabcontent");
	for (let i = 0; i < tabcontent.length; i++) {
		// hides all tabs
		tabcontent[i].style.display = "none";
	}
	getId(tab).style.display = "block"; // shows the correct tab
	let tabbuttons = getClass("tabbuttons");
	for (let i = 0; i < tabbuttons.length; i++) {
		// clears the active class from all tabs and adds the active class to the correct tab
		tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
		if (tabbuttons[i].className.includes(tab)) {
			tabbuttons[i].className += " active";
		}
	}
	let cores = getId("coretoggle");
	if (tab == "Web") {
		cores.style.display = "none";
	} else {
		cores.style.display = "inline";
	}
}

function togglesites(event) {
	const el = event.currentTarget;

	let classes = el.className.split(" ");

	if (classes.includes("inactive")) {
		classes = remove(classes, "inactive");
		classes.push("active");
		filteredsites.push(el.attributes["data"].nodeValue);
	} else {
		classes = remove(classes, "active");
		classes.push("inactive");
		filteredsites = remove(filteredsites, el.attributes["data"].nodeValue);
	}

	el.className = classes.join(" ");

	onSearchInput();
}

function toggleoldcores() {
	let classes = getId("coretoggle").className.split(" ");

	if (classes.includes("inactive")) {
		classes = remove(classes, "inactive");
		localStorage.oldCores = "1";
		classes.push("active");
	} else {
		classes = remove(classes, "active");
		localStorage.oldCores = "0";
		classes.push("inactive");
	}
}

function sortLinks() {
	matches = [];

	for (const game of games) {
		if (
			game[0].toLowerCase().includes(getId("websearch").value.toLowerCase()) &&
			!filteredsites.includes(game[2])
		) {
			matches.push(game);
		}
	}
}

async function renderLinks() {
	main = getId("webgames");
	main.innerHTML = "";

	const startvalue = page * linksperpage;

	for (const game of matches.slice(startvalue, startvalue + linksperpage)) {
		a.textContent = game[0] + " - " + linknames[game[2]];
		a.href = game[1];
		a.style.color =
			"hsl(" +
			(360 / linknamelist.length) * linknamelist.indexOf(game[2]) +
			", 100%, 90%)";

		p.textContent = "(" + game[3] + ")";

		main.appendChild(div.cloneNode(true));
	}

	const disp = getClass("pagedisplay");

	Array.from(disp).forEach((element) => {
		element.textContent = `Page ${page + 1} of ${
			Math.floor(matches.length / linksperpage) + 1
		}`;
	});
}

async function applyLinks(games) {
	main = getId("webgames");

	const div = document.createElement("div");
	div.className = "webcontent";
	const a = document.createElement("a");
	a.className = "weblinks";
	a.setAttribute("target", "_blank");
	const p = document.createElement("p");
	p.className = "domainname";

	div.appendChild(a);
	div.appendChild(p);

	for (const game of games) {
		a.textContent = game[0] + " - " + linknames[game[2]];
		a.href = game[1];
		a.style.color =
			"hsl(" +
			(360 / linknamelist.length) * linknamelist.indexOf(game[2]) +
			", 100%, 90%)";

		p.textContent = "(" + game[3] + ")";

		main.appendChild(div.cloneNode(true));
	}
}

function nextPage() {
	if (page != Math.floor(matches.length / linksperpage)) {
		page += 1;
		renderLinks();
	}
}

function prevPage() {
	if (page != 0) {
		page -= 1;
		renderLinks();
	}
}

function onSearchInput() {
	console.log("running search input");
	page = 0;
	sortLinks();
	renderLinks();
}

function toggleEmulator() {
	let main = getId("emulatortoggle");

	if (main.textContent == "EmulatorJS") {
		localStorage.emu = "NJS";
		main.textContent = "NeptunJS";
	} else {
		localStorage.emu = "EJS";
		main.textContent = "EmulatorJS";
	}
}

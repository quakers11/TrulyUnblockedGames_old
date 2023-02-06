// page loading stuff
console.log("Advanced features:");
console.log(
	"Set session storage 'origin' to 0 to run the emulator hosted on this domain, 1 to run the loader script hosted on this domain, and 2 to run the loader script hosted elsewhere."
);
console.log(
	"Set session storage 'emuWidth' and 'emuHeight' to set a custom size for EmulatorJS."
);

let links, linknames, linknamelist;
let page = 0;
let games = [];
let matches = [];

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

fetch("../links.json")
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		links = data;
		linknamelist = Object.keys(links.names).sort();
		linknames = links.names;

		delete links.names; // delete this so we can iterate through the object without this being there

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

		updatePageDisplay();
	});

// essential functions
function getId(id) {
	return document.getElementById(id);
}

function getClass(className) {
	return document.getElementsByClassName(className);
}

// major functions
function getLocalStorage() {
	if (!localStorage.openTab) localStorage.openTab = "NES";
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
	let tablinks = getClass("tablinks");
	for (let i = 0; i < tablinks.length; i++) {
		// clears the active class from all tabs and adds the active class to the correct tab
		tablinks[i].className = tablinks[i].className.replace(" active", "");
		if (tablinks[i].className.includes(tab)) {
			tablinks[i].className += " active";
		}
	}
	let cores = getId("coretoggle");
	if (tab == "Web") {
		cores.style.display = "none";
	} else {
		cores.style.display = "inline";
	}
}

function toggleoldcores() {
	btn = getId("coretoggle");
	if (sessionStorage.oldCores == "0") {
		sessionStorage.oldCores = "1";
		btn.className = "toggle active";
	} else {
		sessionStorage.oldCores = "0";
		btn.className = "toggle inactive";
	}
}

function sortLinks() {
	matches = [];

	for (const game of games) {
		if (
			game[0].toLowerCase().includes(getId("websearch").value.toLowerCase())
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

	const disp = getId("pagedisplay");

	disp.textContent = `Page ${page + 1} of ${
		Math.floor(matches.length / linksperpage) + 1
	}`;
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

	debugger;

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
	page = 0;
	sortLinks();
	renderLinks();
}

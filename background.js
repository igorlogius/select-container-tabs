
const manifest = browser.runtime.getManifest();
const extname = manifest.name;
const extdesc = manifest.description

browser.menus.create({
	id: extname,
	title: extdesc,
	contexts: ["tab"],
	onclick: (info, tab) => { onClicked(tab); }
});

async function onClicked(tab) {

	const tabs = await browser.tabs.query({
        cookieStoreId: tab.cookieStoreId
	});

	let tmp = {};
	tmp[tab.windowId] = [tab.index];

	tabs.forEach( (t) => {
		if (typeof tmp[t.windowId] === 'undefined'){
			tmp[t.windowId] = [];
		}
		tmp[t.windowId].push(t.index);
	});

	//console.log(JSON.stringify(tmp,null,4));

	for (const [k,v] of Object.entries(tmp)) {
		browser.tabs.highlight({
			windowId: parseInt(k),
			tabs: v,
			populate: false
		});
	}

}

browser.browserAction.onClicked.addListener(onClicked);

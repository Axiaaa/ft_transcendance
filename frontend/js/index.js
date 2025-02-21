class taskbar extends HTMLElement {
	constructor() {
		super();
	}
}

class WindowComponent extends HTMLElement {
	constructor() {
	super();
	const shadow = this.attachShadow({ mode: 'open' });
	shadow.innerHTML = `
		<style>
		.window { position: absolute; border: 1px solid black; }
		</style>
		<div class="window">
		<div class="title-bar">Fenêtre</div>
		<div class="content"><slot></slot></div>
		</div>
	`;
	}
}
customElements.define('custom-window', WindowComponent);



document.body.appendChild(taskbar);
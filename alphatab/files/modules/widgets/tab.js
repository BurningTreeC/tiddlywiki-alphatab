/*\
title: $:/plugins/BTC/AlphaTab/modules/widgets/alphatab.js
type: application/javascript
module-type: widget

renders alphaTex notation to tabs

\*/
(function() {

"use strict";
/*jslint node: true, browser: true */
/*global $tw: false */

var Widget = require("$:/core/modules/widgets/widget.js").widget;

if(typeof window !== 'undefined' && !window.alphaTab) {
	window.alphaTab = require("$:/plugins/BTC/AlphaTab/lib/alphatab.js");
}

var TabWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
TabWidget.prototype = new Widget();


TabWidget.prototype.render = function(parent,nextSibling) {
	var self  = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.pNode = this.document.createElement("div");
	this.pNode.className = "tc-music-sheet";
	parent.insertBefore(this.pNode,nextSibling);
	this.api = new alphaTab.AlphaTabApi(this.pNode,);
	if(this.renderTiddler) {
		this.api.tex(this.wiki.getTiddlerText(this.renderTiddler));
	}
	this.domNodes.push(this.pNode);
};

/*
Compute the internal state of the widget
*/
TabWidget.prototype.execute = function() {
	this.renderTiddler = this.getAttribute("tiddler","");
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
TabWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.renderTiddler) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.tab = TabWidget;

})();
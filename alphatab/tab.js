/*\
title: $:/plugins/BTC/AlphaTab/modules/widgets/tab.js
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
	window.alphaTab.Environment.createStyleElement = function(e,t) {
		return false;
	};
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
	this.tabWrapperNode = this.document.createElement("div");
	this.tabWrapperNode.className = "at-wrap";
	parent.insertBefore(this.tabWrapperNode,nextSibling);
	this.loadOverlayNode = this.document.createElement("div");
	this.loadOverlayNode.className = "at-overlay";
	this.tabWrapperNode.appendChild(this.loadOverlayNode);
	this.loadOverlayContentNode = this.document.createElement("div");
	this.loadOverlayContentNode.className = "at-overlay-content";
	this.loadOverlayNode.appendChild(this.loadOverlayContentNode);
	this.loadOverLayContentTextNode = this.document.createTextNode("Music sheet is loading");
	this.loadOverlayContentNode.appendChild(this.loadOverLayContentTextNode);
	this.tabContentNode = this.document.createElement("div");
	this.tabContentNode.className = "at-content";
	this.tabWrapperNode.appendChild(this.tabContentNode);
	this.tabSidebarNode = this.document.createElement("div");
	this.tabSidebarNode.className = "at-sidebar";
	this.tabContentNode.appendChild(this.tabSidebarNode);
	this.tabSidebarContentNode = this.document.createElement("div");
	this.tabSidebarContentNode.className = "at-sidebar-content";
	this.tabSidebarNode.appendChild(this.tabSidebarContentNode);
	this.trackListNode = this.document.createElement("div");
	this.trackListNode.className = "at-track-list";
	this.tabSidebarNode.appendChild(this.trackListNode);
	this.tabViewportNode = this.document.createElement("div");
	this.tabViewportNode.className = "at-viewport";
	this.tabContentNode.appendChild(this.tabViewportNode);
	this.tabMainNode = this.document.createElement("div");
	this.tabMainNode.className = "at-main";
	this.tabViewportNode.appendChild(this.tabMainNode);
	// Controls
	this.tabControlsNode = this.document.createElement("div");
	this.tabControlsNode.className = "at-controls";
	this.tabWrapperNode.appendChild(this.tabControlsNode);
	this.tabControlsLeftNode = this.document.createElement("div");
	this.tabControlsLeftNode.className = "at-controls-left";
	this.tabControlsNode.appendChild(this.tabControlsLeftNode);
	this.playerStopNode = this.document.createElement("a");
	this.playerStopNode.className = "btn at-player-stop disabled";
	this.tabControlsLeftNode.appendChild(this.playerStopNode);
	this.playerStepBackwardNode = this.document.createElement("i");
	this.playerStepBackwardNode.className = "lui lui-step-backward";
	this.playerStopNode.appendChild(this.playerStepBackwardNode);
	this.playerPauseNode = this.document.createElement("a");
	this.playerPauseNode.className = "btn at-player-play-pause disabled";
	this.tabControlsLeftNode.appendChild(this.playerPauseNode);
	this.playerPlayNode = this.document.createElement("i");
	this.playerPlayNode.className = "lui lui-play";
	this.playerPauseNode.appendChild(this.playerPlayNode);
	this.playerProgressNode = this.document.createElement("span");
	this.playerProgressNode.className = "at-player-progress";
	this.tabControlsLeftNode.appendChild(this.playerProgressNode);
	this.playerProgressTextNode = this.document.createTextNode("0%");
	this.playerProgressNode.appendChild(this.playerProgressTextNode);
	this.playerSongInfoNode = this.document.createElement("div");
	this.playerSongInfoNode.className = "at-song-info";
	this.tabControlsLeftNode.appendChild(this.playerSongInfoNode);
	this.playerSongInfoTitleNode = this.document.createElement("span");
	this.playerSongInfoTitleNode.className = "at-song-title";
	this.playerSongInfoNode.appendChild(this.playerSongInfoTitleNode);
	this.playerSongInfoTitleArtistSeparatorNode = this.document.createTextNode(" - ");
	this.playerSongInfoNode.appendChild(this.playerSongInfoTitleArtistSeparatorNode);
	this.playerSongInfoArtistNode = this.document.createElement("span");
	this.playerSongInfoArtistNode.className = "at-song-artist";
	this.playerSongInfoNode.appendChild(this.playerSongInfoArtistNode);
	this.playerSongPositionNode = this.document.createElement("div");
	this.playerSongPositionNode.className = "at-song-position";
	this.tabControlsLeftNode.appendChild(this.playerSongPositionNode);
	this.playerSongPositionTextNode = this.document.createTextNode("00:00 / 00:00");
	this.playerSongPositionNode.appendChild(this.playerSongPositionTextNode);
	this.tabControlsRightNode = this.document.createElement("div");
	this.tabControlsRightNode.className = "at-controls-right";
	this.tabControlsNode.appendChild(this.tabControlsRightNode);
	this.playerCountInNode = this.document.createElement("a");
	this.playerCountInNode.className = "btn toggle at-count-in";
	this.tabControlsRightNode.appendChild(this.playerCountInNode);
	this.playerCountInBtnNode = this.document.createElement("i");
	this.playerCountInBtnNode.className = "lui lui-hourglass-half";
	this.playerCountInNode.appendChild(this.playerCountInBtnNode);
	this.playerMetronomeNode = this.document.createElement("a");
	this.playerMetronomeNode.className = "btn at-metronome";
	this.tabControlsRightNode.appendChild(this.playerMetronomeNode);
	this.playerMetronomeBtnNode = this.document.createElement("i");
	this.playerMetronomeBtnNode.className = "lui lui-edit";
	this.playerMetronomeNode.appendChild(this.playerMetronomeBtnNode);
	this.playerLoopNode = this.document.createElement("a");
	this.playerLoopNode.className = "btn at-loop";
	this.tabControlsRightNode.appendChild(this.playerLoopNode);
	this.playerLoopBtnNode = this.document.createElement("i");
	this.playerLoopBtnNode.className = "lui lui-retweet";
	this.playerLoopNode.appendChild(this.playerLoopBtnNode);
	this.playerPrintNode = this.document.createElement("a");
	this.playerPrintNode.className = "btn at-print";
	this.tabControlsRightNode.appendChild(this.playerPrintNode);
	this.playerPrintBtnNode = this.document.createElement("i");
	this.playerPrintBtnNode.className = "lui lui-print";
	this.playerPrintNode.appendChild(this.playerPrintBtnNode);
	this.playerZoomNode = this.document.createElement("div");
	this.playerZoomNode.className = "at-zoom";
	this.tabControlsRightNode.appendChild(this.playerZoomNode);
	this.playerZoomSearchIconNode = this.document.createElement("i");
	this.playerZoomSearchIconNode.className = "lui lui-search";
	this.playerZoomNode.appendChild(this.playerZoomSearchIconNode);
	this.playerZoomSelectNode = this.document.createElement("select");
	this.playerZoomNode.appendChild(this.playerZoomSelectNode);
	this.playerZoomOptionNode25 = this.document.createElement("option");
	this.playerZoomOptionNode25.setAttribute("value",25);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode25);
	this.playerZoomTextNode25 = this.document.createTextNode("25%");
	this.playerZoomOptionNode25.appendChild(this.playerZoomTextNode25);
	this.playerZoomOptionNode50 = this.document.createElement("option");
	this.playerZoomOptionNode50.setAttribute("value",50);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode50);
	this.playerZoomTextNode50 = this.document.createTextNode("50%");
	this.playerZoomOptionNode50.appendChild(this.playerZoomTextNode50);
	this.playerZoomOptionNode75 = this.document.createElement("option");
	this.playerZoomOptionNode75.setAttribute("value",75);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode75);
	this.playerZoomTextNode75 = this.document.createTextNode("75%");
	this.playerZoomOptionNode75.appendChild(this.playerZoomTextNode75);
	this.playerZoomOptionNode90 = this.document.createElement("option");
	this.playerZoomOptionNode90.setAttribute("value",90);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode90);
	this.playerZoomTextNode90 = this.document.createTextNode("90%");
	this.playerZoomOptionNode90.appendChild(this.playerZoomTextNode90);
	this.playerZoomOptionNode100 = this.document.createElement("option");
	this.playerZoomOptionNode100.setAttribute("value",100);
	this.playerZoomOptionNode100.setAttribute("selected",true);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode100);
	this.playerZoomTextNode100 = this.document.createTextNode("100%");
	this.playerZoomOptionNode100.appendChild(this.playerZoomTextNode100);
	this.playerZoomOptionNode110 = this.document.createElement("option");
	this.playerZoomOptionNode110.setAttribute("value",110);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode110);
	this.playerZoomTextNode110 = this.document.createTextNode("110%");
	this.playerZoomOptionNode110.appendChild(this.playerZoomTextNode110);
	this.playerZoomOptionNode125 = this.document.createElement("option");
	this.playerZoomOptionNode125.setAttribute("value",125);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode125);
	this.playerZoomTextNode125 = this.document.createTextNode("125%");
	this.playerZoomOptionNode125.appendChild(this.playerZoomTextNode125);
	this.playerZoomOptionNode150 = this.document.createElement("option");
	this.playerZoomOptionNode150.setAttribute("value",150);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode150);
	this.playerZoomTextNode150 = this.document.createTextNode("150%");
	this.playerZoomOptionNode150.appendChild(this.playerZoomTextNode150);
	this.playerZoomOptionNode200 = this.document.createElement("option");
	this.playerZoomOptionNode200.setAttribute("value",200);
	this.playerZoomSelectNode.appendChild(this.playerZoomOptionNode200);
	this.playerZoomTextNode200 = this.document.createTextNode("200%");
	this.playerZoomOptionNode200.appendChild(this.playerZoomTextNode200);
	this.tabLayoutNode = this.document.createElement("div");
	this.tabLayoutNode.className = "at-layout";
	this.tabControlsRightNode.appendChild(this.tabLayoutNode);
	this.tabLayoutSelectNode = this.document.createElement("select");
	this.tabLayoutNode.appendChild(this.tabLayoutSelectNode);
	this.tabLayoutSelectOptionHorizontalNode = this.document.createElement("option");
	this.tabLayoutSelectOptionHorizontalNode.setAttribute("value","horizontal");
	this.tabLayoutSelectNode.appendChild(this.tabLayoutSelectOptionHorizontalNode);
	this.tabLayoutSelectOptionHorizontalTextNode = this.document.createTextNode("Horizontal");
	this.tabLayoutSelectOptionHorizontalNode.appendChild(this.tabLayoutSelectOptionHorizontalTextNode);
	this.tabLayoutSelectOptionPageNode = this.document.createElement("option");
	this.tabLayoutSelectOptionPageNode.setAttribute("value","page");
	this.tabLayoutSelectOptionPageNode.setAttribute("selected",true);
	this.tabLayoutSelectNode.appendChild(this.tabLayoutSelectOptionPageNode);
	this.tabLayoutSelectOptionPageTextNode = this.document.createTextNode("Page");
	this.tabLayoutSelectOptionPageNode.appendChild(this.tabLayoutSelectOptionPageTextNode);
	// Tracks
	this.trackTemplateNode = this.document.createElement("template");
	this.trackTemplateNode.className = "at-track-template";
	parent.insertBefore(this.trackTemplateNode,nextSibling);
	this.trackNode = this.document.createElement("div");
	this.trackNode.className = "at-track";
	this.trackTemplateNode.content.appendChild(this.trackNode);
	this.trackIconNode = this.document.createElement("div");
	this.trackIconNode.className = "at-track-icon";
	this.trackNode.appendChild(this.trackIconNode);
	this.guitarIconNode = this.document.createElement("i");
	this.guitarIconNode.className = "lui lui-guitar";
	this.trackIconNode.appendChild(this.guitarIconNode);
	this.trackDetailsNode = this.document.createElement("div");
	this.trackDetailsNode.className = "at-track-details";
	this.trackNode.appendChild(this.trackDetailsNode);
	this.trackNameNode = this.document.createElement("div");
	this.trackNameNode.className = "at-track-name";
	this.trackDetailsNode.appendChild(this.trackNameNode);

	var storeEl = this.document.querySelector("script.tiddlywiki-tiddler-store"),
		tiddlerStore = JSON.parse(storeEl.textContent);

	// Helper to get a tiddler from the store by title
	function getTiddler(title) {
		for(var t=0; t<tiddlerStore.length; t++) {
			var tiddler = tiddlerStore[t];
			if(tiddler.title === title) {
				return tiddler;
			}
		}
		return undefined;
	}
	// Get the shadow tiddlers of this plugin
	var thisPlugin = getTiddler("$:/plugins/BTC/AlphaTab"),
		thisPluginTiddlers = JSON.parse(thisPlugin.text).tiddlers;
	var alphaTabjs = thisPluginTiddlers["$:/plugins/BTC/AlphaTab/lib/alphatab.js"].text,
		context = {
			exports: {}
		};
	var soundFont = thisPluginTiddlers["$:/plugins/BTC/AlphaTab/soundfont"].text,
		soundContext = {
			exports: {}
		};
	$tw.utils.evalSandboxed(alphaTabjs,context,"$:/plugins/BTC/AlphaTab/lib/alphatab.js",true);
	//$tw.utils.evalSandboxed(soundFont,soundContext,"$:/plugins/BTC/AlphaTab/soundfont",true);
	var alphaTabjsWorkers = thisPluginTiddlers["$:/plugins/BTC/AlphaTab/lib/alphatab.js"].text;

	var decodedData = alphaTabjsWorkers,
		uInt8Array = new Uint8Array(decodedData.length);
	for (var i = 0; i < decodedData.length; ++i) {
		uInt8Array[i] = decodedData.charCodeAt(i);
	}
	var blobUrl = URL.createObjectURL(new Blob([uInt8Array],{type: "application/javascript"}));

	function hexToUint8Array(hex) {
		var cleaned = hex.replace(/[^a-fA-F0-9]/g, ""); // Alle Leerzeichen, \n, etc. entfernen
		var len = cleaned.length / 2;
		var arr = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			arr[i] = parseInt(cleaned.substr(i * 2, 2), 16);
		}
		return arr;
	}
	var soundFontText = thisPluginTiddlers["$:/plugins/BTC/AlphaTab/soundfont"].text;
	var soundFontArray = hexToUint8Array(soundFontText);
	var soundFontBlobUrl = URL.createObjectURL(
		new Blob([soundFontArray], { type: "audio/sf2" })
	);
	
	this.api = new alphaTab.AlphaTabApi(this.tabMainNode,{
		core: {
			useWorkers: true,
			scriptFile: blobUrl,
			tex: true
		},
		player: {
			enablePlayer: true,
			soundFont: soundFontBlobUrl,
			enableUserInteraction: true,
			scrollElement: self.generateSelector(self.tabViewportNode)
		}
	});

	var scoreuIntArray = hexToUint8Array(this.wiki.getTiddlerText(this.renderTiddler));
	this.api.load(scoreuIntArray, [0]);

	this.api.renderStarted.on(function() {
		self.loadOverlayNode.style.display = "flex";
	});
	
	this.api.renderFinished.on(function() {
		self.loadOverlayNode.style.display = "none";
	});

	function createTrackItem(track) {
		var trackItem = self.trackTemplateNode.content.cloneNode(true).firstElementChild;
		trackItem.querySelector(".at-track-name").innerText = track.name;
		trackItem.track = track;
		trackItem.onclick = function(e) {
			e.stopPropagation();
			self.api.renderTracks([track]);
		};
		return trackItem;
	}

	this.api.scoreLoaded.on(function(score) {
		self.trackListNode.innerHTML = "";
		$tw.utils.each(score.tracks,function(track) {
			self.trackListNode.appendChild(createTrackItem(track));
		});
	});

	this.api.renderStarted.on(function() {
		var tracks = new Map();
		$tw.utils.each(self.api.tracks,function(t) {
			tracks.set(t.index,t);
		});
		var trackItems = self.trackListNode.querySelectorAll(".at-track");
		$tw.utils.each(trackItems,function(trackItem) {
			if(tracks.has(trackItem.track.index)) {
				trackItem.classList.add("active");
			} else {
				trackItem.classList.remove("active");
			}
		});
	});

	this.api.scoreLoaded.on(function(score) {
		self.tabWrapperNode.querySelector(".at-song-title").innerText = score.title;
		self.tabWrapperNode.querySelector(".at-song-artist").innerText = score.artist;
	});

	var countIn = this.tabWrapperNode.querySelector(".at-controls .at-count-in");
	countIn.onclick = function() {
		countIn.classList.toggle("active");
		if(countIn.classList.contains("active")) {
			self.api.countInVolume = 1;
		} else {
			self.api.countInVolume = 0;
		}
	};

	var metronome = this.tabWrapperNode.querySelector(".at-controls .at-metronome");
	metronome.onclick = function() {
		metronome.classList.toggle("active");
		if(metronome.classList.contains("active")) {
			self.api.metronomeVolume = 1;
		} else {
			self.api.metronomeVolume = 0;
		}
	};

	var loop = this.tabWrapperNode.querySelector(".at-controls .at-loop");
	loop.onclick = function() {
		loop.classList.toggle("active");
		self.api.isLooping = loop.classList.contains("active");
	};

	var zoom = this.tabWrapperNode.querySelector(".at-controls .at-zoom select");
	zoom.onchange = function() {
		var zoomLevel = parseInt(zoom.value) / 100;
		self.api.settings.display.scale = zoomLevel;
		self.api.updateSettings();
		self.api.render();
	};

	var layout = this.tabWrapperNode.querySelector(".at-controls .at-layout select");
	layout.onchange = function() {
		switch(layout.value) {
		case "horizontal":
			self.api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
			break;
		case "page":
			self.api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
			break;
		}
		self.api.updateSettings();
		self.api.render();
	};

	var playerIndicator = this.tabWrapperNode.querySelector(".at-controls .at-player-progress");
	this.api.soundFontLoad.on(function(e) {
		var percentage = Math.floor((e.loaded / e.total) * 100);
		playerIndicator.inerText = percentage + "%";
	});
	this.api.playerReady.on(function() {
		playerIndicator.style.display = "none";
	});

	var playPause = this.tabWrapperNode.querySelector(".at-controls .at-player-play-pause");
	var stop = this.tabWrapperNode.querySelector(".at-controls .at-player-stop");
	playPause.onclick = function(e) {
		if(e.target.classList.contains("disabled")) {
			return;
		}
		self.api.playPause();
	};
	stop.onclick = function(e) {
		if(e.target.classList.contains("disabled")) {
			return;
		}
		self.api.stop();
	};
	this.api.playerReady.on(function() {
		playPause.classList.remove("disabled");
		stop.classList.remove("disabled");
	});
	this.api.playerStateChanged.on(function(e) {
		var icon = playPause.querySelector("i.lui");
		if(e.state === alphaTab.synth.PlayerState.Playing) {
			icon.classList.remove("lui-play");
			icon.classList.add("lui-pause");
		} else {
			icon.classList.remove("lui-pause");
			icon.classList.add("lui-play");
		}
	});

	function formatDuration(milliseconds) {
		var seconds = milliseconds / 1000;
		var minutes = (seconds / 60) | 0;
		seconds = (seconds - minutes * 60) | 0;
		return (
			String(minutes).padStart(2, "0") +
			":" +
			String(seconds).padStart(2, "0")
		);
	}

	var songPosition = this.tabWrapperNode.querySelector(".at-song-position");
	var previousTime = -1;
	this.api.playerPositionChanged.on(function(e) {
		var currentSeconds = (e.currentTime / 1000) | 0;
		if(currentSeconds === previousTime) {
			return;
		}
		songPosition.innerText = formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
	});

	this.domNodes.push(this.tabWrapperNode);
};

TabWidget.prototype.getIndex = function(node) {
	var i = 1;
	var tagName = node.tagName;

	while(node.previousSibling) {
		node = node.previousSibling;
		if(
			node.nodeType === 1 &&
			tagName.toLowerCase() === node.tagName.toLowerCase()
		) {
			i++;
		}
	}

	return i;
};

TabWidget.prototype.generateSelector = function(context) {
	var index, pathSelector = "", localName;

	if(context === "null") throw "not a DOM reference";

	index = this.getIndex(context);

	while(context.tagName) {
		pathSelector = context.localName + (pathSelector ? " > " + pathSelector : "");
		context = context.parentNode;
	}

	pathSelector = pathSelector + ':nth-of-type(' + index + ')';
	console.log(pathSelector);
	return pathSelector;
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
	if(changedAttributes.renderTiddler || changedTiddlers[this.renderTiddler]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.tab = TabWidget;

})();

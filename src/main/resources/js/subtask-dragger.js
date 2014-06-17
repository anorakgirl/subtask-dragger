/*
* jQuery drag and drop functionality for Jira subtasks
* Inspired on version of anorakgirl (https://github.com/anorakgirl/subtask-dragger) with modifications by czerwiu:
* - reordering subtasks without reloading the page
* - visual DnD handle
* - fixed issue with moving subtask to the last position
* - works with Jira 5.x and 6.x
*/

function makeSubtasksSortable() { 

	var subTasksTbody = jQuery("#issuetable tbody");

	// ignore call if subtasks are already sortable
	if (subTasksTbody.hasClass("ui-sortable")) {
		return;
	}

	//Fixes problem with helper position if page has been scrolled
	jQuery("#content").css("position","static");

	subTasksTbody.sortable({
		start: rememberCurrentOrder,
		stop: updatePosition,
		appendTo: "#issuetable",
		axis: "y",
		delay: 100,
		handle: '.stsequence',
		cursor: "move"	
	});
	// adding nice drag&drop handle
	jQuery(".stsequence").prepend('<span style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJElEQVQIHWP4//8/w7lzp4HUfwam8+fP/L916yYDCDCCRGAAANedEldyQ5zxAAAAAElFTkSuQmCC);cursor:move;display:inline-block;float:left;height:100%;margin-bottom:-6px;min-height:24px;width:12px;margin-right:10px;"></span>');
	jQuery(".stsequence div").css("padding","0 40px 0 0");

}

function getCurrentOrder() {
	order = [];
	jQuery('#issuetable>tbody').children('tr').each(function(idx,elm) {
		if(elm.id)order.push(elm.id)
	});
	return order;
}

var rememberCurrentOrder = function(e,ui) {
	subtasksOrder = getCurrentOrder();
}

var updatePosition = function(e, ui) {

	oldOrder = subtasksOrder;
	newOrder = getCurrentOrder();
	
	for(i=0;i<=newOrder.length;i++) {
		id = ui.item[0].id;
		if (id == oldOrder[i]) {
			currentPos = i;
		}
		if (id == newOrder[i]) {
			newPos = i;
		} 
	}

	if (currentPos != newPos) {
		var url = ui.item.find("div.subtask-reorder").children("a").attr("href");
		var newUrl = url.replace(/subTaskSequence=\d*/,"subTaskSequence="+newPos);
		moveSubtaskAction(newUrl);
	}
	
};

function moveSubtaskAction(url) {
	// creating temp anchor, clicking and removing it
	jQuery("#issuetable tr:first-child div.subtask-reorder").append('<a id="tempMoveBtn" href="'+url+'" class="icon"><span></span></a>');
	tmpbtn = jQuery("#tempMoveBtn");
	tmpbtn[0].click();
	tmpbtn.remove();
}

jQuery(function() {
	if (jQuery("#view-subtasks").length) {
		makeSubtasksSortable();
		JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e,context) {
			makeSubtasksSortable();
		});
	}
});


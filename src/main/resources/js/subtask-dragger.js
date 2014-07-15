/*
* jQuery drag and drop functionality for Jira subtasks
* Copyright anorakgirl 2013
*/
var updatePosition = function(e, ui) {
	var url = ui.item.find("div.subtask-reorder").children("a").attr("href");
	var currentPos = getCurrentPosition(url);	
	var newPos = currentPos;

	var nextUrl = ui.item.next().find("div.subtask-reorder").children("a").attr("href");
	var prevUrl = ui.item.prev().find("div.subtask-reorder").children("a").attr("href");	

	//if there is a position below
	if (nextUrl !== undefined) {	

		var nextPos = getCurrentPosition(nextUrl);
		
		//if we are moving up, use the below index
		if (nextPos < (currentPos + 1)) {
			newPos = nextPos;
		} else if (nextPos > (currentPos + 1)) {			
			//use the prev index as we are moving down
			newPos = getCurrentPosition(prevUrl);			
		}
	} else {
		
		//we must be moving to the bottom of the table
		var prevPos = getCurrentPosition(prevUrl);	
		// if (prevPos < (currentPos - 1)) {		
			newPos = prevPos;
		// } 				
	}

	if (currentPos != newPos) {
	
		//replace the new position with the one we worked out
		var newUrl = url.replace(/subTaskSequence=\d*/,"subTaskSequence="+newPos);
	
		//go to this page
		window.location.href = newUrl;
	}
	
};

function getCurrentPosition(url) {
	var params = /.*currentSubTaskSequence=(\d*)&.*/g.exec(url);
	return parseInt(params[1]);
	
}

function makeSubtasksSortable()
{
	//Fixes problem with helper position if page has been scrolled	
	AJS.$("#content").css("position","static");

	//Add a new cell to be the grabber target
	AJS.$("#issuetable .issuerow").not(":has(\".grabber\")").prepend("<td class=\"grabber\" style=\"cursor:move;color:#ccc;\">&#8801;</td>");
	
	AJS.$("#issuetable tbody").sortable({
		stop: updatePosition,
		appendTo: "#issuetable",
		axis: "y",
		delay: 100,
		handle: '.grabber',
		cursor: "move"		
	});
}


AJS.$(document).ready(function() {
	if ( AJS.$("#view-subtasks" ).length) {
		JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e,context) {
			makeSubtasksSortable();
		});
	}
});



function loadAllPhotos () {
	db.transaction(function (tx) {
	   tx.executeSql('select * from Photos where event = ? order by created_time desc ',[ActualEvent.id] ,function (tx,results) {
			$("#list_photos").append(renderLocation(results.rows));
		   });
	}, function(e) {
		console.log(e);
	});
	



}


var renderLocation = function(locList) {
		var listObject;
		var imageObject;
		var feedObject;
		var description;
		var nameLink;
		var renderResult = [];	
		for (var i = 0; i < locList.length; i++) {

			if (locList.item(i).text) {
				description = locList.item(i).text;
			} else {
				description = "";
			}
			if (locList.item(i).website.length > 3) {
				nameLink = '<a class="whitelink" href="' + locList.item(i).website + '" target="_blank">' + locList.item(i).full_name + '</a>';
			} else {
				nameLink = locList.item(i).full_name;
			}
			listObject = $('<li class="feedlistitem mainshadow mainblock mainblockblack"></li>');
			imageObject = $('<div id="feed' + i + '" class="feeditem insetimage"style="background-image:url(' + locList.item(i).image + ')"><a target="href" new="' + locList.item(i).link + '"></a></div>');
			(function(linkurl) {
				imageObject.bind('click', {}, function() {
					window.open(linkurl);
				});
			})(locList.item(i).link);
			feedObject = '<div class="profile">';
			feedObject += '<div id="profile' + i + '" class="profileimage insetimage" style="background-image:url(' + locList.item(i).profile_picture + ')"></div>';
			feedObject += '<div class="profileinfo">';
			feedObject += '<p class="profileuser profileline">' + nameLink + ' (@' + locList.item(i).username + ')</p>';
			feedObject += '<p class="profilecaption profileline">' + description + '</p>';
			feedObject += '</div>';
			feedObject += '<div class="profiledate">' + relativeDate(+locList.item(i).created_time * 1000) + '</div>';
			feedObject += '</div>';
			listObject.html(imageObject);
			listObject.append($(feedObject));
			renderResult.push(listObject);
		}
		return renderResult;
	};
	

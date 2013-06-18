	var ActualEvent =  {} ;
	var tagList = 0;

	//funcao que cria o evento
	//funcao q lista os eventos
	//função q lista as fotos
	//montar html
	
	
	
	
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}
	
//	function loadPhotos() {
//		db.readTransaction(function (tx) {
//			tx.executeSql('SELECT  *  FROM PHOTOS WHERE fi.idEvent=? AND fi.id =?', [ActualEvent.id], function (tx, results) {
//				
//			
//			}
//			});
//	}


	
	
	var loadEvent = function() {
			var eventParamenters = getUrlVars();
			ActualEvent.id = parseFloat(eventParamenters["id"]);
			//ActualEvent.tags = getTagsList(eventParamenters["tags"]);
			ActualEvent.geo = getGeoList(eventParamenters["geo"]);
			ActualEvent.name =  eventParamenters["name"];
	}

/* 	var getTagsByEvent = function() {
	db.readTransaction(function (tx) {
			tx.executeSql('SELECT * from TAGS where idEvent=?', [ActualEvent.id], function (tx, results) {
				tags=new Array(); 
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					tags.push(row.tag);				
				}
				ActualEvent["tags"] = tags;
			}, null);
		});
	} */
	
/* 	var getTagsList = function(str) {
		var array = new Array();
		array = str.split(',');		
		return array;
	} */
	
	var getGeoList = function(str) {
		var array = new Array();
		var list = str.split(',');
		array["lat"] = parseFloat(list[0]);
		array["long"] = parseFloat(list[1]);
		array["radius"] = parseFloat(list[2]);
		return array;
	}
	
	
	var loadInstagramGeoData = function() {
		db.readTransaction(function (tx) {
			tx.executeSql('SELECT  fi.firstId  FROM firstid fi WHERE fi.idEvent=? AND fi.id =?', [ActualEvent.id,"instagram_geoData"], function (tx, results) {
				var geo = ActualEvent.geo
				if (results.rows.length > 0) {
					var row = results.rows.item(0);
					paramsInstagram = {
						client_id: "22aaafad8e8447cf883c2cbb55663de5",
						lat: geo.lat,
						lng: geo.long,
						distance: geo.radius,
						min_timestamp: Number(row.firstId)+100
					};
				}
				else {
					paramsInstagram = {
						client_id: "22aaafad8e8447cf883c2cbb55663de5",
						lat: geo.lat,
						lng: geo.long,
						distance: geo.radius,
					};
				}
				loadInstagranLocation(paramsInstagram, 1);
			}, null);
		});
	};
	
	var loadTwitterGeoData = function() {
		db.readTransaction(function (tx) {
			tx.executeSql('SELECT  fi.firstId  FROM firstid fi WHERE fi.idEvent=? AND fi.id =?', [ActualEvent.id,"twitter_Data"], function (tx, results) {
				var geo = ActualEvent.geo;
				if (results.rows.length > 0) {
				var row = results.rows.item(0);
					params = {
							geocode: geo.lat+","+geo.long+","+(geo.radius/1000)+"km",
							rpp: 50,
							include_entities: true,
							result_type: "recent"
						};
				}
				else {
					params = {
							geocode: geo.lat+","+geo.long+","+(geo.radius/1000)+"km",
							rpp: 50,
							include_entities: true,
							result_type: "recent"
						};
				}
				loadTwitterLocation(params);
			}, null);
		});
	
	
	}
	
/* 	var loadInstagramTagData = function() {
		db.readTransaction(function (tx) {
			for (tagsList = 0; tagsList < ActualEvent.tags.length; tagsList++) {
				tx.executeSql('SELECT  fi.firstId FROM firstid fi WHERE fi.idEvent=? AND fi.id =?', [ActualEvent.id,ActualEvent.tags[tagsList]], function (tx, results) {
					var geo = ActualEvent.geo
					if (results.rows.length > 0) {
						var row = results.rows.item(0);
						paramsInstagram = {
							MAX_ID: Number(row.firstId)
						};
					}
					else {
						paramsInstagram = {	};
					}
					loadInstagramTag(paramsInstagram,row.tag, 1);
				}, null);
			}
		});
	}; */
	
/* 	var loadInstagramTag = function(paramsInstagram,tag, loop) {
		var searchURL = "https://api.instagram.com/v1/tags/"+tag+"/media/recent?client_id=22aaafad8e8447cf883c2cbb55663de5";
		$.ajax({
			url: searchURL,
			type: "GET",
			dataType: "jsonp",
			cache: false,
			data: paramsInstagram,
			success: function(data) {
				console.log("Instagram Data");
				console.log(data);
				if (data.data.length > 0)
				saveInstagrams(data.data,tag);
				if ((data.data.length > 19) && (loop < 3)) {
					paramsInstagram["MAX_ID"] =  Number(data.data[19].id);
					loop = loop + 1;
					loadInstagramTag(paramsInstagram,loop);
				}
				//$("#list_photos").append(renderLocation(data.data));
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("ERROR loadInstagramTagLocation: " + textStatus);
			}
		});
	
	} */
	
	var loadInstagranLocation = function(paramsInstagram, loop) {
		console.log("loadInstagramLocation()");
		var searchURL = "https://api.instagram.com/v1/media/search";
	
		$.ajax({
			url: searchURL,
			type: "GET",
			dataType: "jsonp",
			cache: false,
			data: paramsInstagram,
			success: function(data) {
				console.log("Instagram Data");
				console.log(data);
				if (data.data.length > 0)
				saveInstagrams(data.data,"instagram_geoData");
/* 				if ((data.data.length > 19) && (loop < 3)) {
					paramsInstagram["max_timestamp"] =  Number(data.data[19].created_time);
					loop = loop + 1;
					loadInstagranLocation(paramsInstagram,loop);
				} */
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("ERROR loadGeoLocation: " + textStatus);
			}
		});
	};

	var loadTwitterLocation = function(params) {
		console.log("loadGeoLocation()");
		var searchURL = "http://search.twitter.com/search.json";
		console.log(searchURL );
		console.log(location);
		$.ajax({
			q: tag,
			url: searchURL,
			type: "GET",
			dataType: "jsonp",
			cache: false,
			include_entities: true,
			result_type: "recent"
			success: function(data) {
				console.log("success");
				console.log(data);
				if (data.results.length > 0) {
				alert("fundo");
				
				}
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("ERROR loadGeoLocation: " + textStatus);
			}
		});
	};
	
	var saveInstagrams = function(locList, searchName) {
		db.transaction(function (tx) {
				for (var i = 0; i < locList.length; i++) {
						lastInstagramCreatedDate = locList[i].created_time;
						var sqlInsert = 'INSERT OR REPLACE INTO PHOTOS (id,source,event, text, website, full_name, image, link, profile_picture, username, created_time) VALUES (?,"instagram",?,?,?,?,?,?,?,?,?) ';
						var params = [locList[i].id,ActualEvent.id, locList[i].caption? locList[i].caption.text : "" , locList[i].user.website, locList[i].user.full_name, locList[i].images.standard_resolution.url, locList[i].link, locList[i].user.profile_picture, locList[i].user.username, locList[i].created_time];
						tx.executeSql(sqlInsert,params);
					}
					firstInstagramCreatedDate = locList[0].created_time;
					savePositionLast(ActualEvent.id,searchName,lastInstagramCreatedDate,tx);
					savePositionFirst(ActualEvent.id,searchName,firstInstagramCreatedDate,tx);
				}, function(e) {
					console.log(e);
				});
	};

	var saveTwitters = function(locList) {
	db.transaction(function (tx) {
			for (var i = 0; i < locList.length; i++) {
					var lastID = locList[i].id_str;
					var sqlInsert = 'INSERT OR REPLACE INTO PHOTOS (id,source,event, text, website, full_name, image, link, profile_picture, username, created_time) VALUES (?,"twitter",1,?,?,?,?,?,?,?,?)';
					if (locList[i].entities.media) 
						var media = locList[i].entities.media[0].media_url;
					else
						var media = "";
					var params = [locList[i].id_str, locList[i].text, "http://twitter.com/"+locList[i].from_user, locList[i].from_user_name,media,"http://twitter.com/"+locList[i].from_user+"/status/"+locList[i].id_str, locList[i].profile_image_url, locList[i].from_user, new Date(locList[i].created_at).getTime().toString().substring(0,10)];
					tx.executeSql(sqlInsert,params);
				}
					savePositionLast(ActualEvent.id,"twitter_Data",lastID,tx);
					savePositionFirst(ActualEvent.id,"twitter_Data",locList[0].id_str,tx);
			}, function(e) {
				console.log(e);
			});
	};
	
	
	function savePositionFirst(idevent, id, lastadata,tx) {
	tx.executeSql('SELECT * FROM FIRSTID where idEvent=? and id=?', [idevent, id], function (tx, results) {
						if( results.rows.length > 0) {
							if (results.rows.item(0).firstId > lastadata) {
								return;
							}
						}
					var sqlInsert = 'INSERT OR REPLACE INTO FIRSTID (id,firstId,idEvent) VALUES (?,?,?)';
					var params = [id,lastadata,idevent];
					tx.executeSql(sqlInsert,params);
					})
	}
	
		function savePositionLast(idevent, id, lastadata,tx) {
		tx.executeSql('SELECT * FROM LASTID where idEvent=? and id=?', [idevent, id], function (tx, results) {
							if( results.rows.length > 0) {
								if (results.rows.item(0).lastId < lastadata) {
									return;
								}
							}
						var sqlInsert = 'INSERT OR REPLACE INTO LASTID (id,lastId,idEvent) VALUES (?,?,?)';
						var params = [id,lastadata,idevent];
						tx.executeSql(sqlInsert,params);
						})
	}
	 
	
	var renderLocation = function(locList) {
		var listObject;
		var imageObject;
		var feedObject;
		var description;
		var nameLink;
		var renderResult = [];	
		for (var i = 0; i < locList.length; i++) {

			if (locList[i].caption) {
				description = locList[i].caption.text;
			} else {
				description = "";
			}
			if (locList[i].user.website.length > 3) {
				nameLink = '<a class="whitelink" href="' + locList[i].user.website + '" target="_blank">' + locList[i].user.full_name + '</a>';
			} else {
				nameLink = locList[i].user.full_name;
			}
			listObject = $('<li class="feedlistitem mainshadow mainblock mainblockblack"></li>');
			imageObject = $('<div id="feed' + i + '" class="feeditem insetimage"style="background-image:url(' + locList[i].images.standard_resolution.url + ')"><a target="new" href="' + locList[i].link + '"></a></div>');
			(function(linkurl) {
				imageObject.bind('click', {}, function() {
					window.open(linkurl);
				});
			})(locList[i].link);
			feedObject = '<div class="profile">';
			feedObject += '<div id="profile' + i + '" class="profileimage insetimage" style="background-image:url(' + locList[i].user.profile_picture + ')"></div>';
			feedObject += '<div class="profileinfo">';
			feedObject += '<p class="profileuser profileline">' + nameLink + ' (@' + locList[i].user.username + ')</p>';
			feedObject += '<p class="profilecaption profileline">' + description + '</p>';
			feedObject += '</div>';
			feedObject += '<div class="profiledate">' + relativeDate(+locList[i].created_time * 1000) + '</div>';
			feedObject += '</div>';
			listObject.html(imageObject);
			listObject.append($(feedObject));
			renderResult.push(listObject);
		}
		return renderResult;
	};

	function codeAddress(address) {
	var geocoder;
	var map;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      geocoder = new google.maps.Geocoder();
	  var mapOptions = {
	    zoom: 17,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  }
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
		  draggable: true
      });
	  

				// Add circle overlay and bind to marker
		var circle = new google.maps.Circle({
		  map: map,
		  radius: 1000,    // 10 miles in metres
		  fillColor: '#AA0000'
		});
		circle.bindTo('center', marker, 'position');
		    google.maps.event.addListener(marker, 'dragend', function() {
			loadInstagranLocation(marker.getPosition(),1000);
			loadTwitterLocation(marker.getPosition(),1);
		});

	     var getLat =  results[0].geometry.location.Xa;
	     var getLong = results[0].geometry.location.Ya;
    } else {
		alert("não encontrado seja mais especifico");
    } 
  });
}

	NEXT = '';
	NEXTFACEBOOK = '';
	tag = 'protestosp';
	var loadInstagram = function() {

		paramsInstagram = {
			client_id: "42380a752fd0470398100dd4773dfe97"
		};

		console.log("loadInstagramLocation()");
		if (NEXT=='') {
			NEXT = "https://api.instagram.com/v1/tags/"+tag+"/media/recent";
		}
		
	
		$.ajax({
			url: NEXT,
			type: "GET",
			dataType: "jsonp",
			cache: false,
			data: paramsInstagram,
			success: function(data) {
				console.log("Instagram Data");
				console.log(data);
				if (data.data.length > 0) {
					instaTemplate = _.template($("#instagramTemplate").html());
					for (var i=0;i<data.data.length;i++)
					{ 
						elem = $(instaTemplate({data: data.data[i]}).trim());
						 $('#container').masonry().append(elem).masonry('appended', elem);
					}
					NEXT = data.pagination.next_url;
					
				}
			},
			error: function() {
				alert("error");
			}
		});
	
	}
	
		var loadFacebook = function() {
		console.log("loadFacebook()");
		if (NEXTFACEBOOK == '') {
			NEXTFACEBOOK = "https://graph.facebook.com/search?q="+tag+"&type=post";
		}
		console.log(NEXTFACEBOOK );
		$.ajax({
			url: NEXTFACEBOOK,
			success: function(data) {
				console.log("success");
				console.log(data);
				if (data.data.length > 0)
				{
				faceTemplate = _.template($("#facebookTemplate").html());
					for (var i=0;i<data.data.length;i++)
					{ 
						if (data.data[i].type == "photo") {
							data.data[i].picture = data.data[i].picture.replace("_s.jpg","_n.jpg");
							elem = $(faceTemplate({data: data.data[i]}).trim());
							$('#container').masonry().append(elem).masonry('appended', elem);
						}
					
					}
				NEXTFACEBOOK = data.paging.next;
				
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("ERROR loadGeoLocation: " + textStatus);
			}
		});
	};
	
	
	


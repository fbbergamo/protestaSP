var db = window.openDatabase('PhotoEvents', '1.0', 'Photos', 2 * 1024 * 1024);
db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTS (id INTEGER PRIMARY KEY AUTOINCREMENT,name,date,lat,long, radius)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS  PHOTOS (id text PRIMARY KEY,source,event int, text, website, full_name, image, link, profile_picture, username, created_time)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS  FIRSTID (id,firstId,IdEvent int)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS  LASTID (id,lastId,IdEvent int)');
//   tx.executeSql('INSERT INTO EVENTS (name,date,lat,long,radius) VALUES (?,DateTime(),?,?,?)',["Bienal Ibirapuera",-23.58857,-46.654538,100]);
}, function(e) {
	console.log(e);
});

function loadAllEvents () {
	db.transaction(function (tx) {
	   tx.executeSql('select * from Events',[] ,function (tx,results) {
	   		var html = "<ul data-role='listview' data-filter='true'>";
	   		for (i=0; i<results.rows.length; i++) {
	   			var evento = results.rows.item(i);
				 html += "<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c'><div class='ui-btn-inner ui-li'><div class='ui-btn-text'><a class='ui-link-inherit' rel='external' href='show.html?id="+evento.id+"&geo="+evento.lat+","+evento.long+","+evento.radius+"'><h1 class='ui-li-heading'>"+evento.name+"</h1><img src='http://maps.google.com/maps/api/staticmap?center="+evento.lat+","+evento.long+"&zoom=12&size=100x100&sensor=false'  class='ui-li-thumb'/></a></div><span class='ui-icon ui-icon-arrow-r ui-icon-shadow'>&nbsp;</span></div></li>";
			}
			html+="</ul>";
			$("#evento-lista").append(html);
		   });
	}, function(e) {
		console.log(e);
	});

}

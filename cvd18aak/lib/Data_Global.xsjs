// function getData() {
var dest = $.net.http.readDestination("EXTERNAL_HTTP_LOC");
var client = new $.net.http.Client();
  	var req = new $.web.WebRequest($.net.http.GET, "/summary");
  	client.request(req, dest);
  	var response = client.getResponse();
  	var JString = response.body.asString();
  	// 	var JString = JSON.stringify(response);// aString.Countries.length
  	var aString = JSON.parse(JString); //aString.Global.NewConfirmed
  	// $.response.setBody(JString);
  	//var aString = JSON.parse(JString).values;
  	if (aString.Countries.length !== 0) {
  		try {
  			var connection = $.db.getConnection();
  			var pstmt = connection.prepareStatement(
  				"Upsert \"DB_CVD19_1\".\"CVD19AAK.db_cvd19.tables::DD_Covid.table.Global_Data\" values(?,?,?,?,?,?,?,?) WITH PRIMARY KEY");
  			pstmt.setBatchSize(1);
  			pstmt.setInt(1, aString.Global.NewConfirmed);
  			pstmt.setInt(2, aString.Global.TotalConfirmed);
  			pstmt.setString(3, aString.Countries[0].Date);
  			pstmt.setInt(4, aString.Global.NewDeaths);
  			pstmt.setInt(5, aString.Global.TotalDeaths);
  			pstmt.setInt(6, aString.Global.NewRecovered);
  			pstmt.setInt(7, aString.Global.TotalRecovered);
  			pstmt.setString(8, aString.Countries[0].Date);
  			//pstmt.execute();
  			pstmt.addBatch();
  			pstmt.executeBatch();
  			pstmt.close();
  			connection.commit();
  			connection.close();
  			$.response.setBody("Global Data Uploaded Successfully");
  		} catch (e) {
  			$.response.setBody(e.message);
  		}
  	}
// }
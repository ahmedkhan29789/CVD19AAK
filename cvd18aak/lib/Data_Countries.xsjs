  //function getData() {
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
  				"Upsert \"DB_CVD19_1\".\"CVD19AAK.db_cvd19.tables::DD_Covid.table.Countries_Data\" values(?,?,?,?,?,?,?,?,?,?,?) WITH PRIMARY KEY");
  			pstmt.setBatchSize(aString.Countries.length);
  			for (var i = 0; i < aString.Countries.length; i++) {
  				pstmt.setString(1, aString.Countries[i].Country);
  				pstmt.setString(2, aString.Countries[i].CountryCode);
  				pstmt.setString(3, aString.Countries[i].Date);
  				pstmt.setString(4, aString.Countries[i].Slug);
  				pstmt.setInt(5, aString.Countries[i].NewConfirmed);
  				pstmt.setInt(6, aString.Countries[i].TotalConfirmed);
  				pstmt.setInt(7, aString.Countries[i].NewDeaths);
  				pstmt.setInt(8, aString.Countries[i].TotalDeaths);
  				pstmt.setInt(9, aString.Countries[i].NewRecovered);
  				pstmt.setInt(10, aString.Countries[i].TotalRecovered);
  				pstmt.setString(11, aString.Countries[i].Date);
  				pstmt.addBatch();
  				//	var str = aString[i][2];
  				//	var price = str.replace(",", ".");
  				//	pstmt.setString(3, price);
  			}
  			pstmt.executeBatch();
  			pstmt.close();
  			connection.commit();
  			connection.close();
  			$.response.setBody("Countries Data Uploaded Successfully");
  		} catch (e) {
  			$.response.setBody(e.message);
  		}
  	}
  //}
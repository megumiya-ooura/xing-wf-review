var VisumoJPTracking = VisumoJPTracking || {};

(function(){
	var config = {
		trackingUrl: "https://dpolc4ci3j.execute-api.ap-northeast-1.amazonaws.com/prod/",
		cookieName  : "VisumoJPSession",
		// AWSセッション更新間隔
		sessionUpdateInterval : 1000 * 3600
	};

	// 投稿トラッキング
	VisumoJPTracking.PhotoClick = function (param, callback) {
		ProcessClick(param, "photo", callback);
	};

	// 投稿商品トラッキング
	VisumoJPTracking.ProductClick = function (param, callback) {
		ProcessClick(param, "product", callback);
	};

	// コンバージョントラッキング
	VisumoJPTracking.Conversion = function (param) {
		var data = {
			sessionKey: null,
			isUpdate: true
		};
		GetSessionCookie(data);
		if (data.sessionKey != null) {
			// トラッキング送信
			SendTrackingData(data.sessionKey, param, "conversion");
			// セッションCookie削除
			DeleteSessionCookie();
		}
	};

	// クリック処理
	function ProcessClick(param, kind, callback) {
		var data = {
			sessionKey: null,
			updateTime: null
		};
		GetSessionCookie(data);
		var currentTime = new Date();
		if (data.sessionKey == null) {
			// セッション作成
			CreateSession(param.userid,
				function(response) {
					var obj = JSON.parse(response)
					if (obj.SessionKey != null) {
						// セッションCookie作成
						SetSessionCookie(obj.SessionKey, currentTime.getTime());
						// トラッキング送信
						SendTrackingData(obj.SessionKey, param, kind, callback);
					}
				}
			);
		} else {
			// Cookie更新
			SetSessionCookie(data.sessionKey, data.updateTime);
			// トラッキング送信
			SendTrackingData(data.sessionKey, param, kind, callback);
			
			var currentTime = new Date();
			if (data.updateTime < (currentTime.getTime() - config.sessionUpdateInterval)) {
				// セッション更新
				UpdateSession(data.sessionKey,
					function(response) {
						var obj = JSON.parse(response)
						if (obj.SessionKey != null) {
							// セッションCookie更新
							SetSessionCookie(obj.SessionKey, currentTime.getTime());
						}
						else {
							// セッションCookie削除
							DeleteSessionCookie();
						}
					}
				);
			}
		}
	}

	// セッションCookie取得
	function GetSessionCookie(data) {
		var targetCookie = config.cookieName + "=";
		var cookieData = document.cookie;
		var pos = cookieData.indexOf( targetCookie );
		if( pos != -1 ) {
			var startIndex = pos + targetCookie.length;
			var endIndex = cookieData.indexOf( ";", startIndex );
			if ( endIndex == -1 ) {
				endIndex = cookieData.length;
			}
			var result = decodeURIComponent(cookieData.substring( startIndex, endIndex )).split(",");
			
			var isValid = true;
			
			if (result.length != 2) {
				isValid = false;
			}
			else if ((result[0].length != 32 ) || (!result[0].match(/^[0-9a-zA-Z]+$/))) {
				isValid = false;
			}
			else if (!result[1].match(/^[0-9]+$/)) {
				isValid = false;
			}
			
			if (isValid) {
				data.sessionKey = result[0];
				data.updateTime = result[1];
			}
			else {
				DeleteSessionCookie();
			}
		}
	}

	// セッション生成
	function CreateSession(userid, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
		var postData = JSON.stringify({ UserId : userid});
		request.open("POST", config.trackingUrl + "session/create", true);
		request.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		request.send(postData);
	}

	// セッション更新
	function UpdateSession(sessionKey, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
		var postData = JSON.stringify({ SessionKey : sessionKey});
		request.open("POST", config.trackingUrl + "session/update", true);
		request.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		request.send(postData);
	}

	// セッションCookie設定
	function SetSessionCookie(key, updateTime) {
		var expire = new Date();
		expire.setTime( expire.getTime() + 1000 * 3600 * 24 );
		document.cookie = config.cookieName + "=" + encodeURIComponent(key + "," + updateTime) + "; path=/; expires=" + expire.toUTCString();
	}

	// セッションCookie削除
	function DeleteSessionCookie() {
		document.cookie = config.cookieName + "=; path=/; max-age=0";
	}

	// 投稿トラッキングデータ作成
	function CreatePhotoTrackingData(key, param) {
		var obj = new Object();
		obj.SessionKey = key;
		obj.UserId = param.userid;
		obj.Fqdn = location.hostname;
		obj.CollectionLogicalId = param.selection;
		obj.MediaId = param.mediaid;
		obj.Type = param.type;
		var tag = "";
		if (param.type == "selection-page") {
			tag = param.tag ? encodeURIComponent(param.tag) : "";
		}
		obj.Tag = tag;
		var productcd = "";
		if (param.type == "goods") {
			productcd = param.productcd;
		}
		obj.ProductCd = productcd;

		return JSON.stringify({ "Data" : obj});
	}

	// 商品トラッキングデータ作成
	function CreateProductTrackingData(key, param) {
		var obj = new Object();
		obj.SessionKey = key;
		obj.UserId = param.userid;
		obj.Fqdn = location.hostname;
		obj.CollectionLogicalId = param.selection;
		obj.MediaId = param.mediaid;
		obj.Type = param.type;
		var tag = "";
		if (param.type == "selection-page") {
			tag = param.tag ? encodeURIComponent(param.tag) : "";
		}
		obj.Tag = tag;
		obj.ProductCd = param.productcd;

		return JSON.stringify({ "Data" : obj});
	}

	// コンバージョントラッキングデータ作成
	function CreateConversionTrackingData(key, param) {
		var obj = new Object();
		obj.SessionKey = key;
		obj.UserId = param.userid;
		obj.Fqdn = location.hostname;
        obj.TotalPrice = param.totalprice;
        obj.Products = param.products;
		
		return JSON.stringify({ "Data" : obj});
	}

	// トラッキング送信
	function SendTrackingData(sessionKey, param, kind, callback) {
		var sendDir = "";
		var postData = null;

		if (kind == "photo") {
			sendDir = "tracking/photo";
			postData = CreatePhotoTrackingData(sessionKey, param);
		}
		else if (kind == "product") {
			sendDir = "tracking/product";
			postData = CreateProductTrackingData(sessionKey, param);
		}
		else if (kind == "conversion") {
			sendDir = "conversion";
			postData = CreateConversionTrackingData(sessionKey, param);
		}

		if ((sendDir != "") && (postData != null)) {
		    var request = new XMLHttpRequest();
		    request.onload = function () {
		        if (request.readyState !== 4) { return; }
		        if (callback) {
		            callback.apply(request, arguments);
		        }
		    };
		    request.open("POST", config.trackingUrl + sendDir, true);
		    request.timeout = 2000;
			request.setRequestHeader("content-type", "application/json");
			request.send(postData);
		}
	}
})();
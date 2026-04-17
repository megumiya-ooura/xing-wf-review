var revico= (revico || {});
(function(revico){
var $ = null;
var _revico;
(function (_revico) {
    var util;
    (function (util) {
        var loader;
        (function (loader) {
            function loadCss(urls, callback) {
                if (urls.length === 0) {
                    callback();
                    return;
                }
                var head = document.getElementsByTagName('head')[0];
                var url = urls.shift();
                if (head.querySelectorAll('link[type="text/css"][rel="stylesheet"][href="' + url + '"]').length === 0) {
                    var link = document.createElement('link');
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = url;
                    link.onload = function () {
                        loadCss(urls, callback);
                    };
                    head.appendChild(link);
                }
                else {
                    loadCss(urls, callback);
                }
            }
            loader.loadCss = loadCss;
            function loadScript(urls, callback) {
                if (urls.length === 0) {
                    callback();
                    return;
                }
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", urls.shift());
                script.onload = function () {
                    loadScript(urls, callback);
                };
                head.appendChild(script);
            }
            loader.loadScript = loadScript;
            function load(callback, appendCss, appendScript) {
                var _this = this;
                var css = _revico.config.common.cssUrls.concat(appendCss || []);
                var js = _revico.config.common.scriptUrls.concat(appendScript || []);
                loadCss(css, function () {
                    _this.loadScript(js, callback);
                });
            }
            loader.load = load;
        })(loader = util.loader || (util.loader = {}));
        var api;
        (function (api) {
            function get(url, param, timeout) {
                var defer = $.Deferred();
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: param,
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    traditional: true,
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.get = get;
            function post(url, param, timeout, noCredentials) {
                var defer = $.Deferred();
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: param,
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    xhrFields: {
                        withCredentials: !noCredentials
                    }
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.post = post;
            function reviewpostTagPost(param, timeout, noCredentials) {
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.reviewpost.apiUrlReviewPost,
                    type: 'POST',
                    data: param,
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    processData: false,
                    contentType: false,
                    xhrFields: {
                        withCredentials: !noCredentials
                    },
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.reviewpostTagPost = reviewpostTagPost;
            function getApiToken(tenantId) {
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.common.apiUrlApiToken,
                    type: 'GET',
                    headers: { tenantId: tenantId },
                    timeout: _revico.config.common.apiDefaultTimeout
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.getApiToken = getApiToken;
            function getPicturePresignedUrl(tenantId, token, timeout) {
                var _a;
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.picture.apiUrlPresignedUrl,
                    type: 'GET',
                    headers: (_a = {
                            tenantId: tenantId
                        },
                        _a[_revico.config.common.apiTokenName] = token,
                        _a),
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.getPicturePresignedUrl = getPicturePresignedUrl;
            function getMovieConvertPresignedUrl(tenantId, token, timeout) {
                var _a;
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.movieconvert.apiUrlPresignedUrl,
                    type: 'GET',
                    headers: (_a = {
                            tenantId: tenantId
                        },
                        _a[_revico.config.common.apiTokenName] = token,
                        _a),
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.getMovieConvertPresignedUrl = getMovieConvertPresignedUrl;
            function uploadToS3(presignedUrl, file, contentType, timeout) {
                var defer = $.Deferred();
                $.ajax({
                    url: presignedUrl,
                    type: 'PUT',
                    data: file,
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    processData: false,
                    contentType: contentType,
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.uploadToS3 = uploadToS3;
            function executePictureComplete(tenantId, token, param, timeout) {
                var _a;
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.picture.apiUrlComplete,
                    type: 'POST',
                    data: JSON.stringify(param),
                    headers: (_a = {
                            tenantId: tenantId
                        },
                        _a[_revico.config.common.apiTokenName] = token,
                        _a),
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    contentType: 'application/json',
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.executePictureComplete = executePictureComplete;
            function executeMovieConvert(tenantId, token, param, timeout) {
                var _a;
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.movieconvert.apiUrlExecute,
                    type: 'POST',
                    data: JSON.stringify(param),
                    headers: (_a = {
                            tenantId: tenantId
                        },
                        _a[_revico.config.common.apiTokenName] = token,
                        _a),
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    contentType: 'application/json',
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.executeMovieConvert = executeMovieConvert;
            function getMovieConvertResult(tenantId, jobId, timeout) {
                var defer = $.Deferred();
                var baseUrl = _revico.config.movieconvert.apiUrlResult;
                var searchParams = new URLSearchParams();
                searchParams.append('jobId', jobId);
                var url = "".concat(baseUrl, "?").concat(searchParams.toString());
                $.ajax({
                    url: url,
                    type: 'GET',
                    headers: {
                        tenantId: tenantId,
                    },
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.getMovieConvertResult = getMovieConvertResult;
            function postNewRelicLogApi(param, timeout) {
                var defer = $.Deferred();
                $.ajax({
                    url: _revico.config.common.apiNewRelicLog,
                    type: 'POST',
                    data: JSON.stringify(param),
                    timeout: timeout || _revico.config.common.apiDefaultTimeout,
                    contentType: 'application/json',
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer.promise();
            }
            api.postNewRelicLogApi = postNewRelicLogApi;
            function getProductDetail(param) {
                var def = $.Deferred();
                $.ajax({
                    url: _revico.config.comment.apiUrlProductV2,
                    type: 'GET',
                    data: param,
                    timeout: _revico.config.common.apiDefaultTimeout
                }).done(function (res) {
                    def.resolve(res);
                }).fail(function () {
                    $.ajax({
                        url: _revico.config.comment.apiUrlProduct,
                        type: 'GET',
                        data: param,
                        timeout: _revico.config.common.apiDefaultTimeout
                    }).done(function (res) {
                        def.resolve(res);
                    }).fail(function (error) {
                        def.reject(error);
                    });
                });
                return def.promise();
            }
            api.getProductDetail = getProductDetail;
        })(api = util.api || (util.api = {}));
        var string;
        (function (string) {
            function htmlEscape(str) {
                if (!str)
                    return '';
                return str.replace(/[<>&"'`]/g, function (match) {
                    var escape = {
                        '<': '&lt;',
                        '>': '&gt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        "'": '&#39;',
                        '`': '&#x60;',
                        '\r': '<br>',
                        '\n': '<br>',
                        '\r\n': '<br>'
                    };
                    return escape[match];
                });
            }
            string.htmlEscape = htmlEscape;
            function replaceNewLine(str) {
                if (!str)
                    return;
                return str.replace(/\r\n|\r|\n/g, function (match) {
                    var escape = {
                        '\r\n': '<br>',
                        '\r': '<br>',
                        '\n': '<br>'
                    };
                    return escape[match];
                });
            }
            string.replaceNewLine = replaceNewLine;
            function removeNewLine(str) {
                if (!str)
                    return;
                return str.replace(/\r\n|\r|\n/g, function (match) {
                    var escape = {
                        '\r\n': '',
                        '\r': '',
                        '\n': ''
                    };
                    return escape[match];
                });
            }
            string.removeNewLine = removeNewLine;
        })(string = util.string || (util.string = {}));
        var object;
        (function (object) {
            function values(obj) {
                return Object.keys(obj).map(function (e) {
                    return obj[e];
                });
            }
            object.values = values;
        })(object = util.object || (util.object = {}));
        var loading;
        (function (loading) {
            function showLoading($container) {
                var $loader = $('' +
                    '<div class="revico-loading-container">' +
                    '  <div class="revico-loading">' +
                    '    <div class="ball-pulse">' +
                    '      <div></div>' +
                    '      <div></div>' +
                    '      <div></div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>').appendTo($container);
                return $loader;
            }
            loading.showLoading = showLoading;
            function remove($container, action) {
                $container.find('.revico-loading-container').fadeOut(300, function () {
                    $(this).remove();
                    if (action) {
                        action();
                    }
                });
            }
            loading.remove = remove;
            function hide($container) {
                $container.find('.revico-loading-container').css('visibility', 'hidden');
            }
            loading.hide = hide;
        })(loading = util.loading || (util.loading = {}));
        ;
        var cookie;
        (function (cookie) {
            function get(c_name) {
                if (document.cookie.length > 0) {
                    var c_start = document.cookie.indexOf(c_name + "=");
                    if (c_start != -1) {
                        c_start = c_start + c_name.length + 1;
                        var c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) {
                            c_end = document.cookie.length;
                        }
                        return unescape(document.cookie.substring(c_start, c_end));
                    }
                }
                return "";
            }
            cookie.get = get;
            function set(c_name, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/; SameSite=None; Secure");
            }
            cookie.set = set;
            function check(c_name) {
                c_name = get(c_name);
                if (c_name != null && c_name != "") {
                    return true;
                }
                else {
                    return false;
                }
            }
            cookie.check = check;
            function getVisitorCookie() {
                return get(_revico.config.common.visitorCookieName);
            }
            cookie.getVisitorCookie = getVisitorCookie;
            function deleteIllegalVisitorCookie() {
                if (!util.cookie.get(_revico.config.common.visitorCookieName)) {
                    return;
                }
                if (util.cookie.get(_revico.config.common.visitorCookieName).match(/^[0-9a-f]{8}[-][0-9a-f]{4}[-][0-9a-f]{4}[-][0-9a-f]{4}[-][0-9a-f]{12}$/) === null) {
                    util.cookie.set(_revico.config.common.visitorCookieName, "", -1);
                }
            }
            cookie.deleteIllegalVisitorCookie = deleteIllegalVisitorCookie;
        })(cookie = util.cookie || (util.cookie = {}));
        var device;
        (function (device) {
            function useDevice() {
                if (window.innerWidth <= 768)
                    return 'sp';
                return 'pc';
            }
            device.useDevice = useDevice;
            function isPc() {
                return this.useDevice() === 'pc';
            }
            device.isPc = isPc;
        })(device = util.device || (util.device = {}));
        var calc;
        (function (calc) {
            function rate(rate) {
                var rates = (rate + "").split(".");
                var seisu = Number(rates[0]);
                var shosu = Number(rates[1] || "0");
                if (shosu >= 8) {
                    return seisu + 1;
                }
                else if (shosu < 3) {
                    return seisu;
                }
                else if (3 <= shosu && shosu < 8) {
                    return seisu + 0.5;
                }
            }
            calc.rate = rate;
        })(calc = util.calc || (util.calc = {}));
        var productmaster;
        (function (productmaster) {
            function regist($sctipt, token, tokenName, tenantId, isRegistTargetChecked) {
                if (isRegistTargetChecked === void 0) { isRegistTargetChecked = true; }
                var defer = $.Deferred();
                if (!$sctipt.text()) {
                    defer.resolve("not exists json");
                    return defer.promise();
                }
                var json = JSON.parse($sctipt.text());
                var list = [];
                if (!(json instanceof Array)) {
                    list.push(json);
                }
                else {
                    for (var i = 0; i < json.length; i++) {
                        list.push(json[i]);
                    }
                }
                var paramData = { "tenantId": tenantId, "productData": list, "isRegistTargetChecked": isRegistTargetChecked };
                paramData[tokenName] = token;
                util.api.post(_revico.config.common.apiUrlProductMasterRegist, paramData)
                    .then(function () {
                    defer.resolve();
                }).catch(function (e) { defer.resolve(e); });
                return defer.promise();
            }
            productmaster.regist = regist;
        })(productmaster = util.productmaster || (util.productmaster = {}));
        var localStrage;
        (function (localStrage) {
            function storageAvailable(type) {
                if (type === void 0) { type = 'localStorage'; }
                try {
                    var storage = window[type], x = '__storage_test__';
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    return true;
                }
                catch (e) {
                    return e instanceof DOMException && (e.code === 22 ||
                        e.code === 1014 ||
                        e.name === 'QuotaExceededError' ||
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                        storage.length !== 0;
                }
            }
            localStrage.storageAvailable = storageAvailable;
            function get(key) {
                return window.localStorage.getItem(key);
            }
            localStrage.get = get;
            function set(key, value) {
                window.localStorage.setItem(key, value);
            }
            localStrage.set = set;
            function remove(key) {
                return window.localStorage.removeItem(key);
            }
            localStrage.remove = remove;
            function deleteIllegalVisitorCookie() {
                if (util.localStrage.storageAvailable()) {
                    if (!util.localStrage.get(_revico.config.common.visitorCookieName)) {
                        return;
                    }
                    if (util.localStrage.get(_revico.config.common.visitorCookieName).match(/^[0-9a-f]{8}[-][0-9a-f]{4}[-][0-9a-f]{4}[-][0-9a-f]{4}[-][0-9a-f]{12}$/) === null) {
                        window.localStorage.removeItem(_revico.config.common.visitorCookieName);
                    }
                }
            }
            localStrage.deleteIllegalVisitorCookie = deleteIllegalVisitorCookie;
        })(localStrage = util.localStrage || (util.localStrage = {}));
        var sns;
        (function (sns) {
            function makeTwitterUrl(productUrl, reviewerName, reviewRating, reviewComment, productName) {
                productUrl = productUrl || "";
                var url = "https://x.com/intent/tweet?";
                var leader = "…";
                var text = "".concat(reviewerName, "\u3055\u3093\u306B\u3088\u308B\u300C").concat(productName, "\u300D\u306E\u30EC\u30D3\u30E5\u30FC\n");
                text += "\u8A55\u4FA1: ";
                text += "".concat(Array(parseInt(reviewRating) + 1).join('★'), "\n");
                var noCommentText = text;
                if (reviewComment.length < 30) {
                    text += "\u300C".concat(reviewComment, "\u300D");
                }
                else {
                    text += "\u300C".concat(reviewComment.substring(0, 29)).concat(leader, "\u300D\n");
                }
                var param = "";
                param += "url=" + encodeURIComponent(addRevico(productUrl));
                try {
                    param += "&text=" + encodeURIComponent(text);
                }
                catch (e) {
                    param += "&text=" + encodeURIComponent(noCommentText);
                }
                param += "&hashtags=ReviCo";
                return url + param;
            }
            sns.makeTwitterUrl = makeTwitterUrl;
            function makeFacebookUrl(productUrl) {
                productUrl = productUrl || "";
                var url = "https://www.facebook.com/sharer/sharer.php?";
                var param = "";
                param += "u=" + encodeURIComponent(addRevico(productUrl));
                return url + param;
            }
            sns.makeFacebookUrl = makeFacebookUrl;
            function makeLineUrl(productUrl, reviewerName, reviewRating, reviewComment, productName) {
                productUrl = productUrl || "";
                var url = "https://line.me/R/msg/text/?";
                var leader = "…";
                var text = "".concat(reviewerName, "\u3055\u3093\u306B\u3088\u308B\u300C").concat(productName, "\u300D\u306E\u30EC\u30D3\u30E5\u30FC\n");
                text += "\u8A55\u4FA1: ";
                text += "".concat(Array(parseInt(reviewRating) + 1).join('★'), "\n");
                var noCommentText = text;
                if (reviewComment.length < 30) {
                    text += "\u300C".concat(reviewComment, "\u300D");
                }
                else {
                    text += "\u300C".concat(reviewComment.substring(0, 29)).concat(leader, "\u300D\n");
                }
                text += "\u8A73\u7D30\u306F\u3053\u3061\u3089\u3067\u30C1\u30A7\u30C3\u30AF\uFF01\n";
                text += addRevico(productUrl) + "\n";
                noCommentText += "\u8A73\u7D30\u306F\u3053\u3061\u3089\u3067\u30C1\u30A7\u30C3\u30AF\uFF01\n";
                noCommentText += addRevico(productUrl) + "\n";
                try {
                    return url + encodeURIComponent(text);
                }
                catch (e) {
                    return url + encodeURIComponent(noCommentText);
                }
            }
            sns.makeLineUrl = makeLineUrl;
            function addRevico(url) {
                if (url.indexOf('?') >= 0) {
                    return url + '&revico';
                }
                return url + '?revico';
            }
        })(sns = util.sns || (util.sns = {}));
        var ga;
        (function (ga_1) {
            function send(action, category, label) {
                var revicoAction = _revico.config.common.gaSendPrefix + action;
                var revicoCategory = _revico.config.common.gaSendPrefix + category;
                if (window.gtag) {
                    var gtag = window.gtag;
                    gtag('event', revicoAction, {
                        'event_category': revicoCategory, 'event_label': label,
                        'non_interaction': true,
                    });
                    gtag({
                        'event': revicoAction,
                        'event_category': revicoCategory,
                        'event_label': label
                    });
                }
                if (window.ga) {
                    var ga_2 = window.ga;
                    ga_2(function () {
                        var trackers = ga_2.getAll();
                        for (var i = 0; i < trackers.length; i++) {
                            var trackerName = trackers[i].get('name');
                            if (trackerName === 't0') {
                                ga_2('send', 'event', revicoCategory, revicoAction, label, { 'nonInteraction': 1 });
                            }
                            else {
                                ga_2(trackerName + '.send', 'event', revicoCategory, revicoAction, label, { 'nonInteraction': 1 });
                            }
                        }
                    });
                }
            }
            ga_1.send = send;
        })(ga = util.ga || (util.ga = {}));
        var dom;
        (function (dom) {
            function isWatch($target) {
                var t = $target.offset().top;
                var p = t - $(window).height();
                if ($(window).scrollTop() > p && t > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            dom.isWatch = isWatch;
        })(dom = util.dom || (util.dom = {}));
        var email;
        (function (email_1) {
            function check(email) {
                var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return reg.test(email);
            }
            email_1.check = check;
        })(email = util.email || (util.email = {}));
    })(util = _revico.util || (_revico.util = {}));
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var config;
    (function (config) {
        var common;
        (function (common) {
            common.frontUrl = "https://show.revico.jp";
            common.apiUrl = "https://show.revico.jp";
            common.scriptUrls = ["https://show.revico.jp/lib/jquery/dist/jquery.min.js"];
            common.cssUrls = ["https://show.revico.jp/css/default.css"];
            common.cssUrlDotSlider = "https://show.revico.jp/css/dot_slider.css";
            common.cssUrlModal = "https://show.revico.jp/css/modal.css";
            common.apiUrlLayout = "https://show.revico.jp/api/rating/layout.json";
            common.apiUrlCookie = "https://show.revico.jp/api/visitorcookie/new_cookie.json";
            common.apiUrlCookieReflect = "https://show.revico.jp/api/visitorcookie/reflect";
            common.apiUrlConversionLogSaveAccess = "https://show.revico.jp/apigw/conversion_log/save_access";
            common.apiUrlConversionLogSaveAccessV2 = "https://show.revico.jp/api2/conversion_log/save_access";
            common.apiUrlConversionLogSaveStaffReviewClick = "https://show.revico.jp/apigw/conversion_log/save_staffreview_click";
            common.apiUrlPvsend = "https://show.revico.jp/api/rating/area_view";
            common.apiUrlRichSnippet = "https://show.revico.jp/api/rating/rich_snippet.json";
            common.apiUrlRichSnippetV2 = "https://show.revico.jp/api2/rating/rich_snippet.json";
            common.apiUrlAddHelpful = "https://show.revico.jp/api/rating/add_helpful";
            common.apiUrlAddLike = "https://show.revico.jp/api/rating/add_like";
            common.apiUrlApiToken = "https://show.revico.jp/apigw/apitoken";
            common.apiUrlPurchaseComplete = "https://show.revico.jp/api/purchase/complete";
            common.apiUrlPurchaseCompleteForShopify = "https://show.revico.jp/api/purchase/complete_for_shopify";
            common.apiUrlConversionLogSaveConversion = "https://show.revico.jp/apigw/conversion_log/save_conversion";
            common.apiUrlProductMasterRegist = "https://show.revico.jp/api/productmaster/regist";
            common.apiUrlMailAddressSave = "https://mail.revico.jp/api/mail/mailaddresssave";
            common.apiUrlSendRequestReviewMail = "https://show.revico.jp/api/purchase/sendmail";
            common.apiUrlClickTracking = "https://show.revico.jp/api/reviewclick/add";
            common.apiUrlLineLinkRegist = "https://show.revico.jp/api/linelink/regist";
            common.apiUrlRegisterProductStockAndPrice = "https://show.revico.jp/api/productmaster/register_stock_and_price";
            common.frontUrlPutRevicoCookie = "https://show.revico.jp/putrevicocookie";
            common.apiDefaultTimeout = 60 * 1000;
            common.visitorCookieName = "revico-visitor-id";
            common.visitorCookieExpiredays = 365 * 10;
            common.visitorCookieDefaultId = "00000000-0000-0000-0000-000000000000";
            common.commentAnchor = "#revico-comment";
            common.commentAnchorParamStar = "revico-star-rating";
            common.gaSendPrefix = "revico_";
            common.productMasterCreateJsonId = "#revico-productmaster-data";
            common.revicoLogoClickAreaWidth = 150;
            common.revicoLogoClickUrl = 'https://www.revico.net/?from=revico_logo';
            common.revicoPutCookiePrefix = "revico-putrevicocookie:";
            common.reflectHistoryName = "revico_reflect_hist";
            common.noImagePath = "https://show.revico.jp/img/no_image.png";
            common.apiTokenName = "__RevicoApiRequestVerificationToken";
            common.apiNewRelicLog = "https://show.revico.jp/log/v1";
            common.guidEmpty = "00000000-0000-0000-0000-000000000000";
        })(common = config.common || (config.common = {}));
        var click;
        (function (click) {
            click.image = "image";
            click.movie = "movie";
            click.product = "product";
            click.more = "more";
            click.page = "page";
            click.search = "search";
            click.best_helpful = "best_helpful";
            click.worst_helpful = "worst_helpful";
            click.helpful = "helpful";
            click.sort_date = "sort_date";
            click.sort_helpful = "sort_helpful";
            click.sort_like = "sort_like";
            click.sort_rate = "sort_rate";
            click.write_review = "write_review";
            click.comment_more = "comment_more";
            click.twitter = "twitter";
            click.facebook = "facebook";
            click.line = "line";
            click.star_link = "star_link";
            click.graph_n_star = "graph_${star}_star";
        })(click = config.click || (config.click = {}));
        var star;
        (function (star) {
            star.cssUrls = ["https://show.revico.jp/css/star.css"];
            star.apiUrlStar = "https://show.revico.jp/api/rating/star.json";
            star.apiUrlStarV2 = "https://show.revico.jp/api2/stars";
            star.layoutTypeStarSimple = 1;
        })(star = config.star || (config.star = {}));
        var picture;
        (function (picture) {
            picture.cssUrls = ["https://show.revico.jp/css/picture.css"];
            picture.apiUrlPicture = "https://show.revico.jp/api/rating/picture.json";
            picture.apiUrlReview = "https://show.revico.jp/api/rating/review.json";
            picture.apiUrlPresignedUrl = "https://show.revico.jp/apigw/picture/presigned_url";
            picture.apiUrlComplete = "https://show.revico.jp/apigw/picture/complete";
        })(picture = config.picture || (config.picture = {}));
        var comment;
        (function (comment) {
            comment.cssUrls = ["https://show.revico.jp/css/comment.css"];
            comment.apiUrlComment = "https://show.revico.jp/api/rating/comment.json";
            comment.apiUrlFilter = "https://show.revico.jp/api/rating/comment_filter.json";
            comment.apiUrlTag = "https://show.revico.jp/api/reviewword/tag.json";
            comment.apiUrlProduct = "https://show.revico.jp/api/productmaster/product_detail.json";
            comment.apiUrlProductV2 = "https://show.revico.jp/api2/products";
            comment.reviewUrl = "https://show.revico.jp/Review/Index";
            comment.commentLimit = 5;
            comment.commentLimitSp = 5;
            comment.viewProductCommentReview = 'comment';
            comment.viewAllCommentReview = 'commentAll';
        })(comment = config.comment || (config.comment = {}));
        var tagmanager;
        (function (tagmanager) {
            tagmanager.apiUrlTagmanager = "https://show.revico.jp/apigw/tagmanager/tagitems";
            tagmanager.apiUrlTagmanagerV2 = "https://show.revico.jp/api2/tagmanager/tagitems";
        })(tagmanager = config.tagmanager || (config.tagmanager = {}));
        var revisitmodal;
        (function (revisitmodal) {
            revisitmodal.cssUrls = ["https://show.revico.jp/css/revisit-modal.css", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"];
            revisitmodal.apiUrlRevisitModal = "https://show.revico.jp/api/revisit/revisit_modal.json?";
            revisitmodal.reviewUrl = "https://show.revico.jp/Review/Index";
            revisitmodal.modalIconClicked = "revico-revisit-modal--icon-clicked";
            revisitmodal.modalBodyOpen = "revico-revisit-modal--body-open";
            revisitmodal.modalIconDisplayableDateName = "revico-icon-displayable-date";
            revisitmodal.modalIconDefaultHiddenDays = 1;
        })(revisitmodal = config.revisitmodal || (config.revisitmodal = {}));
        var revisitbanner;
        (function (revisitbanner) {
            revisitbanner.cssUrls = ["https://show.revico.jp/css/revisit_banner.css", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"];
            revisitbanner.apiUrlRevisitBanner = "https://show.revico.jp/api/revisit/revisit_banner.json?";
            revisitbanner.reviewUrl = "https://show.revico.jp/Review/Index";
        })(revisitbanner = config.revisitbanner || (config.revisitbanner = {}));
        var barcodereader;
        (function (barcodereader) {
            barcodereader.cssUrls = ["https://show.revico.jp/css/barcode_reader.css", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"];
            barcodereader.scriptUrls = ["https://webrtc.github.io/adapter/adapter-latest.js", "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js"];
            barcodereader.apiUrlProduct = "https://show.revico.jp/api/productmaster/product_detail_jan.json";
            barcodereader.apiUrlTenantOption = "https://show.revico.jp/api/tenantoption/tenantoption.json";
            barcodereader.apiUrlBarcodeReaderHelp = "https://revico-develop-public.s3-ap-northeast-1.amazonaws.com/barcode_reader_help/barcode-reader_help.html";
            barcodereader.reviewUrl = "https://show.revico.jp/Review/Index";
            barcodereader.barcodeReaderOption = 5;
        })(barcodereader = config.barcodereader || (config.barcodereader = {}));
        var message;
        (function (message) {
            message.noReview = "レビューはありません。";
        })(message = config.message || (config.message = {}));
        (function (message) {
            message.noPicture = "投稿画像はありません。";
        })(message = config.message || (config.message = {}));
        var multicommentcommon;
        (function (multicommentcommon) {
            var endpublishreviewbehavior;
            (function (endpublishreviewbehavior) {
                endpublishreviewbehavior.showAll = "show_all";
                endpublishreviewbehavior.showReviewDisableLink = "show_review_disable_link";
                endpublishreviewbehavior.hideAll = "hide_all";
            })(endpublishreviewbehavior = multicommentcommon.endpublishreviewbehavior || (multicommentcommon.endpublishreviewbehavior = {}));
        })(multicommentcommon = config.multicommentcommon || (config.multicommentcommon = {}));
        var multicomment;
        (function (multicomment) {
            multicomment.cssUrls = ["https://show.revico.jp/css/multi_comment.css", "https://show.revico.jp/css/multi_comment_sp.css"];
            multicomment.filterTypeNameAccordion = "accordion";
        })(multicomment = config.multicomment || (config.multicomment = {}));
        var multicommentslider;
        (function (multicommentslider) {
            multicommentslider.cssUrls = ["https://show.revico.jp/css/multi_comment_slider.css", "https://show.revico.jp/css/multi_comment_slider_sp.css"];
        })(multicommentslider = config.multicommentslider || (config.multicommentslider = {}));
        var productautoregister;
        (function (productautoregister) {
            productautoregister.apiUrlProductAutoRegister = "https://show.revico.jp/api/productmaster/product_auto_register.json";
        })(productautoregister = config.productautoregister || (config.productautoregister = {}));
        var reviewranking;
        (function (reviewranking) {
            reviewranking.cssUrls = ["https://show.revico.jp/css/ranking.css", "https://show.revico.jp/css/ranking_sp.css"];
            reviewranking.apiUrlReviewRanking = "https://show.revico.jp/api/reviewranking/ranking.json";
        })(reviewranking = config.reviewranking || (config.reviewranking = {}));
        var reviewpost;
        (function (reviewpost) {
            reviewpost.cssUrls = ["https://show.revico.jp/css/review_post.css", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"];
            reviewpost.apiUrlReviewPost = "https://show.revico.jp/api/reviewposttag";
            reviewpost.apiUrlRequiredEvaluationItems = "https://show.revico.jp/api/reviewposttag/required_evaluation_items.json";
            reviewpost.apiUrlRequiredReviewerAttributes = "https://show.revico.jp/api/reviewposttag/required_reviewer_attributes.json";
            var postAllowType;
            (function (postAllowType) {
                postAllowType.onlyECMember = 'OnlyECMember';
            })(postAllowType = reviewpost.postAllowType || (reviewpost.postAllowType = {}));
            var reviewformstatus;
            (function (reviewformstatus) {
                reviewformstatus.reviewable = "Reviewable";
                reviewformstatus.notTarget = "NotTarget";
                reviewformstatus.reReview = "ReReview";
                reviewformstatus.complete = "Complete";
                reviewformstatus.requiredLogin = "RequiredLogin";
                reviewformstatus.internalError = "InternalError";
                reviewformstatus.serverError = "ServerError";
            })(reviewformstatus = reviewpost.reviewformstatus || (reviewpost.reviewformstatus = {}));
            var reviewpoststatus;
            (function (reviewpoststatus) {
                reviewpoststatus.beforePost = "BeforePost";
                reviewpoststatus.posting = "Posting";
                reviewpoststatus.uploadingMedia = "UploadingMedia";
                reviewpoststatus.validationError = "ValidationError";
            })(reviewpoststatus = reviewpost.reviewpoststatus || (reviewpost.reviewpoststatus = {}));
        })(reviewpost = config.reviewpost || (config.reviewpost = {}));
        var movieconvert;
        (function (movieconvert) {
            movieconvert.apiUrlPresignedUrl = "https://show.revico.jp/apigw/movie_convert/presigned_url";
            movieconvert.apiUrlExecute = "https://show.revico.jp/apigw/movie_convert/execute";
            movieconvert.apiUrlResult = "https://show.revico.jp/apigw/movie_convert/result";
        })(movieconvert = config.movieconvert || (config.movieconvert = {}));
        var reviewoverview;
        (function (reviewoverview) {
            reviewoverview.cssUrls = ["https://show.revico.jp/css/review_overview.css"];
            reviewoverview.apiUrlGetOverview = "https://show.revico.jp/api/reviewoverview";
        })(reviewoverview = config.reviewoverview || (config.reviewoverview = {}));
        var reviewproductlist;
        (function (reviewproductlist) {
            reviewproductlist.reviewProductListUrl = "https://show.revico.jp/ReviewProductList/List";
        })(reviewproductlist = config.reviewproductlist || (config.reviewproductlist = {}));
        var singlereview;
        (function (singlereview) {
            singlereview.cssUrls = ["https://show.revico.jp/css/single_review/single_review.css", "https://show.revico.jp/css/single_review/single_review_sp.css"];
            singlereview.apiUrlSingleReview = "https://show.revico.jp/api2/reviews";
        })(singlereview = config.singlereview || (config.singlereview = {}));
        var addtowishlistbutton;
        (function (addtowishlistbutton) {
            addtowishlistbutton.cssUrls = ["https://show.revico.jp/css/add_to_wishlist_button/add_to_wishlist_button.css", "https://show.revico.jp/css/add_to_wishlist_button/mail_modal.css"];
            addtowishlistbutton.apiUrlProductDetailsList = "https://show.revico.jp/api/productmaster/product_detail_list.json";
            addtowishlistbutton.apiUrlSaveMailAddress = "https://mail.revico.jp/api/wishlistremindmail/save_mailaddress";
            addtowishlistbutton.apiUrlOptoutMailAddress = "https://mail.revico.jp/api/wishlistremindmail/optout";
            addtowishlistbutton.apiUrlOptinMailAddress = "https://mail.revico.jp/api/wishlistremindmail/optin";
            addtowishlistbutton.apiUrlAddToWishlist = "https://show.revico.jp/api/wishlist/add";
            addtowishlistbutton.apiUrlGetWishlistRemindMailTarget = "https://show.revico.jp/api/wishlist/mailtarget";
            addtowishlistbutton.apiUrlGetTenantPrivacyPolicyUrl = "https://show.revico.jp/api/tenant/privacy_policy_url.json";
            var layouttagparam;
            (function (layouttagparam) {
                layouttagparam.IS_CART = 'IsCartPage';
                layouttagparam.TENANT_MEMBER_CD = 'TenantMemberCdIdAttribute';
                layouttagparam.DELETE_ITEM_FROM_CART_API_URL = 'DeleteItemFromCartAPIUrl';
                layouttagparam.ALLOW_TENANT_MEMBER_MAIL_DELIVERY = 'AllowTenantMemberMailDeliveryIdAttribute';
                layouttagparam.TENANT_MEMBER_MAIL_ADDRESS = 'TenantMemberMailAddressIdAttribute';
                layouttagparam.SHOW_NEW_FEATURE_NOTICE = 'ShowNewFeatureNotice';
                layouttagparam.MAX_SHOW_NOTICE_COUNT = 'MaxShowNoticeCount';
            })(layouttagparam = addtowishlistbutton.layouttagparam || (addtowishlistbutton.layouttagparam = {}));
        })(addtowishlistbutton = config.addtowishlistbutton || (config.addtowishlistbutton = {}));
        var showwishlistbutton;
        (function (showwishlistbutton) {
            showwishlistbutton.cssUrls = ["https://show.revico.jp/css/show_wishlist_button.css"];
            var layouttagparam;
            (function (layouttagparam) {
                layouttagparam.WISHLIST_PAGE_URL = 'WishlistPageUrl';
                layouttagparam.TENANT_MEMBER_CD = 'TenantMemberCdIdAttribute';
            })(layouttagparam = showwishlistbutton.layouttagparam || (showwishlistbutton.layouttagparam = {}));
        })(showwishlistbutton = config.showwishlistbutton || (config.showwishlistbutton = {}));
        var wishlist;
        (function (wishlist) {
            wishlist.cssUrls = ["https://show.revico.jp/css/wishlist/wishlist_base.css"];
            wishlist.ViewExtendedCssUrls = {
                LIST: ["https://show.revico.jp/css/wishlist/list_view.css"],
                GRID: ["https://show.revico.jp/css/wishlist/grid_view.css"]
            };
            wishlist.apiUrlDeleteFromWishlist = "https://show.revico.jp/api/wishlist/delete";
            wishlist.apiUrlProductDetailsList = "https://show.revico.jp/api/productmaster/product_detail_list.json";
            wishlist.apiUrlGetWishlist = "https://show.revico.jp/api/wishlist/wishlist";
            wishlist.cartDefenderLogoImageUrl = "https://show.revico.jp/img/revico_cartdefender_logo.png";
            var layouttagparam;
            (function (layouttagparam) {
                layouttagparam.TENANT_MEMBER_CD = 'TenantMemberCdIdAttribute';
                layouttagparam.ADD_TO_CART_API_URL = 'AddToCartApiUrl';
                layouttagparam.WISHLIST_VIEW_TYPE = 'WishlistViewType';
            })(layouttagparam = wishlist.layouttagparam || (wishlist.layouttagparam = {}));
        })(wishlist = config.wishlist || (config.wishlist = {}));
        var wishlistreminderwidget;
        (function (wishlistreminderwidget) {
            wishlistreminderwidget.cssUrls = ["https://show.revico.jp/css/wishlist_reminder_widget.css", "https://show.revico.jp/lib/swiper/swiper-bundle.min.css"];
            wishlistreminderwidget.scriptUrls = ["https://show.revico.jp/lib/swiper/swiper-bundle.min.js"];
            wishlistreminderwidget.apiUrlProductDetailsList = "https://show.revico.jp/api/productmaster/product_detail_list.json";
            wishlistreminderwidget.apiUrlGetWishlist = "https://show.revico.jp/api/wishlist/wishlist";
            var swiper;
            (function (swiper) {
                swiper.SWIPER_SLIDES_PER_VIEW_SP = 2.6;
                swiper.SWIPER_SPACE_BETWEEN_SP = '18px';
                swiper.SWIPER_SLIDES_PER_VIEW_PC = 4;
                swiper.SWIPER_SPACE_BETWEEN_PC = '22px';
                swiper.SWIPER_BREAKPOINT = 768;
                swiper.API_CHUNK_SIZE = 10;
            })(swiper = wishlistreminderwidget.swiper || (wishlistreminderwidget.swiper = {}));
            var layouttagparam;
            (function (layouttagparam) {
                layouttagparam.WISHLIST_PAGE_URL = 'WishlistPageUrl';
                layouttagparam.SLIDES_PER_VIEW_SP = 'SlidesPerViewSP';
                layouttagparam.SLIDES_PER_VIEW_PC = 'SlidesPerViewPC';
                layouttagparam.SPACE_BETWEEN_SP = 'SpaceBetweenSP';
                layouttagparam.SPACE_BETWEEN_PC = 'SpaceBetweenPC';
            })(layouttagparam = wishlistreminderwidget.layouttagparam || (wishlistreminderwidget.layouttagparam = {}));
        })(wishlistreminderwidget = config.wishlistreminderwidget || (config.wishlistreminderwidget = {}));
        var addtocartcountpopup;
        (function (addtocartcountpopup) {
            addtocartcountpopup.cssUrls = ["https://show.revico.jp/css/add_to_cart_count_popup/add_to_cart_count_popup.css"];
            addtocartcountpopup.SHOW_POPUP_DURATION = 10000;
            addtocartcountpopup.apiUrlUserCount = "https://show.revico.jp/api/cartdefendersummary/user_count.json";
            var layouttagparam;
            (function (layouttagparam) {
                layouttagparam.WISHLIST_PAGE_URL = 'WishlistPageUrl';
                layouttagparam.TENANT_MEMBER_CD = 'TenantMemberCdIdAttribute';
            })(layouttagparam = addtocartcountpopup.layouttagparam || (addtocartcountpopup.layouttagparam = {}));
        })(addtocartcountpopup = config.addtocartcountpopup || (config.addtocartcountpopup = {}));
        var balloonTooltip;
        (function (balloonTooltip) {
            balloonTooltip.cssUrls = ["https://show.revico.jp/css/balloon_tooltip.css"];
            balloonTooltip.storageKey = "revico-cart-defender--tooltip-show-count";
        })(balloonTooltip = config.balloonTooltip || (config.balloonTooltip = {}));
        var mergewishlist;
        (function (mergewishlist) {
            mergewishlist.apiUrlGetWishlist = "https://show.revico.jp/api/wishlist/wishlist";
            mergewishlist.lastTenantMemberCdStorageKey = "revico-cart-defender--last-tenant-member-cd";
        })(mergewishlist = config.mergewishlist || (config.mergewishlist = {}));
        var cartdefendercommon;
        (function (cartdefendercommon) {
            cartdefendercommon.storageKey = "revico-cart-defender--wishlist";
            cartdefendercommon.storageType = 'localStorage';
            cartdefendercommon.cookieExpiredays = 7;
            cartdefendercommon.MAX_WISHLIST_ITEMS = 100;
            cartdefendercommon.DEFAULT_VISIBLE_ITEMS_COUNT = 10;
            cartdefendercommon.wishlistUserIdStorageKey = "revico-cart-defender--wishlist-user-id";
            cartdefendercommon.oldWishlistUserIdStorageKey = "revico-cart-defender--old-wishlist-user-id";
            cartdefendercommon.wishlistSyncExpireUtcStorageKey = "revico-cart-defender--wishlist-sync-expire-utc";
            cartdefendercommon.wishlistSyncReleaseVersionStorageKey = "revico-cart-defender--wishlist-sync-release-version";
            cartdefendercommon.wishlistSyncReleaseVersion = "20260218_1";
            var allowmailsend;
            (function (allowmailsend) {
                allowmailsend.cookieName = "revico-cart-defender--allow-mail-send";
                allowmailsend.cookieExpiredays = 7;
            })(allowmailsend = cartdefendercommon.allowmailsend || (cartdefendercommon.allowmailsend = {}));
            var mailaddressdialog;
            (function (mailaddressdialog) {
                mailaddressdialog.cookieName = "revico-cart-defender--displayable-mailaddress-dialog";
                mailaddressdialog.cookieExpiredays = 1;
                mailaddressdialog.cookieExpiredaysNeverShow = 365;
            })(mailaddressdialog = cartdefendercommon.mailaddressdialog || (cartdefendercommon.mailaddressdialog = {}));
            cartdefendercommon.apiUrlWishlistUserEventLog = "https://show.revico.jp/apigw/wishlistuser-event-log";
            var wishlistUserEventType;
            (function (wishlistUserEventType) {
                wishlistUserEventType["AddToCart"] = "AddToCart";
                wishlistUserEventType["AddToCartFromWishlist"] = "AddToCartFromWishlist";
                wishlistUserEventType["AddToWishlist"] = "AddToWishlist";
                wishlistUserEventType["RemoveFromWishlist"] = "RemoveFromWishlist";
                wishlistUserEventType["ClickWidget"] = "ClickWidget";
            })(wishlistUserEventType = cartdefendercommon.wishlistUserEventType || (cartdefendercommon.wishlistUserEventType = {}));
        })(cartdefendercommon = config.cartdefendercommon || (config.cartdefendercommon = {}));
        var event;
        (function (event) {
            event.VIEWPORT_SCROLL_EVENT = 'revico-cart-defender--wishlist: loadMoreItems';
        })(event = config.event || (config.event = {}));
    })(config = _revico.config || (_revico.config = {}));
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var RichSnippet = (function () {
        function RichSnippet() {
            this._addClass = "revico-merge-product-json";
        }
        RichSnippet.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        RichSnippet.prototype.putRichSnippetTag = function (tenantId, productCd) {
            var _this = this;
            if (revico.global.flag.hasRichSnippet)
                return;
            revico.global.flag.hasRichSnippet = true;
            var param = {};
            param.tenantId = tenantId;
            param.productCd = productCd;
            $.when(this.getRichSnippetData(param))
                .done(function (res) {
                var _a;
                if (res && res.exists) {
                    var preJson = _this.findProductJson();
                    if (preJson) {
                        var preJsonAny = preJson;
                        if (preJsonAny.review == null || ((_a = preJsonAny.review) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                            _this.mergeAndReplaceJson(preJson, res.data);
                        }
                        _this.removeMarkingClass();
                    }
                    else {
                        _this.appendNewJson(res.data);
                    }
                }
            });
        };
        RichSnippet.prototype.getRichSnippetData = function (param) {
            var defer = $.Deferred();
            $.ajax({
                url: _revico.config.common.apiUrlRichSnippetV2,
                type: 'GET',
                data: param,
                timeout: _revico.config.common.apiDefaultTimeout
            }).done(function (data) {
                defer.resolve(data);
            }).fail(function (error) {
                $.ajax({
                    url: _revico.config.common.apiUrlRichSnippet,
                    type: 'GET',
                    data: param,
                    timeout: _revico.config.common.apiDefaultTimeout
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
            });
            return defer.promise();
        };
        RichSnippet.prototype.findProductJson = function () {
            var res;
            var $scripts = $('script[type="application/ld+json"]');
            for (var i = 0; i < $scripts.length; i++) {
                var $e = $($scripts[i]);
                var text = $e.text();
                if (text) {
                    var json = JSON.parse(text);
                    if (Array.isArray(json)) {
                        var hasProduct = json.some(function (item) {
                            return item["@type"] && item["@type"].toLowerCase() === "product";
                        });
                        if (hasProduct) {
                            $e.addClass(this._addClass);
                            res = json;
                            break;
                        }
                    }
                    else if (json["@type"] && json["@type"].toLowerCase() === "product") {
                        $e.addClass(this._addClass);
                        res = json;
                        break;
                    }
                }
            }
            return res;
        };
        RichSnippet.prototype.mergeAndReplaceJson = function (preJson, currentJson) {
            var merged;
            if (Array.isArray(preJson)) {
                merged = preJson.map(function (item) {
                    if (item["@type"] && item["@type"].toLowerCase() === "product") {
                        return $.extend(true, {}, currentJson, item);
                    }
                    return item;
                });
            }
            else {
                merged = $.extend(true, {}, currentJson, preJson);
            }
            $("script." + this._addClass).text(JSON.stringify(this.jsonEscape(merged)));
        };
        RichSnippet.prototype.removeMarkingClass = function () {
            $('script.' + this._addClass).removeClass(this._addClass);
        };
        RichSnippet.prototype.appendNewJson = function (data) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement("script");
            script.setAttribute("type", "application/ld+json");
            script.appendChild(document.createTextNode(JSON.stringify(this.jsonEscape(data))));
            head.appendChild(script);
        };
        RichSnippet.prototype.jsonEscape = function (obj) {
            obj.name = this.htmlEscape(obj.name);
            if (obj.review) {
                for (var i = 0; i < obj.review.length; i++) {
                    var review = obj.review[i];
                    review.author.name = this.htmlEscape(review.author.name);
                    review.description = this.htmlEscape(review.description);
                    review.name = this.htmlEscape(review.name);
                }
            }
            return obj;
        };
        RichSnippet.prototype.htmlEscape = function (str) {
            if (!str)
                return '';
            return str.replace(/[<>&"'`]/g, function (match) {
                var escape = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '`': '&#x60;'
                };
                return escape[match];
            });
        };
        return RichSnippet;
    }());
    _revico.RichSnippet = RichSnippet;
})(_revico || (_revico = {}));
var revico;
(function (revico) {
    var global;
    (function (global) {
        var star;
        (function (star) {
        })(star = global.star || (global.star = {}));
        var comment;
        (function (comment) {
        })(comment = global.comment || (global.comment = {}));
        var multicomment;
        (function (multicomment) {
        })(multicomment = global.multicomment || (global.multicomment = {}));
        var multicommentslider;
        (function (multicommentslider) {
        })(multicommentslider = global.multicommentslider || (global.multicommentslider = {}));
        var productAutoRegister;
        (function (productAutoRegister) {
        })(productAutoRegister = global.productAutoRegister || (global.productAutoRegister = {}));
        var productStockAndPriceRegister;
        (function (productStockAndPriceRegister) {
        })(productStockAndPriceRegister = global.productStockAndPriceRegister || (global.productStockAndPriceRegister = {}));
        var reviewOverview;
        (function (reviewOverview) {
        })(reviewOverview = global.reviewOverview || (global.reviewOverview = {}));
        var singlereview;
        (function (singlereview) {
        })(singlereview = global.singlereview || (global.singlereview = {}));
        var flag;
        (function (flag) {
        })(flag = global.flag || (global.flag = {}));
        var showWishlistButton;
        (function (showWishlistButton) {
        })(showWishlistButton = global.showWishlistButton || (global.showWishlistButton = {}));
        var addToWishlistButton;
        (function (addToWishlistButton) {
        })(addToWishlistButton = global.addToWishlistButton || (global.addToWishlistButton = {}));
        var wishlist;
        (function (wishlist) {
            wishlist.isPresentOnPage = false;
        })(wishlist = global.wishlist || (global.wishlist = {}));
        var mergeWishlist;
        (function (mergeWishlist) {
            mergeWishlist.inflightWishlistMerges = {};
        })(mergeWishlist = global.mergeWishlist || (global.mergeWishlist = {}));
    })(global = revico.global || (revico.global = {}));
})(revico || (revico = {}));
var _revico;
(function (_revico) {
    var StandAloneRichSnippet = (function () {
        function StandAloneRichSnippet() {
            var _this = this;
            this.afterLoad = function () {
                if (_this._existsJquery) {
                    $ = jQuery.noConflict(true);
                }
                else {
                    $ = jQuery;
                }
                if (!_this.checkDuplication()) {
                    return;
                }
                _this.exec();
            };
        }
        StandAloneRichSnippet.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        StandAloneRichSnippet.prototype.init = function () {
            this._existsJquery = (typeof jQuery !== 'undefined');
            _revico.util.loader.loadScript(_revico.config.common.scriptUrls, this.afterLoad);
        };
        StandAloneRichSnippet.prototype.getCurrentWidget = function () {
            return $('#revico-richsnippet');
        };
        ;
        StandAloneRichSnippet.prototype.checkDuplication = function () {
            var res = true;
            this.getCurrentWidget().each(function () {
                if ($(this).hasClass("initailized")) {
                    res = false;
                    return false;
                }
                $(this).addClass("initailized");
            });
            return res;
        };
        StandAloneRichSnippet.prototype.exec = function () {
            var _this = this;
            _revico.util.loader.loadScript(_revico.config.common.scriptUrls, function () {
                var $revico = _this.getCurrentWidget();
                var hiddenId = $revico.data("revico-hidden-id");
                _this._tenantId = $revico.data("revico-tenant-id");
                _this._productCd = $("#".concat(hiddenId)).val();
                if (_this._tenantId && _this._productCd) {
                    _revico.RichSnippet.getInstance().putRichSnippetTag(_this._tenantId, _this._productCd);
                }
            });
        };
        return StandAloneRichSnippet;
    }());
    _revico.StandAloneRichSnippet = StandAloneRichSnippet;
})(_revico || (_revico = {}));
_revico.StandAloneRichSnippet.getInstance().init();
//# sourceMappingURL=standalone_richsnippet.js.map
})(revico);

<raw>
	var messTxt = opts.content || '';
	if (messTxt.indexOf("<clientmess>") !== -1) {
		messTxt = messTxt.replace(/^<clientmess>/g, "").replace(/<\/clientmess>$/g, "");
		messTxt = messTxt.replace(/ on(\w+)=/g, ':ON:\1:');
	}
	this.root.innerHTML = window.chatplus.escapeRiot(messTxt);
</raw>

<nlbr>
	var update = function() {
		var messTxt = opts.content || '';

		if (messTxt.indexOf("<clientmess>") !== -1) {
			messTxt = messTxt.replace(/<clientmess>/g, "").replace(/<\/clientmess>/g, "");
			messTxt = window.chatplus.getMesstxt(messTxt, undefined, opts.link_escape);
		} else {
			if (messTxt.indexOf("<chatplusscript>") !== -1) {
				messTxt = window.chatplus.getMesstxt(messTxt, undefined, undefined, true);
			} else {
				messTxt = window.chatplus.getMesstxt(messTxt, ! opts.escape, undefined, true);
			}
		}

		messTxt = messTxt
			.replace(/(\r\n?|\n|&NewLine;)/g, '<br />')
			.replace(/<label\s?.*?>(.+?)<\/label>/g, function(s) {return s.replace(/&bsol;r&bsol;n/g, '<br />');})
			.replace('<span class="event-trigger">', '<span class="event-trigger"><i class="fas fa-bolt" ></i>');
		this.root.innerHTML = messTxt;
	}.bind(this);

	update();
	// this.on('update', update);
</nlbr>

<abr>
	var update = function() {
		if (opts.cptag) {
			this.root.innerHTML = window.chatplus.getMesstxt(opts.content, true).replace(/(\r\n?|\n)/g, "<br />");
		} else {
			this.root.innerHTML = window.chatplus.to_link(opts.content).replace(/\r\n/g, "<br />").replace(/(\n|\r)/g, "<br />");
		}
	}.bind(this);
	update();
	this.on('update', update);
</abr>

<cp-iframe>
	<iframe src="{opts.src}" sandbox="{opts.sandbox || 'allow-forms allow-scripts allow-popups'}" style="{opts.height > 0 ? ('height:' + opts.height + 'px;height:calc(' + opts.height + 'px * var(--zoom))') : ''}"></iframe>
</cp-iframe>

<cp-richlink>
	<a href="{opts.url}" target="_blank">
		<figure>
			<img if={opts.assetType === 'image'} src="{opts.assetUrl}" alt="{opts.title}" loading="lazy">
			<video if={opts.assetType === 'video'} src="{opts.assetUrl}" muted autoplay></video>
			<figcaption>{opts.title}</figcaption>
		</figure>
	</a>
</cp-richlink>

<cp-listpicker>
	<yield />
</cp-listpicker>

<cp-quote>
	<virtual>
		<blockquote class="quote" data-target="{opts.target}" onclick={jump}><nlbr content="{opts.content}" escape=1 /></blockquote>
		<nlbr class="comment" if={opts.text !== ''} content="{opts.text}" escape=1 />
	</virtual>

	<script>
		jump() {
			var elem = document.querySelector('#chatplusview .msg#msg_' + opts.target);
			if (elem) {elem.scrollIntoView({'block': 'center', 'behavior': 'smooth'});}
		}
	</script>
</cp-quote>

<timestampclient>
	var self = this;

	var timezoneoffset = (new Date()).getTimezoneOffset() / -60;
	var timediff = 0;
	if (typeof(opts.offset) === 'number') {
		timediff = opts.offset - timezoneoffset + 9;
	} else if (opts.timezone && /_[-+]?\d+$/.test(opts.timezone)) {
		timediff = parseInt(opts.timezone.split('_')[1]) - timezoneoffset;
	}

	var leftpad = function(s_, l, c) {
		var s = s_.toString();
		if ('padStart' in String.prototype) {return s.padStart(l, c);}
		var x = '';
		for (var i = s.length; i < l; i++) {x += c;}
		return x + s;
	};

	var date = null;
	if (typeof(opts.content) === 'number') {
		date = new Date(opts.content + 3600000 * timediff);
	} else {
		var datestring = opts.content.replace(/-/g, '/') + ' +0900'; // ex:"2112/03/09 12:34:56 +0900"
		date = new Date(Date.parse(datestring) + 3600000 * timediff);
	}

	// TODO: opts.format解釈 現在は"HH:MM"決め打ち
	self.root.innerText = leftpad(date.getHours(), 2, '0')+':'+leftpad(date.getMinutes(), 2, '0');
</timestampclient>

<datestampclient>
	var self = this;

	var timezoneoffset = (new Date()).getTimezoneOffset() / -60;
	var timediff = 0;
	if (typeof(opts.offset) === 'number') {
		timediff = opts.offset - timezoneoffset + 9;
	} else if (opts.timezone && /_[-+]?\d+$/.test(opts.timezone)) {
		timediff = parseInt(opts.timezone.split('_')[1]) - timezoneoffset;
	}

	var date = null;
	if (typeof(opts.content) === 'number') {
		date = new Date(opts.content + 3600000 * timediff);
	} else {
		var datestring = opts.content.replace(/-/g, '/') + ' +0900'; // ex:"2112/03/09 12:34:56 +0900"
		date = new Date(Date.parse(datestring) + 3600000 * timediff);
	}

	// TODO: opts.format解釈
	self.root.innerText = date.toLocaleDateString();
</datestampclient>

<datepicker>
	<virtual if={weeks}>
		<table if={! manual}>
			<thead>
				<tr>
					<th class="prev" onclick={prevMonth}>&laquo;</th>
					<th colspan="5">
						<label>
							<input type="number" value="{year}" min="1" max="9999" step="1" size="4" onchange={changeYear} data-hidden="1">{labels[lang]['year']}
						</label>
						<select onchange={changeMonth} data-hidden="1">
							<option each={label, m in labels[lang]['month']} selected={m === month} value="{m}">{label}</option>
						</select>
					</th>
					<th class="next" onclick={nextMonth}>&raquo;</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th each={label in labels[lang]['weekday']}>{label}</th>
				</tr>
				<tr each={week in weeks}>
					<td
						each={d in week}
						class="{day: d !== null, selected: checkSelected(d), disabled: checkDisabled(d)}"
						data-value="{d ? getDateString(year, month, d) : null}"
						onclick={select}
					>{d}</td>
				</tr>
			</tbody>
		</table>
		<input type="date" class="datepicker-input form-control {invalid: ! valid}" name="{opts.name}" style="display:{manual ? 'block' : 'none'}" data-name="{opts.dataName}" data-label="{opts.dataLabel}" value="{value()}" required={'required' in opts} data-required-error="{opts.dataRequiredError}" min={opts.min} max={opts.max} readonly={'readonly' in opts} onchange={changeInput}>
		<button type="button" onclick={switchManual}><i class="cpfas fa-fw {fa-pencil-alt: ! manual} {fa-calendar-alt: manual}"></i></button>
	</virtual>

	<script>
		var self = this;
		self.date = null;
		self.year = null; // yyyy
		self.month = null; // [0...11]
		self.weeks = null;
		self.labels = {
			'ja': {
				'year': '年',
				'month': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				'weekday': ['日', '月', '火', '水', '木', '金', '土'],
			},
			'en': {
				'year': '',
				'month': ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
				'weekday': ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			},
			'en-US': {
				'year': '',
				'month': ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
				'weekday': ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			},
		};
		self.lang = 'ja';
		self.manual = false;
		self.valid = true;

		var padLeft = function(x, d, c) {
			if (String.prototype.padStart) {return x.padStart(d, c);}
			var s = '';
			for (var i = x.length; i < d; i++) {s += c;}
			return s + x;
		};
		var includes = function(a, e) {
			if (Array.prototype.includes) {return a.includes(e);}
			return a.indexOf(e) !== -1;
		};

		self.on('before-mount', function() {
			if (opts.lang) {
				self.lang = opts.lang;
			} else {
				for (let i in window.navigator.languages) {
					let l = window.navigator.languages[i];
					if (l in self.labels) {
						self.lang = l;
						break;
					}
				}
			}
			if (opts.value && /^(\d{4})-(\d{2})-(\d{2})$/.test(opts.value)) {
				var matches = opts.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
				self.date = new Date(parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]));
				if (isNaN(self.date.getTime())) {self.date = null;}
			}
			if (self.date !== null) {
				self.year = self.date.getFullYear();
				self.month = self.date.getMonth();
				if (self.checkDisabled(self.date.getDate())) {
					self.date = null;
				}
			} else {
				var d = new Date();
				if ('max' in opts) {
					var max = new Date(opts.max);
					if (d > max) {d = max;}
				}
				if ('min' in opts)  {
					var min = new Date(opts.min);
					if (min > d) {d = min;}
				}
				self.year = d.getFullYear();
				self.month = d.getMonth();
			}
			self.createCalendar();
		});

		createCalendar() {
			var day1 = new Date(self.year, self.month, 1);
			var daysInMonth = {'0': 31, '1': (self.year % 400 === 0 || (self.year % 100 !== 0 && self.year % 4 === 0) ? 29 : 28), '2': 31, '3': 30, '4': 31, '5': 30, '6': 31, '7': 31, '8': 30, '9': 31, '10': 30, '11': 31}[self.month];

			var weeks = [[], [], [], [], [], []];
			for (var i = 0, d = day1.getDay(); i < d; i++) {weeks[0].push(null);}
			var w = 0;
			for (var i = 1; i <= daysInMonth; i++) {
				weeks[w].push(i);
				if (weeks[w].length >= 7) {w++;}
			};
			self.weeks = weeks;
			self.update();
		};

		prevMonth(ev) {
			ev.preventUpdate = true;
			var m = self.month - 1;
			var y = self.year;
			if (m < 0) {m = 11; y -= 1;}
			self.year = y;
			self.month = m;
			self.createCalendar();
		}
		nextMonth(ev) {
			ev.preventUpdate = true;
			var m = self.month + 1;
			var y = self.year;
			if (m > 11) {m = 0; y += 1;}
			self.year = y;
			self.month = m;
			self.createCalendar();
		}
		changeYear(ev) {
			ev.preventUpdate = true;
			self.year = parseInt(ev.target.value);
			self.createCalendar();
		}
		changeMonth(ev) {
			ev.preventUpdate = true;
			self.month = parseInt(ev.target.value);
			self.createCalendar();
		}

		select(ev) {
			ev.preventUpdate = true;
			if (! ev.target.classList.contains('day') || ev.target.classList.contains('disabled') || 'readonly' in opts) {return;}
			var date = parseInt(ev.target.textContent);
			if (isNaN(date)) {return;}
			self.date = new Date(self.year, self.month, date);
			self.root.setAttribute('value', self.value());
			self.update();
		}

		getDateString(y, m, d) {
			return ''
				+ padLeft(String(y), 4, '0')
				+ '-'
				+ padLeft(String(m + 1), 2, '0')
				+ '-'
				+ padLeft(String(d), 2, '0');
		}

		value() {
			if (! self.date) {return null;}
			return self.getDateString(self.date.getFullYear(), self.date.getMonth(), self.date.getDate());
		}

		checkSelected(d) {
			return self.date && (self.year === self.date.getFullYear() && self.month === self.date.getMonth() && d === self.date.getDate());
		}

		checkDisabled(d) {
			if (! d) {return false;}
			return self.validate(self.year, self.month, d) !== null;
		}

		validate(y, m, d) {
			// disabled:属性存在
			if ('disabled' in opts) {return {type: 'disabled'};}

			var ymd = self.getDateString(y, m, d);
			var date = new Date(ymd);
			if (! date || isNaN(date.getTime())) {return {type: 'invalid'};}

			// 許可リスト:YYYY-MM-DD文字列の空白区切り
			if ('allows' in opts) {
				var allows = opts.allows.split(/[, ]/g);
				if (! includes(allows, ymd)) {return {type: 'allows', message: opts.dataAllowsError};}
			}
			// 拒否リスト:YYYY-MM-DD文字列の空白区切り
			if ('denies' in opts) {
				var denies = opts.denies.split(/[, ]/g);
				if (includes(denies, ymd)) {return {type: 'denies', message: opts.dataDeniesError};}
			}
			// 国民の祝日:YYYY-MM-DD文字列の空白区切り
			if ('denyholidays' in opts) {
				var denyholidays = opts.denyholidays.split(/[, ]/g);
				if (includes(denyholidays, ymd)) {return {type: 'denyholidays', message: opts.dataDenyholidaysError};}
			}
			// 最小値(指定値を含む):YYYY-MM-DD
			if ('min' in opts) {
				var min = new Date(opts.min);
				if (date < min) {return {type: 'min', message: opts.dataMinError};}
			}
			// 最大値(指定値を含む):YYYY-MM-DD
			if ('max' in opts) {
				var max = new Date(opts.max);
				if (date > max) {return {type: 'max', message: opts.dataMaxError};}
			}
			// 曜日指定:[0...6]空白区切り(0:日曜日)
			if ('weekdays' in opts) {
				var weekdays = opts.weekdays.split(/[, ]/g).map(function(e) {return parseInt(e);});
				if (! includes(weekdays, date.getDay())) {return {type: 'weekdays', message: opts.dataWeekdaysError};}
			}

			return null;
		}

		switchManual() {
			if (self.manual && ! self.valid) {
				self.date = null;
				self.valid = true;
			}
			self.manual = ! self.manual;
			if (! self.manual) {self.createCalendar();}
		}

		changeInput(ev) {
			var elem = ev.target;
			if (! elem.checkValidity()) {return;}

			var matches = elem.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
			if (matches) {
				var y = parseInt(matches[1]);
				var m = parseInt(matches[2]) - 1;
				var d = parseInt(matches[3]);
				if (y < 1000) {return;}
				var date = new Date(y, m, d);

				self.year = y;
				self.month = m;

				if (isNaN(date.getTime())) {
					self.date = null;
					self.valid = true;
					elem.dataset.error = null;
				} else {
					var error = self.validate(y, m, d);
					self.date = date;
					self.valid = error === null;
					if (error !== null && 'message' in error) {elem.dataset.error = error.message;}
				}
			}
		}
	</script>
</datepicker>


window.chatplus.entities_escape = function(s) {
    return (s+'').replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
};

window.chatplus.entities_unescape = function(s) {
    return (s+'').replace(/(&quot;|&amp;|&lt;|&gt;)/g, function(e) {return {'&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>'}[e];});
};

window.chatplus.to_link = function(str) {
    str = str + '';

    // str = entities_unescape(str);
    if (/(href|src|data-action)="/.test(str)) {return str;}

    var r_hostname = '(?:[^./<>\\s]+)(?:\\.[^./<>\\s]+)+';
    var r_hostnumber_v4 = '(?:[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+)';
    var r_hostnumber_v6 = '(?:\\[[0-9a-f:]+\\])';
    var r_host = '(?:' + r_hostname + '|' + r_hostnumber_v4 + '|' + r_hostnumber_v6 + ')';
    var r_port = '(?::[0-9]+)';
    var r_path_search_hash = '(?:[^\\s<>\\]"]*)';
    var r_httpaddress = 'https?:\\/\\/' + r_host + (r_port + '?') + '(?:/' + r_path_search_hash + ')?';

    // console.log(r_httpaddress);
    var re = new RegExp(r_httpaddress, 'g');

    var str_amp = str.replace(/&amp;/g, '&');
    if (! re.test(str_amp)) {return str;}

    var gyazo = [];
    var replaced = str_amp.replace(re, function(url) {
        if (/gyazo\.com\/[0-9a-f]+$/.test(url)) {gyazo.push(url);}
        return '<a href="' + url + '" target="_blank">' + window.chatplus.entities_escape(url) + '</a>';
    });
    return replaced + (gyazo.length > 0 ? ('<div>' + gyazo.map(function(url) {return '<a href="' + url + '" target="_blank"><img src="' + url + '/raw"></a>';}).join('') + '</div>') : '');
};

window.chatplus.b64DecodeUnicode = function(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

window.chatplus.isBase64 = function(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
};

window.chatplus.getMesstxt = function(messTxt, no_escape, link_escape, parse_markdown) {
    if (messTxt.indexOf("<chatplusscript>") !== -1) {
        messTxt = messTxt.replace(/<chatplusscript>/g, "").replace(/<\/chatplusscript>/g, "");
        messTxt = (window.chatplus.isBase64(messTxt))? window.chatplus.b64DecodeUnicode(messTxt) : messTxt;
    }
    messTxt = messTxt.replace(/&#x0007b;/g, '{');
    messTxt = messTxt.replace(/&#x0007d;/g, '}');

    // "```"に囲まれていたら一切の変換をしない
    if (/^```[\s\S]+```$/.test(messTxt)) {
        return '<code>' + window.chatplus.entities_escape(window.chatplus.escapeRiot(messTxt)) + '</code>';
    }

    messTxt = messTxt.replace(/<a([^>]*?)href\s*=\s*(['"])([^\2]*?)\2\1*>([^>]*?)<\/a>/mg, '$4');
    if (! no_escape) {
        messTxt = window.chatplus.entities_escape(messTxt);
    }

    // マークダウン変換（ボットメッセージのみ、選択肢メッセージは除外）
    if (parse_markdown && ! /^\+\+/m.test(messTxt)) {
        messTxt = window.chatplus.convertBoldMarkdown(messTxt);
    }

    if (! /^\+\+/m.test(messTxt)) {
        messTxt = messTxt.replace(/\[#.*\]/g, '');
    }

    if (messTxt.indexOf("[[") !== -1 && messTxt.indexOf("]]") !== -1){
        messTxt = messTxt.replace(/\[\[([\u0000-\uffff]*?)\]\]/g, function(a, b){
            return window.chatplus.getMessPrefix('[[' + b + ']]', no_escape);
        });
    }

    // '++'で始まる行があれば選択肢メッセージにする
    if (/^\+\+/m.test(messTxt)) {
        var unixtime = 1600000000 + Math.floor(Math.random() * 100000000);
        var line_body = [];
        var line_option = [];
        messTxt.split(/\r?\n|\r/).forEach(function(line) {
            if (/^\+\+/.test(line)) {
                var value = line.replace(/^\+\+\s*/, '');
                var label = value.replace(/\[#.*\]$/ ,'');
                line_option.push({'label': label, 'value': value});
            } else {
                line_body.push(line);
            }
        });

        messTxt = line_body.join('\n')
            + '<ul class="chat-ques">'
            + line_option.map(function(e, i) {
                var template = ''
                    + '<li>'
                    + '<input type="radio" name="radio_0_%timestamp%" id="0_%timestamp%_00_%index%_ctext" value="%value%">'
                    + '<label for="0_%timestamp%_00_%index%_ctext">%label%</label>'
                    + '</li>';
                return template
                    .replace(/%timestamp%/g, unixtime)
                    .replace(/%index%/g, i)
                    .replace(/%label%/g, e.label)
                    .replace(/%value%/g, window.chatplus.entities_escape(e.value));
            }).join('')
            + '</ul>';
    }

    if (! link_escape && ! /(img src=|data-url=)['"](https?|ftp):/.test(messTxt) && ! /(&lt;|<)script(&gt;|>)/.test(messTxt)) {
        messTxt = messTxt.split(/\r?\n/g).map(window.chatplus.to_link).join('\r\n');
    }

    return window.chatplus.escapeRiot(messTxt);
};

window.chatplus.getMessPrefix = function(messText, no_escape) {
    var body = messText.replace(/&quot;/g, '"');
    var matches = body.match(/^\[\[((?:"[^"]+"|[^:])+):([\u0000-\uffff]*)\]\]$/);
    var style = '';
    var contentTxt = '';
    if (matches && matches.length >= 3) {
        style = matches[1];
        contentTxt = matches[2];
    }

    if (style.length > 0) {
        var is_link = false;
        var is_image = false;
        var is_video = false;
        var attributes = {};
        var media_attributes = {};
        var str_style = '';
        var tags = style.match(/(cp\w+(?:="[^"]+"(?:,\w+="[^"]+")*)?);?/g) || [];
        for (let i = 0, l = tags.length; i < l; i++) {
            var parsed = tags[i].match(/cp(\w+)(?:="([^"]+)"((?:,\w+="[^"]+")*))?/);
            if (! parsed || parsed.length < 2) {continue;}

            var cptag_type = parsed[1];
            var cptag_value = parsed[2] || '';
            let cptag_suffix = parsed.length >= 3 ? parsed[3] : null;

            if (/^link/.test(cptag_type)) {
                is_link = true;
                attributes['href'] = cptag_value;

                switch (cptag_type) {
                    case 'link_target': {
                        attributes['target'] = '_blank';
                        break;
                    }
                    case 'link_blank':
                    case 'link_parent':
                    case 'link_top':
                    case 'link_self': {
                        attributes['target'] = cptag_type.replace(/^link/, '');
                        break;
                    }
                    case 'link':
                    default: {
                        break;
                    }
                }
            } else if (cptag_type === 'media' || cptag_type === 'media_dl') {
                is_image = /\.(jpe?g|png|gif|tiff?|bmp|webp|svg|avif)(?:[?#&]|$)/i.test(cptag_value);
                is_video = /\.(mp4|webm|ogg|mov)$/i.test(cptag_value);
                media_attributes['src'] = cptag_value;
                if (is_image) {
                    media_attributes['loading'] = 'lazy';
                }
                if (cptag_type === 'media_dl') {
                    is_link = true;
                    attributes['href'] = cptag_value;
                    attributes['target'] = '_blank';
                    attributes['download'] = '';
                }
                if (cptag_suffix != null) {
                    (cptag_suffix.match(/\w+="[^"]+"/g) || []).forEach(function(e) {
                        var kv = e.match(/(\w+)="([^"]+)"/);
                        if (kv && kv.length >= 3) {
                            if (kv[1] === 'width' || kv[1] === 'height') {
                                if (! ('style' in media_attributes)) {
                                    media_attributes['style'] = '';
                                }
                                media_attributes['style'] += kv[1] + ':' + kv[2] + ';';
                            } else {
                                media_attributes[kv[1]] = kv[2];
                            }
                        }
                    });
                }
            } else if (cptag_type === 'class') {
                attributes['class'] = cptag_value;
            } else {
                str_style = window.chatplus.getStyle(cptag_type, cptag_value, str_style);
            }
        }

        if (str_style.length > 0) {
            attributes['style'] = str_style;
        }

        var attributes_s = '';
        for (var k in attributes) {
            attributes_s += ' ' + window.chatplus.entities_escape(k) + '="' + window.chatplus.entities_escape(attributes[k]) + '"';
        }
        var media_attributes_s = '';
        for (var k in media_attributes) {
            media_attributes_s += ' ' + window.chatplus.entities_escape(k) + '="' + window.chatplus.entities_escape(media_attributes[k]) + '"';
        }

        if (is_image) {
            if (is_link) {
                return '<a' + attributes_s + '><img' + media_attributes_s + ' alt="' + window.chatplus.entities_escape(contentTxt) + '"></a>';
            } else {
                return '<img' + media_attributes_s + ' alt="' + window.chatplus.entities_escape(contentTxt) + '">';
            }
        } else {
            var result = '';
            if (is_link) {
                result = '<a' + attributes_s + '>' + contentTxt + '</a>';
            } else {
                result = '<span' + attributes_s + '>' + contentTxt + '</span>';
            }
            if (is_video) {
                if (result === '<span></span>') {
                    result = '';
                } else {
                    result += '<br>';
                }
                result += '<video controls controlsList="nodownload"' + media_attributes_s + '></video>';
            }
            return result;
        }
    } else {
        return window.chatplus.to_link(messText);
    }
};

//Add style here
window.chatplus.getStyle = function(style_type, style_value, str_style) {
    if (style_value == undefined) {
        style_type = style_type.replace(/cp/g, '');
    }
    if (style_type == "size") {
        str_style += "font-size:" + style_value + ";";
    }
    if (style_type == "color") {
        str_style += "color:" + style_value + ";";
    }
    if (style_type == "bgcolor") {
        str_style += "background-color:" + style_value + ";";
    }
    if (style_type == "b") {
        str_style += "font-weight:bold;";
    }
    if (style_type == "t") {
        str_style += "font-weight:100;";
    }
    if (style_type == "i") {
        str_style += "font-style:italic;";
    }
    if (style_type == "u") {
        str_style += "text-decoration:underline;";
    }
    if (style_type == "s") {
        str_style += "text-decoration:line-through;";
    }

    return str_style;
};

window.chatplus.escapeRiot = function(s) {
    if (! window.riot || ! /^v3/.test(window.riot.version)) {
        return s;
    }

    return s
        .split(/\r?\n/g)
        .map(function(l) {
            if (! /\{|&#x0007b;|&lbrace;|&lcub;/.test(l) || ! /\}|&#x0007d;|&rbrace;|&rcub;/.test(l)) {return l;}
            var c = l.match(/\}|&#x0007d;|&rbrace;|&rcub;/g).length;
            var r = 0;
            return l.replace(/\{|&#x0007b;|&lbrace;|&lcub;/g, function(m) {
                if (r >= c) {return m;}
                r += 1;
                return '\\' + m;
            });
        })
        .join('\n');
};

window.chatplus.convertBoldMarkdown = function(text) {
    return text.replace(/\*\*([\s\S]*?)\*\*/g, '[[cpb:$1]]');
};

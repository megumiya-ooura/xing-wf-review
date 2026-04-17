<chat>
	<div
		id="chatplusview"
		class="
			chatplusview-{opts.appearance.themeName}
			{front: status=='no_chat'||status=='wait_chat'&&!inChatWaiting||status=='no_agent'}
			{queued: status=='wait_chat'}
			{end: status=='close_chat_by_visitor'||status=='close_chat_by_agent'||status=='close_chat_by_mute'}
			{contact: status=='no_agent'}
			{no-contact: (status=='no_agent'&& (opts.appearance.disconnect_disable || opts.startup.disuseContact))}
			{closed: windowStatus=='close'}
			{headless: headless || windowStatus == 'close' && ((status == 'no_chat' && eyeCatcher.no_chat.only) || (status == 'no_agent' && eyeCatcher.no_agent.only) || ((status == 'in_chat' || status == 'in_chatbot' || status == 'suspend_chat' || status == 'wait_chat' || status == 'accept_chat') && eyeCatcher.in_chat.only) || ((status == 'close_chat_by_visitor'||status == 'close_chat_by_agent'||status == 'close_chat_by_mute') && eyeCatcher.close_chat.only))}
			{large-header: opts.appearance.themeParams.spLargeHeader}
			{no_prompt: ! checkPromptShown()}
			{compressed: compressed}
			{suppressed: suppressed}
			{float: opts.appearance.themeParams.floatdesign && ! chatbuttonFlag}
			{botleft: opts.appearance.themeParams.position === 'botleft'}
		"
		role="application"
		aria-label="ChatPlus"
		aria-expanded="{windowStatus === 'open' ? 'true' : 'false'}"
		hide={hidden || (suppressed && windowStatus !== 'open' && ! opts.appearance.end.suppressOnlyGreeting)}
		inert={! status}
	>
		<div id="outline" if={ status=="no_chat" }>
		<div id="chatpluscontent">
			<balloon design={opts.balloon[mobileFlag ? 'sp' : 'pc']} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? 0 : -1}" if={opts.balloon && opts.balloon.enabled} />
			<div id="eye_catcher" class="eyecatcher-no_chat" if={eyeCatcher.no_chat.enable && eyeCatcher.no_chat.active && ! eyeCatcher.no_chat.imagemap} onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? '0' : null}">
				<img if={! eyeCatcher.no_chat.image_fallback} src="{eyeCatcher.no_chat.image}" alt="{eyeCatcher.no_chat.altText}" title="{eyeCatcher.no_chat.titleText}" width="{eyeCatcher.no_chat.image_width}" height="{eyeCatcher.no_chat.image_height}">
				<picture if={eyeCatcher.no_chat.image_fallback}>
					<source type="{eyeCatcher.no_chat.image_mimetype}" srcset="{eyeCatcher.no_chat.image}">
					<img src="{eyeCatcher.no_chat.image_fallback}" alt="{eyeCatcher.no_chat.altText}" title="{eyeCatcher.no_chat.titleText}" width="{eyeCatcher.no_chat.image_width}" height="{eyeCatcher.no_chat.image_height}">
				</picture>
				<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
			</div>
			<div id="eye_catcher" class="eyecatcher-no_chat eyecatcher-imagemap" if={eyeCatcher.no_chat.enable && eyeCatcher.no_chat.active && eyeCatcher.no_chat.imagemap}>
				<img src="{eyeCatcher.no_chat.image}" usemap="#eyecatcher-no_chat-map" if={  eyeCatcher.no_chat.imagemap.size} width="{eyeCatcher.no_chat.imagemap.size.width}" height="{eyeCatcher.no_chat.imagemap.size.height}" data-width="{eyeCatcher.no_chat.imagemap.size.width}" data-height="{eyeCatcher.no_chat.imagemap.size.height}" alt="{eyeCatcher.no_chat.altText}">
				<img src="{eyeCatcher.no_chat.image}" usemap="#eyecatcher-no_chat-map" if={! eyeCatcher.no_chat.imagemap.size} data-width="{eyeCatcher.no_chat.imagemap.baseSize.width}" data-height="{eyeCatcher.no_chat.imagemap.baseSize.height}" alt="{eyeCatcher.no_chat.altText}">
				<map name="eyecatcher-no_chat-map" data-rule="{eyeCatcher.no_chat.imagemap.bot_rule}" if={eyeCatcher.no_chat.imagemap}>
					<virtual each={a in eyeCatcher.no_chat.imagemap.actions}>
						<area if={a.type=='message'} shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-text="{a.text}" onclick="{imagemapMessage}" alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='uri'    } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="{a.linkUri}" target="{a.sameTab ? '' : '_blank'}" alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='open'   } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" onclick={open} alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='mailto' } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="mailto:{a.addr}" alt="" title="{a.title}" tabindex="0" />
					</virtual>
				</map>
				<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
			</div>

			<div id="chatplusheader" onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? 0 : -1}">
				<div id="profile" class="profile" role="heading">
					<span class="name">{ opts.appearance.start.title }</span>
				</div>
				<div class="operate" if={! btnheadless}>
					<a class="button-expand" onclick={expand} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelExpand || '拡大'}" if={compress_enabled && compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-expand-alt fa-lg"></i></a>
					<a class="button-compress" onclick={compress} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelCompress || '縮小'}" if={compress_enabled && !compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-compress-alt fa-lg"></i></a>
					<a class="button-close" onclick={closeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelMinimize || '最小化'}" if={windowStatus != 'close' && ! chatbuttonFlag}><i role="presentation" aria-hidden="true" class="cpfar fa-minus-square fa-lg"></i></a>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={hideButton.titlebar}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</div><!-- header -->
			<div id="body" aria-hidden={windowStatus === 'close' ? 'true' : 'false'}>
				<h2>
					<div class="icon"><i role="presentation" aria-hidden="true" class="cpfas fa-comments fa-3x"></i></div>
					<div class="text"><abr content="{ variableTexts.startExplanation }" cptag="1" /></div>
				</h2>

				<form id="form-start" class="form-horizontal" onsubmit="return false;" inert="{optionDialogVisible}">
				<div id="name_form_group" class="form-group" if={ opts.appearance.start.getName }>
					<label class="col-sm-4 control-label" id="oastn701">{ opts.appearance.start.titleName || "名前" }<span class="required-marker" if={ opts.appearance.start.getNameRequired }>※</span></label>
					<div class="col-sm-8"><input name="visitor_name" class="form-control" value="{ customer.chat_username }" type="text" placeholder="{ opts.appearance.start.guideName === "" || opts.appearance.start.guideName ? opts.appearance.start.guideName : "名前" }">
					</div>
					<input name="name_label" value="{ opts.appearance.start.titleName || "名前" }" type="hidden">
				</div>
				<div id="name_form_group" class="form-group" if={ opts.appearance.start.getCompany }>
					<label class="col-sm-4 control-label" id="oastc702">{ opts.appearance.start.titleCompany || "会社名" }<span class="required-marker" if={ opts.appearance.start.getCompanyRequired }>※</span></label>
					<div class="col-sm-8"><input name="visitor_company" class="form-control" value="{ customer.chat_company_name }" type="text" placeholder="{ opts.appearance.start.guideCompany === "" || opts.appearance.start.guideCompany ? opts.appearance.start.guideCompany : "会社名" }">
					</div>
					<input name="com_label" value="{ opts.appearance.start.titleCompany || "会社名" }" type="hidden">
				</div>
				<div class="form-group" if={ opts.appearance.start.getEmail }>
					<label class="col-sm-4 control-label" id="oaste703">{ opts.appearance.start.titleEmail || "メールアドレス" }<span class="required-marker" if={ opts.appearance.start.getEmailRequired }>※</span></label>
					<div class="col-sm-8">
					<input name="visitor_email" value="{ customer.chat_email }" class="form-control" type="text" placeholder="{ opts.appearance.start.guideEmail === "" || opts.appearance.start.guideEmail ? opts.appearance.start.guideEmail : "メールアドレス" }">
					</div>
					<input name="mail_label" value="{ opts.appearance.start.titleEmail || "メールアドレス" }" type="hidden">
				</div>
				<div class="form-group" if={ opts.appearance.start.getTel }>
					<label class="col-sm-4 control-label" id="oastt704">{ opts.appearance.start.titleTel || "電話番号" }<span class="required-marker" if={ opts.appearance.start.getTelRequired }>※</span></label>
					<div class="col-sm-8">
					<input name="visitor_tel" value="{ customer.chat_tel }" class="form-control" type="text" placeholder="{ opts.appearance.start.guideTel === "" || opts.appearance.start.guideTel ? opts.appearance.start.guideTel : "電話番号" }">
					</div>
					<input name="tel_label" value="{ opts.appearance.start.titleTel || "電話番号" }" type="hidden">
				</div>
				<div class="form-group" if={ opts.appearance.start.getContact }>
					<label class="col-sm-4 control-label" id="oastc705">{ opts.appearance.start.titleContact || "お問い合わせ内容" }<span class="required-marker" if={ opts.appearance.start.getContactRequired }>※</span></label>
					<div class="col-sm-8">
					<textarea name="inquiry" class="form-control"></textarea><span></span>
					</div>
					<input name="content_label" value="{ opts.appearance.start.titleContact || "お問い合わせ内容" }" type="hidden">
				</div>
				<div class="form-group freeform" data-type="{ff.type}" each={ ff,i in opts.appearance.start.freeform }>
					<label class="col-sm-4 control-label">{ ff.title }<span class="required-marker" if={ ff.required }>※</span></label>
					<div class="col-sm-8" if="{! ff.type || ff.type == 'text'}">
						<input name="freeform_{i}" class="form-control" type="text" placeholder="{ ff.guide }">
					</div>
					<div class="col-sm-8" if="{ff.type == 'textarea'}">
						<textarea name="freeform_{i}" class="form-control" placeholder="{ ff.guide }"></textarea>
					</div>
					<div class="col-sm-8" if="{ff.type == 'radio'}">
						<label each="{e in ff.choice}"><input name="freeform_{i}" value="{e}" type="radio">{e}</label>
					</div>
					<div class="col-sm-8" if="{ff.type == 'check'}">
						<label each="{e in ff.choice}"><input name="freeform_{i}" value="{e}" type="checkbox">{e}</label>
					</div>
					<div class="col-sm-8" if="{ff.type == 'select'}">
						<select name="freeform_{i}" class="form-control">
							<option value="{ff.dummyfirst && j==0 ? '###dummy###' : e}" hidden="{ff.dummyfirst && j==0}" each="{e,j in ff.choice}">{e}</option>
						</select>
					</div>
				</div>
				<p class="box" if={ opts.appearance.start.getEmail && !(opts.appearance.start.logmail === false) }><label id="email_use"><input name="mail_note" type="checkbox" for="email_use">{ opts.appearance.start.emailQuestion || "チャット終了後に、内容をメールで送信する。" }</label></p>
				<p class="box" if={ opts.appearance.start.showRequiredCheckbox && opts.appearance.start.requiredCheckboxAbove }><label id="required-checkbox-label"><input id="required_checkbox" name="required_checkbox" type="checkbox" for="required-checkbox-label"><abr content="{ opts.appearance.start.requiredCheckboxText }" cptag="1" /></label></p>

				<div class="error-message"></div>

				<div class="form-group btn-container">
					<button id="start_btn" type="button" class="btn btn-block" onclick="{requestChat}">
						<span>{ opts.appearance.start.buttonText || "チャットを開始する" }</span>
					</button>
				</div>
				<p class="box" if={ opts.appearance.start.showRequiredCheckbox && !opts.appearance.start.requiredCheckboxAbove }><label id="required-checkbox-label"><input id="required_checkbox" name="required_checkbox" type="checkbox" for="required-checkbox-label"><abr content="{ opts.appearance.start.requiredCheckboxText }" cptag="1" /></label></p>
				<div class="form-group contact-remark" if={ opts.appearance.start.remark }>
					<abr class="form-control" content="{variableTexts.startRemark}" cptag="{opts.appearance.start.remarkTag}" />
				</div>
				</form>

				<div id="option_form" show={optionDialogVisible}>
					<div class="operate">
						<div class="input-file">{opts.appearance.themeParams.optionTitle || 'オプション'}</div>
						<div class="options">
							<label for="option_form__mute">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.mute) || '通知音を出さない'}</label>
							<input type="checkbox" name="mute" id="option_form__mute" checked="{chatplus.option.mute}">
							<virtual if={! mobileFlag}>
								<label for="option_form__submitKey">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.submitKey) || '送信キー'}</label>
								<select name="submitKey" id="option_form__submitKey" class="form-control">
									<option each={v,k in submitKeyLabels} key={k} value="{k}" selected={k === ('submitKey' in window.chatplus.option ? window.chatplus.option.submitKey : opts.appearance.talking.submitKey)}>{v}</option>
								</select>
							</virtual>
						</div>
						<div class="button-container">
							<button class="btn btn-sm" onclick={submitOption} type="button"><span>{opts.appearance.themeParams.optionSubmit || '適用'}</span></button>
							<button class="btn btn-sm" onclick={cancelOption} type="button"><span>{opts.appearance.themeParams.optionCancel || 'キャンセル'}</span></button>
						</div>
					</div>
				</div><!-- #option_form -->

			</div><!-- body -->

			<div id="chatplusfooter" inert="{optionDialogVisible}">
				<span class="footer option"><a onclick={openOptionDialog} role="button" tabindex="0" if={opts.appearance.themeParams.option}>{ opts.appearance.themeParams.optionTitle || 'オプション'}</a></span>
				<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="0">Powered by {opts.poweredby}</a></span>
			</div><!-- footer -->
		</div><!-- content -->
		</div><!-- outline -->

		<div id="outline" if={ status=="no_agent" }>
		<div id="chatpluscontent">
			<div id="eye_catcher" class="eyecatcher-no_agent" if={eyeCatcher.no_agent.enable && eyeCatcher.no_agent.active && ! eyeCatcher.no_agent.imagemap} onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? '0' : null}">
				<img if={! eyeCatcher.no_agent.image_fallback} src="{eyeCatcher.no_agent.image}" alt="{eyeCatcher.no_agent.altText}" title="{eyeCatcher.no_agent.titleText}" width="{eyeCatcher.no_agent.image_width}" height="{eyeCatcher.no_agent.image_height}">
				<picture if={eyeCatcher.no_agent.image_fallback}>
					<source type="{eyeCatcher.no_agent.image_mimetype}" srcset="{eyeCatcher.no_agent.image}">
					<img src="{eyeCatcher.no_agent.image_fallback}" alt="{eyeCatcher.no_agent.altText}" title="{eyeCatcher.no_agent.titleText}" width="{eyeCatcher.no_agent.image_width}" height="{eyeCatcher.no_agent.image_height}">
				</picture>
				<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
			</div>
			<div id="eye_catcher" class="eyecatcher-no_agent eyecatcher-imagemap" if={eyeCatcher.no_agent.enable && eyeCatcher.no_agent.active && eyeCatcher.no_agent.imagemap}>
				<img src="{eyeCatcher.no_agent.image}" usemap="#eyecatcher-no_agent-map" if={  eyeCatcher.no_agent.imagemap.size} width="{eyeCatcher.no_agent.imagemap.size.width}" height="{eyeCatcher.no_agent.imagemap.size.height}" data-width="{eyeCatcher.no_agent.imagemap.size.width}" data-height="{eyeCatcher.no_agent.imagemap.size.height}" alt="{eyeCatcher.no_agent.altText}">
				<img src="{eyeCatcher.no_agent.image}" usemap="#eyecatcher-no_agent-map" if={! eyeCatcher.no_agent.imagemap.size} data-width="{eyeCatcher.no_agent.imagemap.baseSize.width}" data-height="{eyeCatcher.no_agent.imagemap.baseSize.height}" alt="{eyeCatcher.no_agent.altText}">
				<map name="eyecatcher-no_agent-map" data-rule="{eyeCatcher.no_agent.imagemap.bot_rule}" if={eyeCatcher.no_agent.imagemap}>
					<virtual each={a in eyeCatcher.no_agent.imagemap.actions}>
						<area if={a.type=='message'} shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-text="{a.text}" onclick="{imagemapMessage}" alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='uri'    } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="{a.linkUri}" target="{a.sameTab ? '' : '_blank'}" alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='open'   } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" onclick={open} alt="" title="{a.title}" tabindex="0" />
						<area if={a.type=='mailto' } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="mailto:{a.addr}" alt="" title="{a.title}" tabindex="0" />
					</virtual>
				</map>
				<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
			</div>

			<div id="chatplusheader" onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? 0 : -1}">
				<div id="profile" class="profile" role="heading">
					<span class="name">{ opts.appearance.disconnect_title || "メッセージを残す" }</span>
				</div>
				<div class="operate" if={! btnheadless}>
					<a class="button-expand" onclick={expand} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelExpand || '拡大'}" if={compress_enabled && compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-expand-alt fa-lg"></i></a>
					<a class="button-compress" onclick={compress} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelCompress || '縮小'}" if={compress_enabled && !compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-compress-alt fa-lg"></i></a>
					<a class="button-close" onclick={closeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelMinimize || '最小化'}" if={windowStatus != 'close' && ! chatbuttonFlag}><i role="presentation" aria-hidden="true" class="cpfar fa-minus-square fa-lg"></i></a>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={hideButton.titlebar && (windowStatus=="close" || contactResult !== null)}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</div>

			<div id="body">
			<h2 id="cpoadb710" class="{after: contactResult !== null}">
				<abr if={contactResult === null } content="{variableTexts.disconnectBody || "オペレーターは今対応できません。メッセージをお残しください。すぐにこちらからご連絡いたします。"}" cptag="1" />
				<abr if={contactResult === true } content="{opts.appearance.contact_sucesMess}" cptag="1" />
				<abr if={contactResult === false} content="{opts.appearance.contact_failMess}" cptag="1" />
			</h2>
			<form id="form-offline" class="form-horizontal" if={! opts.appearance.disconnect_no_form && ! expired && contactResult === null}>
			<div each={ e,i in disconnect }>
			<div class="form-group" if={e.type == '_name'}>
				<label class="col-sm-4 control-label" id="cpoadnt711">{e.title}<span class="required-marker" if={e.required}>※</span></label>
				<div class="col-sm-8"><input class="form-control ques" data-label="{e.title}" data-required="{e.required}" data-name="name" type="text" placeholder="{e.title}" value="{ customer.username }"></div>
			</div>
			<virtual if={e.type == '_email'}>
			<div class="form-group">
				<label class="col-sm-4 control-label" id="cpoadet712">{e.title}<span class="required-marker" if={e.required}>※</span></label>
				<div class="col-sm-8"><input class="form-control ques" data-label="{e.title}" data-required="{e.required}" data-name="email" type="text" placeholder="{e.title}" value="{ customer.email }"></div>
			</div>
			<div class="form-group" if={e.check}>
				<label class="col-sm-4 control-label" id="cpoadet712">{e.title}(確認)<span class="required-marker" if={e.required}>※</span></label>
				<div class="col-sm-8"><input class="form-control ques emailCheck" data-label="{e.title}(確認)" data-required="{e.required}" data-name="emailCheck" type="text" placeholder="{e.title}(確認)"></div>
			</div>
			</virtual>
			<div class="form-group" if={ e.type=="text" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8"><input class="form-control ques" data-label="{ e.title }" data-required="{ e.required }" data-name="{e.title}" type="text" placeholder="{ e.title }"><span></span></div>
			</div>
			<div class="form-group" if={ e.type=="title" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8"><input class="form-control ques" data-label="{ e.title }" data-required="{ e.required }" data-name="title" type="text" placeholder="{ e.title }"><span></span></div>
			</div>
			<div class="form-group" if={ e.type=="textarea" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8">
				<textarea class="form-control ques" data-label="{ e.title }" data-required="{ e.required }" data-name="{e.title}"></textarea><span></span>
				</div>
			</div>
			<div class="form-group" if={ e.type=="select" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8">
				<select class="form-control ques selectbox" data-label="{ e.title }" data-required="{ e.required }" data-name="{e.title}">
				<option value=""></option>
				<option each={ name, i in e.items } value="{name}">{ name }</option>
				</select>
				</div>
			</div>
			<div class="form-group" if={ e.type=="radio" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8">
				<ul class="form-list">
					<li each={ name in e.items }><label><input type="radio" data-label="{ e.title }" data-required="{ e.required }" data-name="{e.title}" name="radio_{i}" class="ques" value="{ name }">{ name }</label></li>
				</ul>
				</div>
			</div>
			<div class="form-group" if={ e.type=="check" }>
				<label class="col-sm-4 control-label">{ e.title }<span class="required-marker" if={ e.required=="1" }>※</span></label>
				<div class="col-sm-8">
				<ul class="form-list">
					<li each={ name, i in e.items }><label><input type="checkbox" data-label="{ e.title }" data-required="{ e.required }" data-name="{e.title}" name="checkbox1" value="{ name }" class="ques">{ name }</label></li>
				</ul>
				</div>
			</div>
			</div>

			<div if={ opts.appearance.disconnect_remark } class="contact-remark">
				<abr class="form-control" content="{variableTexts.disconnectRemark}" cptag="{opts.appearance.disconnect_remarkTag}" />
			</div>


			<div class="error-message"></div>

			<div class="form-group btn-container">
				<button type="button" class="btn btn-block" onclick="{contact}" id="cpoadbt713">
					<span>{ opts.appearance.disconnect_buttonText || "メッセージを残す" }</span>
				</button>
			</div>
			</form>

			<div id="option_form" show={optionDialogVisible}>
				<div class="operate">
					<div class="input-file">{opts.appearance.themeParams.optionTitle || 'オプション'}</div>
					<div class="options">
						<label for="option_form__mute">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.mute) || '通知音を出さない'}</label>
						<input type="checkbox" name="mute" id="option_form__mute" checked="{chatplus.option.mute}">
						<virtual if={! mobileFlag}>
							<label for="option_form__submitKey">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.submitKey) || '送信キー'}</label>
							<select name="submitKey" id="option_form__submitKey" class="form-control">
								<option each={v,k in submitKeyLabels} key={k} value="{k}" selected={k === ('submitKey' in window.chatplus.option ? window.chatplus.option.submitKey : opts.appearance.talking.submitKey)}>{v}</option>
							</select>
						</virtual>
					</div>
					<div class="button-container">
						<button class="btn btn-sm" onclick={submitOption} type="button"><span>{opts.appearance.themeParams.optionSubmit || '適用'}</span></button>
						<button class="btn btn-sm" onclick={cancelOption} type="button"><span>{opts.appearance.themeParams.optionCancel || 'キャンセル'}</span></button>
					</div>
				</div>
			</div><!-- #option_form -->

			</div><!-- body -->

			<div id="chatplusfooter" inert="{optionDialogVisible}">
				<span class="footer option"><a onclick={openOptionDialog} role="button" tabindex="0" if={opts.appearance.themeParams.option}>{ opts.appearance.themeParams.optionTitle || 'オプション'}</a></span>
				<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="0">Powered by {opts.poweredby}</a></span>
			</div><!-- footer -->
		</div><!-- content -->
		</div><!-- outline -->

		<div id="outline" if={ status == 'in_chat' || status == 'in_chatbot' || status=="greeting" || status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute' || status == 'accept_chat' || inChatWaiting && status == 'wait_chat'}>
		<div id="chatpluscontent">
			<virtual if={status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute'}>
				<div id="eye_catcher" class="eyecatcher-close_chat" if={eyeCatcher.close_chat.enable && eyeCatcher.close_chat.active && ! eyeCatcher.close_chat.imagemap} onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? '0' : null}">
					<img if={! eyeCatcher.close_chat.image_fallback} src="{eyeCatcher.close_chat.image}" alt="{eyeCatcher.close_chat.altText}" title="{eyeCatcher.close_chat.titleText}" width="{eyeCatcher.close_chat.image_width}" height="{eyeCatcher.close_chat.image_height}">
					<picture if={eyeCatcher.close_chat.image_fallback}>
						<source type="{eyeCatcher.close_chat.image_mimetype}" srcset="{eyeCatcher.close_chat.image}">
						<img src="{eyeCatcher.close_chat.image_fallback}" alt="{eyeCatcher.close_chat.altText}" title="{eyeCatcher.close_chat.titleText}" width="{eyeCatcher.close_chat.image_width}" height="{eyeCatcher.close_chat.image_height}">
					</picture>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
				<div id="eye_catcher" class="eyecatcher-close_chat eyecatcher-imagemap" if={eyeCatcher.close_chat.enable && eyeCatcher.close_chat.active && eyeCatcher.close_chat.imagemap}>
					<img src="{eyeCatcher.close_chat.image}" usemap="#eyecatcher-close_chat-map" if={  eyeCatcher.close_chat.imagemap.size} width="{eyeCatcher.close_chat.imagemap.size.width}" height="{eyeCatcher.close_chat.imagemap.size.height}" data-width="{eyeCatcher.close_chat.imagemap.size.width}" data-height="{eyeCatcher.close_chat.imagemap.size.height}" alt="{eyeCatcher.close_chat.altText}">
					<img src="{eyeCatcher.close_chat.image}" usemap="#eyecatcher-close_chat-map" if={! eyeCatcher.close_chat.imagemap.size} data-width="{eyeCatcher.close_chat.imagemap.baseSize.width}" data-height="{eyeCatcher.close_chat.imagemap.baseSize.height}" alt="{eyeCatcher.close_chat.altText}">
					<map name="eyecatcher-close_chat-map" data-rule="{eyeCatcher.close_chat.imagemap.bot_rule}" if={eyeCatcher.close_chat.imagemap}>
						<virtual each={a in eyeCatcher.close_chat.imagemap.actions}>
							<area if={a.type=='message'} shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-text="{a.text}" onclick="{imagemapMessage}" alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='uri'    } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="{a.linkUri}" target="{a.sameTab ? '' : '_blank'}" alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='open'   } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" onclick={open} alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='mailto' } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="mailto:{a.addr}" alt="" title="{a.title}" tabindex="0" />
						</virtual>
					</map>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</virtual>
			<virtual if={! (status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute')}>
				<div id="eye_catcher" class="eyecatcher-in_chat" if={eyeCatcher.in_chat.enable && eyeCatcher.in_chat.active && ! eyeCatcher.in_chat.imagemap} onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}">
					<img if={! eyeCatcher.in_chat.image_fallback} src="{eyeCatcher.in_chat.image}" alt="{eyeCatcher.in_chat.altText}" title="{eyeCatcher.in_chat.titleText}" width="{eyeCatcher.in_chat.image_width}" height="{eyeCatcher.in_chat.image_height}">
					<picture if={eyeCatcher.in_chat.image_fallback}>
						<source type="{eyeCatcher.in_chat.image_mimetype}" srcset="{eyeCatcher.in_chat.image}">
						<img src="{eyeCatcher.in_chat.image_fallback}" alt="{eyeCatcher.in_chat.altText}" title="{eyeCatcher.in_chat.titleText}" width="{eyeCatcher.in_chat.image_width}" height="{eyeCatcher.in_chat.image_height}">
					</picture>
					<div id="chatplusbadge" if={badge.enable && windowStatus === 'close' && unreadCount > 0}>{unreadCount}</div>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher && ! hideButton.close}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
					<a class="button-hide close" onclick={removeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelQuit || '閉じる'}" if={windowStatus=="close" && hideButton.eyecatcher && hideButton.close}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
				<div id="eye_catcher" class="eyecatcher-in_chat eyecatcher-imagemap" if={eyeCatcher.in_chat.enable && eyeCatcher.in_chat.active && eyeCatcher.in_chat.imagemap}>
					<img src="{eyeCatcher.in_chat.image}" usemap="#eyecatcher-in_chat-map" if={  eyeCatcher.in_chat.imagemap.size} width="{eyeCatcher.in_chat.imagemap.size.width}" height="{eyeCatcher.in_chat.imagemap.size.height}" data-width="{eyeCatcher.in_chat.imagemap.size.width}" data-height="{eyeCatcher.in_chat.imagemap.size.height}" alt="{eyeCatcher.in_chat.altText}">
					<img src="{eyeCatcher.in_chat.image}" usemap="#eyecatcher-in_chat-map" if={! eyeCatcher.in_chat.imagemap.size} data-width="{eyeCatcher.in_chat.imagemap.baseSize.width}" data-height="{eyeCatcher.in_chat.imagemap.baseSize.height}" alt="{eyeCatcher.in_chat.altText}">
					<map name="eyecatcher-in_chat-map" data-rule="{eyeCatcher.in_chat.imagemap.bot_rule}" if={eyeCatcher.in_chat.imagemap}>
						<virtual each={a in eyeCatcher.in_chat.imagemap.actions}>
							<area if={a.type=='message'} shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-text="{a.text}" onclick="{imagemapMessage}" alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='uri'    } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="{a.linkUri}" target="{a.sameTab ? '' : '_blank'}" alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='open'   } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" onclick={open} alt="" title="{a.title}" tabindex="0" />
							<area if={a.type=='mailto' } shape="rect" coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" data-coords="{a.area.x},{a.area.y},{a.area.x + a.area.width},{a.area.y + a.area.height}" href="mailto:{a.addr}" alt="" title="{a.title}" tabindex="0" />
						</virtual>
					</map>
					<div id="chatplusbadge" if={badge.enable && windowStatus === 'close' && unreadCount > 0}>{unreadCount}</div>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" if={windowStatus=="close" && hideButton.eyecatcher && ! hideButton.close}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
					<a class="button-hide close" onclick={removeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelQuit || '閉じる'}" if={windowStatus=="close" && hideButton.eyecatcher && hideButton.close}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</virtual>

			<div id="chatplusheader" onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? 0 : -1}">
				<div class="title {frame:opts.frame_image}" role="heading">{
					  status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute' ? opts.appearance.end.title
					: status == 'wait_chat' ? (callingTitle ? callingTitle : "担当者に接続中です")
					: opts.appearance.talking.title
				}</div>
				<div class="operate" if={! btnheadless}>
					<a class="button-expand" onclick={expand} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelExpand || '拡大'}" if={compress_enabled && compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-expand-alt fa-lg"></i></a>
					<a class="button-compress" onclick={compress} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelCompress || '縮小'}" if={compress_enabled && !compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-compress-alt fa-lg"></i></a>
					<a class="button-close" onclick={closeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelMinimize || '最小化'}" if={windowStatus != 'close' && ! chatbuttonFlag}><i role="presentation" aria-hidden="true" class="cpfar fa-minus-square fa-lg"></i></a>
					<a class="button-remove" onclick={removeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelQuit || '閉じる'}" style={quitConfirmVisible || ocrScanVisible ? 'visibility:hidden' : ''} if={status == 'in_chat' || status == 'in_chatbot' || status == 'wait_chat' && inChatWaiting || status == 'accept_chat' }><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
					<a class="button-hide" onclick={hideWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelHide || '非表示'}" style={quitConfirmVisible ? 'visibility:hidden' : ''} if={(status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute' || status == 'quit') && hideButton.titlebar}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</div><!-- header -->
			<div id="chatplusbadge" if={badge.enable && !(eyeCatcher.in_chat.enable && eyeCatcher.in_chat.active) && windowStatus === 'close' && unreadCount > 0}>{unreadCount}</div>

			<div id="body" class="{frame:opts.frame_image} {oneliner:opts.appearance.talking.oneliner && !(status=='close_chat_by_visitor'||status=='close_chat_by_agent'||status=='close_chat_by_mute')}">
				<div id="profile" class="profile" if={agent_id}>
					<img class="agent-icon" src="{url}/image/user/{ access_key }/{ agent_id }" alt="" width="56" height="56" if={ opts.appearance.talking.agentPhoto }>
					<div class="name">{ agent_name }</div>
					<div class="operator-role"><span id="cpatcn619">{ opts.appearance.talking.counterName || "カスタマーサポート" }</span></div>
					<div class="logo" if={ opts.appearance.talking.logo }><img src="{ opts.logo_image }" width="56" height="56" alt="{opts.logo_alt}"></div>
				</div>
				<div id="profile" class="profile" if={! agent_id}>
					<img class="agent-icon" alt="" if={ opts.appearance.talking.agentPhoto }>
					<div class="name">{ callingTitle }</div>
					<div class="operator-role"></div>
					<div class="logo" if={ opts.appearance.talking.logo }><img src="{ opts.logo_image }" width="56" height="56" alt="{opts.logo_alt}"></div>
				</div>
				<div id="chatplusframe" class="frame" if={opts.frame_image}>
					<img class="frame-icon" src="{opts.frame_image}" alt="">
					<span class="name" if={opts.appearance.talking.explanation}>{ opts.appearance.talking.explanation }</span>
				</div>

				<div id="messages" class="iconsize{ opts.appearance.themeParams.iconsize } {selectwrap: opts.appearance.themeParams.selectwrap} {imageMap: imageMap}" inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
					<div class="view">
						<div id="past-mess-block" class="view-content" if={ pastMessages && (status=="in_chat" || status=="in_chatbot" || status=="suspend_chat" || status=="wait_chat" && inChatWaiting) || status=="accept_chat"}>
							<a class="past-mess-anchor" hide={pastMessagesLoading} onclick="{ showPastMessages }" >{opts.appearance.talking.showPastMessages_msg|| "前回の内容を表示する"}</a>
							<span class="past-mess-throbber" show={pastMessagesLoading}><i role="presentation" aria-hidden="true" class="cpfas fa-spinner fa-spin"></i></span>
						</div>
						<div class="view-content {msg: !m.date, user: m.event_from == 1, ope: (m.event_from == 2 || m.event_from == 3), msgSlider: m.event_type == 28, imageMap: m.event_type == 25, textform: m.event_type == 26, iframe: m.event_type == 36, iframe-notext: m.event_type == 36 && (opts.iframe && ! opts.iframe.balloon), dummy: m.dummy, already: m.already, date: m.date, unread: m.unread}" id="msg_{m.id}" data-num="{i}" data-rule="{m.bot_rule}" data-past="{m.past}" each={m in messages}>
							<div class="datestamp" if={ m.date }>
								<datestampclient content={ m.created_at } format="YYYY/MM/DD" timezone="{parent.opts.timezone}" offset="{parent.opts.timezone_offset}" />
							</div>
							<virtual if={! (m.event_type == 25 || (m.event_type == 36 && (opts.iframe && ! opts.iframe.balloon))) && m.date === undefined}>
								<div class="time" if={ m.event_type != 28 }>
									<p class="streaming-spinner" if={m.event_type == 60}><i class="fas fa-spin fa-spinner"></i></p>
									<timestampclient content="{ m.created_at }" format="HH:mm" timezone="{parent.opts.timezone}" offset="{parent.opts.timezone_offset}" />
								</div>
								<div class="name" if={ m.event_from == 1 }>
									<span class="chat-username">{ m.name || parent.opts.appearance.themeParams.visitorName }</span>
								</div>
								<div class="name" if={ (m.event_from == 2 || m.event_from == 3) && m.event_type != 28 }>
									<span class="chat-username">{ m.name }</span>
									<img if={ parent.opts.appearance.talking.agentPhoto !== false && m.agent_id } class="icon" src="{url}/image/user/{ access_key }/{ m.agent_id }" alt="">
								</div>
								<div if={m.event_type == 24} class="stamp"><raw content="{ m.body }" /></div>
								<div if={m.event_type == 26} class="textform"><raw content="{ m.body }" /></div>
								<div if={m.event_type == 27} class="confirm"><raw content="{ m.body }" /></div>
								<div if={m.event_type == 28} class="carousel"><raw content="{ m.body }" /></div>
								<div if={m.event_type == 36 && (! opts.iframe || opts.iframe.balloon)} class="text"><raw content="{ m.body }" /></div>
								<div if={m.event_type != 24 && m.event_type != 26 && m.event_type != 27 && m.event_type != 28 && m.event_type != 29 && m.event_type != 36} class="text {no_name: m.event_from == 1 ? (opts.appearance.themeParams.hideVisitorName || !(m.name || parent.opts.appearance.themeParams.visitorName)) : opts.appearance.themeParams.hideAgentName}">
									<virtual if={m.event_type == 21}>
										<nlbr content="{ m.body }" escape="{parent.opts.appearance.talking.escape}" if={! m.translated} />
										<nlbr content="{ m.translated }" escape="{parent.opts.appearance.talking.escape}" if={m.translated} />
									</virtual>
									<virtual if={m.event_type == 22 || m.event_type == 60}>
										<nlbr content="{ m.body }" />
									</virtual>
									<raw content="{ m.body }" if={!(m.event_type == 21 || m.event_type == 22 || m.event_type == 60)} />
									<virtual if={checkPromptShown() && (imageMapState === 'keyboard' || imageMapState === 'show*' || imageMapState === 'hide*')}>
										<button type="button" class="button-quote {active: m.id == quoteTarget.id}" onclick={quoteEventToggle} if={(opts.appearance.talking.enableQuote || (opts.appearance.talking.enableQuoteInChat && status === 'in_chat')) && (m.event_type == 21 || m.event_type == 22 || m.event_type == 31 || m.event_type == 39)}><i class="far fa-fw fa-reply"></i></button>
									</virtual>
								</div>
							</virtual>
							<div if={ m.event_type==25 && m.date === undefined }>
								<raw content="{ m.body }" />
							</div>
							<div if={ m.event_type==29 && m.date === undefined } class="text">
								<nlbr content="{ m.body }" />
							</div>
							<div if={m.event_type == 36 && (opts.iframe && ! opts.iframe.balloon)}>
								<raw content="{ m.body }" />
							</div>
						</div>
						<div id="scroll-dummy" style="height:{scrollDummyHeight}px"></div>
					</div>

				<div
					id="writing_box"
					if={(opts.appearance.talking.showWriting || opts.appearance.talking.showChatbotWritingText) && status != 'close_chat_by_visitor' && status != 'close_chat_by_agent' && status != 'close_chat_by_mute'}
					show={(opts.appearance.talking.showWriting && (opts.appearance.talking.showWritingAlways || writingByAgent)) || (opts.appearance.talking.showChatbotWritingText && writingByAgent === '🤖🤔')}
				>
					<img if={opts.appearance.talking.showWriting} show={opts.appearance.talking.showChatbotWriting || writingByAgent !== '🤖🤔'} src="{document.__cp_img || 'https://image.chatplus.jp'}/app/writing.gif" width="26" height="21" alt="">
					<span if={opts.appearance.talking.showChatbotWritingText} show={writingByAgent === '🤖🤔'}>{chatbotWritingText}</span>
				</div>

				</div><!-- messages -->

				<div class="info-closed {info-closed-cover: opts.appearance.end.infoCloseCover}" if={status == 'close_chat_by_visitor' || status == 'close_chat_by_agent' || status == 'close_chat_by_mute'} inert={optionDialogVisible || quitQuestionVisible}>
					<p id='cpoaeat721'><nlbr content="{ status == 'close_chat_by_mute' ? (opts.appearance.end.afterTextByMute || '一定時間新しい発言がなかったためチャットを終了しました。') : (opts.appearance.end.afterText || 'チャットを終了しました。') }"></p>
					<a id="cpoaert722" class="{btn: opts.appearance.themeName == 'modern'} restart-btn" role="button" tabindex="0" onclick={reDisplay} if={ ! opts.appearance.end.noRestart && display_when_restart == 're_display' }>{ opts.appearance.end.restartText || "チャットを再開する" }</a>
					<a id="cpoaert723" class="{btn: opts.appearance.themeName == 'modern'} restart-btn" role="button" tabindex="0" onclick={restart} if={ ! opts.appearance.end.noRestart && (display_when_restart == 're_init' || !display_when_restart) }>{ opts.appearance.end.restartText || "チャットを再開する" }</a>
				</div>

				<div id="file_upload_form" show={uploadFormVisible}>
					<div class="operate">
						<div class="input-file"><input type="file" class="addfile" name="addfile" accept="{[opts.appearance.talking.uploadVisitorAccept, opts.appearance.talking.uploadVisitorAcceptAdditional].filter(Boolean).join(',')}"></div>
						<div class="button-container">
							<button id="oatubt707" class="btn btn-sm" onclick="{ uploadFile }" type="button">
								<i role="presentation" aria-hidden="true" class="cpfas fa-spinner fa-spin fa-lg fa-fw margin-bottom" show={uploading}></i>
								<span>{ opts.appearance.talking.uploadButtonText || "アップロード" }</span>
							</button>
							<a onclick={cancelFile} id="oatuct708" role="button" tabindex="0">{ opts.appearance.talking.uploadCancelText || "キャンセル" }</a>
						</div>
						<p id="oatun709" class="upload-note">{ opts.appearance.talking.uploadNote || "※10MB以内のファイルをアップロードしてください" }</p>
					</div>
				</div>

				<div id="option_form" show={optionDialogVisible}>
					<div class="operate">
						<div class="input-file">{opts.appearance.themeParams.optionTitle || 'オプション'}</div>
						<div class="options">
							<label for="option_form__mute">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.mute) || '通知音を出さない'}</label>
							<input type="checkbox" name="mute" id="option_form__mute" checked="{chatplus.option.mute}">
							<virtual if={! mobileFlag}>
								<label for="option_form__submitKey">{(opts.appearance.themeParams.optionLabel && opts.appearance.themeParams.optionLabel.submitKey) || '送信キー'}</label>
								<select name="submitKey" id="option_form__submitKey" class="form-control">
									<option each={v,k in submitKeyLabels} key={k} value="{k}" selected={k === ('submitKey' in window.chatplus.option ? window.chatplus.option.submitKey : opts.appearance.talking.submitKey)}>{v}</option>
								</select>
							</virtual>
						</div>
						<div class="button-container">
							<button class="btn btn-sm" onclick={submitOption} type="button"><span>{opts.appearance.themeParams.optionSubmit || '適用'}</span></button>
							<button class="btn btn-sm" onclick={cancelOption} type="button"><span>{opts.appearance.themeParams.optionCancel || 'キャンセル'}</span></button>
						</div>
					</div>
				</div><!-- #option_form -->

				<div id="quit_confirm" if={! opts.appearance.end.direct} show={quitConfirmVisible}>
					<div class="operate">
						<div id="cpoaecm731" class="input-file"><abr content="{opts.appearance.end.confirmMessage || 'チャットを終了しますか？'}" /></div>
						<div class="button-container">
							<button id="cpoaeeb732" class="btn btn-sm" onclick={quit} type="button"><abr content="{opts.appearance.end.endButtonText || 'はい'}" /></button>&nbsp;
							<button id="cpoaecbt733" class="btn btn-sm" onclick={cancelQuit} type="button"><abr content="{opts.appearance.end.cancelButtonText || 'キャンセル'}" /></button>
						</div>
						<div class="suppress-container" if={opts.appearance.end.suppress && ('suppressCheck' in opts.appearance.end ? opts.appearance.end.suppressCheck == 'confirm' : !opts.appearance.end.suppressPopup)}>
							<label><input type="checkbox" class="suppress" value="1" checked={opts.appearance.end.suppressDefault}>&nbsp;{opts.appearance.end.suppressText||"一定時間チャットを表示しない"}</label>
						</div>
					</div>
				</div>

				<virtual if={! opts.appearance.end.skip}>
				<div id="quit_question" class="question-form" if={opts.appearance.end.useQuestion && !(opts.appearance.end.noRateOffline && ! online)} show={quitQuestionVisible}>
					<h2 id="cpoaerm740" if={! endQuestionSubmitted}><nlbr content="{variableTexts.endQuestionMessage || 'いかがでしたか。よろしければ今後の改善のため、評価をお願いします。'}" /></h2>
					<div class="form-container">
						<form id="form-quit" class="form-horizontal" onsubmit="{feedback}" if={opts.appearance.end.question && ! endQuestionSubmitted}>
							<div class="form-group rate" if={opts.appearance.end.rate}>
								<label id="cpoaetr741" class="form-header">{opts.appearance.end.titleRate || '評価'}<span class="required-marker" if={opts.appearance.end.questionRateRequired}>※</span></label>
								<div id="rating_buttons">
									<a onclick={feedbackGood} role="button" tabindex="0" id="cpoaegr742" class="rate-good {active: rateState == 1}"><input type="radio" class="ques" name="quit-rate" value="1" checked={rateState == 1}><i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-up fa-lg"></i>{ opts.appearance.end.goodRate || "良かった" }</a>
									<a onclick={feedbackBad} role="button" tabindex="0" id="cpoaebr743" class="rate-bad {active: rateState == 2}"><input type="radio" class="ques" name="quit-rate" value="2" checked={rateState == 2}><i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-down fa-lg"></i>{ opts.appearance.end.badRate || "良くなかった" }</a>
								</div>
							</div>
							<div each={q in opts.appearance.end.question}>
								<div class="form-group">
									<label class="control-label">{q.title}<span class="required-marker" if={q.required=="1"}>※</span></label>
									<div>
										<input if={q.type=="text"} type="text" class="form-control ques" data-label="{q.title}" data-required="{q.required}" data-name="{q.title}">
										<textarea if={q.type=="textarea"} class="form-control ques" data-label="{q.title}" data-required="{q.required}" data-name="{q.title}"></textarea>
										<select if={q.type=="select"} class="form-control ques selectbox" data-label="{q.title}" data-required="{q.required}" data-name="{q.title}">
											<option value=""></option>
											<option each={name, i in q.items} value="{name}">{name}</option>
										</select>
										<ul class="form-list" if={q.type=="radio"}>
											<li each={name, i in q.items}><label><input type="radio" data-label="{q.title}" data-required="{q.required}" data-name="{q.title}" name="{'radio_' + q.title}" class="ques" value="{name}">{name}</label></li>
										</ul>
										<ul class="form-list" if={q.type=="check"}>
											<li each={name, i in q.items}><label><input type="checkbox" data-label="{q.title}" data-required="{q.required}" data-name="{q.title}" name="{'check_' + q.title}" class="ques" value="{name}">{name}</label></li>
										</ul>
									</div>
								</div>
							</div>
							<span class="error-msg"></span>
							<div class="form-group button-container">
								<button type="submit" class="btn btn-block btn-sm"><span>{opts.appearance.end.questionButtonText || 'アンケートに答える'}</span></button>
							</div>
						</form>

						<div id="question-abort" if={! opts.appearance.end.rateForce && ! endQuestionSubmitted}>
							<button id="cpoatpb744" class="btn btn-sm" onclick="{ closeQuestion }" type="button"><span>{opts.appearance.end.buttonText || '閉じる'}</span></button>
						</div>
						<div id="question-submitted" if={endQuestionSubmitted}>
							<p>{opts.appearance.end.questionDoneMessage || 'アンケートを受け取りました。ご協力ありがとうございます。'}</p>
							<div class="button-container">
								<button id="cpoatpb744" class="btn btn-sm" onclick="{ closeQuestion }" type="button"><span>{opts.appearance.end.buttonText || '閉じる'}</span></button>
							</div>
						</div>
					</div>
				</div>

				<div id="quit_question" if={(opts.appearance.end.rate && ! opts.appearance.end.useQuestion) && !(opts.appearance.end.noRateOffline && ! online)} show={quitQuestionVisible}>
					<h2 id="cpoaerm740"><nlbr content="{variableTexts.endRateMessage || 'いかがでしたか。よろしければ今後の改善のため、評価をお願いします。'}" /></h2>
					<div class="form-container">
						<div class="form-group" if={ opts.appearance.end.rate }>
							<label class="form-header" id="cpoaetr741">{ opts.appearance.end.titleRate || "評価" }</label>
							<div id="rating_buttons" if={rateState == 0}>
								<a onclick={good} role="button" tabindex="0" id="cpoaegr742"><i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-up fa-lg"></i>{opts.appearance.end.goodRate || '良かった'}</a>
								<a onclick={bad} role="button" tabindex="0" id="cpoaebr743"><i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-down fa-lg"></i>{opts.appearance.end.badRate || '良くなかった'}</a>
							</div>
						</div>
						<div class="form-group" if={rateState != 0}>
							<div id="rating_field">
								<virtual if={rateState == 1}>{opts.appearance.end.goodRateMessage || '【良かった】で承りました'}</virtual>
								<virtual if={rateState == 2}>{opts.appearance.end.badRateMessage || '【良くなかった】で承りました'}</virtual>
							</div>
						</div>
						<div id="rating_close" class="button-container" if={! opts.appearance.end.rateForce || rateState != 0}>
							<button id="cpoatpb744" class="btn btn-sm" onclick="{ closeQuestion }" type="button"><span>{opts.appearance.end.buttonText || '閉じる'}</span></button>
						</div>
					</div>
				</div>

				<div id="quit_question" if={(! opts.appearance.end.rate && ! opts.appearance.end.useQuestion) || (opts.appearance.end.noRateOffline && ! online)} show={quitQuestionVisible}>
					<h2 id="cpoaenm740"><nlbr content="{variableTexts.endNoRateMessage || 'チャットを終了しました。ご利用ありがとうございました。'}" /></h2>
					<div class="form-container">
						<div class="button-container">
							<button id="cpoatpb744" class="btn btn-sm" onclick="{ closeQuestion }" type="button"><span>{opts.appearance.end.buttonText || '閉じる'}</span></button>
						</div>
					</div>
				</div>
				</virtual>

				<div id="ocr_scan" show={ocrScanVisible}>
					<div>
            			<video id="scan_video"></video>
       				 </div>
					<canvas id="canvas"></canvas>
					<canvas id="canvas_scan"></canvas>
					<div class="zoom">
						<button class="btn btn-sm zoom-btn" data-type="x-expand" onclick="{ resizeScanWindow }"><i class="cpfar fa-expand-alt deg45"></i></button>
						<button class="btn btn-sm zoom-btn" data-type="x-compress" onclick="{ resizeScanWindow }"><i class="cpfar fa-compress-alt deg45"></i></button>
						<button class="btn btn-sm zoom-btn" data-type="y-expand" onclick="{ resizeScanWindow }"><i class="cpfar fa-expand-alt deg135"></i></button>
						<button class="btn btn-sm zoom-btn" data-type="y-compress" onclick="{ resizeScanWindow }"><i class="cpfar fa-compress-alt deg135"></i></button>
					</div>
					<div class="ocr_scan_input">
						<label>読み取り値：</label>
						<input type="text" name="scan_number" class="input form-control"></input>
						<div class="scanning" show={!reScanOcrVisible}><i class="cpfas fa-3x fa-spin fa-spinner"></i></div>
					</div>
					<div class="btn-container">
						<button class="btn btn-sm" onclick="{ fixScan }">OK</button>
						<button class="btn btn-sm cansel" onclick="{ closeScanWindow }">キャンセル</button>
					</div>
					<div class="btn-container">
						<button class="btn btn-sm rescan" onclick="{ reScanOcr }" show={reScanOcrVisible}>再度読み込む</button>
					</div>
				</div>

			</div><!-- body -->


			<div id="userOperation" if={imageMapOnline && (online || imageMapOffline == null) && (status == 'in_chat' || status == 'in_chatbot' || status == 'wait_chat' && inChatWaiting || status == 'accept_chat') && (imageMapState === 'show' || imageMapState === 'hide')}>
				<div id="userOperationImage" data-rule="{imageMapOnline.id}" if={imageMapState === 'show'}>
					<img if={! imageMapOnline.fixed} usemap="#JpChatPlusImageMap" src="{imageMapOnline.image}" alt="{imageMapOnline.alt}" />
					<img if={  imageMapOnline.fixed} usemap="#JpChatPlusImageMap" src="{imageMapOnline.image}" width="{imageMapOnline.areaWidth}" height="{imageMapOnline.areaHeight}" alt="{imageMapOnline.alt}" />
					<map name="JpChatPlusImageMap">
						<area each={a in imageMapOnline.areas} if={a.type=="uri"    } shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" href="{a.value}" target="{a.target}" alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOnline.areas} if={a.type=="maphide"} shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" data-text="{a.value}" onclick={showKeyboard} alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOnline.areas} if={a.type=="message"} shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" data-text="{a.value}" onclick={imagemapMessage} alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOnline.areas} if={a.type=="mailto" } shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" href="mailto:{a.value}" alt="" title="{a.title}" tabindex="0" />
					</map>
				</div>
				<section id="userOperationArea" class="{slim: opts.appearance.talking.imageMapAreaSlim}" if={! opts.appearance.talking.imageMapAreaHide}>
					<div id="iconKeyboard" onclick={showKeyboard} role="button" tabindex="0">
						<i role="presentation" aria-hidden="true" class="cpfar fa-keyboard fa-lg"></i>
					</div>
					<div id="tapMessage" if={imageMapState === 'show' || imageMapState === 'hide'} onclick={switchImageMap} role="button" tabindex="0">
						<span if={opts.appearance.talking.imageMapText}>{opts.appearance.talking.imageMapText}&nbsp;</span><i role="presentation" aria-hidden="true" class="cpfas {fa-caret-down: imageMapState === 'show'} {fa-caret-up: imageMapState === 'hide'}"></i>
					</div>
				</section>
			</div>
			<div id="userOperation" if={(! online && imageMapOffline) && (status == 'in_chat' || status == 'in_chatbot' || status == 'accept_chat' || status == 'wait_chat' && inChatWaiting) && (imageMapState === 'show' || imageMapState === 'hide')}>
				<div id="userOperationImage" data-rule="{imageMapOffline.id}" if={imageMapState === 'show'}>
					<img if={! imageMapOffline.fixed} usemap="#JpChatPlusImageMap" src="{imageMapOffline.image}" alt="{imageMapOffline.alt}" />
					<img if={  imageMapOffline.fixed} usemap="#JpChatPlusImageMap" src="{imageMapOffline.image}" width="{imageMapOffline.areaWidth}" height="{imageMapOffline.areaHeight}" alt="{imageMapOffline.alt}" />
					<map name="JpChatPlusImageMap">
						<area each={a in imageMapOffline.areas} if={a.type=="uri"    } shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" href="{a.value}" target="{a.target}" alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOffline.areas} if={a.type=="maphide"} shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" data-text="{a.value}" onclick={showKeyboard} alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOffline.areas} if={a.type=="message"} shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" data-text="{a.value}" onclick={imagemapMessage} alt="" title="{a.title}" tabindex="0" />
						<area each={a in imageMapOffline.areas} if={a.type=="mailto" } shape="rect" coords="{a.coords}" data-coords="{a.dataCoords}" href="mailto:{a.value}" alt="" title="{a.title}" tabindex="0" />
					</map>
				</div>
				<section id="userOperationArea" class="{slim: opts.appearance.talking.imageMapAreaSlim}" if={! opts.appearance.talking.imageMapAreaHide}>
					<div id="iconKeyboard" onclick={showKeyboard} role="button" tabindex="0">
						<i role="presentation" aria-hidden="true" class="cpfar fa-keyboard fa-lg"></i>
					</div>
					<div id="tapMessage" if={imageMapState === 'show' || imageMapState === 'hide'} onclick={switchImageMap} role="button" tabindex="0">
						<span if={opts.appearance.talking.imageMapText}>{opts.appearance.talking.imageMapText}&nbsp;</span><i role="presentation" aria-hidden="true" class="cpfas {fa-caret-down: imageMapState === 'show'} {fa-caret-up: imageMapState === 'hide'}"></i>
					</div>
				</section>
			</div>

			<div id="suggests" if={(status == 'in_chat' || status == 'in_chatbot') && suggests.length > 0} class="suggest-{opts.appearance.talking.suggestStyle}">
				<button class="btn" onclick="{sendSuggest}" each={e in suggests}>{e}</button>
			</div>

			<div id="knowledge_suggests" if={(opts.appearance.talking.suggestSource === 'knowledge' || opts.appearance.talking.suggestSource === 'suggestknowledge') && status == 'in_chatbot' && windowStatus != 'close' && knowledge_suggests.length > 0}>
				<ul class="chat-ques">
					<li each={e,i in knowledge_suggests}>
						<input type="radio" name="radio_knowledge_suggests" id="ks_{i}_ctext" data-type="{e.type || 'knowledge'}" data-copy-site={e.copy_site} value="{e.value}" data-knowledge-id="{e.id}" data-suggest="1" data-knowledge-evaluate="{e.evaluate}" data-knowledge-hiddenevaluate="{e.hiddenevaluate}">
						<label class="knowledge_suggest_label_{i}" for="ks_{i}_ctext" tabindex="0" onkeydown={knowledgeSuggestKeydown}>{e.label}</label>
					</li>
				</ul>
			</div>

			<form id="chattext" onsubmit={send} if={checkPromptShown() && (imageMapState === 'keyboard' || imageMapState === 'show*' || imageMapState === 'hide*')} inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
				<div id="textarea" if={! compressed} ondrop={dropToUpload} ondragover={dropPrevent} ondragenter={dropEnter} ondragleave={dropLeave}>
					<div id="operate" class="{with-clip: opts.appearance.talking.uploadByVisitor && (! opts.appearance.talking.uploadOnlyInchat || status === 'in_chat')}" if={(! opts.appearance.talking.oneliner || opts.appearance.themeName === 'mini') && opts.appearance.themeName !== 'modern'}>
						<i if={(online ? imageMapOnline : (imageMapOffline || imageMapOffline == null && imageMapOnline)) && imageMapState === 'keyboard' && ! opts.appearance.talking.imageMapButtonHide} class="swtimg cpfas fa-list-ul" onclick={showImageMap} role="button" tabindex="0"></i>
						<div class="phone" if={opts.appearance.talking.phoneNumber && opts.appearance.themeName !== 'mini'}>
							<a if={mobileFlag} href="tel:{opts.appearance.talking.phoneNumber}" target="_parent"><i role="presentation" aria-hidden="true" class="cpfas fa-phone"></i>&nbsp;<span class="number">{opts.appearance.talking.phoneNumber}</span></a>
							<span if={! mobileFlag}><i role="presentation" aria-hidden="true" class="cpfas fa-phone"></i>&nbsp;<span class="number">{opts.appearance.talking.phoneNumber}</span></span>
						</div>
						<i if={opts.appearance.talking.uploadByVisitor && (! opts.appearance.talking.uploadOnlyInchat || status === 'in_chat')} class="cpfas fa-paperclip fa-lg" onclick={selectFile} role="button" tabindex="0" show={status == 'in_chat' || status == 'in_chatbot'}></i>
						<button class="btn btn-sm" type="submit" type="button" id="submit_btn" disabled={sending} show={status == 'in_chat' || status == 'in_chatbot'}>
							<span>{ status == 'in_chatbot' ? (opts.appearance.talking.buttonText_chatbot || "送信") : (opts.appearance.talking.buttonText || "送信") }</span>
						</button>
					</div>
					<span id="message-wrapper" class="message-wrapper {has-operate: (opts.appearance.talking.oneliner && opts.appearance.themeName !== 'mini') || opts.appearance.themeName === 'modern', has-quote: quoteTarget.id != null}">
						<span id="textarea-wrapper" class="textarea-bg style-border-color">
							<textarea name="message" if={!mobileFlag} class="textarea-bg textarea-font" id="message_pc"     placeholder="{(opts.appearance.talking.prompt_offline && ! online ? opts.appearance.talking.prompt_offline : (opts.appearance.talking.prompt_chatbot && status === 'in_chatbot' ? opts.appearance.talking.prompt_chatbot : opts.appearance.talking.prompt)) || 'ここにメッセージを入力してください'}" maxlength="3000" onkeyup={textareaKeyup} onkeydown={textareaKeydown} disabled={sending || status === 'wait_chat'}></textarea>
							<textarea name="message" if={ mobileFlag} class="textarea-bg textarea-font" id="message_mobile" placeholder="{(opts.appearance.talking.prompt_phone_offline && ! online ? opts.appearance.talking.prompt_phone_offline : (opts.appearance.talking.prompt_phone_chatbot && status === 'in_chatbot' ? opts.appearance.talking.prompt_phone_chatbot : opts.appearance.talking.prompt_phone)) || 'ここにメッセージを入力してください'}" maxlength="3000" onkeyup={textareaKeyup} onkeydown={textareaKeydown} disabled={sending || status === 'wait_chat'}></textarea>
							<div id="operate" class="{with-clip: opts.appearance.talking.uploadByVisitor && (! opts.appearance.talking.uploadOnlyInchat || status === 'in_chat')}" if={(opts.appearance.talking.oneliner && opts.appearance.themeName !== 'mini') || opts.appearance.themeName === 'modern'} onclick={focusTextArea}>
								<i if={(online ? imageMapOnline : (imageMapOffline || imageMapOffline == null && imageMapOnline)) && imageMapState === 'keyboard' && ! opts.appearance.talking.imageMapButtonHide} class="swtimg cpfas fa-list-ul" onclick={showImageMap} role="button" tabindex="0"></i>
								<i if={opts.appearance.talking.uploadByVisitor && (! opts.appearance.talking.uploadOnlyInchat || status === 'in_chat')} class="cpfas fa-paperclip" onclick={selectFile} role="button" tabindex="0" show={status == 'in_chat' || status == 'in_chatbot'}></i>
								<button class="btn btn-sm" type="submit" type="button" id="submit_btn" disabled={sending} show={status == 'in_chat' || status == 'in_chatbot'}>
									<span>{ status == 'in_chatbot' ? (opts.appearance.talking.buttonText_chatbot || "送信") : (opts.appearance.talking.buttonText || "送信") }</span>
								</button>
								<div class="phone" if={opts.appearance.talking.phoneNumber && opts.appearance.themeName === 'modern' && ! opts.appearance.talking.oneliner}>
									<a if={mobileFlag} href="tel:{opts.appearance.talking.phoneNumber}" target="_parent"><i role="presentation" aria-hidden="true" class="cpfas fa-phone"></i>&nbsp;<span class="number">{opts.appearance.talking.phoneNumber}</span></a>
									<span if={! mobileFlag}><i role="presentation" aria-hidden="true" class="cpfas fa-phone"></i>&nbsp;<span class="number">{opts.appearance.talking.phoneNumber}</span></span>
								</div>
							</div>
						</span>
						<div class="quote-content" if={quoteTarget.id != null}>
							<abr ref="quoteContent" content="{quoteTarget.text}" />
							<p ref="quoteTimestamp" class="time">{quoteTarget.time}</p>
							<i class="quote-cancel fas fa-times" onclick={quoteEventCancel}></i>
						</div>
					</span>
					<div class="drop-overlay" if={dropping > 0}>
						<span if={! uploading}>{opts.appearance.talking.uploadOverlay || 'ファイルをドロップしてアップロード'}</span>
						<span if={  uploading}><i role="presentation" aria-hidden="true" class="cpfas fa-lg fa-spin fa-spinner"></i></span>
					</div>
				</div>
				<div id="textarea" class="textarea-compressed" if={compressed && opts.appearance.themeParams.spHeightArea}>
					<span id="message-wrapper" class="message-wrapper has-operate">
						<span id="textarea-wrapper" class="textarea-bg style-border-color">
							<textarea name="message" class="textarea-bg textarea-font" id="message_mobile" placeholder="{(opts.appearance.talking.prompt_phone_offline && ! online ? opts.appearance.talking.prompt_phone_offline : (opts.appearance.talking.prompt_phone_chatbot && status === 'in_chatbot' ? opts.appearance.talking.prompt_phone_chatbot : opts.appearance.talking.prompt_phone)) || 'ここにメッセージを入力してください'}" maxlength="3000" onkeyup={textareaKeyup} onkeydown={textareaKeydown} disabled={status === 'wait_chat'}></textarea>
							<div id="operate" onclick={focusTextArea}>
								<button class="btn btn-sm" type="submit" type="button" id="submit_btn" disabled={sending}>
									<span>{ status == 'in_chatbot' ? (opts.appearance.talking.buttonText_chatbot || "送信") : (opts.appearance.talking.buttonText || "送信") }</span>
								</button>
							</div>
						</span>
					</span>
				</div>
				<div id="textarea" class="textarea-dummy" if={(compress_enabled && compressed && ! opts.appearance.themeParams.spHeightArea)} onclick={expand}>
					{(opts.appearance.talking.prompt_phone_compressed_offline && ! online) ? opts.appearance.talking.prompt_phone_compressed_offline : opts.appearance.talking.prompt_phone_compressed}
				</div>
			</form>

			<virtual if={(status === 'in_chat' || status === 'in_chatbot') && opts.appearance.themeName === 'modern' && opts.appearance.talking.imageMapAreaSlim && (imageMapState === 'show' || imageMapState === 'hide')}>
				<div id="chatplusfooter" class="{with-imagemaparea: ! opts.appearance.talking.imageMapAreaHide && imageMapState !== 'keyboard'} with-slim-imagemaparea {no-effect: (compressed || imageMapState === 'show')}" inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
					<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="{compressed || imageMapState === 'show' ? null : '0'}">Powered by {opts.poweredby}</a></span>
				</div>
			</virtual>
			<virtual if={! ((status === 'in_chat' || status === 'in_chatbot') && opts.appearance.themeName === 'modern' && opts.appearance.talking.imageMapAreaSlim && (imageMapState === 'show' || imageMapState === 'hide'))}>
				<div id="chatplusfooter" class="{with-imagemaparea: ! opts.appearance.talking.imageMapAreaHide && imageMapState !== 'keyboard'} {no-effect: compressed}" inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
					<span class="footer option" if={opts.appearance.themeParams.option && ! compressed}><a onclick={openOptionDialog} role="button" tabindex="{compressed ? null : '0'}">{ opts.appearance.themeParams.optionTitle || 'オプション'}</a></span>
					<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="{compressed ? null : '0'}">Powered by {opts.poweredby}</a></span>
				</div>
			</virtual>
		</div><!-- content -->
		</div><!-- outline -->

		<div id="outline" if={ status == 'wait_chat' && ( !waitDisable || chatbuttonFlag ) && !inChatWaiting }>
		<div id="chatpluscontent">
			<div id="eye_catcher" if={eyeCatcher.in_chat.enable && eyeCatcher.in_chat.active} onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? '0' : null}">
				<img src="{eyeCatcher.in_chat.image}" alt="{eyeCatcher.in_chat.altText}" title="{eyeCatcher.in_chat.titleText}" width="{eyeCatcher.in_chat.image_width}" height="{eyeCatcher.in_chat.image_height}">
			</div>

			<div id="chatplusheader" onclick={open} aria-controls="{windowStatus === 'close' ? 'chatplusview' : null}" tabindex="{windowStatus === 'close' ? 0 : -1}">
				<div class="profile" role="heading">
					<span class="name">{ callingTitle === "" || callingTitle ? callingTitle : "担当者に接続中です" }</span>
				</div>
				<div class="operate" if={! btnheadless}>
					<a class="button-expand" onclick={expand} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelExpand || '拡大'}" if={compress_enabled && compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-expand-alt fa-lg"></i></a>
					<a class="button-compress" onclick={compress} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelCompress || '縮小'}" if={compress_enabled && !compressed}><i role="presentation" aria-hidden="true" class="cpfas fa-compress-alt fa-lg"></i></a>
					<a class="button-close" onclick={closeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelMinimize || '最小化'}" if={windowStatus != 'close' && ! chatbuttonFlag}><i role="presentation" aria-hidden="true" class="cpfar fa-minus-square fa-lg"></i></a>
					<a class="button-remove" onclick={removeWindow} role="button" tabindex="0" aria-controls="chatplusview" title="{opts.appearance.themeParams.labelQuit || '閉じる'}" style={quitConfirmVisible || ocrScanVisible ? 'visibility:hidden' : ''}><i role="presentation" aria-hidden="true" class="cpfas fa-times fa-lg"></i></a>
				</div>
			</div><!-- header -->

			<div id="body">
				<h2>
					<p id="calling-explanation">
						<abr content="{explanation}"></abr>
					</p>
				</h2>

				<div id="quit_confirm" if={! opts.appearance.end.direct} show={quitConfirmVisible}>
					<div class="operate">
						<div id="cpoaecm731" class="input-file"><abr content="{opts.appearance.end.confirmMessage || 'チャットを終了しますか？'}" /></div>
						<div class="button-container">
							<button id="cpoaeeb732" class="btn btn-sm" onclick={quit} type="button"><abr content="{opts.appearance.end.endButtonText || 'はい'}" /></button>&nbsp;
							<button id="cpoaecbt733" class="btn btn-sm" onclick={cancelQuit} type="button"><abr content="{opts.appearance.end.cancelButtonText || 'キャンセル'}" /></button>
						</div>
						<div class="suppress-container" if={opts.appearance.end.suppress && ('suppressCheck' in opts.appearance.end ? opts.appearance.end.suppressCheck == 'confirm' : !opts.appearance.end.suppressPopup)}>
							<label><input type="checkbox" class="suppress" value="1" checked={opts.appearance.end.suppressDefault}>&nbsp;{opts.appearance.end.suppressText||"一定時間チャットを表示しない"}</label>
						</div>
					</div>
				</div>
			</div><!-- body -->

			<div id="chatplusfooter" if={! compressed} inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
				<span class="footer option"><a onclick={openOptionDialog} role="button" tabindex="0" if={opts.appearance.themeParams.option}>{ opts.appearance.themeParams.optionTitle || 'オプション'}</a></span>
				<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="0">Powered by {opts.poweredby}</a></span>
			</div>
			<div id="chatplusfooter" if={compressed} inert="{optionDialogVisible || uploadFormVisible || quitConfirmVisible || quitQuestionVisible}">
				<span class="deprecated-secondary-font style-background-color footer powered"><a onclick={powered} role="button" tabindex="0">Powered by {opts.poweredby}</a></span>
			</div><!-- footer -->
		</div><!-- content -->
		</div><!-- outline -->

		<div class="buttons">
			<button id="openChat" onclick={open} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="closeChat" onclick={closeWindow} if={! chatbuttonFlag} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="showChat" onclick={show} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="hideChat" onclick={hide} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="quitChat" onclick={quit} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="showPrompt" onclick={showPrompt} type="button" aria-hidden="true" tabindex="-1"></button>
			<button id="hidePrompt" onclick={hidePrompt} type="button" aria-hidden="true" tabindex="-1"></button>
		</div>
	</div><!-- chatplusview -->

	<script>
		var self = this;
		this.writeIntervalID = null;
		this.writeTimeoutID = null;
		this.agent_id = null;
		this.agent_name = null;
		this.messages = [];
		this.suggests = [];
		this.suggestsWord = '';
		this.status = '';
		this.explanation = '';
		this.callingTitle = opts.appearance.calling.title;
		this.sending = false;
		this.uploading = false;
		this.dropping = 0;
		this.chatbuttonFlag = /[?&]t=btn/.test(window.location.search);
		this.popupFlag = window.name === 'chat_plus_jp_window';
		this.mobileFlag = false;
		this.teamsImageMapFlag = false;
		this.uploadFormVisible = false;
		this.optionDialogVisible = false;
		this.quitConfirmVisible = false;
		this.quitQuestionVisible = false;
		this.ocrScanVisible = false;
		this.ocrScanInterval = null;
		this.ocrScanRecognize = true;
		this.ocrScanBoxX = 100;
		this.ocrScanBoxH = 50;
		this.activeScanForm = null;
		this.reScanOcrVisible = false;
		this.url = __cp_d;
		this.display_when_restart = '';
		this.contact_form_height = "";
		this.waitDisable = opts.appearance.calling.disable;
		this.compress_enabled = ! this.chatbuttonFlag && (0 < opts.appearance.themeParams.spHeight && opts.appearance.themeParams.spHeight < 100);
		this.compressed = undefined;
		this.online = ! chatplusData.offline;
		this.messagePreID = -999;
		this.customer = {'username': null, 'email': null};
		this.writingByAgent = null;
		this.imageMapOnline = false;
		this.imageMapOffline = null;
		this.imageMapState = 'keyboard';
		this.forcedMessaging = false;
		this.headless = 'titleBar' in opts.appearance.themeParams && ! opts.appearance.themeParams.titleBar;
		this.pastMessages = opts.appearance.talking.showPastMessages || (opts.rewind && opts.rewind.enabled);
		this.pastMessagesLoading = false;
		this.pastMessagesPosition = 0;
		this.pastMessagesUpdated = false;
		this.scrollDummyHeight = 0;
		this.inChatWaiting = false;
		this.timer = null;
		this.refreshtime = 100;
		this.inquiry = "";
		this.mail_note_flg = null;
		this.contactResult = null;
		this.disconnect = (Array.isArray(opts.appearance.disconnect) ? opts.appearance.disconnect : (JSON.parse(opts.appearance.disconnect) || []))
			.map(function(e, i) {e.order = parseInt(e.order) || 3 + i; return e;})
			.concat({'type': '_name',  'order': opts.appearance.disconnect_nameOrder  || 1, 'required': opts.appearance.disconnect_nameRequired !== false,  'title': opts.appearance.disconnect_nameTitle  || '名前'})
			.concat({'type': '_email', 'order': opts.appearance.disconnect_emailOrder || 2, 'required': opts.appearance.disconnect_emailRequired !== false, 'title': opts.appearance.disconnect_emailTitle || 'メールアドレス', 'check': opts.appearance.disconnect_emailCheck})
			.sort(function(a, b) {return a.order - b.order;});
		this.suppressed = false;
		this.hidden = false;
		this.expired = false;
		this.btnheadless = /[?&]cpbtn=headless/.test(window.location.search);
		this.applyYubinbangoRequired = false;
		this.rateState = 0;
		this.endQuestionSubmitted = false;
		this.muteSelect = false;
		this.fileUploadError = false;
		this.knowledge_suggests = [];
		this.windowStatus = ((opts.appearance.eyeCatcher.skip || /[?&]cpwin=open/.test(location.search)) && (opts.startup.disuseContact || ! opts.appearance.disconnect_disable)) ? 'open' : 'close';
		this.promptShown = null;
		this.quoteTarget = {'id': null, 'text': null, 'time': null};
		this.chatbotWritingText = null;
		var chatClient = opts.chatClient;
		if (! chatClient) {
			chatClient = new chatplus.VisitorClient();
		}

		var _ua = (function(u){
			return {
				Tablet: (u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1 && u.indexOf("windows nt 6.3") ==-1) //windows8.1 Touchを対象外
					|| u.indexOf("ipad") != -1
					|| (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
					|| (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
					|| u.indexOf("kindle") != -1
					|| u.indexOf("silk") != -1
					|| u.indexOf("playbook") != -1,
				Mobile: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
					|| u.indexOf("iphone") != -1
					|| u.indexOf("ipod") != -1
					|| (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
					|| (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
					|| u.indexOf("blackberry") != -1,
				Android: (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
					|| (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1),
				IOS: u.indexOf("iphone") != -1
					|| u.indexOf("ipod") != -1
					|| u.indexOf("ipad") != -1,
				MACOS: (u.indexOf("macintosh") != -1),
				IE: (u.indexOf('msie') != -1 || u.indexOf('trident/7') != -1),
			};
		})(window.navigator.userAgent.toLowerCase());
		if (_ua.MACOS && window.navigator.platform === 'MacIntel' && 'TouchEvent' in window) {
			// _ua.Tablet = true;
			_ua.IOS = true;
			_ua.MACOS = false;
		}
		this.mobileFlag = _ua.Mobile || _ua.Tablet;
		this.isIE = _ua.IE;

		this.submitKeyLabels = {'enter': 'Enter', 'shift': 'Shift+Enter', 'meta': 'Command+Enter', 'ctrl': 'Ctrl+Enter', 'alt': 'Alt+Enter', 'none': '(なし)'};
		if (_ua.MACOS || _ua.IOS) {
			this.submitKeyLabels['alt'] = 'Option+Enter';
		} else {
			delete this.submitKeyLabels['meta'];
		}

		var isLandscape = function() {
			if (!(_ua.Mobile || _ua.Tablet)) {return false;}

			if ('screen' in window && 'orientation' in window.screen) {
				if ('type' in window.screen.orientation) {
					return /^landscape/.test(window.screen.orientation.type);
				} else {
					return window.screen.orientation.angle % 180 !== 0;
				}
			} else if ('orientation' in window) {
				return Math.abs(window.orientation) === 90;
			} else {
				return false; // not supported
			}
		};

		//imageMap
		if (opts.appearance.talking.useImageMap || opts.appearance.talking.useImageMapOffline) {
			var generateImageMap = function(data, screenW) {
				try {
					var imagemap = {
						'fixed': false,
						'id': data.id,
						'image': data.src,
						'width': parseInt(data.width, 10),
						'height': parseInt(data.height, 10),
						'alt': data.params.altText ? data.params.altText : '',
						'areas': [],
						'areaWidth': null,
						'areaHeight': null,
					};

					var w = screenW;
					var h = Math.round(screenW / data.width * data.height);
					var w_per = w / data.params.baseSize.width;
					var h_per = h / data.params.baseSize.height;

					if ('size' in data.params) {
						w = screenW;
						h = Math.round(w / data.params.size.width * data.params.size.height);
						w_per = w / data.params.size.width;
						h_per = h / data.params.size.height;
						imagemap.fixed = true;
					}

					imagemap.areaWidth = w;
					imagemap.areaHeight = h;

					chatplus._.each(data.params.actions, function(action) {
						var value = '';
						var target = '';
						var type = action['type'];
						switch (type) {
							case 'message': {
								value = action['text'];
								break;
							}
							case 'uri': {
								value = action['linkUri'];
								if (! action['sameTab']) {target = '_blank';}
								break;
							}
							case 'mailto': {
								value = action['addr'];
								break;
							}
						}

						var coords = [
							Math.round(action['area']['x'] * w_per),
							Math.round(action['area']['y'] * h_per),
							Math.round((action['area']['width'] + action['area']['x']) * w_per),
							Math.round((action['area']['height'] + action['area']['y']) * h_per),
						];
						var dataCoords = [
							Math.round(action['area']['x']),
							Math.round(action['area']['y']),
							Math.round(action['area']['x'] + action['area']['width']),
							Math.round(action['area']['y'] + action['area']['height']),
						];

						imagemap.areas.push({
							'coords': coords.join(','),
							'dataCoords': dataCoords.join(','),
							'value': value,
							'type': type,
							'target': target,
							'title': action.title,
						});
					});

					return imagemap;
				} catch (ex) {
					console.warn(ex);
					return null;
				}
			};

			if(location.href.indexOf('https://chatplus.jp/teams/ko.php') != -1) self.teamsImageMapFlag = true;

			var screenW = 0;
			if (self.mobileFlag) {
				screenW = isLandscape() ? jQueryPlus(window).height() : jQueryPlus(window).width();
				screenW -= {'basic': 22, 'app': 0, 'mini': 2, 'modern': screenW * 0.02}[opts.appearance.themeName];
			} else if (self.chatbuttonFlag) {
				if (/[?&]bw=/.test(location.search)) {
					screenW = /[?&]bw=([^?&]*)/.exec(location.search)[1];
				} else {
					screenW = jQueryPlus(window).width();
				}
			} else if(self.teamsImageMapFlag) {
				screenW = jQueryPlus(window).width();
			} else {
				// screenW = jQueryPlus('#chatplusview #outline').innerWidth();
				screenW = {'basic': 388, 'app': 408, 'mini': 298, 'modern': 420}[opts.appearance.themeName];
			}

			if (opts.appearance.talking.useImageMap) {
				self.imageMapOnline = generateImageMap({
					'id': opts.appearance.talking.imageMapId,
					'src': opts.appearance.talking.imageMapImage,
					'width': opts.appearance.talking.imageMapImagew,
					'height': opts.appearance.talking.imageMapImageh,
					'params': opts.appearance.talking.imageMapParams,
				}, screenW);
				if (self.imageMapOnline === null) {self.imageMapOnline = false;}
			} else {
				self.imageMapOnline = false;
			}
			if (opts.appearance.talking.useImageMapOffline) {
				self.imageMapOffline = generateImageMap({
					'id': opts.appearance.talking.imageMapOfflineId,
					'src': opts.appearance.talking.imageMapOfflineImage,
					'width': opts.appearance.talking.imageMapOfflineImagew,
					'height': opts.appearance.talking.imageMapOfflineImageh,
					'params': opts.appearance.talking.imageMapOfflineParams,
				}, screenW);
			} else if (opts.appearance.talking.useImageMapOffline === false) {
				self.imageMapOffline = false;
			} else {
				self.imageMapOffline = null;
			}

			var currentImageMap = (self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline;
			if (currentImageMap) {
				self.imageMapState = opts.appearance.talking.imageMapInitialState === 'hide' ? 'keyboard' : (isLandscape() ? 'show*' : 'show');
			}
		}

		if (! self.mobileFlag) {self.compress_enabled = false;}

		self.eyeCatcher = {};
		self.eyeCatcher.base = {};
		chatplus._.each(['enable', 'image', 'always', 'only', 'offhide', 'offbar', 'behavior', 'param', 'imagemap', 'altText', 'titleText', 'image_width', 'image_height', 'image_mimetype', 'image_fallback'], function(k) {
			self.eyeCatcher.base[k] = opts.appearance.eyeCatcher[k];
		});
		self.eyeCatcher.base.active = self.eyeCatcher.base.behavior !== 'sudden' && self.eyeCatcher.base.behavior !== 'scroll-in';

		var device = self.mobileFlag ? 'sp' : 'pc';
		chatplus._.each(['no_chat', 'no_agent', 'in_chat', 'close_chat'], function(status) {
			self.eyeCatcher[status] = {};
			chatplus._.each(['enable', 'image', 'always', 'only', 'behavior', 'param', 'imagemap', 'altText', 'titleText', 'image_width', 'image_height', 'image_mimetype', 'image_fallback'], function(k) {
				self.eyeCatcher[status][k] = self.eyeCatcher.base[k];
			});

			if (status in opts.appearance.eyeCatcher && device in opts.appearance.eyeCatcher[status]) {
				if (! opts.appearance.eyeCatcher[status][device].same) {
					chatplus._.each(['enable', 'image', 'always', 'behavior', 'param', 'imagemap', 'altText', 'titleText', 'image_width', 'image_height', 'image_mimetype', 'image_fallback'], function(k) {
						if (k in opts.appearance.eyeCatcher[status][device] && opts.appearance.eyeCatcher[status][device][k] !== null) {
							self.eyeCatcher[status][k] = opts.appearance.eyeCatcher[status][device][k];
						}
					});
				}
				if ('only' in opts.appearance.eyeCatcher[status][device] && opts.appearance.eyeCatcher[status][device].only !== null) {
					self.eyeCatcher[status].only = opts.appearance.eyeCatcher[status][device].only;
				}
			}

			self.eyeCatcher[status].active = self.eyeCatcher[status].behavior !== 'sudden' && self.eyeCatcher[status].behavior !== 'scroll-in';
		});
		self.eyeCatcher.no_agent.enable   = self.eyeCatcher.no_agent.enable   && opts.appearance.eyeCatcher.always && ! opts.appearance.eyeCatcher.offhide;
		self.eyeCatcher.in_chat.enable    = self.eyeCatcher.in_chat.enable    && opts.appearance.eyeCatcher.always;
		self.eyeCatcher.close_chat.enable = self.eyeCatcher.close_chat.enable && opts.appearance.eyeCatcher.always && ! opts.appearance.end.noeyecatcher;

		chatplus._.each(['no_chat', 'no_agent', 'in_chat', 'close_chat'], function(status) {
			if (! self.eyeCatcher[status].enable) {return;}
			switch (self.eyeCatcher[status].behavior) {
				case 'hidden':
				case 'sudden': {
					window.setTimeout(function() {
						self.eyeCatcher[status].active = (self.eyeCatcher[status].behavior === 'sudden');
						self.update();
					}, parseInt(self.eyeCatcher[status].param, 10) * 1000);
					break;
				}
				case 'scroll-in':
				case 'scroll-out': {
					var f = chatplus._.throttle(function() {
						if ((jQueryPlus(document).scrollTop() + window.innerHeight / 2) > jQueryPlus(document).height() / 100.0 * parseInt(self.eyeCatcher[status].param, 10)) {
							self.eyeCatcher[status].active = self.eyeCatcher[status].behavior === 'scroll-in';
							self.update();
							document.removeEventListener('scroll', f);
						}
					}, 500);
					document.addEventListener('scroll', f, {'passive': true});
					break;
				}
			}
		});

		if ('hideButton' in opts.appearance) {
			this.hideButton = {
				'titlebar': opts.appearance.hideButton.titlebar,
				'eyecatcher': opts.appearance.hideButton.eyecatcher,
				'close': opts.appearance.hideButton.eyecatcherClose,
			};
			if (device === 'sp') {
				if ('titlebarSp' in opts.appearance.hideButton) {this.hideButton.titlebar = opts.appearance.hideButton.titlebarSp;}
				if ('eyecatcherSp' in opts.appearance.hideButton) {this.hideButton.eyecatcher = opts.appearance.hideButton.eyecatcherSp;}
				if ('eyecatcherCloseSp' in opts.appearance.hideButton) {this.hideButton.close = opts.appearance.hideButton.eyecatcherCloseSp;}
			}
		} else {
			this.hideButton = {
				'titlebar': false,
				'eyecatcher': false,
				'close': false,
			};
		}

		if ('badge' in opts.appearance) {
			this.badge = {
				'enable': opts.appearance.badge.enable,
			};
			if (device === 'sp') {
				if ('enableSp' in opts.appearance.badge) {this.badge.enable = opts.appearance.badge.enableSp;}
			}
		} else {
			this.badge = {
				'enable': false,
			};
		}

		this.unreadCount = 0;

		if ('suggestSourceOnline' in opts.appearance.talking || 'suggestSourceOffline' in opts.appearance.talking) {
			opts.appearance.talking.suggestSource = self.online ? opts.appearance.talking.suggestSourceOnline : opts.appearance.talking.suggestSourceOffline;
			opts.appearance.talking.suggestCount = self.online ? opts.appearance.talking.suggestCountOnline : opts.appearance.talking.suggestCountOffline;
			opts.appearance.talking.suggestCategories = self.online ? opts.appearance.talking.suggestCategoriesOnline : opts.appearance.talking.suggestCategoriesOffline;
			opts.appearance.talking.suggestEvaluate = self.online ? opts.appearance.talking.suggestEvaluateOnline : opts.appearance.talking.suggestEvaluateOffline;
			opts.appearance.talking.suggestQ = self.online ? opts.appearance.talking.suggestQOnline : opts.appearance.talking.suggestQOffline;
		}

		jQueryPlus(function() {
			if (! self.mobileFlag) {
				jQueryPlus(document).on('keydown', '#chatplusview #message_pc', function(ev) {
					if (ev.originalEvent && ev.originalEvent.isComposing) {return;}

					var submitKey = opts.appearance.talking.submitKey;
					if ('submitKey' in window.chatplus.option) {submitKey = window.chatplus.option.submitKey;}
					if (submitKey == 'none') {return;}
					if (ev.key === 'Enter' || ev.key === '\n') {
						switch (submitKey) {
							case 'shift': {if (! ev.shiftKey ||   ev.ctrlKey ||   ev.altKey ||   ev.metaKey) {return;} break;}
							case 'ctrl' : {if (  ev.shiftKey || ! ev.ctrlKey ||   ev.altKey ||   ev.metaKey) {return;} break;}
							case 'alt'  : {if (  ev.shiftKey ||   ev.ctrlKey || ! ev.altKey ||   ev.metaKey) {return;} break;}
							case 'meta' : {if (  ev.shiftKey ||   ev.ctrlKey ||   ev.altKey || ! ev.metaKey) {return;} break;}
							default     : {if (  ev.shiftKey ||   ev.ctrlKey ||   ev.altKey ||   ev.metaKey) {return;}}
						}
						ev.preventDefault();
						sendMessage();
					}
				});
			}

			if (self.popupFlag) {
				jQueryPlus(document).on("click", "#chatplusview .msg a", function(e) {
					if (e.target.href) {
						e.preventDefault();

						var href = e.target.href;
						var target = jQueryPlus(this).attr('target') || '_blank';
						window.open(href, '_blank');
					}
				});
			}

			//webcomponents利用サイト + ipad端末で選択肢のイベントの取得ができない場合の補助的な処理
			jQueryPlus(document).on("click", "#chatplusview ul.chat-ques li", function(e) {

				// 連打防止
				if (self.forcedRadioClickEvent) {return;}
				self.forcedRadioClickEvent = true;
				setTimeout(function() {self.forcedRadioClickEvent = false;}, 500);

				//これまでの処理のinput[type=radio]イベントを待ってから発火させる
				setTimeout(function() {
					if(!e.target.parentNode.firstChild || e.target.parentNode.firstChild.tagName!="INPUT")
						return;

					jQueryPlus(e.target.parentNode.firstChild).trigger("click");
				}, 50);
			});

			jQueryPlus(document).on("click", "#chatplusview ul.chat-ques input[type=radio]", function(e) {
				if (chatplus._.contains(['no_agent', 'no_chat', 'close_chat_by_visitor', 'close_chat_by_agent', 'quit'], self.status)) {e.preventDefault(); return;}

				// 連打防止
				if (self.forcedMessaging) {return;}
				self.forcedMessaging = true;
				setTimeout(function() {self.forcedMessaging = false;}, 250);

				var rule_id = jQueryPlus(e.target).closest('.view-content').data('rule');
				var index = jQueryPlus(e.target).closest('.chat-ques').find('li').index(jQueryPlus(e.target).closest('li')) + 1;
				var rule_num = jQueryPlus(e.target).attr('rule_num') || index;
				var no_message = jQueryPlus(this).attr('data-nomessage');

				var object_que = jQueryPlus(e.target).find("input").context;
				var inputString = object_que.id;
				var expiry_ms = 1000 * 60 * 60 * 24; // 24時間
				if (opts.startup && opts.startup.lockChoices) {
					window.chatplus.setCookie(inputString, "message_select_checked", expiry_ms);
					jQueryPlus(e.target).closest('.msg').find('.chat-ques input[type="radio"]').prop({'disabled': true});
				} else {
					window.chatplus.setCookie(inputString, "message_select", expiry_ms);
				}

				if (e.target.labels && e.target.labels.length) {
					var label = e.target.labels[0].innerHTML;
					var event_trigger = new RegExp(/<span class="event-trigger">.*<\/span>/).exec(label);
					event_trigger = event_trigger ? event_trigger[0] : null;
					if (event_trigger) {
						var events = event_trigger.substr(event_trigger.indexOf("#!!") + 3)
						events = events.substr(0, events.indexOf("<"));
						if (events) {
							chatClient.trigger('sendEvent', {events:events});
						}
					}
				}
				self.knowledge_suggests = [];
				var suggest_text = '';
				var suggest_candidate = [];
				if(jQueryPlus(this).attr('data-suggest')){
					suggest_text = self.suggestsWord;
					jQueryPlus(this).parents('ul.chat-ques').find('li').each(function(i, e) {
						var $e = jQueryPlus(e);
						if ($e.find('input').attr('data-knowledge-id')) {
							suggest_candidate.push({
								'id': $e.find('input').attr('data-knowledge-id')
							});
						}
					});
				}

				var event_name = jQueryPlus(e.target).attr('data-event');
				if (event_name) {
					chatClient.trigger('sendEvent', {events: event_name});
				}

				var type = jQueryPlus(this).attr('data-type');
				switch (type) {
					case 'rule': {
						chatClient.trigger('eventlog', {
							'rule_id': rule_id,
							'num': rule_num,
						});
						execRule(jQueryPlus(this).val());
						break;
					}
					case 'imagemap': {
						chatClient.trigger('imagemapState', jQueryPlus(this).val());
						break;
					}
					case 'post': {
						var url = jQueryPlus(this).val();
						var payload = {};
						if (jQueryPlus(this).attr('data-payload').length > 0) {
							try {
								payload = JSON.parse(jQueryPlus(this).attr('data-payload'));
								if (payload === null || typeof payload !== 'object') {throw new TypeError('post: typeof payload -> ' + typeof payload);}
							} catch (e) {
								console.warn(e);
								break;
							}
						}
						var label = jQueryPlus(this).attr('data-label');
						if (url && payload) {
							postback(url, payload, 'json', true);
						}
						if (label && ! no_message) {
							sendForcedMessage({'value': label});
						}
						break;
					}
					case 'attrvisitor': {
						var name = String(jQueryPlus(this).attr('data-name'));
						var value = String(jQueryPlus(this).val());
						if (name !== '') {
							if (value === '') {
								value = null;
							}
							var data = {};
							data[name] = value;
							addVisitorAttribute(data, true);
						}
						sendForcedMessage({
							'value': String(jQueryPlus(this).attr('data-label')),
							'rule_id': rule_id,
							'rule_num': rule_num,
							'target': e.target,
						});
						break;
					}
					case 'knowledge': {
						var $this = jQueryPlus(this);
						var bot_rule = $this.closest('.view-content').attr('data-rule');
						if ($this.attr('data-knowledge-id')) {
							// dummy発言
							chatClient.trigger('receiveMessage', {
								'dummy': true,
								'id': self.messagePreID,
								'event_type': 22,
								'event_from': 1,
								'name': self.customer.chat_username,
								'body': '<clientmess>' + $this.val().replace(/<br( \/)?>/g, '\n') + '</clientmess>',
								'created_at': Date.now(),
							});

							var copy_site_id = jQueryPlus(this).closest('.chat-ques').attr('data-cp-site');
							if (jQueryPlus(this).attr('data-copy-site')) {
								copy_site_id = jQueryPlus(this).attr('data-copy-site');
							}
							// ナレッジベースid検索
							ChatplusAction.searchKnowledgeById($this.attr('data-knowledge-id'), {
								'evaluate': $this.attr('data-knowledge-evaluate') ? 1 : null,
								'bot_rule': bot_rule,
								'bot_option_number': $this.attr('data-knowledge-index'),
								'search_id': jQueryPlus(this).closest('.chat-ques').attr('data-search'),
								'copy_site_id': copy_site_id,
								'hidden_evaluate': $this.attr('data-knowledge-hiddenevaluate') ? $this.attr('data-knowledge-hiddenevaluate') : null,
								'index': index,
								'suggest_text': suggest_text,
								'suggest_candidate': suggest_candidate,
							});

							if($this.attr('data-suggest')){
								self.knowledge_suggests = [];
								jQueryPlus('#chatplusview [name="message"]').val(null);
								self.suggestsWord = null;
							}
						} else {
							// ナレッジベース検索:ページ送り
							var options = {};
							if ($this.attr('data-knowledge-targets')) {options.targets = $this.attr('data-knowledge-targets').split(',');}
							if ($this.attr('data-knowledge-operator')) {options.operator = $this.attr('data-knowledge-operator');}
							if ($this.attr('data-knowledge-categories')) {options.categories = $this.attr('data-knowledge-categories').split(',');}
							if ($this.attr('data-knowledge-dictionary')) {options.dictionary = $this.attr('data-knowledge-dictionary');}
							if ($this.attr('data-knowledge-dictionary_strategy')) {options.dictionary_strategy = $this.attr('data-knowledge-dictionary_strategy');}
							if ($this.attr('data-knowledge-count')) {options.count = parseInt($this.attr('data-knowledge-count'));}
							if ($this.attr('data-knowledge-answer')) {options.answer = parseInt($this.attr('data-knowledge-answer'));}
							if ($this.attr('data-knowledge-exact')) {options.exact = parseInt($this.attr('data-knowledge-exact'));}
							if ($this.attr('data-knowledge-prev')) {options.prev = $this.attr('data-knowledge-prev');}
							if ($this.attr('data-knowledge-next')) {options.next = $this.attr('data-knowledge-next');}
							if ($this.attr('data-knowledge-na')) {options.na = $this.attr('data-knowledge-na');}
							if ($this.attr('data-knowledge-prefix')) {options.prefix = $this.attr('data-knowledge-prefix');}
							if ($this.attr('data-knowledge-error_failed')) {options.error_failed = $this.attr('data-knowledge-error_failed');}
							if ($this.attr('data-knowledge-error_empty')) {options.error_empty = $this.attr('data-knowledge-error_empty');}
							if ($this.attr('data-knowledge-evaluate')) {options.evaluate = $this.attr('data-knowledge-evaluate');}
							if ($this.attr('data-knowledge-hiddenevaluate')) {options.hiddenevaluate = $this.attr('data-knowledge-hiddenevaluate');}
							if ($this.attr('data-systemmessage')) {options.systemmessage = parseInt($this.attr('data-systemmessage'));}
							if ($this.attr('data-suggestknowledge')) {options.suggestknowledge = parseInt($this.attr('data-suggestknowledge'));}
							ChatplusAction.searchKnowledge($this.val(), $this.attr('data-knowledge-page'), options, bot_rule);
						}
						break;
					}
					case 'evaluate': {
						jQueryPlus(this).closest('.chat-ques').find('input').prop({'disabled': true});
						if (jQueryPlus(this).attr('data-evaluate-reason')) {
							chatClient.trigger('evaluateForm', {
								'type': jQueryPlus(this).attr('data-evaluate-type'),
								'target': jQueryPlus(this).attr('data-evaluate-target'),
								'value': jQueryPlus(this).attr('value'),
								'reason': jQueryPlus(this).attr('data-evaluate-reason'),
								'after': {
									'type': jQueryPlus(this).attr('data-evaluate-after-type'),
									'value': jQueryPlus(this).attr('data-evaluate-after-value'),
								},
								'rule_id': jQueryPlus(this).closest('.view-content').attr('data-rule'),
								'input': jQueryPlus(this).attr('data-evaluate-input'),
								'search_id': jQueryPlus(this).attr('data-evaluate-search-id'),
								'index': jQueryPlus(this).attr('data-select-index'),
							});
						} else {
							chatClient.trigger('evaluate', {
								'type': jQueryPlus(this).attr('data-evaluate-type'),
								'target': jQueryPlus(this).attr('data-evaluate-target'),
								'value': jQueryPlus(this).attr('value'),
								// 'reason': jQueryPlus(this).attr('data-evaluate-reason'),
								'after': {
									'type': jQueryPlus(this).attr('data-evaluate-after-type'),
									'value': jQueryPlus(this).attr('data-evaluate-after-value'),
								},
								'rule_id': jQueryPlus(this).closest('.view-content').attr('data-rule'),
								'input': jQueryPlus(this).attr('data-evaluate-input'),
								'search_id': jQueryPlus(this).attr('data-evaluate-search-id'),
								'index': jQueryPlus(this).attr('data-select-index'),
							});
						}
						break;
					}
					case 'sodai': {
						var $this = jQueryPlus(this);
						ChatplusAction.invokeExternal('sodai-result', {
							'label': $this.attr('data-sodai-label'),
						}, {
							'success': $this.attr('data-sodai-success'),
							'unregistered': $this.attr('data-sodai-unregistered'),
							'na': $this.attr('data-sodai-na'),
							'after_success': $this.attr('data-sodai-after_success'),
							'after_unregistered': $this.attr('data-sodai-after_unregistered'),
							'after_na': $this.attr('data-sodai-after_na'),
						});
						break;
					}
					case 'googlecalendar': {
						var $this = jQueryPlus(this);

						var message = $this.attr('data-label');
						if (message.length > 0) {
							// ダミー発言
							chatClient.trigger('receiveMessage', {
								'dummy': true,
								'id': self.messagePreID,
								'event_from': 1,
								'event_type': 22,
								'name': self.customer.chat_username,
								'body': '<clientmess>' + message + '</clientmess>',
								'read_flg': 0,
								'created_at': Date.now(),
							});
						}

						ChatplusAction.invokeExternal('googlecalendar', {
							'step': $this.attr('value'),
							'eventId': $this.attr('data-eventId'),
						}, {
							'message': message,
							'rule_id': rule_id,
							'bot_option_number': $this.parent().index($this),
						}).done(function() {
							chatClient.pingReset();
						});
						break;
					}
					case 'csv': {
						var $this = jQueryPlus(this);
						if ($this.attr('data-csv-conditions') && $this.attr('data-csv-page')) {
							// ページ送り
							ChatplusAction.searchCSV(JSON.parse($this.attr('data-csv-conditions')), {
								'page': $this.attr('data-csv-page'),
								'filename': $this.attr('data-csv-filename'),
								'prefix': $this.attr('data-csv-prefix'),
								'count': $this.attr('data-csv-count'),
								'prev': $this.attr('data-csv-prev'),
								'next': $this.attr('data-csv-next'),
								'message': $this.attr('data-csv-message'),
								'evaluate': $this.attr('data-csv-evaluate'),
								'rule_id': rule_id,
							});
						} else {
							// 選択肢選択
							var line_number = Number($this.val());
							ChatplusAction.choiceCSV($this.attr('data-csv-filename'), line_number, {
								'message': $this.attr('data-csv-message'),
								'evaluate': $this.attr('data-csv-evaluate'),
								'rule_id': rule_id,
								'search_id': $this.parents('.chat-ques').attr('data-search'),
								'select_index': index,
							});
						}
						break;
					}
					default: {
						if (! no_message) {
							sendForcedMessage(e.target);
						}
					}
				}

				var id = jQueryPlus(this).attr('id');
				var url = jQueryPlus(this).attr('data-url');
				if (url && /(nothertab-url|sametab-url)$/.test(id)) {
					url = url.replace(/<a.+?>/g, '').replace(/<\/a>/g, '');
					var target = self.popupFlag || /nothertab-url$/.test(id) ? '_blank' : '_self';

					chatClient.trigger('gotoURL', {
						'url': url,
						'target': target,
						'rule_id': rule_id,
						'num': rule_num,
						'nomessage': no_message,
					});
				}
				var search_id = jQueryPlus(e.target).closest('.chat-ques').attr('data-search');
				if(search_id && ! jQueryPlus(this).attr('data-knowledge-page')){
					var search_log_index = index - 1;
					// ページ送り選択肢を考慮
					var knowledge_list = jQueryPlus(e.target).closest('.chat-ques').find('li');
					if(knowledge_list){
						var pagenation_count = 0;
						jQueryPlus(knowledge_list).each(function(knowledge_list_index) {
							var $this = jQueryPlus(this);
							if($this.find('input') && $this.find('input').attr('data-knowledge-page')){
								pagenation_count += 1;
							}
							if(knowledge_list_index == search_log_index){
								return false;
							}
						});
						search_log_index -= pagenation_count;
					}
					chatClient.trigger('sendSearchSelect', {
						'search_id': search_id,
						'index': search_log_index,
						'knowledge_id': jQueryPlus(this).attr('data-knowledge-id'),
					});
				}
			});

			jQueryPlus(document).on("click", "#chatplusview ul.chat-ques a", function(e) {
				var event_trigger = new RegExp(/<span class="event-trigger">.*<\/span>/).exec(e.target.innerHTML);
				event_trigger = event_trigger ? event_trigger[0] : null;
				if (event_trigger) {
					var events = event_trigger.substr(event_trigger.indexOf("#!!") + 3)
					events = events.substr(0, events.indexOf("<"));
					if (events)
						chatClient.trigger('sendEvent', {events:events});
				}
			});

			jQueryPlus(document).on('click', '#chatplusview .msg.msgSlider ul.chat-ques label', function(ev) {
				var $input = jQueryPlus(this).siblings('input[type="radio"]');
				if ($input.length > 0) {
					ev.stopPropagation();
					$input.get(0).click();
				}
			});

            jQueryPlus(document).on('click', '#chatplusview .confirm .confirm_link a', function(ev) {
                var $this = jQueryPlus(this);

                if ($this.closest('.confirm_link').hasClass('locked')) {
                    ev.preventDefault();
                    return;
                }

                $this.parents('.confirm_link').find('a.clicked').removeClass('clicked');
                $this.addClass('clicked');

                var index = $this.closest('.confirm_link').find('a').index($this) + 1;
                var rule_id = $this.closest('.view-content').data('rule');
                window.chatplus.setCookie($this.parents('.msg').attr('id'), 'confirm_clicked_' + index, 1000 * 60 * 60 * 24);

                if (opts.startup && opts.startup.lockChoices) {
                    $this.parents('.confirm_link').addClass('locked');
                }

                //リンクの場合もボットログを記録
                if ($this.attr('href')) {
                    chatClient.trigger('gotoURL', {
                        'url': $this.attr('href'),
                        'target': $this.attr('target') || '_blank',
                        'rule_id': rule_id,
                        'num': index,
                        'nomessage': true,
                    });
                    return false;
                }

                var type = $this.attr('data-type');
                var value = $this.attr('data-value');
                switch (type) {
                    case 'rule': {
                        execRule(value);
                        break;
                    }
                    case 'ctext': {
                        sendForcedMessage({'value': value, 'rule_id':rule_id, 'rule_num':index});
                        break;
                    }
                    case 'status': {
                        chatClient.trigger('changeStatus', {'status': value, 'rule_id':rule_id, 'num':index});
                        break;
                    }
                    case 'assign': {
                        if (/^id_/.test(value)) {
                            var text = value.replace(/^id_/, '');
                            chatClient.trigger('changeAgent', {
                                'mode': "id",
                                'target': text,
                                'status': 'in_chat',
                                'rule_id':rule_id,
                                'num':index
                            });
                        }

                        if (/^tag_/.test(value)) {
                            var text = value.replace(/^tag_/, '');
                            chatClient.trigger('changeAgent', {
                                'mode': "tag",
                                'target': text,
                                'status': 'in_chat',
                                'rule_id':rule_id,
                                'num':index
                            });
                        }
                        break;
                    }
                    case 'post': {
                        var payload = {};
                        if ($this.attr('data-payload').length > 0) {
                            try {
                                payload = JSON.parse($this.attr('data-payload'));
                                if (payload === null || typeof payload !== 'object') {throw new TypeError('post: typeof payload -> ' + typeof payload);}
                            } catch (e) {
                                console.warn(e);
                                break;
                            }
                        }
                        if (value && payload) {
                            postback(value, payload, 'json', true);
                        }
                        break;
                    }
                    case 'evaluate': {
                        $this.parents('.confirm_link').addClass('locked');

                        if ($this.attr('data-reason')) {
                            chatClient.trigger('evaluateForm', {
                                'type': $this.attr('data-evaluate-type'),
                                'target': $this.attr('data-evaluate-target'),
                                'value': $this.attr('data-value'),
                                'reason': $this.attr('data-reason'),
                                'after': {
                                    'type': $this.attr('data-after-type'),
                                    'value': $this.attr('data-after-value'),
                                },
                                'input': $this.attr('data-input'),
                                'rule_id': rule_id,
                                'num': index,
                                'search_id': $this.attr('data-evaluate-search-id'),
                                'index': $this.attr('data-select-index'),
                            });
                        } else {
                            chatClient.trigger('evaluate', {
                                'type': $this.attr('data-evaluate-type'),
                                'target': $this.attr('data-evaluate-target'),
                                'value': $this.attr('data-value'),
                                // 'reason': $this.attr('data-reason'),
                                'after': {
                                    'type': $this.attr('data-after-type'),
                                    'value': $this.attr('data-after-value'),
                                },
                                'input': $this.attr('data-input'),
                                'rule_id': rule_id,
                                'num': index,
                                'search_id': $this.attr('data-evaluate-search-id'),
                                'index': $this.attr('data-select-index'),
                            });
                        }
                        break;
                    }
                    case 'imagemap': {
                        chatClient.trigger('imagemapState', value);
                        break;
                    }
                    case 'attrvisitor': {
                        var name = String($this.attr('data-name'));
                        var value = String($this.attr('data-value'));
                        if (name !== '') {
                            if (value === '') {
                                value = null;
                            }
                            var data = {};
                            data[name] = value;
                            addVisitorAttribute(data, true);
                        }
                        break;
                    }
                }
            });

            jQueryPlus(document).on('click', '#chatplusview .youtube-thumbnail', function(ev) {
                var $this = jQueryPlus(this);
                var $template = $this.find('template');
                if ('DocumentFragment' in window) {
                    $this.append($template.get(0).content.cloneNode(true));
                } else {
                    $this.append($template.html());
                }
                $template.remove();
                $this.find('img').remove();
            });

            jQueryPlus(document).on('click', '#chatplusview .googlemap-sendbtn button', function(ev) {
                var $this = jQueryPlus(this);
				// 送信後アクション
				var after_action = $this.data('action');
				var after_body = $this.data('body');
				var after_id = $this.data('id');
				$this.prop('disabled', true);
				$this.closest(".view-content").find('.googlemap-error').hide();

				chatClient.trigger('updateLagLng',
				{
					'callback': function(res) {
						if(res.result == 1){
							switch (after_action) {
								case 'message_': {
									sendForcedMessage({'value': after_body, 'no_assign': true, 'rule_id': $this.closest(".view-content").data("rule")});
									break;
								}
								case 'rule_': {
									execRule(parseInt(after_id));
									break;
								}
							}
						} else {
							$this.prop('disabled', false);
							$this.closest(".view-content").find('.googlemap-error').show();
						}
					},
				})
            });

            jQueryPlus(document).on('click', '#chatplusview cp-listpicker .listpicker-section:not(.locked) .listpicker-item', function(ev) {
                if (self.forcedMessaging) {return;}
                self.forcedMessaging = true;
                setTimeout(function() {self.forcedMessaging = false;}, 250);

                var $this = jQueryPlus(this);
                var $section = $this.parents('.listpicker-section');
                var $listpicker = $this.parents('cp-listpicker');

                $section.find('.listpicker-item.clicked').removeClass('clicked');
                $this.addClass('clicked');
                if (opts.startup && opts.startup.lockChoices) {
                    $section.addClass('locked');
                }

                var title = $this.find('.listpicker-item-title').text();
                var rule_id = $this.closest('.view-content').data('rule');
                var num = $this.parents('.listpicker-items').find('.listpicker-item').index($this) + 1;
                sendForcedMessage({
                    'value': title,
                    'rule_id': rule_id,
                    'rule_num': num,
                });
            });

			jQueryPlus(document).on('click touchend', '#chatplusview .msg map area.imagemapMessage', function(ev) {
				if (ev.type === 'touchend' && ! _ua.IOS) {console.warn(navigator.userAgent, _ua.IOS); return;}

				var $area = jQueryPlus(ev.target);
				var $map = $area.closest('map');
				if ($map.attr('data-disabled')) {return;}

				var text = $area.data('text').toString();
				if (! text) {return;}

				//連打防止
				if (self.forcedMessaging) {return;}
				self.forcedMessaging = true;
				setTimeout(function() {self.forcedMessaging = false;}, 250);

				var index = $map.find('area').index($area) + 1;
				var rule_id = $area.closest('.view-content').data('rule');
				sendForcedMessage({'value': text, 'rule_id': rule_id, 'rule_num': index});

				if (opts.startup && opts.startup.lockChoices) {
					$map.attr({'data-disabled': true});
					window.chatplus.setCookie($area.parents('.msg').attr('id'), 'imagemap_clicked', 1000 * 60 * 60 * 24);
				}
			});
			jQueryPlus(document).on('click touchend', '#chatplusview .msg map area.imagemapPostback', function(ev) {
				if (ev.type === 'touchend' && ! _ua.IOS) {console.warn(navigator.userAgent, _ua.IOS); return;}

				var $area = jQueryPlus(ev.target);
				var $map = $area.closest('map');
				if ($map.attr('data-disabled')) {return;}

				//連打防止
				if (self.forcedMessaging) {return;}
				self.forcedMessaging = true;
				setTimeout(function() {self.forcedMessaging = false;}, 250);

				var url = $area.data('url').toString();
				var payload_s = $area.data('payload');
				var title = $area.attr('title');
				if (! url || ! payload_s) {return;}

				try {
					if (title) {
						var index = $map.find('area').index($area) + 1;
						var rule_id = $area.closest('.view-content').data('rule');
						sendForcedMessage({'value': title, 'rule_id': rule_id, 'rule_num': index});
					}

					var payload = typeof payload_s === 'string' ? JSON.parse(payload_s) : payload_s;
					if (typeof payload === 'object' && payload != null) {
						postback(url, payload, 'json', true);
					} else {
						throw new TypeError('payload is ' + (typeof payload));
					}
				} catch (ex) {
					console.warn(ex, [url, payload_s, $area]);
				}

				if (opts.startup && opts.startup.lockChoices) {
					$map.attr({'data-disabled': true});
					window.chatplus.setCookie($area.parents('.msg').attr('id'), 'imagemap_clicked', 1000 * 60 * 60 * 24);
				}
			});
			jQueryPlus(document).on('click touchend', '#chatplusview .msg map area.imagemapAttrvisitor', function(ev) {
				if (ev.type === 'touchend' && ! _ua.IOS) {console.warn(navigator.userAgent, _ua.IOS); return;}

				var $area = jQueryPlus(ev.target);
				var $map = $area.closest('map');
				if ($map.attr('data-disabled')) {return;}

				//連打防止
				if (self.forcedMessaging) {return;}
				self.forcedMessaging = true;
				setTimeout(function() {self.forcedMessaging = false;}, 250);

				var name = String($area.data('name'));
				var value = String($area.data('value'));
				var title = String($area.attr('title'));

				if (name !== '') {
					if (value === '') {
						value = null;
					}
					var data = {};
					data[name] = value;
					addVisitorAttribute(data, true);
				}
				if (title !== '') {
					var index = $map.find('area').index($area) + 1;
					var rule_id = $area.closest('.view-content').data('rule');
					sendForcedMessage({'value': title, 'rule_id': rule_id, 'rule_num': index});
				}

				if (opts.startup && opts.startup.lockChoices) {
					$map.attr({'data-disabled': true});
					window.chatplus.setCookie($area.parents('.msg').attr('id'), 'imagemap_clicked', 1000 * 60 * 60 * 24);
				}
			});
			jQueryPlus(document).on('click touchend', '#chatplusview .msg map > area[href]', function(ev) {
				var $area = jQueryPlus(ev.target);
				var $map = $area.closest('map');

				if ($map.attr('data-disabled')) {
					ev.preventDefault();
					return;
				}

				if (opts.startup && opts.startup.lockChoices) {
					$map.attr({'data-disabled': true});
					window.chatplus.setCookie($area.parents('.msg').attr('id'), 'imagemap_clicked', 1000 * 60 * 60 * 24);
				}
			});

			jQueryPlus(document).on("keydown", "#chatplusview .msg.textform input, #chatplusview .msg.textform select", function(ev) {
				if (ev.isComposing || ev.keyCode === 229) {return;}

				var $this = jQueryPlus(this);
				var $form = $this.parents('form');

				if (ev.key === 'Enter' || ev.key === '\n') {
					ev.preventDefault();
					if ($form.hasClass('zipcode2') && $this.hasClass('p-postal-code')) {
						$this.blur();
						$form.find('.btn-search').click();
					} else if ($form.attr('data-enter')) {
						$this.blur();
						$form.find('.submit button').click();
					}
				} else if ($this.attr('type') === 'number' && (! ev.ctrlKey && ! ev.altKey && ! ev.metaKey && /^[^-+.0-9]$/.test(ev.key))) {
					ev.preventDefault();
				} else if ($this.is('.p-postal-code') && (! ev.ctrlKey && ! ev.altKey && ! ev.metaKey)) {
					if (/^[^-0-9]$/.test(ev.key)) {
						ev.preventDefault();
					} else if (ev.key === '-' && $this.val().indexOf('-') !== -1) {
						ev.preventDefault();
					}
				}
			});
			jQueryPlus(document).on('keyup change', '#chatplusview .msg.textform input.p-postal-code.hyphen', function(ev) {
				if (ev.type === 'keyup' && (ev.ctrlKey || ev.altKey || ev.metaKey || ev.key.length !== 1)) {return;}

				var before = jQueryPlus(this).val();
				var after = before;
				if (/^[0-9]{3,}$/.test(before)) {
					after = before.substring(0, 3) + '-' + before.substring(3, 7);
				}
				if (after !== before) {
					jQueryPlus(this).val(after);
				}
			});
			jQueryPlus(document).on('keydown change compositionend paste', '#chatplusview .msg.textform form.group input', function(ev) {
				var $elem = jQueryPlus(this);
				if ($elem.attr('type') !== 'tel' && $elem.attr('inputmode') !== 'numeric' && $elem.attr('inputmode') !== 'tel') {return;}
				switch (ev.type) {
					case 'keydown': {
						if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.isComposing) {return;}
						if (ev.key.length === 1 && /[^0-9]/.test(ev.key)) {
							ev.preventDefault();
						}
						break;
					}
					case 'compositionend': {
						$elem.val(String(ev.originalEvent.data).replace(/[^0-9]/g, ''));
						break;
					}
					case 'change': {
						$elem.val(String($elem.val()).replace(/[^0-9]/g, ''));
						break;
					}
					case 'paste': {
						try {
							var text = ev.originalEvent.clipboardData.getData('text/plain');
							if (text && /[^0-9]/.test(text)) {
								document.execCommand('insertText', false, text.replace(/[^0-9]/g, ''));
								ev.preventDefault();
							}
						} catch (ex) {
							console.warn(ex);
						}
						break;
					}
				}
			});

			jQueryPlus(document).on('keyup change', '#chatplusview .msg.textform input.suggest', function(ev) {
				if (ev.type === 'keyup' && (ev.ctrlKey || ev.altKey || ev.metaKey || ev.originalEvent.isComposing)) {return;}
				if (ev.type === 'keyup' && ev.key === 'Enter' && ! ev.originalEvent.composed) {return;}

				// テキストフォーム ナレッジベース検索　サジェスト
				var text = jQueryPlus(this).val().trim();
				var textform = jQueryPlus(this).parents('.msg.textform');
				var msg_id = textform.attr('id');
				var suggest = textform.find('.suggest-ques');
				var suggestcount = textform.find('form').data('knowledge-suggestcount') ? textform.find('form').data('knowledge-suggestcount') : 5;
				var categories = textform.find('form').data('knowledge-categories');
				var evaluate = textform.find('form').data('knowledge-evaluate') ? textform.find('form').data('knowledge-evaluate') : 0;
				var hiddenevaluate = textform.find('form').data('knowledge-hiddenevaluate') ? textform.find('form').data('knowledge-hiddenevaluate') : 0;
				if (! suggest) {return;}

				if ((ev.type === 'keyup' && ev.key === 'Escape') || text.length === 0) {
					self.suggestsWord = '';
					suggest.empty();
					suggest.attr({'data-text': null});
					return;
				}
				if (suggest.attr('data-text') === text) {
					return;
				}
				suggest.attr({'data-text': text});
				if(opts.appearance.talking.suggestTextform && window.chatplus.Suggestknowledge){
					// 新サジェスト
					if(! categories){ categories = ''; }
					suggest.empty();
					var res = window.chatplus.Suggestknowledge.suggest(text, String(categories), evaluate, suggestcount, 'knowledge', hiddenevaluate);
					if (res !== null && res.target) {
						res.target.reverse().forEach(function(item) {
							var $li = jQueryPlus('<li>', {});
							var $label = '<label class="suggest" title="'+item.label+'" data-value="'+item.value+'" data-type="knowledge" data-knowledge-id="'+item.id+'" data-knowledge-evaluate="'+item.evaluate+'" data-knowledge-hiddenevaluate="'+item.hiddenevaluate+'">'+item.label_hit+'</label>';
							$li.append($label);
							suggest.append($li);
						});
					} else if (res !== null && res.body) {
						suggest.append(res.body);
					}
					if (textform.attr('id') === 'msg_' + chatplusData.last_message_id) {
						scrollIntoMessage(chatplusData.last_message_id);
					}
				} else {
					// 旧サジェスト
					if(self.suggestsWord != text){
						self.suggestsWord = text;
						chatClient.trigger('knowledgesuggest', {
							'text': text,
							'type': 'form',
							'target': textform.find('form').data('knowledge-targets'),
							'categories': textform.find('form').data('knowledge-categories'),
							// 'operator': textform.find('form').data('knowledge-operator'),
							'evaluate': textform.find('form').data('knowledge-evaluate'),
							'q': jQueryPlus(this).data('suggestq'),
							'callback': function(res) {
								jQueryPlus('#chatplusview .suggest-ques').empty();
								if (res && res.text === self.suggestsWord) {
									if (res.items) {
										res.items.forEach(function(item) {
											var $li = jQueryPlus('<li>', {});
											var $label = jQueryPlus('<label>', {'class': 'suggest', 'text': item.label, 'title': item.label, 'data-value': item.value, 'data-type': 'knowledge', 'data-knowledge-id': item.id, 'data-knowledge-evaluate': item.evaluate});
											$li.append($label);
											suggest.append($li);
										});
									} else if (res.body) {
										suggest.append(res.body);
									}
	
									if (textform.attr('id') === 'msg_' + chatplusData.last_message_id) {
										scrollIntoMessage(chatplusData.last_message_id);
									}
								}
							},
						});
					}
				}
			});

			jQueryPlus(document).on('click', '#chatplusview .msg.textform .suggest-container .suggest-ques label.suggest', function(ev) {
				var $this = jQueryPlus(this);

				var $form = $this.parents('form');
				$form.addClass('disabled');
				$form.find('input, textarea, select, datepicker').attr({'readonly': true});
				$form.find('input[type="radio"]:not(:checked), input[type="checkbox"]:not(:checked), select option:not(:selected)').attr({'disabled': true});
				$form.find('.submit button').attr({'disabled': true});
				var index = $this.closest('.suggest-ques').find('li').index($this.closest('li')) + 1;
				var suggest_text = $form.find('input.suggest').val().trim();
				var suggest_candidate = [];
				$this.parents('.msg.textform').find('.suggest-ques li').each(function(i, e) {
					var $e = jQueryPlus(e);
					if ($e.find('label').attr('data-knowledge-id')) {
						suggest_candidate.push({
							'id': $e.find('label').attr('data-knowledge-id')
						});
					}
				});

				chatClient.trigger('receiveMessage', {
					'dummy': true,
					'id': self.messagePreID,
					'event_type': 22,
					'event_from': 1,
					'name': self.customer.chat_username,
					'body': '<clientmess>' + $this.attr('data-value') + '</clientmess>',
					'created_at': Date.now(),
				});

				ChatplusAction.searchKnowledgeById($this.attr('data-knowledge-id'), {
					'evaluate': $this.attr('data-knowledge-evaluate') ? $this.attr('data-knowledge-evaluate') : null,
					'hidden_evaluate': $this.attr('data-knowledge-hiddenevaluate') ? $this.attr('data-knowledge-hiddenevaluate') : null,
					'bot_rule': null,
					'index': index,
					'suggest_text': suggest_text,
					'suggest_candidate': suggest_candidate,
				});
			});

			jQueryPlus(document).on('click', '#chatplusview #knowledge_suggests .chat-ques label', function(ev) {
				var $this = jQueryPlus(this);
				if ($this.closest('li').find('input').data('type') !== 'chatgpt') { return; }

				var index = $this.closest('.chat-ques').find('li').index($this.closest('li'));
				var suggest_text = self.suggestsWord;
				var suggest_candidate = [];
				$this.parents('#knowledge_suggests').find('.chat-ques li input').each(function(i, e) {
					var $e = jQueryPlus(e);
					if ($e.val() && $e.data('knowledge-id')) {
						suggest_candidate.push({
							'id': $e.data('knowledge-id'),
							'value': $e.val(),
						});
					}
				});
				var with_evaluate = $this.closest('li').find('input').data('knowledge-evaluate');

				ChatplusAction.saveSuggestClick(index, suggest_text, suggest_candidate);
			});

			jQueryPlus(document).on("click", "#chatplusview .msg.textform .ocrform .scanbtn", function(e) {
				self.ocrScanVisible = true;
				self.update();
				jQueryPlus("#chatplusview #chattext").hide();

				var $this = jQueryPlus(this);
				var $video = document.getElementById('scan_video');
				var $canvas = document.getElementById('canvas');
				var $canvas_scan = document.getElementById('canvas_scan');
				var ctx_scan = $canvas_scan.getContext('2d');
				var scanchar = $this.parent('.ocrform').find('input').data('ocrchar');
				self.activeScanForm = $this.parent('.ocrform').find('input').data('serial-number');
				var recognize_count = 0;

				ChatplusScriptMedia.getUserMedia(function(stream) {
					$video.srcObject = stream;
					$video.setAttribute('autoplay', '');
					$video.setAttribute('muted', '');
					$video.setAttribute('playsinline', '');
					$video.play();

					try {
						if(window.localStorage.getItem('ocr_scan_box_x')){
							self.ocrScanBoxX = parseInt(window.localStorage.getItem('ocr_scan_box_x'));
						}
						if(self.ocrScanBoxX < 20 || self.ocrScanBoxX > 300){
							self.ocrScanBoxX = 100;
							try {window.localStorage.setItem('ocr_scan_box_x', 100);} catch (e) {}
						}
					} catch (e) {}
					try {
						if(window.localStorage.getItem('ocr_scan_box_h')){
							self.ocrScanBoxH = parseInt(window.localStorage.getItem('ocr_scan_box_h'));
						}
						if(self.ocrScanBoxH < 20 || self.ocrScanBoxH > 400){
							self.ocrScanBoxH = 50;
							try {window.localStorage.setItem('ocr_scan_box_h', 50);} catch (e) {}
						}
					} catch (e) {}		

					self.ocrScanInterval = window.setInterval(function(){
						$canvas.width = $video.videoWidth;
						$canvas.height = $video.videoHeight;
						var ctx = $canvas.getContext('2d');
						ctx.drawImage($video, 0, 0, $video.videoWidth, $video.videoHeight, 0, 0, $canvas.width, $canvas.height);

						var box = {
							x: self.ocrScanBoxX,
							h: self.ocrScanBoxH
						};
						box.y = (canvas.height - box.h) / 2;
						box.w = (canvas.width - box.x * 2);
				
						ctx.beginPath();
						ctx.strokeStyle = 'red';
						ctx.lineWidth = 4;
						ctx.rect(
							box.x, box.y, box.w, box.h
						);
						ctx.stroke();
						$canvas_scan.width = box.w;
						$canvas_scan.height = box.h;
						try{
							if(self.ocrScanRecognize){
								self.ocrScanRecognize = false;
								if(recognize_count == 0){
									setTimeout(function(){
										ctx_scan.drawImage($canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
										var img = $canvas_scan.toDataURL("image/jpeg");
										tesseract_recognize(img, scanchar);
									}, 1000);
								} else {
									ctx_scan.drawImage($canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
									var img = $canvas_scan.toDataURL("image/jpeg");
									tesseract_recognize(img, scanchar);
								}
							}
							recognize_count += 1;
						} catch (e) {}
					}, 200);
				});
			});

			jQueryPlus(document).on('click', '#chatplusview .msg.textform form.zipcode2:not(.disabled) .btn-search', function(ev) {
				ev.preventDefault();
				var $form = jQueryPlus(this).closest('.textform').find('form');
				window.ChatplusAction.completeZipcodes($form);
			});

			jQueryPlus(document).on("click", "#chatplusview .msg.textform .submit button", function(e) {
				if (chatplus._.contains(['no_agent', 'no_chat', 'close_chat_by_visitor', 'close_chat_by_agent', 'quit'], self.status)) {return;}

				var form = jQueryPlus(this).closest('.textform').find('form');
				if (form && form.attr('data-action')) {
					// 新textform
					form.removeClass('failed');
					form.find('.error-list').empty();

					var selector = {
						'input': 'input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="time"], input[type="number"], input[type="password"], input[type="hidden"], textarea, select',
						'check': '.form-group.checkbox, .form-group.radio',
						'file': 'input[type="file"]',
					};

					var rule_id = form.closest('.view-content').data('rule');
					var action_ = form.attr('data-action').split('_');
					var action_type = action_.shift(), action_value = action_.join('_');
					var withmessage = form.attr('data-withmessage') ? true : false;
					var systemmessage = form.attr('data-systemmessage') ? true : false;
					var messageonly = form.attr('data-messageonly') ? true : false;
					var chatinfo = form.attr('data-chatinfo') ? true : false;
					var visitorinfo = form.attr('data-visitorinfo') ? true : false;
					var writeattr = form.attr('data-writeattr') ? true : false;
					var uselabel = form.attr('data-uselabel') ? true : false;
					var payload = form.attr('data-payload') ? JSON.parse(form.attr('data-payload')) : {};
					var filesize = parseFloat(form.attr('data-filesize')) || null;
					self.fileUploadError = false;

					var data = {};
					var rack = {};
					form.find(selector.input + ', ' + selector.check + ', ' + selector.file).each(function() {
						var $this = jQueryPlus(this);

						if ($this.is(selector.check)) {
							var name = $this.find('input').attr('data-name') || $this.find('input').attr('name');
							if (! name) {return;}
							var list = $this.find('input:checked').map(function() {return jQueryPlus(this).val();}).toArray();
							data[name] = list;
							var required = $this.find('input').prop('required') || $this.attr('data-req');
							if (required && list.length == 0) {rack[name] = $this.attr('data-required-error') || true;}
						} else {
							var name = $this.attr('data-name') || $this.attr('name');
							if (! name) {return;}
							var val = $this.val();
							if (/\[\]$/.test(name)) {
								if (! (name in data)) {data[name] = [];}
								data[name].push(val);
							} else {
								data[name] = val;
							}

							var required = $this.prop('required') || $this.attr('data-req');
							var valid = ($this.is(':valid') && ! $this.hasClass('invalid')) || $this.attr('type') === 'hidden';
							if (required && (! val || (typeof val === 'string' && val.trim() === ''))) {
								rack[name] = $this.attr('data-required-error') || $this.attr('data-error') || true;
							} else if (! valid) {
								var errors = [];

								if ('validity' in $this[0]) {
									if ($this[0].validity.patternMismatch) {errors.push($this.attr('data-pattern-error'));}
									if ($this[0].validity.rangeUnderflow) {errors.push($this.attr('data-min-error'));}
									if ($this[0].validity.rangeOverflow) {errors.push($this.attr('data-max-error'));}
									if ($this[0].validity.stepMismatch) {errors.push($this.attr('data-step-error'));}
									if ($this[0].validity.tooShort) {errors.push($this.attr('data-minlength-error'));}
									if ($this[0].validity.tooLong) {errors.push($this.attr('data-maxlength-error'));}
								} else {
									if (($this.attr('pattern') !== undefined || $this.attr('pattern') !== false) && (new RegExp($this.attr('pattern')), 'u').test(val) === false) {errors.push($this.attr('data-pattern-error'));}
									if (($this.attr('min') !== undefined || $this.attr('min') !== false) && val < $this.attr('min')) {errors.push($this.attr('data-min-error'));}
									if (($this.attr('max') !== undefined || $this.attr('max') !== false) && val > $this.attr('max')) {errors.push($this.attr('data-max-error'));}
									if (($this.attr('step') !== undefined || $this.attr('step') !== false) && val % $this.attr('step') !== 0) {errors.push($this.attr('data-step-error'));}
									if (($this.attr('minlength') !== undefined || $this.attr('minlength') !== false) && val.length < $this.attr('minlength')) {errors.push($this.attr('data-minlength-error'));}
									if (($this.attr('maxlength') !== undefined || $this.attr('maxlength') !== false) && val.length > $this.attr('maxlength')) {errors.push($this.attr('data-maxlength-error'));}
								}

								if (errors.length === 0) {
									errors.push($this.attr('data-error') || ($this.attr('type') === 'email' ? 'メールアドレスに誤りがあります' : '入力内容を確認してください'));
								}

								rack[name] = errors.join('\n');
							} else if (val) {
								var errors = [];

								if ($this.attr('type') === 'number') {
									if (/e/i.test(val)) {
										errors.push($this.attr('data-error') || '入力内容を確認してください');
									}
									if ($this.attr('minlength') !== undefined && val.length < $this.attr('minlength')) {
										errors.push($this.attr('data-minlength-error') || $this.attr('data-error'));
									}
									if ($this.attr('maxlength') !== undefined && val.length > $this.attr('maxlength')) {
										errors.push($this.attr('data-maxlength-error') || $this.attr('data-error'));
									}
								}
								if ($this.attr('pattern') !== undefined) {
									try {
										var pattern = new RegExp('^(?:' + $this.attr('pattern') + ')$', 'v');
										var val_tmp = val;
										if (! pattern.test(val_tmp.replace(/\r?\n/g, ''))) {
											errors.push($this.attr('data-pattern-error') || $this.attr('data-error'));
										}
									} catch (e) {
										console.warn(e);
									}
								}
								if ($this.attr('min') !== undefined && $this.attr('type') === 'date' && $this.attr('data-polyfill')) {
									if (new Date(val) < new Date($this.attr('min'))) {
										errors.push($this.attr('data-min-error') || $this.attr('data-error'));
									}
								}
								if ($this.attr('max') !== undefined && $this.attr('type') === 'date' && $this.attr('data-polyfill')) {
									if (new Date(val) > new Date($this.attr('max'))) {
										errors.push($this.attr('data-max-error') || $this.attr('data-error'));
									}
								}
								if ($this.attr('data-match')) {
									var $target = form.find('[data-name="'+$this.attr('data-match')+'"], [name="'+$this.attr('data-match')+'"]');
									if (! $target) {
										console.warn($this.attr('data-match-error'), 'validation target not found', $this, $this.attr('data-match'));
									} else if ($target.val() != val) {
										errors.push($this.attr('data-match-error') || $this.attr('data-error'));
									}
								}

								if (errors.length > 0) {
									rack[name] = chatplus._.uniq(errors).join('\n');
								}
							}
						}
					});

					if (! chatplus._.isEmpty(rack)) {
						console.warn(rack);
						form.addClass('failed');
						for (var name in rack) {
							if (chatplus._.isString(rack[name])) {
								form.find('.error-list').append('<p>'+rack[name]+'</p>');
							}
						}
						if (form.find('.error-list > p').length == 0) {
							form.find('.error-list').append('<p>必須項目を入力してください</p>');
						}
						return;
					}

					chatplus._.each(payload, function(v, k) {data[k] = v;}); // Object.assign(data, payload);

					// then(({name:string,url:string}[]) => {})
					var resolveWithFiles = function(deferred, form, selector) {
						if (form.find(selector.file).length === 0) {
							// 「ファイル」無し
							deferred.resolve([]);
						} else {
							var input_with_file = form.find(selector.file).filter(function(i, e) {return e.files.length > 0;});
							if (input_with_file.length === 0) {
								// 「ファイル」有り,値無し
								deferred.resolve([]);
							} else {
								// 「ファイル」有り,値有り
								chatClient.trigger('uploadFormFile', {
									'target': input_with_file,
									'callback': function(res) {
										var files = [];
										if (Array.isArray(res.url)) {
											for (var i = 0, l = res.url.length; i < l; i++) {
												files.push({
													'name': input_with_file.eq(i).attr('data-name'),
													'url': res.url[i],
													's3url': 's3url' in res ? res.s3url[i] : null,
												});
											}
										} else if (typeof(res.url) === 'string') {
											files.push({
												'name': input_with_file.eq(0).attr('data-name'),
												'url': res.url,
												's3url': null,
											});
										}
										deferred.resolve(files);
									},
								}, filesize);
							}
						}
					};

					var after = function() {
						if (self.fileUploadError) {
							// ファイルアップロードに失敗
							self.fileUploadError = false;
							return;
						}

						// ボット操作ログを保存する
						if (action_type != 'message' && ! withmessage) {
							if (systemmessage && action_type !== 'knowledge') {
								chatClient.trigger('eventlog', {
									'rule_id': rule_id,
									'body': 'フォーム送信\n-----\n' + generateTextformMessage(form, selector, {}),
								});
							} else {
								chatClient.trigger('eventlog', {
									'rule_id': rule_id,
								});
							}
						}

						// フォーム後処理
						form.addClass('disabled');
						form.find('input, textarea, select, datepicker').attr({'readonly': true});
						form.find('input[type="radio"]:not(:checked), input[type="checkbox"]:not(:checked), select option:not(:selected)').attr({'disabled': true});
						form.find('.submit button').prop({'disabled': true});
						form.find('.btn-search').prop({'disabled': true});
						self.fileUploadError = false;

						var form_parent = form.parents('.msg');
						var form_parent_id = form_parent.attr('id');
						var expiry_ms = 1000 * 60 * 60 * 24; // 24時間
						window.chatplus.setCookie(form_parent_id, "form_submit_btn_sended", expiry_ms);

						if ((action_type !== 'postback' && action_type !== 'json') && form.attr('data-after')) {
							// 送信後アクション
							var after_ = form.attr('data-after').split('_');
							var after_mode = after_[0];
							var after_value = after_.splice(1).join('_');
							switch (after_mode) {
								case 'message': {
									sendForcedMessage({'value': after_value, 'no_assign': true, 'rule_id': rule_id});
									break;
								}
								case 'rule': {
									execRule(parseInt(after_value));
									break;
								}
							}
						}

						// GAイベント:テキストフォーム送信
						chatClient.trigger('sendGaEvents', {'actions': ['textform']});
					};

					var $btn = jQueryPlus(this);
					var __cp_skipQuoteCheck = $btn.data('skipQuoteCheck') === 1;
					if (!__cp_skipQuoteCheck) {
						$btn.prop('disabled', true);
						chatClient.trigger('validateTextformQuote', {
							'formdata': data,
							'rule_id': rule_id
						}, function(valid, res) {
							$btn.prop('disabled', false);
							if (!valid && res == 'failed') {
								return;
							} else if (!valid && res) {
								form.addClass('failed');
								window.alert('フォームの入力内容はダブルクォーテーション(")を含まず入力してください。');
								return;
							}
							$btn.data('skipQuoteCheck', 1);
							$btn.trigger('click');
						});
						return;
					} else {
						// 再入時はフラグをクリアして通常フローへ
						$btn.removeData('skipQuoteCheck');
					}

					switch (action_type) {
						// 訪問者への属性付与
						case 'attr': {
							var deferred = new jQueryPlus.Deferred();

							deferred.promise().then(function(files) {
								files.forEach(function(file) {
									data[file.name] = file.url;
								});

								// 訪問者属性更新完了後に送信後アクションを実行
								addVisitorAttribute(data, true).then(function() {
									// 「発言する」なら発言する
									if (withmessage) {
										textformMessage(form, selector, {
											'rule_id': rule_id,
											'files': files,
										});
									}
									after();
								});
							});

							chatClient.trigger('validateTextform', {
								'formdata': data,
								'rule_id': rule_id,
							}, function() {resolveWithFiles(deferred, form, selector);});

							break;
						}
						// 訪問者へのタグ付与
						case 'tag': {
							var tags = [];

							var first_elem = form.find(selector.input + ', ' + selector.check).first();
							if (first_elem.hasClass('form-group')) {
								// radio, checkbox
								tags = first_elem.find('input:checked').map(function() {return jQueryPlus(this).val();}).toArray();
							} else if (first_elem.length > 0) {
								// input[text], textarea, select
								tags = [first_elem.val()];
							}

							addVisitorTag(tags);

							// 「発言する」なら発言する
							if (withmessage) {
								textformMessage(form, selector, {
									'rule_id': rule_id,
								});
							}

							after();
							break;
						}
						// 指定URLへのPOST
						case 'postback':
						// json形式でのメッセージ発言
						case 'json': {
							var deferred = new jQueryPlus.Deferred();

							deferred.promise().then(function(files) {
								files.forEach(function(file) {
									data[file.name] = file.url;
								});

								postback(action_value, data, action_type === 'json' ? 'json' : null, chatinfo, visitorinfo, writeattr, function(res) {
									var after_mode = null;
									var after_value = null;
									if (res && res.result) {
										if (form.attr('data-after')) {
											var after_success = form.attr('data-after').split('_');
											after_mode = after_success[0];
											after_value = after_success.splice(1).join('_');
										}
									} else {
										if (form.attr('data-after-failure')) {
											var after_failure = form.attr('data-after-failure').split('_');
											after_mode = after_failure[0];
											after_value = after_failure.splice(1).join('_');
										}
									}
									switch (after_mode) {
										case 'message': {
											sendForcedMessage({'value': after_value, 'no_assign': true});
											break;
										}
										case 'rule': {
											execRule(parseInt(after_value));
											break;
										}
									}
								});

								// 「発言する」なら発言する
								if (withmessage) {
									textformMessage(form, selector, {
										'rule_id': rule_id,
										'files': files,
									});
								}
								after();
							});

							resolveWithFiles(deferred, form, selector);

							break;
						}
						// メッセージ送信
						case 'message': {
							var deferred = new jQueryPlus.Deferred();

							deferred.promise().then(function(files) {
								textformMessage(form, selector, {
									'rule_id': rule_id,
									'messageonly': messageonly,
									'files': files,
								});
								after();
							});

							if (form.find(selector.file).length === 0) {
								// 「ファイル」が無い
								deferred.resolve([]);
							} else if (form.find(selector.input + ',' + selector.check).length === 0) {
								// 「ファイル」以外が無い: 全ファイルを個別にファイル発言
								var tasks = form.find(selector.file).map(function() {
									var d = new jQueryPlus.Deferred();
									chatClient.trigger('uploadFile', {
										'target': jQueryPlus(this),
										'textform': true,
										'callback': d.resolve,
									}, filesize);
									return d.promise();
								}).toArray();

								// 全ファイル送信完了後に後処理
								jQueryPlus.when.apply(null, tasks).done(after);
							} else {
								// 「ファイル」とそれ以外が混在
								var input_with_file = form.find(selector.file).filter(function(i, e) {return e.files.length > 0;});
								if (input_with_file.length === 0) {
									// 値を持つ「ファイル」が無い
									deferred.resolve([]);
								} else {
									// 値を持つ「ファイル」がある: アップロードを待ってから発言
									chatClient.trigger('uploadFormFile', {
										'target': input_with_file,
										'callback': function(res) {
											var files = [];
											if (Array.isArray(res.url)) {
												for (var i = 0, l = res.url.length; i < l; i++) {
													files.push({'name': input_with_file.eq(i).attr('data-name'), 'url': res['url'][i]});
												}
											} else if (typeof(res.url) === 'string') {
												files.push({'name': input_with_file.eq(0).attr('data-name'), 'url': res.url});
											}
											deferred.resolve(files);
										},
									}, filesize);
								}
							}
							break;
						}
						// チケット作成,メール送信,CSVに値を追加
						case 'ticket':
						case 'mail':
						case 'formdata': {
							var subject = data['__subject'] || form.attr('data-subject') || null;
							var visitor_name = data['name'] || data['chatName'] || data['perhapsName'] || chatplusData.customer.username || chatplusData.customer.chat_username || '';
							var email = data['email'] || data['chatEmail'] || data['perhapsEmail'] || chatplusData.customer.email || chatplusData.customer.chat_email || '';
							var page_url = location.href;
							var message = form.find(selector.input+', '+selector.check)
								.map(function() {
									var $this = jQueryPlus(this);
									if ($this.data('hidden') !== undefined) {return;}

									var label = $this.hasClass('form-group')
										? $this.find('input').data('label')
										: $this.data('label');
									var value = $this.hasClass('form-group')
										? $this.find('input:checked').map(function() {return jQueryPlus(this).val();}).toArray().join(',')
										: $this.val();
									var name = $this.hasClass('form-group')
										? ($this.find('input').data('name') || $this.find('input').attr('name'))
										: ($this.data('name') || $this.attr('name'));

									if (! uselabel || label == null || label === '') {
										if (name == null || name === '') {return;}
										return '【' + name + '】' + value;
									} else {
										return '【' + label + '】' + value;
									}
								})
								.toArray().join('\n');
							var nomail = form.attr('data-nomail') ? 1 : 0;
							var nosign = form.attr('data-nosign') ? 1 : 0;
							var agent_id = form.attr('data-selectagent') ? form.attr('data-selectagent') : 0;
							var mailto = form.attr('data-mailto') ? form.attr('data-mailto') : null;
							var category_id = form.attr('data-category') ? form.attr('data-category') : null;
							var events = null;

							if (form.attr('data-log')) {
								events = chatplus._.map(
									chatplus._.filter(self.messages, function(e) {return ! e.date && ! e.past;}),
									function(e) {return {'name': e.name, 'event_from': e.event_from, 'event_type': e.event_type, 'body': e.body, 'created_at': e.created_at};}
								);
							}

							var deferred = new jQueryPlus.Deferred();

							deferred.promise().then(function(files) {
								var attach = files.map(function(file) {return file.s3url || file.url;});
								files.forEach(function(file) {
									data[file.name] = file.url;
								});

								if (action_type === 'ticket') {
									chatClient.trigger('createTicket', {
										'subject': subject,
										'name': visitor_name,
										'email': email,
										'body': message,
										'nomail': nomail,
										'attach': attach,
										'events': events,
										'page_url': page_url,
										'agent_id': agent_id,
										'mailto': mailto,
										'category_id': category_id,
									});
								} else if (action_type === 'mail') {
									chatClient.trigger('formMail', {
										'subject': subject,
										'name': visitor_name,
										'email': email,
										'body': message,
										'nomail': nomail,
										'nosign': nosign,
										'attach': attach,
										'events': events,
										'page_url': page_url,
										'mailto': mailto,
									});
								}  else if (action_type === 'formdata') {
									if (form.attr('data-formdata-mail')) {
										chatClient.trigger('formMail', {
											'subject': subject,
											'name': visitor_name,
											'email': email,
											'body': message,
											'nomail': nomail,
											'nosign': nosign,
											'attach': attach,
											'events': events,
											'page_url': page_url,
											'mailto': mailto,
										});
									}
									ChatplusAction.invokeExternal(action_type, data, {
										'rule_id': rule_id,
										'chat_id': window.chatplusData.chat_id,
										'chat_url': window.location.href,
									}).done(function() {
										chatClient.pingReset();
									});
								} else {
									throw new Error();
								}

								// 「発言する」なら発言する
								if (withmessage) {
									textformMessage(form, selector, {
										'rule_id': rule_id,
										'files': files,
									});
								}
								// 「訪問者の属性を更新する」が有効なら訪問者属性更新
								if (writeattr) {
									addVisitorAttribute(data, true);
								}
								after();
							});

							chatClient.trigger('validateTextform', {
								'formdata': data,
								'rule_id': rule_id,
							}, function() {resolveWithFiles(deferred, form, selector);});

							break;
						}
						case 'syncform': {
							var query = form.attr('data-syncform-query');
							var option_s = form.attr('data-syncform-option') || '';
							var option = {};
							option_s.split(',').forEach(function(e) {option[e] = true;});

							ChatplusAction.syncForm(data, query, option);

							// 「発言する」なら発言する
							if (withmessage) {
								textformMessage(form, selector, {
									'rule_id': rule_id,
								});
							}
							after();
							break;
						}
						// ナレッジベースを検索
						case 'knowledge':
						case 'suggestknowledge': {
							// 「発言する」なら発言する
							if (withmessage) {
								textformMessage(form, selector, {
									'rule_id': rule_id,
									'messageonly': true,
								});
							}

							var text = chatplus._.values(data)[0];
							var options = {
								'targets': form.attr('data-knowledge-targets') ? form.attr('data-knowledge-targets').split(',') : ['q'],
								'operator': form.attr('data-knowledge-operator'),
								'categories': form.attr('data-knowledge-categories') ? form.attr('data-knowledge-categories').split(',') : null,
								'dictionary': form.attr('data-knowledge-dictionary') ? 1 : null,
								'dictionary_strategy': form.attr('data-knowledge-dictionary_strategy'),
								'prefix': form.attr('data-knowledge-prefix'),
								'count': form.attr('data-knowledge-count'),
								'prev': form.attr('data-knowledge-prev'),
								'next': form.attr('data-knowledge-next'),
								'na': form.attr('data-knowledge-na'),
								'answer': form.attr('data-knowledge-answer') ? 1 : null,
								'exact': form.attr('data-knowledge-exact') ? 1 : null,
								'evaluate': form.attr('data-knowledge-evaluate') ? 1 : null,
								'hiddenevaluate': form.attr('data-knowledge-hiddenevaluate') ? form.attr('data-knowledge-hiddenevaluate') : null,
								'error_failed': form.attr('data-knowledge-error_failed'),
								'error_empty': form.attr('data-knowledge-error_empty'),
								'systemmessage': form.attr('data-systemmessage') ? 1 : null,
								'suggestknowledge': action_type == 'suggestknowledge' ? 1 : null
							};
							ChatplusAction.searchKnowledge(text, 1, options, rule_id);
							after();
							break;
						}
						// チャット決済
						case 'payment': {
							chatClient.trigger('payment', {
								'x': form.attr('data-x'),
								'data': data,
							}, function(res, error) {
								form.find('[name="number"], [name="security"]').attr({'type': 'password'});

								if (! error && res.result == 1) {
									execRule(parseInt(form.attr('data-after-success')));
								} else {
									execRule(parseInt(form.attr('data-after-failure')));
								}
							});
							after();
							break;
						}
						// 解決確認(理由フォーム)
						case 'evaluate': {
							chatClient.trigger('evaluate', {
								'type': form.attr('data-evaluate-type'),
								'target': form.attr('data-evaluate-target'),
								'value': form.attr('data-evaluate-value'),
								'reason': data['reason'],
								'after': {
									'type': form.attr('data-evaluate-after-type'),
									'value': form.attr('data-evaluate-after-value'),
								},
								'input': form.attr('data-evaluate-input'),
								'rule_id': rule_id,
								'search_id': form.attr('data-evaluate-search-id'),
							});
							after();
							break;
						}
						case 'sodai': {
							var deferred = new jQueryPlus.Deferred();
							deferred.promise().then(function(files) {
								var options = {
									'no_loading': form.attr('data-sodai-no_loading'),
									'loading': form.attr('data-sodai-loading'),
									'select': form.attr('data-sodai-select'),
									'success': form.attr('data-sodai-success'),
									'unregistered': form.attr('data-sodai-unregistered'),
									'failure': form.attr('data-sodai-failure'),
									'na': form.attr('data-sodai-na'),
									'after_success': form.attr('data-sodai-after_success'),
									'after_unregistered': form.attr('data-sodai-after_unregistered'),
									'after_failure': form.attr('data-sodai-after_failure'),
									'after_na': form.attr('data-sodai-after_na'),
								};

								data['attach'] = files.map(function(file) {return decodeURIComponent(file.url);});
								ChatplusAction.invokeExternal(action_type, data, options);
								after();
							});

							resolveWithFiles(deferred, form, selector);

							break;
						}

						case 'cobit':{
							var options = {
								'robotid':form.attr('data-cobit-robotid'),
							};
							// console.log(options);
							if (withmessage) {
								textformMessage(form, selector, {
									'rule_id': rule_id,
									'messageonly': true,
								});
							}
							ChatplusAction.invokeExternal(action_type, data, options);
							after();
							break;
						}
						// CSVを参照
						case 'csv': {
							var options = {
								'filename': form.attr('data-csv-filename'),
								'prefix': form.attr('data-csv-prefix'),
								'count': form.attr('data-csv-count'),
								'prev': form.attr('data-csv-prev'),
								'next': form.attr('data-csv-next'),
								'answer': form.attr('data-csv-answer'),
								'message': form.attr('data-csv-message'),
								'evaluate': form.attr('data-csv-evaluate'),
								'error_failed': form.attr('data-csv-error_failed'),
								'error_empty': form.attr('data-csv-error_empty'),
								'error_notfound': form.attr('data-csv-error_notfound'),
								'rule_id': rule_id,
							};
							ChatplusAction.invokeExternal(action_type, data, options);
							// 「検索内容で訪問者属性を更新する」が有効なら訪問者属性更新
							if (writeattr) {
								// CVS参照処理用のデータを削除
								var data_tmp = {};
								Object.keys(data).forEach(function (key) {
									if (! /^conditions.*/.test(key)) {
										data_tmp[key] = data[key];
									}
								});
								addVisitorAttribute(data_tmp, true);
							}
							after();
							break;
						}

						case 'googlecalendar': {
							if (writeattr) {
								var attributes = {};
								for (var k in data) {if (k !== 'step') {attributes[k] = data[k];}}
								addVisitorAttribute(attributes, true);
							}
							ChatplusAction.invokeExternal(action_type, data, {
								'rule_id': rule_id,
								'textform': true,
							}).done(function() {
								chatClient.pingReset();
							});
							after();
							break;
						}

						default: {
							console.warn(action_type);
							after();
						}
					}
				} else {
					// 旧textform
					var text = jQueryPlus(this).closest('.textform').find('.input').val();
					if (!text) {return;}

					text = chatClient.parseVariables(text);

					//send message
                    sendForcedMessage( {value:text, rule_id:jQueryPlus(e.target).closest(".view-content").data("rule")} );
					//event
					try {
						var actions = jQueryPlus(this).data("action").split("_");
						if (actions[0] == "attr") {
							var obj = {};
							obj[ actions[1] ] = text;
							addVisitorAttribute( obj );
						}else if (actions[0] == "tag") {
							addVisitorTag( text );
						}else if (actions[0] == "postback") {
							postback(actions[1], text, null, true);
						}
					} catch(e) {}
				}
			});

			var onResize = function() {
				fixImageMapEyecatcher();

				if (self.mobileFlag || self.chatbuttonFlag) {
					fixImageMapMessage();

					if ((self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline) {
						if (isLandscape()) {
							//横向きの場合、イメージマップを表示しない
							if (self.imageMapState === 'show') {
								self.imageMapState = 'show*';
								self.update();
							} else if (self.imageMapState === 'hide') {
								self.imageMapState = 'hide*';
								self.update();
							}
						} else {
							// 横向きになる前の状態に戻す
							if (self.imageMapState === 'show*') {
								self.imageMapState = 'show';
								self.update();
							} else if (self.imageMapState === 'hide*') {
								self.imageMapState = 'hide';
								self.update();
							}
						}
						fixImageMap();
					}

					fitChat(true);
					carouselResizeAll();
				}
			};
			window.addEventListener('resize', chatplus._.debounce(onResize, 200), {'passive': true});

			if (opts.appearance.themeParams.closeOnUnload) {
				var preventUnloadUntil = 0;
				jQueryPlus(document).on('click', '#chatplusview a[href^="tel:"], #chatplusview a[href^="mailto:"]', function() {
					preventUnloadUntil = Date.now() + 500;
				});

				if (self.isIE) {
					jQueryPlus(window).on('beforeunload', function(ev) {
						if (Date.now() > preventUnloadUntil) {
							chatplus.clearWindowStatus();
							chatClient.trigger('quitChat', {'on': 'unload', 'isIE': self.isIE});
						}
					});
				} else {
					jQueryPlus(window).on('pagehide', function(ev) {
						if (Date.now() > preventUnloadUntil) {
							chatplus.clearWindowStatus();
							chatClient.trigger('quitChat', {'on': 'unload'});
						}
					});
					jQueryPlus(window).on('pageshow', function(ev) {
						if (ev.originalEvent.persisted) {
							chatClient.trigger('reinit', {});
						}
					});
				}
			}

			/*
			jQueryPlus(window).on('hashchange', function(ev) {
				chatClient.trigger('urlchange', {'before': ev.originalEvent.oldURL, 'after': ev.originalEvent.newURL, 'state': null});
			});
			*/

			jQueryPlus(document).on('visibilitychange', function() {
				if (! document.hidden && self.windowStatus === 'open') {chatClient.trigger('markReadAll');}
			});

			//templateを使用している場合、電話番号のクリックをchat_eventsに保存
			jQueryPlus(document).on("click", "#chatplusview a.cp-template-tel", function(e) {
				var rule_id = jQueryPlus(e.target).closest('.view-content').data('rule');
				chatClient.trigger('eventlog_template_tel', {
					'rule_id': rule_id,
					'body': 'template-tel',
				});
			});

			// 発言内容コピー時に前後の空白を削除
			jQueryPlus(document).on('copy', '#chatplusview .msg', function(ev) {
				if (! (ev.originalEvent instanceof ClipboardEvent)) {return;}
				ev.preventDefault();
				var selection = document.getSelection();
				ev.originalEvent.clipboardData.setData('text/plain', selection.toString().trim());
			});

			// キーボードフォーカス可能な要素でフォーカス中にEnter/Spaceを押されたらクリック
			jQueryPlus(document).on('keypress', '#chatplusview [tabindex="0"]:not(button)', function(ev) {
				if (ev.key === 'Enter' || ev.key === '\n' || ev.key === ' ') {
					ev.preventDefault();
					ev.target.click();
				}
			});

			// ツムラ案件カルーセルクリック
			jQueryPlus(document).on('click', '#chatplusview .slider-carousel[data-tsumura="1"] .chat-ques li label', function(ev) {
				var carousel_index = jQueryPlus(this).parents('.slick-chatplus-slide').data('slick-chatplus-index');
				chatClient.trigger('tsumura_carousel_click', {
					'index': carousel_index,
				});
			});

			// メッセージエリアが最下部までスクロールされている状態で高さが縮んだら改めて最下部にスクロール
			jQueryPlus(document).on('transitionrun', '#chatplusview.chatplusview-modern #messages', function(ev) {
				if (ev.originalEvent.propertyName !== 'height') {return;}
				var elem = jQueryPlus('#chatplusview #messages').get(0);
				if (elem.clientHeight > 150 && elem.scrollTop >= elem.scrollHeight - elem.clientHeight - 10) {
					var height_before = elem.clientHeight;
					jQueryPlus('#chatplusview #messages').one('transitionend', function() {
						if (jQueryPlus('#chatplusview #messages').get(0).clientHeight >= height_before) {return;}
						jQueryPlus('#chatplusview #messages').animate({'scrollTop': 2000000}, 'fast');
					});
				}
			});
		});

		// ファイルドロップ処理
		dropPrevent(ev) {
			ev.preventUpdate = true;
			ev.preventDefault();
		}
		dropEnter(ev) {
			if (! opts.appearance.talking.uploadByVisitor || (self.status !== 'in_chat' && self.status !== 'in_chatbot')) {return;}
			if (opts.appearance.talking.uploadOnlyInchat && self.status === 'in_chatbot') {return;}
			if (! chatplus._.some(ev.dataTransfer.types, function(e) {return e === 'Files';})) {return;}
			if (self.uploading) {return;}

			self.dropping += 1;
		}
		dropLeave(ev) {
			if (! opts.appearance.talking.uploadByVisitor || (self.status !== 'in_chat' && self.status !== 'in_chatbot')) {return;}
			if (opts.appearance.talking.uploadOnlyInchat && self.status === 'in_chatbot') {return;}
			if (! chatplus._.some(ev.dataTransfer.types, function(e) {return e === 'Files';})) {return;}
			if (self.uploading) {return;}

			self.dropping -= 1;
			if (self.dropping < 0) {self.dropping = 0;}
		}
		dropToUpload(ev) {
			if (! chatplus._.some(ev.dataTransfer.types, function(e) {return e === 'Files';})) {return;}

			ev.preventDefault();

			if (opts.appearance.talking.uploadByVisitor && (self.status === 'in_chat' || (self.status === 'in_chatbot' && ! opts.appearance.talking.uploadOnlyInchat)) && ! self.uploading) {
				self.uploading = true;
				chatClient.trigger('dropFile', ev.dataTransfer.files, function() {
					self.uploading = false;
					self.dropping = 0;
					self.update();
				});
			} else {
				self.dropping = 0;
			}
		}

		chatClient.on('initialized', function() {
			if (self.chatbuttonFlag) {
				// チャットボタンならチャットウィンドウを開いた状態で開始する
				self.windowStatus = 'open';
				chatplus.setWindowStatus('open');
				if (! document.hidden) {chatClient.trigger('markReadAll');}

				if (opts.appearance.start.disable && window.chatplusData['status'] === 'no_chat') {
					// 開始フォーム非表示→ ステータスを「チャット中/チャットボット中」に偽装
					self.status = opts.appearance.start.status || 'in_chatbot';
				}

				self.update();
			} else {
				// 初期化時点で訪問中/オフラインなら現在のチャット開閉状態をリセット
				if (window.chatplusData['status'] === 'no_chat' || window.chatplusData['status'] === 'no_agent') {
					chatplus.clearWindowStatus();
				}
			}

			// メッセージ入力枠表示状態の復元
			try {
				var state_s = window.localStorage.getItem('promptShown');
				if (typeof state_s === 'string' && state_s.indexOf('|') > 0) {
					var state = state_s.split('|');
					if (state[0] == window.chatplusData.chat_id) {
						self.promptShown = state[1] === '1';
					} else {
						window.localStorage.removeItem('promptShown');
					}
				}
			} catch (e) {
			}
		});

		chatClient.on('noChat', function(data){
			if (self.status=="no_chat") {
				return;
			}

			self.status = 'no_chat';
			self.customer = data.customer;
			self.explanation = '';
			self.messages = [];
			if (self.display_when_restart && opts.appearance.start.displayWhenRestart) {
				chatClient.trigger('requestChat', {
					'pre_survey': {'visitor_name': self.customer.name, 'visitor_company': self.customer.company_name, 'visitor_email': self.customer.email, 'visitor_tel': self.customer.tel, 'inquiry': self.inquiry, 'mail_note_flg': self.mail_note_flg}
				});
				jQueryPlus('#chatplusview #start_btn').click();
			}
			if (opts.appearance.start.disable && self.windowStatus === 'open') {
				self.status = opts.dispatchMode === 'select' ? 'wait_chat' : 'in_chatbot';
				chatClient.trigger('requestChat', {
					'pre_survey': {'visitor_name': self.customer.name, 'visitor_company': self.customer.company_name, 'visitor_email': self.customer.email, 'visitor_tel': self.customer.tel, 'inquiry': self.inquiry, 'mail_note_flg': self.mail_note_flg}
				});
			}

			self.update();
			chatResize();
		});

		chatClient.on('noAgent', function(data) {
			if (self.status === 'no_agent') {
				return;
			}

			if (!('change_status' in data) && (self.status == 'in_chat' || self.status == 'in_chatbot')) {
				return;
			}

			chatClient.trigger('sendGaEvents', {actions: 'noAgent'});

			self.status = 'no_agent';
			self.explanation = '';
			if ('customer' in data) {self.customer = data.customer;}
			if ('expiration' in data) {self.expired = true;}

			self.update();
			chatResize();
		});

		chatClient.on('waitChat', function(data, start, inChatWaiting) {
			if (data.force || self.windowStatus == "open") {
				self.waitDisable = false;
			}

			if (inChatWaiting) {
				self.inChatWaiting = true;

				if (! self.chatbuttonFlag) {
					if (! start && /[?&]cpwin=/.test(location.search)) {
						var statusParam = /[?&]cpwin=([^?&]*)/.exec(location.search)[1];
						if (/open|close/.test(statusParam)) {self.windowStatus = statusParam;}
						else {self.windowStatus = parseInt(statusParam) ? 'open' : 'close';}
					} else {
						if (start || ! opts.appearance.themeParams.discardWindowStatus) {
							self.windowStatus = chatplus.getWindowStatus() || 'close';
						}
					}
				}
			}

			if (self.status !== 'wait_chat' && !data.disable) {
				chatClient.trigger('sendGaEvents', {actions: 'waitChat'});
			}

			self.status = 'wait_chat';
			self.agent_id = null;
			self.agent_name = null;

			var explanation;
			if (data.congestion) {
				self.callingTitle = 'limitTitle' in opts.appearance.calling ? opts.appearance.calling.limitTitle : opts.appearance.calling.title;
				explanation = 'limitExplanation' in opts.appearance.calling ? opts.appearance.calling.limitExplanation : opts.appearance.calling.explanation;
			} else if (data.select) {
				self.callingTitle = 'selectTitle' in opts.appearance.calling ? opts.appearance.calling.selectTitle : opts.appearance.calling.title;
				explanation = 'selectExplanation' in opts.appearance.calling ? opts.appearance.calling.selectExplanation : opts.appearance.calling.explanation;
			} else {
				self.callingTitle = opts.appearance.calling.title;
				explanation = opts.appearance.calling.explanation;
			}

			if (explanation) {
				explanation = explanation.replace(/%number%/g, data.number || 0);
				explanation = explanation.replace(/%min%/g, data.min || 0);
				explanation = chatClient.parseVariables(explanation);
				self.explanation = explanation;
			} else {
				self.explanation = '';
			}
			self.update();
		});

		chatClient.on('postGreeting', function(data){
			if (self.windowStatus=="open" && ! self.chatbuttonFlag) {
				// チャットウィンドウ(開始フォーム)を開いているなら自動話しかけを受け付けない
				//  ボタン形式の場合は開始フォームでも受け付ける
				return;
			}

			self.status = data.status === 'in_chatbot' ? 'in_chatbot' : 'in_chat';
			self.windowStatus = 'open';
			self.agent_id = data.agent.id;
			self.agent_name = data.agent.chat_username;
			self.explanation = '';
			self.update();

			if (data.chat) {
				var currentChatId = null;
				var messages = [];

				for (var i = 0; i< data.chat.length; i ++) {
					var message = data.chat[i];

					if (currentChatId != message.chat_id) {
						messages = [];
						currentChatId = message.chat_id;
					}
					message.body = message.body.replace(/[{}]/g, function(c) {return {'{':'&#x0007b;','}':'&#x0007d;'}[c];});
					messages.push(message);
				}

				self.messages = messages;
				self.update();

				// 最新メッセージ上部までスクロールする
				jQueryPlus('#chatplusview #messages').stop();
				scrollIntoMessage(messages[0].id);
			}

			if (! document.hidden && self.windowStatus === 'open') {chatClient.trigger('markReadAll');}

			chatResize();
		});

		chatClient.on('inChat', function(data, start) {
			var beforeStatus = self.status;
			self.status = data.status === 'in_chatbot' ? 'in_chatbot' : 'in_chat';
			if (beforeStatus !== '' && beforeStatus !== self.status) {
				if (self.status === 'in_chat') {
					chatClient.trigger('sendGaEvents', {actions: ['inChat', 'inChatFirst']});
				} else if (self.status === 'in_chatbot') {
					chatClient.trigger('sendGaEvents', {actions: ['inChatbot', 'inChatbotFirst']});
				}
			}

			if (opts.appearance.talking.uploadOnlyInchat && self.status === 'in_chatbot') {
				self.uploadFormVisible = false;
			}

			if (! self.chatbuttonFlag) {
				if (! start && /[?&]cpwin=/.test(location.search)) {
					var statusParam = /[?&]cpwin=([^?&]*)/.exec(location.search)[1];
					if (/open|close/.test(statusParam)) {self.windowStatus = statusParam;}
					else {self.windowStatus = parseInt(statusParam) ? 'open' : 'close';}
				} else {
					if (start || ! opts.appearance.themeParams.discardWindowStatus) {
						self.windowStatus = chatplus.getWindowStatus() || 'close';
					}
				}
			}

			self.customer = data.customer;
			self.agent_id = data.agent.id;
			self.agent_name = data.agent.chat_username;
			self.explanation = '';
			self.pastMessages = (opts.appearance.talking.showPastMessages || (opts.rewind && opts.rewind.enabled)) && data.past_chat_id !== false;
			self.update();

			if (((self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline) && !(opts.appearance.talking.imageMapInitialState && beforeStatus === '')) {
				if (beforeStatus !== 'in_chat' && self.status === 'in_chat' && opts.appearance.talking.imageMapAutoClose) {
					self.showKeyboard();
				} else if (beforeStatus !== 'in_chatbot' && self.status === 'in_chatbot' && opts.appearance.talking.imageMapAutoOpen) {
					self.showImageMap();
				}
			}

			if (opts.appearance.talking.hidePromptWhenChatbot) {
				updateMessageArea();
			}

			chatResize();
			replaceForIE();

			setTimeout(function() {
				if (! document.hidden && self.windowStatus === 'open') {chatClient.trigger('markReadAll');}
			}, 100);
		});

		var closeChat = function(status, data) {
			if (self.status == status) {return;}

			chatClient.trigger('sendGaEvents', {actions: "closeChat"});

			self.status = status;
			self.explanation = '';
			self.display_when_restart = data.display_when_restart;
			if (status === 'close_chat_by_agent') {
				self.quitConfirmVisible = false;
				if (! opts.appearance.end.skip) {self.quitQuestionVisible = true;}
			} else if (status === 'close_chat_by_mute') {
				self.quitConfirmVisible = false;
			}

			try {window.localStorage.removeItem('promptShown');} catch (ex) {}
			self.promptShown = null;

			self.update();

			jQueryPlus('#chatplusview .msg.textform form').find('input, textarea, select').attr({'readonly': true});
			jQueryPlus('#chatplusview .msg.textform form').find('input[type="radio"]:not(:checked), input[type="checkbox"]:not(:checked), select option:not(:selected)').attr({'disabled': true});
			jQueryPlus('#chatplusview .msg.textform form').find('.submit button').attr({'disabled': true});

			if (status === 'close_chat_by_agent') {
				if (opts.appearance.end.noeyecatcher) {
					jQueryPlus("#chatplusview #eye_catcher").hide();
				}
				if(opts.appearance.end.close) {
					self.closeWindow();
				}
			}

			chatResize();

			setTimeout(function() {
				chatplus.clearWindowStatus();
			}, 1);
		};

		chatClient.on('closeChatByVisitor', function(data){
			closeChat('close_chat_by_visitor', data);
		});

		chatClient.on('closeChatByAgent', function(data){
			closeChat('close_chat_by_agent', data);
		});

		chatClient.on('closeChatByMute', function(data){
			closeChat('close_chat_by_mute', data);
		});

		chatClient.on('receiveMessage', function(data, no_scroll) {
			/*
			if (data.chat) {
				self.agent_id = data.chat.agent_id;
				self.agent_name = data.chat.agent_name;
			}
			delete data.chat;
			*/
			data.body = data.body.replace(/[{}]/g, function(c) {return {'{':'&#x0007b;','}':'&#x0007d;'}[c];});

			var event_trigger = new RegExp(/<span class="event-trigger">.*<\/span>/).exec(data.body);
			if (data.body == event_trigger) {
				return;
			}

		    var message_length = self.messages.length;
			if (data.event_from == 1 && data.id != self.messagePreID) {
				var flag = false;
				for (var i = 0; i < message_length; i++) {
					if (self.messages[i].id == self.messagePreID) {
						data.already = true;
						self.messages[i] = data;
						flag = true;
						break;
					}
				}
				if (!flag) {
					self.messages.push(data);
				}
				self.sending = false;
			} else {
				if (data.event_from != 1 && ! data.read_flg) {
					// 未読
					if (! document.hidden && self.windowStatus === 'open') {
						// 今見たので既読にする
						chatClient.trigger('markRead', data.id);
					} else {
						// 未読属性付与,未読カウント+1
						data.unread = true;
						self.unreadCount += 1;
					}
				}
				self.messages.push(data);
			}

			self.explanation = '';
			self.update();

			if (! no_scroll) {
				jQueryPlus('#chatplusview #messages').stop();
				if (data['event_from'] == 2 || data['event_from'] == 3) {
					// 担当者からのメッセージなら そのメッセージの上部までスクロールする
					setTimeout(scrollIntoMessage.bind(undefined, data.id), 1);
				} else {
					// 訪問者からのメッセージなら 一番下までスクロールする
					jQueryPlus('#chatplusview #messages').animate({'scrollTop': 2000000}, 'fast');
				}
			}

			carouselResizeAll();
			if ((data['event_from'] == 2 || data['event_from'] == 3) && data['event_type'] == 26) {
				self.applyYubinbangoRequired = true;
				applyYubinBango();
			}

			// イメージマップのクリッカブルエリアを調整
			setTimeout(fixImageMapMessage, 100);
		});

		chatClient.on('initMessage', function(){
			self.messages = [];
			self.suggests = [];
			self.unreadCount = 0;
			self.update();
		});

		chatClient.on('Startforce', function() {
			if ((opts.appearance.eyeCatcher.skip || /[?&]cpwin=open/.test(location.search)) && (self.online || opts.startup.disuseContact || ! opts.appearance.disconnect_disable)) {
				self.open();
			}
		});

		chatClient.on('listMessages', function(data) {
			var messages_ = data.messages || data.data || [];
			if (Array.isArray(messages_) && messages_.length > 0) {
				var currentChatId = null;
				var messages = [];
				var messages_map = typeof Map === 'function' ? new Map() : undefined;
				var unreadCount = 0;

				for (var i = 0, l = messages_.length; i < l; i++) {
					var message = messages_[i];

					if (currentChatId != message.chat_id) {
						messages = [];
						if (messages_map !== undefined) {messages_map.clear();}
						currentChatId = message.chat_id;
					}
					message.body = message.body.replace(/[{}]/g, function(c) {return {'{':'&#x0007b;','}':'&#x0007d;'}[c];});

					if (message.event_from == 2) {
						if (message.event_type == 26) {
							// テキストフォーム
							var cookie_msg = window.chatplus.getCookie('msg_' + message.id);
							if (cookie_msg === 'form_submit_btn_sended') {
								// 送信済みフォーム
								message.body = message.body
									.replace(/<form (.*?) class="(.*?)"/g, '<form $1 disabled class="$2 disabled"')
									.replace(/<button /g, '<button disabled ')
									.replace(/<(input|textarea|select|datepicker) /g, '<$1 readonly ');
							}
						}

						if (message.event_type == 22 || message.event_type == 28) {
							// メッセージ+選択肢,カルーセル
							var matches_inputid = message.body.match(/<input .*? id='[^']+'/g);
							if (matches_inputid) {
								for (var j = 0; j < matches_inputid.length; j++) {
									var input_match = matches_inputid[j].match(/^<input (.*?) id='([^']+)'$/);
									if (input_match) {
										var cookie_input = window.chatplus.getCookie(input_match[2]);
										if (cookie_input === 'message_select_checked' || cookie_input === 'message_select') {
											// クリック済選択肢
											message.body = message.body
												.replace(input_match[0], '<input checked ' + input_match[1] + ' id=\'' + input_match[2] + '\'');
											if (opts.startup && opts.startup.lockChoices) {
												// チャットボットの選択肢を一度しか押せないようにする。
												message.body = message.body
													.replace(/<input /g, '<input disabled ');
											}
											break;
										}
									}
								}
							}
						}

						if (message.event_type == 25 && (opts.startup && opts.startup.lockChoices)) {
							// イメージマップ
							var cookie_msg = window.chatplus.getCookie('msg_' + message.id);
							if (cookie_msg === 'imagemap_clicked') {
								// クリック済イメージマップ
								message.body = message.body
									.replace(/<map /g, '<map data-disabled="1" ');
							}
						}

						if (message.event_type == 27) {
							// コンファーム
							var cookie_msg = window.chatplus.getCookie('msg_' + message.id);
							if (cookie_msg === 'confirm_clicked_1' || cookie_msg === 'confirm_clicked_2') {
								// クリック済コンファーム
								var index = Number(/^confirm_clicked_(\d)$/.exec(cookie_msg)[1]);
								var calledCount = 0;
								message.body = message.body
									.replace(/<a /g, function() {
										calledCount += 1;
										return '<a ' + (index === calledCount ? 'class="clicked" ' : '');
									});
								if (opts.startup && opts.startup.lockChoices) {
									// チャットボットの選択肢を一度しか押せないようにする。
									message.body = message.body
										.replace(/class="confirm_link"/g, 'class="confirm_link locked"');
								}
							}
						}
					}

					if (message.event_from != 1 && ! message.read_flg) {
						// 未読
						if (! document.hidden && self.windowStatus === 'open') {
							// 今見たので既読にする
							chatClient.trigger('markRead', message.id);
						} else {
							// 未読属性付与,未読カウント+1
							message.unread = true;
							unreadCount += 1;
						}
					}

					messages.push(message);
					if (messages_map !== undefined) {messages_map.set(message.id, message);}
				}

				if (messages_map !== undefined && data.edit && data.edit.length > 0) {
					data.edit.forEach(function(e) {
						if ('translated' in e) {
							messages_map.get(e.id).translated = e.translated;
						}
					});
				}

				if (messages_map !== undefined) {
					var message_map_entries = [];
					if (typeof messages_map.entries === 'function') {
						message_map_entries = Array.from(messages_map.entries());
					} else {
						messages_map.forEach(function(v, k) {message_map_entries.push([k, v]);});
					}
					self.messages = message_map_entries
						.sort(function(a, b) {return a[0] - b[0];})
						.map(function(e) {return e[1];});
				} else {
					self.messages = messages;
				}
				self.unreadCount = unreadCount;
				self.update();
				// 一番下までスクロールする
				jQueryPlus('#chatplusview #messages').animate({scrollTop: 2000000}, 'fast');

				// イメージマップのクリッカブルエリアを調整
				setTimeout(fixImageMapMessage, 100);
			}
		});

		chatClient.on('updateMessages', function(messages) {
			var $messages = jQueryPlus('#chatplusview #messages');
			var scrollFlag = $messages.scrollTop() >= $messages.get(0).scrollHeight - $messages.outerHeight();

			var modified = null;
			messages.forEach(function(message) {
				var index = chatplus._.findIndex(self.messages, function(e) {return e['id'] == message['id'];});
				if (index === -1) {return;}

				modified = Math.max(modified, message.id);
				if (message['deleted_at']) {
					self.messages.splice(index, 1);
				} else {
					if ('translated' in message) {
						self.messages[index].translated = message.translated;
						self.messages[index].already = true;
					} else if ('chat_id' in message) {
						self.messages[index] = message;
						self.messages[index].already = true;
					} else {
						self.messages[index] = {
							'already': true,
							'id': message.id,
							'body': message.body,
							'event_type': message.event_type,
							'chat_id': self.messages[index].chat_id,
							'event_from': self.messages[index].event_from,
							'agent_id': self.messages[index].agent_id,
							'name': self.messages[index].name,
							'bot_rule': self.messages[index].bot_rule,
							'read_flg': self.messages[index].read_flg,
							'created_at': self.messages[index].created_at,
						};
					}
				}
			});
			if (modified) {
				self.update();
				if (scrollFlag) {
					jQueryPlus('#chatplusview #messages').scrollTop(2000000);
				}
			}
		});

		chatClient.on('uploadComplete', function(data){
			self.uploading = false;
			self.uploadFormVisible = false;
			self.update();
			jQueryPlus('#chatplusview #file_upload_form').find('.addfile').val(null);
		});

		chatClient.on('uploadFailed', function(reason, textform) {
			var error_message = opts.appearance.talking.uploadFailed || 'ファイルサイズが大きいまたは、ネットワークの状態が悪いため、アップロードできませんでした。';
			if (reason === 'type') {
				error_message = opts.appearance.talking.uploadFailedAccept || '許可されていないファイルタイプです。';
			}
			self.fileUploadError = true;
			if (textform) {
				textform.find('.error-list').append(jQueryPlus('<p>', {'text': error_message}));
			} else {
				chatClient.trigger('eventlog', {
					'body': error_message,
				});
				chatClient.trigger('receiveMessage', {
					'dummy': true,
					'id': -998,
					'event_type': 22,
					'event_from': 2,
					'name': self.agent_name,
					'agent_id': self.agent_id,
					'body': error_message,
					'read_flg': 1,
					'created_at': Date.now(),
				});
			}
		});

		chatClient.on('quickStart', function(){
			if (opts.appearance.start.disable) {
				self.windowStatus = 'open';
				self.update();
				chatResize();
				fitChat();
			}
		});

		//CHATBOT用ACTION(開始ここから)
		chatClient.on('jumpPage', function(data){
			if(data.same_tab == 'true'){
				parent.location.href=data.URL;
			} else {
				window.open(data.URL,'_blank');
			}
		});
		//CHATBOT用ACTION(終了ここまで)

		chatClient.on('onlineState', function(state) {
			if (self.online === state) {return;}

			self.online = state;

			var currentImageMap = (self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline;
			if (! currentImageMap) {
				self.imageMapState = 'keyboard';
			}

			if ('suggestSourceOnline' in opts.appearance.talking || 'suggestSourceOffline' in opts.appearance.talking) {
				opts.appearance.talking.suggestSource = self.online ? opts.appearance.talking.suggestSourceOnline : opts.appearance.talking.suggestSourceOffline;
				opts.appearance.talking.suggestCount = self.online ? opts.appearance.talking.suggestCountOnline : opts.appearance.talking.suggestCountOffline;
				opts.appearance.talking.suggestCategories = self.online ? opts.appearance.talking.suggestCategoriesOnline : opts.appearance.talking.suggestCategoriesOffline;
				opts.appearance.talking.suggestEvaluate = self.online ? opts.appearance.talking.suggestEvaluateOnline : opts.appearance.talking.suggestEvaluateOffline;
				self.suggestsWord = null;
				self.knowledge_suggests = [];
			}

			self.update();
		});

		chatClient.on('messageOffForm',function(data){
			opts.appearance.disconnect_no_form = false;
			//jQueryPlus("#chatplusview #body h2").html("");
			if (data.result=="success") {
				self.contactResult = true;
				self.update();
			} else {
				self.contactResult = false;
				self.update();
			}
		});

		chatClient.on('markReadAll', function() {
			self.unreadCount = 0;
		});

		chatClient.on('suppress', function() {
			self.suppressed = true;
		});

		chatClient.on('writingByAgent', function(v, scroll) {
			self.writingByAgent = v;
			self.update();

			if (scroll) {
				// jQueryPlus('#messages').animate({scrollTop: jQueryPlus('.view')[0].scrollHeight}, 'fast');
				// #messagesが上に500px以上手動スクロールされてなければ,最下部にスクロール
				var $parent = jQueryPlus('#messages');
				var parent = $parent[0];
				var view = jQueryPlus('#chatplusview .view')[0];
				if (parent && view.scrollHeight - (parent.scrollTop + parent.clientHeight) < 500) {
					$parent.animate({'scrollTop': 1000000}, 'fast');
				}
			}
		});
		chatClient.on('chatbotWritingText', function(text) {
			self.chatbotWritingText = text;
			self.update();
		});

		send(ev) {
			ev.preventDefault();
			sendMessage();
		};

		sendSuggest(ev) {
			var text = jQueryPlus(ev.target).text();
			jQueryPlus('#chatplusview [name="message"]').val(text);
			sendMessage();
		};

		contact(e) {
			jQueryPlus('#chatplusview #form-offline #cpoadbt713').attr({'disabled': true});
			var message = '';
			var data = {
				'title': '',
				'name': '',
				'email': '',
				'emailCheck': null,
			};
			var label = {
				'name': opts.appearance.disconnect_nameTitle || '名前',
				'email': opts.appearance.disconnect_emailTitle || 'メールアドレス',
			};
			var errorMessage = '';
			var selectTypes = {};

			jQueryPlus('#chatplusview #form-offline .ques').each(function() {
				var $this = jQueryPlus(this);
				if ($this.attr('type') == 'checkbox' || $this.attr('type') == 'radio' || $this.attr('class') == 'form-control ques selectbox') {
					selectTypes[$this.data('name')] = {
						'required': $this.data('required'),
						'label': $this.data('label'),
						'values': [],
					};
				}
			});
			jQueryPlus('#chatplusview #form-offline .ques').each(function() {
				var $this = jQueryPlus(this);
				var val = jQueryPlus.trim($this.val());

				if ($this.is(':invalid')) {
					errorMessage += $this.data('label') + 'を正しく入力してください<br>';
					jQueryPlus('#chatplusview #form-offline #cpoadbt713').removeAttr('disabled');
					return;
				}

				if ($this.data('name') == 'title') {
					data.title = val;
				} else if ($this.data('name') == 'email') {
					data.email = val;
					if ($this.data('label')) {label.email = $this.data('label');}

					message += '【' + label.email + '】' + data.email + '\n\r';
				} else if ($this.data('name') == 'emailCheck') {
					data.emailCheck = val;
				} else if ($this.data('name') == 'name') {
					data.name = val;
					if ($this.data('label')) {label.name = $this.data('label');}

					message += '【' + label.name + '】' + data.name + '\n\r';
				} else if ($this.attr('type') == 'checkbox' || $this.attr('type') == 'radio') {
					if ($this.prop('checked')) {
						selectTypes[$this.data('name')]['values'].push(val);
					}
				} else if ($this.attr('class') == 'form-control ques selectbox') {
					if (val) {
						selectTypes[$this.data('name')]['values'].push(val);
					}
				} else {
					message += '【' + $this.data('label') + '】' + val + '\n\r';
				}

				if ($this.data('required') && ($this.attr('type') == 'text' || $this.attr('type') == 'email' || $this.prop('tagName') == 'TEXTAREA') && val.length <= 0) {
					if (opts.appearance.disconnect_errorText) {
						errorMessage += opts.appearance.disconnect_errorText.replace(/%title%/g, $this.data('label')) + '<br>';
					} else {
						errorMessage += $this.data('label') + 'を入力してください<br>';
					}
				}
			});

			if (data.email) {
				// 確認オプションがあるときに2つのinputを確認する
				if (opts.appearance.disconnect_emailCheck && data.email !== data.emailCheck) {
					errorMessage += label.email + 'が一致しません<br>';
				}
				// メールアドレスが正しく入力されているかのチェック
				if (opts.appearance.disconnect_emailOnlyAscii) {
					if (! /^[\x20-\x7e]+@[-0-9A-Za-z]+\.[-.0-9A-Za-z]+$/.test(data.email)) {
						data.email = null;
						// errorMessage += label.email + 'を正しく入力してください<br>';
					}
				} else {
					if (! /^[\x20-\x7e]+@[^.]+\..+$/.test(data.email)) {
						data.email = null;
						// errorMessage += label.email + 'を正しく入力してください<br>';
					}
				}
			}

			for (var prop in selectTypes) {
				if (selectTypes[prop]['values'].length) {
					message += '【' + prop + '】' + selectTypes[prop]['values'].join(',') + '\n\r';
				} else if (selectTypes[prop]['required'] == '1') {
					if (opts.appearance.disconnect_errorText) {
						errorMessage += opts.appearance.disconnect_errorText.replace(new RegExp('%title%', 'g'), selectTypes[prop]['label']) + '<br>';
					} else {
						errorMessage += selectTypes[prop]['label'] + 'を入力してください<br>';
					}
				}
			}

			if (errorMessage) {
				jQueryPlus("#chatplusview .error-message").html( errorMessage );
				jQueryPlus('#chatplusview #form-offline #cpoadbt713').removeAttr('disabled');
				return;
			} else {
				chatClient.trigger('createTicket', {
					'subject': data.title,
					'name': data.name,
					'email': data.email,
					'nomail': data.email ? 0 : 1,
					'body': message,
				}, true);

				chatClient.trigger('sendGaEvents', {'actions': ['contact']});
			}
		}

		feedback(e) {
			e.preventDefault();
			jQueryPlus('#chatplusview #form-quit .error-msg').empty();

			var required = [];
			var result = {};

			jQueryPlus('#chatplusview #form-quit .ques[data-name]').each(function(i, e) {
				var $e = jQueryPlus(e);
				if ($e.attr('data-required') == '1') {
					required.push($e.attr('data-name'));
				}
				switch ($e.prop('type')) {
					case 'radio': {
						if ($e.prop('checked')) {result[$e.attr('data-name')] = $e.val();}
						break;
					}
					case 'checkbox': {
						if (! Array.isArray(result[$e.attr('data-name')])) {result[$e.attr('data-name')] = [];}
						if ($e.prop('checked')) {result[$e.attr('data-name')].push($e.val());}
						break;
					}
					default: {
						result[$e.attr('data-name')] = $e.val();
					}
				}
			});

			required = chatplus._.uniq(required);

			var valid = true;
			var error_messages = [];
			var error_message_format = opts.appearance.end.questionError || '%title%を入力してください';

			if (opts.appearance.end.questionRateRequired) {
				if (! self.rateState) {
					valid = false;
					error_messages.push(error_message_format.replace(/%title%/g, opts.appearance.end.titleRate || '評価'));
				}
			}
			chatplus._.each(required, function(e) {
				if (!(e in result) || result[e].length === 0) {
					valid = false;
					error_messages.push(error_message_format.replace(/%title%/g, e));
				}
			});

			chatplus._.each(error_messages, function(message) {
				jQueryPlus('#chatplusview #form-quit .error-msg').append(jQueryPlus('<div>', {'text': message}));
			});

			if (valid) {
				if (opts.appearance.end.rate) {
					chatClient.trigger('feedback', {'value': result, 'rate': self.rateState, 'emptyCheck': opts.appearance.end.questionEmpty});
				} else {
					chatClient.trigger('feedback', {'value': result, 'emptyCheck': opts.appearance.end.questionEmpty});
				}

				self.endQuestionSubmitted = true;
			}
		}
		feedbackGood(e) {
			self.rateState = 1;
		}
		feedbackBad(e) {
			self.rateState = 2;
		}

		selectFile(e) {
			self.uploadFormVisible = true;
		}

		cancelFile(e) {
			if (self.uploading) {
				return;
			}
			self.uploadFormVisible = false;
		}

		uploadFile(e) {
			if (self.uploading) {
				return;
			}

			if (! jQueryPlus('#chatplusview #file_upload_form').find('.addfile').val()) {
				return;
			}

			self.uploading = true;
			chatClient.trigger('uploadFile', {
				'target': jQueryPlus('#chatplusview #file_upload_form').find('.addfile'),
			});
		}

		openOptionDialog(e) {
			self.optionDialogVisible = true;
			this.muteSelect = jQueryPlus('#chatplusview #option_form .options input[name="mute"]').prop('checked');
		}

		submitOption(e) {
			self.optionDialogVisible = false;

			var options = {};
			jQueryPlus('#chatplusview #option_form .options input').each(function(i, e) {
				options[jQueryPlus(e).attr('name')] = jQueryPlus(e).prop('checked');
			});
			jQueryPlus('#chatplusview #option_form .options select').each(function(i, e) {
				options[jQueryPlus(e).attr('name')] = jQueryPlus(e).find('option:selected').val();
			});

			this.muteSelect = jQueryPlus('#chatplusview #option_form .options input[name="mute"]').prop('checked');
			chatClient.trigger('submitOption', options);
		}

		cancelOption(e) {
			self.optionDialogVisible = false;
			jQueryPlus('#chatplusview #option_form .options input[name="mute"]').prop('checked', this.muteSelect);
		}


		requestChat(e) {
			//validate
			var form = {
				'name_label':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="name_label"]').val()),
				'com_label':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="com_label"]').val()),
				'mail_label':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="mail_label"]').val()),
				'tel_label':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="tel_label"]').val()),
				'content_label':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="content_label"]').val()),
				'visitor_name':    jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="visitor_name"]').val()),
				'visitor_company': jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="visitor_company"]').val()),
				'visitor_email':   jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="visitor_email"]').val()),
				'visitor_tel':     jQueryPlus.trim(jQueryPlus('#chatplusview #form-start input[name="visitor_tel"]').val()),
				'inquiry':         jQueryPlus.trim(jQueryPlus('#chatplusview #form-start textarea[name="inquiry"]').val()),
				'mail_note_flg':   jQueryPlus('#chatplusview #form-start input[name="mail_note"]').prop('checked'),
				'check':           jQueryPlus('#chatplusview #form-start input[name="required_checkbox"]').prop('checked'),
			};

			var errorMessage = "";
			if (! form.visitor_name && opts.appearance.start.getNameRequired) {
				errorMessage += (opts.appearance.start.errorName ? opts.appearance.start.errorName : "名前を入力してください") + "<br>";
			}
			if (! form.visitor_company && opts.appearance.start.getCompanyRequired) {
				errorMessage += (opts.appearance.start.errorCompany ? opts.appearance.start.errorCompany : "会社名を入力してください") + "<br>";
			}
			if (! form.visitor_email && opts.appearance.start.getEmailRequired) {
				errorMessage += (opts.appearance.start.errorEmail1 ? opts.appearance.start.errorEmail1 : "メールアドレスを入力してください") + "<br>";
			} else if (opts.appearance.start.getEmail && form.visitor_email) {
				if (opts.appearance.start.getEmailOnlyAscii) {
					if (! /^[\x20-\x7e]+@[-0-9A-Za-z]+\.[-.0-9A-Za-z]+$/.test(form.visitor_email)) {
						errorMessage += (opts.appearance.start.errorEmail2 ? opts.appearance.start.errorEmail2 : "メールアドレスを正しく入力してください") + "<br>";
					}
				} else {
					if (! /^[\x20-\x7e]+@[^.]+\..+$/.test(form.visitor_email)) {
						errorMessage += (opts.appearance.start.errorEmail2 ? opts.appearance.start.errorEmail2 : "メールアドレスを正しく入力してください") + "<br>";
					}
				}
			}
			if (! form.visitor_tel && opts.appearance.start.getTelRequired) {
				errorMessage += (opts.appearance.start.errorTel ? opts.appearance.start.errorTel : "電話番号を入力してください") + "<br>";
			}
			if (! form.inquiry && opts.appearance.start.getContactRequired) {
				errorMessage += (opts.appearance.start.errorContact ? opts.appearance.start.errorContact : "お問い合わせ内容を入力してください") + "<br>";
			}
			if (! form.check && opts.appearance.start.showRequiredCheckbox) {
				errorMessage += (opts.appearance.start.requiredCheckboxError ? opts.appearance.start.requiredCheckboxError : "") + "<br>";
			}
			var freeform = {};
			jQueryPlus('#chatplusview #form-start .freeform').each(function(i) {
				if(opts.appearance.start.freeform[i]){
					var title = "";
					if(opts.appearance.start.freeform[i].title){
						title = opts.appearance.start.freeform[i].title;
					}
					var type = jQueryPlus(this).attr('data-type') || 'text';
					var value = null;
					if (type === 'radio') {
						value = jQueryPlus(this).find('input:checked').val();
					} else if (type === 'check') {
						value = jQueryPlus(this).find('input:checked').map(function() {return jQueryPlus(this).val();}).toArray().join(',');
					} else if (type === 'select') {
						value = jQueryPlus.trim(jQueryPlus(this).find('select').val());
						if (opts.appearance.start.freeform[i].dummyfirst && value === '###dummy###') {
							value = '';
						}
					} else {
						value = jQueryPlus.trim(jQueryPlus(this).find('input,textarea').val());
					}
	
					if (! value && opts.appearance.start.freeform[i].required) {
						if(title){
							errorMessage += title + 'を入力してください' + '<br>';
						} else {
							errorMessage += '必須項目を入力してください' + '<br>';
						}
					} else {
						freeform[title] = value;
					}
				}
			});

			jQueryPlus("#chatplusview .error-message").html(errorMessage);
			if (errorMessage) {return;}

			var pre_survey = {
				'name_label': form.name_label,
				'com_label': form.com_label,
				'mail_label': form.mail_label,
				'tel_label': form.tel_label,
				'content_label': form.content_label,
				'visitor_name': form.visitor_name,
				'visitor_company': form.visitor_company,
				'visitor_email': form.visitor_email,
				'visitor_tel': form.visitor_tel,
				'inquiry': form.inquiry,
				'freeform': JSON.stringify(freeform),
				'mail_note_flg': form.mail_note_flg,
			};
			self.inquiry = form.inquiry;
			self.mail_note_flg = form.mail_note_flg;

			chatClient.trigger('requestChat', {
				pre_survey: pre_survey
			});
			if (window.chatplus && window.chatplus.send_pardot_form) {
				window.chatplus.send_pardot_form({
					'serial': chatplusData.customer.serial_number,
					'name': form.visitor_name,
					'companyName': form.visitor_company,
					'email': form.visitor_email,
					'tel': form.visitor_tel,
					'inquiry': form.inquiry,
				});
			}

			//self.chat_username = this.visitor_name.value;
			setTimeout(updateMessageArea, 500);
		}

		requestByBalloon(balloon) {
			chatClient.trigger('requestChat', {
				'form': {},
				'balloon': balloon,
			});
		}

		balloonEvent(data) {
			chatClient.trigger('balloonEvent', data);
		}

		function checkSuggestVisitorAttr(sign, attr, value) {
			var target_attr_value = null;
			if(chatplusData.customer && chatplusData.customer[attr]){ 
				target_attr_value = chatplusData.customer[attr]; 
			}
			if(chatplusData.customer.custom_fields && chatplusData.customer.custom_fields[attr]){ 
				target_attr_value = chatplusData.customer.custom_fields[attr]; 
			}

			switch (sign) {
				case '=': {
					if(target_attr_value != null && target_attr_value === value){
						return true;
					}
					break;
				}
				case 'in': {
					if(target_attr_value != null && target_attr_value.indexOf(value) != -1){
						return true;
					}
					break;
				}
				case '!=': {
					if(target_attr_value == null || target_attr_value !== value){
						return true;
					}
					break;
				}
				case 'out': {
					if(target_attr_value == null || target_attr_value.indexOf(value) == -1){
						return true;
					}
					break;
				}
				case '+=': {
					if(isNaN(value) || isNaN(target_attr_value)){
						return false;
					}
					value = Number(value);
					target_attr_value = Number(target_attr_value);
					if(target_attr_value != null && target_attr_value >= value){
						return true;
					}
					break;
				}
				case '-=': {
					if(isNaN(value) || isNaN(target_attr_value)){
						return false;
					}
					value = Number(value);
					target_attr_value = Number(target_attr_value);
					if(target_attr_value != null && target_attr_value <= value){
						return true;
					}
					break;
				}
				case '+': {
					if(isNaN(value) || isNaN(target_attr_value)){
						return false;
					}
					value = Number(value);
					target_attr_value = Number(target_attr_value);
					if(target_attr_value != null && target_attr_value > value){
						return true;
					}
					break;
				}
				case '-': {
					if(isNaN(value) || isNaN(target_attr_value)){
						return false;
					}
					value = Number(value);
					target_attr_value = Number(target_attr_value);
					if(target_attr_value != null && target_attr_value < value){
						return true;
					}
					break;
				}
				default: {}
			}

			return false;
		}

		function checkSuggestTag(type, sign, value) {
			var target_tags = null;
			if (type === 'visitor') {
				if(chatplusData.customer && chatplusData.customer.tags){
					target_tags = chatplusData.customer.tags;
				}
			} else if (type === 'chat') {
				if(chatplusData.chat_tags){
					target_tags = chatplusData.chat_tags;
				}
			}

			switch (sign) {
				case '=': {
					if(target_tags != null && chatplus._.contains(target_tags, value)){
						return true;
					}
					break;
				}
				case '!=': {
					if(target_tags == null || ! chatplus._.contains(target_tags, value)){
						return true;
					}
					break;
				}
				case 'in': {
					if(target_tags != null){
						var flag = false;
						target_tags.forEach(function(tag) {
							if (tag.indexOf(value) != -1) {
								flag = true;
							}
						});
						return flag;
					}
					break;
				}
				case 'out': {
					if(target_tags == null){
						return true;
					} else {
						var flag = true;
						target_tags.forEach(function(tag) {
							if (tag.indexOf(value) != -1) {
								flag = false;
							}
						});
						return flag;
					}
					break;
				}
				case 'some': {
					if(target_tags != null){
						var values = value.split(',');
						var flag = false;
						values.forEach(function(val) {
							if (chatplus._.contains(target_tags, val)) {
								flag = true;
							}
						});
						return flag;
					}
					break;
				}
				case 'every': {
					if(target_tags != null){
						var values = value.split(',');
						var flag = true;
						values.forEach(function(val) {
							if (! chatplus._.contains(target_tags, val)) {
								flag = false;
							}
						});
						return flag;
					}
					break;
				}
				case 'any': {
					if(target_tags == null){
						return true;
					} else {
						var values = value.split(',');
						var flag = true;
						values.forEach(function(val) {
							if (chatplus._.contains(target_tags, val)) {
								flag = false;
							}
						});
						return flag;
					}
					break;
				}
				case 'none': {
					if(target_tags == null){
						return true;
					} else {
						var values = value.split(',');
						var flag = false;
						values.forEach(function(val, index) {
							if ((index === 0 || flag) && chatplus._.contains(target_tags, val)) {
								flag = true;
							} else {
								flag = false;
							}
						});
						return ! flag;
					}
					break;
				}
				default: {}
			}

			return false;
		}

		function checkSuggestStatus() {
			opts.appearance.talking.suggestSource = null;
			opts.appearance.talking.suggestCategories = null;
			opts.appearance.talking.suggestEvaluate = null;
			opts.appearance.talking.suggestQ = null;
			opts.appearance.talking.suggestCount = null;
			opts.appearance.talking.suggestType = null;
			opts.appearance.talking.suggestHiddenEvaluate = null;

			chatplus._.each(opts.appearance.talking.suggests, function(suggest, i) {
				var rules_check_result = true;
				// オンライン・オフライン
				if(suggest.suggestAgent === 'online' && !self.online){
					rules_check_result = false;
				} else if(suggest.suggestAgent === 'offline' && self.online){
					rules_check_result = false;
				}
				// rulea
				if(rules_check_result){
					var rulea_check_result = true;
					chatplus._.each(suggest.suggestRuleA, function(rule, i) {
						if(
							(rulea_check_result === true && rule['operator'] === 'and')
							|| (rulea_check_result === false && rule['operator'] === 'or')
						){
							switch (rule['type']) {
								// 訪問者属性
								case 'visitor_attr': {
									rulea_check_result = checkSuggestVisitorAttr(rule['sign'], rule['attr'], rule['value']);	
									break;
								}
								// 訪問者のタグ
								case 'visitor_tag': {
									rulea_check_result = checkSuggestTag('visitor', rule['sign'], rule['value']);	
									break;
								}
								// チャットのタグ
								case 'chat_tag': {
									rulea_check_result = checkSuggestTag('chat', rule['sign'], rule['value']);	
									break;
								}
								default: {}
							}
						}
						
					});
					rules_check_result = rulea_check_result;
				}
				if(rules_check_result){
					opts.appearance.talking.suggestSource = suggest.suggestSource;
					opts.appearance.talking.suggestCategories = suggest.suggestCategories;
					opts.appearance.talking.suggestEvaluate = suggest.suggestEvaluate;
					opts.appearance.talking.suggestQ = suggest.suggestQ;
					opts.appearance.talking.suggestCount = suggest.suggestCount;
					opts.appearance.talking.suggestType = suggest.suggestType;
					opts.appearance.talking.suggestHiddenEvaluate = suggest.suggestHiddenEvaluate;
				}
			});
		}

		textareaKeyup(ev) {
			ev.preventUpdate = true;

			if(opts.appearance.talking.suggests){
				checkSuggestStatus();
			}

			if (opts.appearance.talking.suggestSource === 'caiwa' && 'caiwa' in chatplus) {
				suggest(ev.target.value, true);
			}
			if (opts.appearance.talking.suggestSource === 'knowledge' || opts.appearance.talking.suggestSource === 'suggestknowledge') {
				suggest(ev.target.value, false);
			}

			if (self.writeIntervalID) {return;}

			self.writeIntervalID = window.setInterval(function(target, messages) {
				window.clearInterval(self.writeIntervalID);
				self.writeIntervalID = null;

				chatClient.trigger('writing', {
					'text': target.value,
					'messages': messages,
				});

				if (!(opts.appearance.talking.suggestSource === 'caiwa' && 'caiwa' in chatplus)) {
					suggest(target.value, false);
				}
			}.bind(undefined, ev.target, self.messages), 2000);
		}

		function suggest(text, direct) {
			// if (! opts.appearance.talking.suggest || self.compressed) {return;}

			if (direct) {
				switch (opts.appearance.talking.suggestSource) {
					case 'caiwa': {
						chatplus.caiwa.suggest(text, opts.appearance.talking.suggestCount)
							.then(function(data) {
								self.suggests = data;
								self.update();
							})
							.catch(function(error) {
								console.warn(error);
								// debugger;
							});
						break;
					}
				}
			} else {
				switch (opts.appearance.talking.suggestSource) {
					case 'caiwa': {
						var session_id = null;
						try {session_id = window.localStorage.getItem('suggest_session_id');} catch (e) {}

						chatClient.trigger('suggest', {
							'text': text,
							'session_id': session_id,
							'callback': function(res) {
								if (res) {
									if (res.session_id) {
										try {window.localStorage.setItem('suggest_session_id', res.session_id);} catch (e) {}
									}
									self.suggests = res.suggest;
								} else {
									self.suggests = [];
								}
								self.update();
							},
						});
						break;
					}
					// 旧サジェスト
					case 'knowledge':{
						var categories = "";
						var evaluate = "";
						var q = false;

						if(opts.appearance.talking.suggestCategories){
							categories = opts.appearance.talking.suggestCategories.join(',');
						}
						if(opts.appearance.talking.suggestEvaluate){
							evaluate = opts.appearance.talking.suggestEvaluate;
						}
						if(opts.appearance.talking.suggestQ){
							q = opts.appearance.talking.suggestQ;
						}
						if (self.status === 'in_chatbot' && text !== '') {
							if (self.suggestsWord != text) {
								self.suggestsWord = text;
								chatClient.trigger('knowledgesuggest', {
									'text': text,
									'type': 'free',
									'categories': categories,
									'evaluate': evaluate,
									'q': q,
									'callback': function(res) {
										if (res && res.text === self.suggestsWord) {
											self.knowledge_suggests = res.items;
										} else {
											self.knowledge_suggests = [];
										}
										self.update();
									},
								});
							}
						} else {
							self.suggestsWord = '';
							self.knowledge_suggests = [];
							self.update();
						}
					}
					// 新サジェスト
					case 'suggestknowledge':{
						var categories = "";
						var evaluate = "";
						var q = true;
						var suggestcount = 5;
						var suggesttype = null;
						var hiddenevaluate = 0;

						if(opts.appearance.talking.suggestCategories){
							categories = opts.appearance.talking.suggestCategories.join(',');
						}
						if(opts.appearance.talking.suggestEvaluate){
							evaluate = opts.appearance.talking.suggestEvaluate;
						}
						if(opts.appearance.talking.suggestCount && opts.appearance.talking.suggestCount > 0){
							suggestcount = opts.appearance.talking.suggestCount;
						}
						if (opts.appearance.talking.suggestType) {
							suggesttype = opts.appearance.talking.suggestType;
						}
						if(opts.appearance.talking.suggestHiddenEvaluate){
                            hiddenevaluate = opts.appearance.talking.suggestHiddenEvaluate;
                        }
						if (self.status === 'in_chatbot' && text !== '') {
							if (self.suggestsWord != text) {
								self.suggestsWord = text;
								if(window.chatplus.Suggestknowledge){
									clearTimeout(self.writeTimeoutID);
									self.writeTimeoutID = setTimeout(function() {
										var res = window.chatplus.Suggestknowledge.suggest(text, categories, evaluate, suggestcount, suggesttype, hiddenevaluate);
										var textarea_message = jQueryPlus('#chatplusview #textarea-wrapper [name="message"]').val();
										if (res !== null && res.target && res.text === self.suggestsWord && self.suggestsWord === textarea_message) {
											// 優先度の高いものから下に表示する
											self.knowledge_suggests = res.target.reverse();
										} else {
											self.knowledge_suggests = [];
										}
										self.update();
										suggest_hit_highlight();
									}, window.chatplus.Suggestknowledge.timeout);
								}
							}
						} else {
							self.suggestsWord = '';
							self.knowledge_suggests = [];
							self.update();
						}
					}
				}
			}
		}

		focusTextArea(ev) {
			ev.preventUpdate = true;
			if (! ev.target || ev.target.id !== 'operate') {return;}
			jQueryPlus('#chatplusview #textarea-wrapper [name="message"]').get(0).focus();
		}

		textareaKeydown(ev) {
			if (self.knowledge_suggests.length <= 0) {return;}

			ev.preventUpdate = true;

			if (! ev.isComposing && ! ev.shiftKey && ! ev.ctrlKey && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) {
				var target = jQueryPlus('#chatplusview #knowledge_suggests .chat-ques li' + (ev.key === 'ArrowUp' ? ':last-child' : ':first-child') + ' label').get(0);
				if (target) {
					ev.preventDefault();
					target.focus();
					return;
				}
			}
		}

		knowledgeSuggestKeydown(ev) {
			ev.preventUpdate = true;
			if (ev.key === 'Enter' || ev.key === ' ') {
				ev.preventDefault();
				var $this = jQueryPlus(ev.target);
				var $target = jQueryPlus('#chatplusview #' + $this.attr('for'));
				$target.trigger('click');
			}
			if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
				ev.preventDefault();
				var $targets = jQueryPlus('#chatplusview #knowledge_suggests .chat-ques li label');
				var $this = jQueryPlus(ev.target);
				var index = Math.max($targets.index($this) + (ev.key === 'ArrowUp' ? -1 : 1), 0);
				if (index < $targets.length) {
					$targets.get(index).focus();
				} else {
					jQueryPlus('#chatplusview [name="message"]').focus();
				}
			}
			if (ev.key === 'Escape') {
				ev.preventDefault();
				ev.target.blur();
			}
		}


		closeQuestion(e) {
			self.quitQuestionVisible = false;
			self.closeWindow();
		}

		quit(e) {
			self.parseVariableTexts();
			if(_ua.Mobile || _ua.Tablet) {
				jQueryPlus("#chatplusview #message_mobile").val("");
			} else {
				jQueryPlus("#chatplusview #message_pc").val("");
			}

			if (self.status == 'close_chat_by_agent' || self.status == 'close_chat_by_visitor' || self.status == 'close_chat_by_mute') {
				self.hidden = true;
				chatClient.trigger('hideWindow');
			} else {
				chatClient.trigger('quitChat', {});
				if (opts.appearance.end.noeyecatcher) {
					jQueryPlus("#chatplusview #eye_catcher").hide();
				}
				if (opts.appearance.end.suppress) {
					if (opts.appearance.end.suppressPopup) {
						if (confirm(opts.appearance.end.suppressPopupText || '一定時間チャットを表示しないように設定しますか')) {
							chatClient.trigger('suppress');
						}
					} else if (opts.appearance.end.suppressCheck === false) {
						chatClient.trigger('suppress');
					} else {
						if (jQueryPlus('#chatplusview #quit_confirm .suppress').prop('checked')) {
							chatClient.trigger('suppress');
						}
					}
				}

				if (opts.appearance.end.close) {
					self.closeWindow();
				}

				self.quitConfirmVisible = false;
				if (! opts.appearance.end.skip) {self.quitQuestionVisible = true;}
			}
		}

		restart(e) {
			self.messages = [];
			self.suggests = [];
			self.knowledge_suggests = [];
			self.rateState = 0;
			self.endQuestionSubmitted = false;
			self.quitConfirmVisible = false;
			self.quitQuestionVisible = false;

			chatClient.trigger('reinit', {});
		}

		reDisplay(e) {
			self.windowStatus = 'open';
			chatplus.setWindowStatus('open');

			self.messages = [];
			self.suggests = [];
			self.knowledge_suggests = [];
			self.rateState = 0;
			self.endQuestionSubmitted = false;
			self.quitConfirmVisible = false;
			self.quitQuestionVisible = false;

			chatClient.trigger('reinit', {
				reDisplay: true,
				pre_survey: {
					visitor_name: chatplusData.customer.chat_username,
					visitor_company: chatplusData.customer.chat_company_name,
					visitor_email: chatplusData.customer.chat_email,
					visitor_tel: chatplusData.customer.chat_tel,
					inquiry: self.inquiry,
					mail_note_flg: self.mail_note_flg,
				},
			});
		}

		open(e) {
			self.windowStatus = 'open';
			self.waitDisable = false;

			// チャット終了済でなければチャット開閉状態を保存
			if (this.status !== 'close_chat_by_visitor' && this.status !== 'close_chat_by_agent' && this.status !== 'close_chat_by_mute' && this.status !== 'quit') {
				chatplus.setWindowStatus('open');
			}

			if (this.status == "no_chat" && opts.appearance.start.disable) {
				// チャットが開始するまでチャットウィンドウを開かない
				self.windowStatus = 'close';

				var pre_survey = {
					visitor_name: null,
					visitor_company: null,
					visitor_email: null,
					visitor_tel: null,
					inquiry: null,
					mail_note_flg: false
				}
				chatClient.trigger('requestChat', {
					pre_survey: pre_survey
				});
				return;
			}else if (this.status == "no_chat" && !opts.appearance.start.disable) {
				//開始画面が表示されるので、greetingがあれば、greetingを停止させる
				chatClient.trigger('openPreSurvey', {});
			}

			if (! document.hidden && self.windowStatus === 'open') {chatClient.trigger('markReadAll');}

			self.update();
			chatResize();
			carouselResizeAll();
			fixImageMapMessage();
		}

		close(ev) {
			if (ev) {ev.stopPropagation();}

			self.status = 'close_chat';
			self.update();
			chatResize();
		}

		show(ev) {
			self.hidden = false;
		}
		hide(ev) {
			self.hidden = true;
		}

		compress(ev) {
			if (ev) {
				ev.preventUpdate = true;
				ev.stopPropagation();
			}
			if (self.windowStatus === 'close') {return;}
			if (! self.compress_enabled) {return;}

			self.compressed = true;

			self.update();
			fitChat();
		}
		expand(ev) {
			if (ev) {
				ev.preventUpdate = true;
				ev.stopPropagation();
			}
			if (self.windowStatus === 'close') {return;}
			if (! self.compress_enabled) {return;}

			self.compressed = false;

			self.update();
			if (! jQueryPlus('#chatplusview').hasClass('float')) {
				chatResize();
			} else {
				jQueryPlus('#chatplusview').one('oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend', chatResize);
			}
		}

		closeWindow(ev) {
			if (ev) {ev.stopPropagation();}
			if (self.chatbuttonFlag) {return;}

			self.windowStatus = 'close';
			// self.compressed = false;

			if (self.status === 'in_chat' || self.status === 'in_chatbot' || self.status === 'suspend_chat' || self.status === 'wait_chat'|| self.status === 'accept_chat') {
				// チャット中: 閉状態を保存
				chatplus.setWindowStatus('close');
			} else {
				// チャット開始前/チャット終了済: 状態を破棄
				chatplus.clearWindowStatus();
			}

			self.update();
			fixImageMapEyecatcher();
		}

		cancelQuit(e) {
			self.quitConfirmVisible = false;
		}

		removeWindow(ev) {
			if (ev) {ev.stopPropagation();}

			if (opts.appearance.end.direct) {
				self.quit();
				return;
			}

			if (self.windowStatus === 'close') {
				self.open();
			}

			self.quitConfirmVisible = true;
		}

		hideWindow(ev) {
			if (ev) {ev.stopPropagation();}

			self.hidden = true;
			chatClient.trigger('hideWindow');
			if (opts.appearance.hideButton && opts.appearance.hideButton.suppress) {
				if (opts.appearance.end.suppressCheck === false || ! opts.appearance.end.suppressPopup || confirm(opts.appearance.end.suppressPopupText || '一定時間チャットを表示しないように設定しますか')) {
					chatClient.trigger('suppress');
				}
			}
		}

		good(e) {
			self.rateState = 1;
			chatClient.trigger('rateGood');
			chatClient.trigger('sendGaEvents', {actions: 'pressGood'});
		}

		bad(e) {
			self.rateState = 2;
			chatClient.trigger('rateBad');
			chatClient.trigger('sendGaEvents', {actions: 'pressBad'});
		}

		imagemapMessage(e) {
			if (/^close_chat/.test(self.status)) {
				self.windowStatus = 'open';
				chatplus.setWindowStatus('open');
				return;
			}

			//連打防止
			if (self.forcedMessaging) {return;}
			self.forcedMessaging = true;
			setTimeout(function() {self.forcedMessaging = false;}, 250);

			var $this = jQueryPlus(e.target);
			var value = $this.data('text').toString();
			var index = $this.closest('map').find('area').index($this) + 1;
			var rule_id = $this.closest('.view-content').data('rule') || $this.closest('map').data('rule');
			if (value.length <= 0) {return;}

			if (self.status === 'no_chat') {self.status = 'in_chatbot';}
			sendForcedMessage({
				'value': value,
				'rule_id': rule_id,
				'rule_num': index,
				'target': e.target,
			});

			if (opts.appearance.talking.imageMapOnce) {self.showKeyboard();}
		}

		function sendForcedMessage(target) {
			if (! target.value) {return;}
			if (/^close_chat/.test(self.status)) {return;}

			self.suggests = [];
			self.knowledge_suggests = [];

			var $target = null;
			if ('target' in target && target.target instanceof HTMLElement) {
				$target = jQueryPlus(target.target);
			} else if (target instanceof HTMLElement) {
				$target = jQueryPlus(target);
			}

			var value = String(target.value);
			value = value.replace(/\\r\\n/g, '\n');

			var text = "";
			var no_assign = target.no_assign || false;
			var no_message = false;
			var rule_id = null;
			if (target.rule_id) {
				rule_id = target.rule_id;
			} else if ($target && $target.closest('#userOperationImage').data('rule')) {
				// 下部のイメージマップ
				rule_id = $target.closest('#userOperationImage').data('rule');
			} else if ($target && $target.closest('.view-content').data('rule')) {
				// 選択肢
				rule_id = $target.closest('.view-content').data('rule');
			} else {
				// 初回メッセージ
				rule_id = '3_000000_01';
			}
			var index = 1;
			if (target.rule_num) {
				index = Number(target.rule_num);
			} else if ($target) {
				if ($target.attr('rule_num')) {
					index = Number($target.attr('rule_num'));
				} else if ($target.closest('.chat-ques')) {
					index = $target.closest('.chat-ques').find('li').index($target.closest('li')) + 1;
				}
			}

			// '_status_'が入ってたらステータス変更メッセージ
			if (/_status_/.test(value)) {
				// target.valueを'{text}_status_{status_to}'に分割
				var v = value.split(/_status_/);
				var status_to = v.pop();
				text = v.join('_status_');

				if (chatplus._.contains(['no_chat', 'in_chat', 'in_chatbot', 'suspend_chat', 'close_chat_by_visitor', 'close_chat_by_agent', 'no_agent'], status_to)) {
					chatClient.trigger('changeStatus', {
						'status': status_to,
						'text': text,
						'rule_id': rule_id,
						'num': index,
					});
					no_message = true;
					return;
				}
			}

			// '_assign_'が入ってたら担当者割当メッセージ
			if (/_assign_(id|tag)_/.test(value)) {
				var matches = /^(.*)_assign_(id|tag)_(.*?)$/.exec(value);
				chatClient.trigger('changeAgent', {
					'mode': matches[2],
					'text': matches[1],
					'target': matches[3],
					'status': $target ? $target.attr('data-status') : undefined,
					'rule_id': rule_id,
					'num': index
				});
				text = matches[1];
				no_message = true;
			}

			if (text == "") {
				text = value;
			}

			self.windowStatus = 'open';
			chatplus.setWindowStatus('open');

			chatClient.trigger('receiveMessage', {
				name: self.customer.chat_username,
				body: "<clientmess>"+text+"</clientmess>",
				created_at: Date.now(),
				event_type: 22,
				event_from: 1,
				id: self.messagePreID,
				read_flg: 0,
				dummy: true,
			});

			if (! no_message) {
				chatClient.trigger('sendMessage', {
					'text': text,
					'start': true,
					'no_assign': no_assign,
					'rule_id': rule_id,
					'num': index,
				}, function(data) {
					if (data.result == 1) {
						chatClient.trigger('sendGaEvents', {
							actions: ['sendBtnMess', 'sendBtnMessFirst'],
							message: text,
						});
					} else {
						// console.warn(data);
						self.messages = self.messages.filter(function(message) {return ! message.dummy;});
						self.update();
					}
				});
			} else {
				chatClient.trigger('sendGaEvents', {
					actions: ['sendBtnMess', 'sendBtnMessFirst'],
					message: text,
				});
			}
		}

		function sendMessage() {
			var $target = jQueryPlus('#chatplusview [name="message"]');
			var text = $target.val();
			if (text.length <= 0) {return;}
			if (self.sending) {return;}

			//EC CUBE対策（submit後overlayされる処理を解除する）
			//loadingOverlay関数がある場合、EC CUBEと判断
			if (typeof loadingOverlay == 'function') {
				loadingOverlay('hide');
			}

			self.sending = true;
			self.suggests = [];
			self.knowledge_suggests = [];
			$target.val(null);

			chatClient.trigger('receiveMessage', {
				name: self.customer.chat_username,
				body: "<clientmess>"+text+"</clientmess>",
				created_at: new Date().getTime(),
				event_type: 21,
				event_from: 1,
				id: self.messagePreID,
				read_flg: 0,
				dummy: true,
			});

			chatClient.trigger('sendMessage', {
				'text': text,
				'quote_target': self.quoteTarget.id,
			}, function(data) {
				self.sending = false;
				if (data.result == 1) {
					chatClient.trigger('sendGaEvents', {
						actions: ['sendTypeMess', 'sendTypeMessFirst'],
						message: text,
					});
					self.quoteTarget = {'id': null, 'text': null, 'time': null};
				} else {
					if (data.error !== 'prohibit') {
						$target.val(text);
					}
					self.messages = self.messages.filter(function(message) {return ! message.dummy;});
					self.update();
				}
				if (! self.mobileFlag) {$target.focus();}
			});
		}

		function execRule(ruleId) {
			if (! ruleId) {return;}
			chatClient.trigger('execRule', {
				'id': ruleId
			});
		}

		function fitChat(immediate) {
			if (immediate) {
				updateMessageArea();
				return;
			}

			if (self.status == 'in_chat' || self.status == 'in_chatbot' || self.status == 'greeting' || self.status == 'close_chat_by_agent' || self.status == 'close_chat_by_visitor' || self.status == 'close_chat_by_mute') {
				// {[300ms後,transition終了後]の速い方}まで待ってから高さ調整を行う

				var fit_timerid = setTimeout(function() {
					updateMessageArea();
					fit_timerid = null;
				}, 300);

				if (jQueryPlus("#chatplusview").hasClass("chatplusview-modern") || (jQueryPlus("#chatplusview").css("transition")).indexOf("height") != -1 ) {
					jQueryPlus('#chatplusview').on('oTransitionEnd.fitChat mozTransitionEnd.fitChat webkitTransitionEnd.fitChat transitionend.fitChat', function() {
						jQueryPlus('#chatplusview').off('.fitChat');
						if (! fit_timerid) {return;}
						updateMessageArea();
						clearTimeout(fit_timerid);
						fit_timerid = null;
					});
				}
				knowledgeSuggestResize();
			}
		}

		// 訪問者属性更新
		function addVisitorAttribute(attr, ex) {
			var deferred = new jQueryPlus.Deferred();

			if (self.status == 'in_chat' || self.status == 'in_chatbot' || self.status == 'wait_chat' || self.status == 'accept_chat' || self.status == 'greeting') {
				chatClient.trigger('addVisitorAttribute', {
					attr: attr
				}, !!(ex), function() {
					deferred.resolve();
				});
			} else {
				// ステータス条件を満たさない場合もresolveする
				deferred.resolve();
			}
			if (ex && window.chatplus && window.chatplus.send_pardot_form) {
				window.chatplus.send_pardot_form({
					'serial': chatplusData.customer.serial_number,
					'name': attr.name || attr.chatName || attr.perhapsName,
					'companyName': attr.companyName || attr.chatCompanyName || attr.perhapsCompanyName,
					'email': attr.email || attr.chatEmail || attr.perhapsEmail,
					'tel': attr.tel || attr.chatTel || attr.perhapsTel,
					'inquiry': attr.inquiry,
				});
			}

			return deferred.promise();
		}

		function addVisitorTag(tag) {
			if (self.status == 'in_chat' || self.status == 'in_chatbot' || self.status == 'wait_chat' || self.status == 'accept_chat' || self.status == 'greeting') {
				chatClient.trigger('addVisitorTag', {
					value: tag
				});
			}
		}

		function postback(url, value, type, chatinfo, visitorinfo, writeattr, callback) {
			if (self.status !== 'in_chat' && self.status !== 'in_chatbot' && self.status !== 'wait_chat' && self.status !== 'accept_chat' && self.status !== 'greeting') {return;}

			return chatClient.trigger('postback', {
				'url': url,
				'value': value,
				'type': type,
				'chatinfo': chatinfo,
				'visitorinfo': visitorinfo,
				'writeattr': writeattr,
			}, callback);
		}

		function generateTextformMessage($form, selector, option) {
			return $form.find(selector.input + ',' + selector.check + ',' + selector.file)
				.filter(function() {
					return jQueryPlus(this).data('hidden') === undefined;
				})
				.map(function() {
					var $this = jQueryPlus(this);
					var label = $this.hasClass('form-group')
						? $this.find('input').data('label')
						: $this.data('label');
					if (label == null && $this.hasClass('datepicker-input')) {label = '';}
					var value = $this.hasClass('form-group')
						? $this.find('input:checked').map(function() {return jQueryPlus(this).val();}).toArray().join(',')
						: $this.val();
					var name = $this.data('name') || $this.attr('name');

					if (label == null) {
						return null;
					} else {
						label = String(label);
					}

					if ('files' in option && $this.attr('type') === 'file') {
						var file = chatplus._.find(option.files, function(e) {return e.name == name;});
						value = file ? file.url : '';
					}
					if (label === "") {
						return value;
					} else {
						return option.messageonly ? value : label+':'+value;
					}
				})
				.toArray()
				.filter(function(e) {return e !== null;})
				.join('\n');
		}

		function textformMessage($form, selector, option) {
			sendForcedMessage({
				'value': generateTextformMessage($form, selector, option),
				'no_assign': true,
				'rule_id': option.rule_id,
			});
		}

		function chatResize() {
			if (jQueryPlus('#chatplusview:visible').length <= 0) {return;}

			if (jQueryPlus('#chatplusview').hasClass("chatplusview-modern")) {
				if (opts.appearance.themeParams.heightType !== 'pct' && opts.appearance.themeParams.heightPx && opts.appearance.themeParams.heightPx > window.innerHeight && jQueryPlus('#chatplusview #fix-heightpx').length == 0) {
					var style = '#chatplusview.float.chatplusview-modern.closed {bottom: -100%;}';
					jQueryPlus('<style>', {'id': 'fix-heightpx', 'text': style}).appendTo('#chatplusview');
				}
			}

			if (self.windowStatus !== 'close' && !self.chatbuttonFlag && self.mobileFlag && opts.appearance.themeParams.spHeight) {
				// 縮小表示
				if (self.compressed === void(0)) {
					self.compress();
				}
			}

			if (!(_ua.Mobile || _ua.Tablet) && self.windowStatus != 'close' && self.chatbuttonFlag == true) {
				if ((self.status == 'in_chat' || self.status == 'in_chatbot') && jQueryPlus("#chatplusview").hasClass("chatplusview-basic")) {
					var paddingsize=33;
					var chatplusheader = document.getElementById('chatplusheader').clientHeight + paddingsize;
                	var chatplusframe = document.getElementById('chatplusframe')? document.getElementById('chatplusframe').offsetHeight + chatplusheader : chatplusheader;
                	var chatpluscontent = document.getElementById('chatpluscontent').clientHeight - chatplusframe;
                	var textareaHeight = document.getElementById('textarea') ? document.getElementById('textarea').clientHeight : 0;
                	var chatplusfooter = document.getElementById('chatplusfooter').clientHeight;
					chatplusfooter+=42;
					var heightMess = chatpluscontent - (textareaHeight + chatplusfooter);
					jQueryPlus("#chatplusview #messages").css("height", heightMess+"px")
					jQueryPlus("#chatplusview #chatplusfooter").css("padding", 3+"px");
					jQueryPlus("#chatplusview #messages").css("padding-bottom", 0+"px");

				}
			}
			else if((_ua.Mobile || _ua.Tablet) && self.status=="no_agent") {
				if (!this.contact_form_height && jQueryPlus("#chatplusview #chatpluscontent form").height())
					this.contact_form_height = jQueryPlus("#chatplusview #chatpluscontent form").height();
				jQueryPlus("#chatplusview form").css("height", this.contact_form_height+jQueryPlus("#chatplusview #chatpluscontent h2").height()+30+"px");
			}

			replaceForIE();
			fitChat();
			carouselResizeAll();
		}

		showKeyboard() {
			self.imageMapState = 'keyboard';
			self.update();
			updateMessageArea();
			if (self.isIE) {fixTextareaPlaceholder();}
		}
		showImageMap() {
			if (isLandscape()) {return;}
			self.imageMapState = 'show';
			self.update();
			updateMessageArea();
		}
		switchImageMap() {
			self.imageMapState = self.imageMapState === 'show' ? 'hide' : 'show';
			self.update();
			updateMessageArea();
		}
		chatClient.on('imagemapState', function(mode) {
			switch (mode) {
				case 'hide': {self.showKeyboard(); break;}
				case 'show': {self.showImageMap(); break;}
				case 'toggle':
				default: {
					if (self.imageMapState === 'keyboard') {self.showImageMap();}
					else if (self.imageMapState === 'show') {self.showKeyboard();}
				}
			}
		});

		powered() {
			var v = confirm((opts.poweredby || 'ChatPlus')+'公式サイトに移動します。 よろしいですか?');
			if (v) {window.open(opts.siteurl);}
		}


		// スクロール連鎖抑制
		if (! ('CSS' in window) || ! window.CSS.supports('overscroll-behavior: contain')) {
			var touchStartY = null;

			document.addEventListener('touchstart', function(ev) {
				if (ev.target.id !== 'messages') {return;}
				touchStartY = ev.touches[0].clientY;
			}, {'passive': true});

			var preventOverScroll = function(ev, deltaY) {
				var elem = ev.currentTarget;
				if (deltaY > 0) {
					if (elem.scrollTop + elem.offsetHeight >= elem.scrollHeight) {
						ev.preventDefault();
					}
				} else if (deltaY < 0) {
					if (elem.scrollTop <= 0) {
						ev.preventDefault();
					}
				}
			};

			var prevent_overscroll_timerid = window.setInterval(function() {
				if (! document.querySelector('#chatplusview #messages')) {return;}
				window.clearInterval(prevent_overscroll_timerid);

				document.querySelector('#chatplusview #messages').addEventListener('wheel', function(ev) {
					preventOverScroll(ev, ev.deltaY);
				}, {'passive': false});
				document.querySelector('#chatplusview #messages').addEventListener('touchmove', function(ev) {
					preventOverScroll(ev, touchStartY !== null ? touchStartY - ev.touches[0].clientY : 0);
				}, {'passive': false});
			}, 200);
		}


		var resize_timerid = setInterval(function() {
			if (jQueryPlus('#chatplusview #chatpluscontent').length > 0) {
				clearInterval(resize_timerid);
				chatResize();
				fixImageMapEyecatcher();
				if (self.mobileFlag && opts.appearance.themeParams.spZoom) {fixImageMap();}
			}
		}, 200);


		function updateMessageArea() {
			if (jQueryPlus('#chatplusview').hasClass('chatplusview-modern')) {
				fixModernMess();
				return;
			}

			if (jQueryPlus('#chatplusview').hasClass('closed')) {
				return;
			}

			if (jQueryPlus('#chatplusview #userOperationImage:visible > img').length > 0 && ! jQueryPlus('#chatplusview #userOperationImage:visible > img').prop('complete')) {
				jQueryPlus('#chatplusview #userOperationImage:visible > img').get(0).addEventListener('load', updateMessageArea, {'once': true});
				return;
			}


			var heightMess = 0;
			var height_expression = '';

			var paddingsize = jQueryPlus('#chatplusview #body').innerHeight() - jQueryPlus('#chatplusview #body').outerHeight(true);
			var chatplusheader = (jQueryPlus('#chatplusview #chatplusheader:visible').outerHeight(true) || 0) + paddingsize;
			var chatplusframe = (jQueryPlus('#chatplusview #chatplusframe:visible').outerHeight(true) || 0);
			var chatpluscontent = jQueryPlus('#chatplusview #chatpluscontent').outerHeight(true);
			var chatplusfooter = jQueryPlus('#chatplusview #chatplusfooter').outerHeight(true);

			var virtualHeight = 0;
			if (jQueryPlus('#chatplusview .info-closed').length > 0 ) {
				virtualHeight = jQueryPlus('#chatplusview .info-closed').outerHeight(true);
			}
			var profileHeight = 0;
			if (jQueryPlus('#chatplusview').hasClass('chatplusview-basic')) {
				profileHeight = jQueryPlus('#chatplusview #body #profile').outerHeight(true);
			}

			var is_float = opts.appearance.themeParams.floatdesign && ! self.chatbuttonFlag;
			var is_mobile = _ua.Mobile || _ua.Tablet;
			var is_compressed = is_mobile && self.compressed;
			var is_in_chatting = self.status != 'close_chat_by_agent' && self.status != 'close_chat_by_visitor' && self.status != 'close_chat_by_mute';
			var is_imagemap_enabled = ((self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline) && is_in_chatting && !isLandscape();

			if (is_float && ! is_mobile && ! is_imagemap_enabled) {return;}

			if (! is_float) {
				heightMess = (chatpluscontent - chatplusheader - chatplusframe) - (virtualHeight + profileHeight + chatplusfooter);
				height_expression = '('+chatpluscontent+'px - '+chatplusheader+'px - '+chatplusframe+'px) - ('+virtualHeight+'px + '+profileHeight+'px + '+chatplusfooter+'px)';
			} else {
				var viewHeight = 420;
				if (is_mobile && jQueryPlus('#chatplusview').length > 0) {
					viewHeight = jQueryPlus('#chatplusview').get(0).style.height === 'auto' ? (window.innerHeight - 30) : jQueryPlus('#chatplusview').height();
				}
				heightMess = viewHeight - chatplusheader - chatplusframe - (virtualHeight + profileHeight + chatplusfooter);
				height_expression = ''+viewHeight+'px - '+chatplusheader+'px - '+chatplusframe+'px - ('+virtualHeight+'px + '+profileHeight+'px + '+chatplusfooter+'px)';
			}
			if (is_imagemap_enabled) {
				jQueryPlus('#chatplusview #chatpluscontent #body').css('height', 'auto');

				var userOperationAreaHeight = opts.appearance.talking.imageMapAreaHide ? 0 : (opts.appearance.talking.imageMapAreaSlim ? 24 : 47);
				var userOperationImageHeight = jQueryPlus('#chatplusview #userOperationImage').height();
				try {userOperationImageHeight = jQueryPlus('#chatplusview #userOperationImage').get(0).getBoundingClientRect().height;} catch (ex) {}

				switch (self.imageMapState) {
					case 'show': {
						heightMess -= (userOperationAreaHeight + userOperationImageHeight);
						height_expression += ' - ('+userOperationAreaHeight+'px + '+userOperationImageHeight+'px)';
						break;
					}
					case 'hide': {
						heightMess -= (userOperationAreaHeight);
						height_expression += ' - ('+userOperationAreaHeight+'px)';
						break;
					}
					case 'keyboard':
					case 'show*':
					case 'hide*': {
						var textareaHeight = (jQueryPlus('#chatplusview #textarea:visible').outerHeight(true) || 0);
						heightMess -= textareaHeight;
						height_expression += ' - '+textareaHeight+'px';
						break;
					}
				}
			} else {
				jQueryPlus("#chatplusview #chatpluscontent #body").css('height', '');

				var textareaHeight = (jQueryPlus('#chatplusview #textarea:visible').outerHeight(true) || 0);
				if (textareaHeight > 0) {
					heightMess -= textareaHeight;
					height_expression += ' - '+textareaHeight+'px';
				}
			}

			if (heightMess > 0) {
				jQueryPlus('#chatplusview #messages').css('height', heightMess+'px');
				// jQueryPlus('#chatplusview #messages').css('height', 'calc('+height_expression+')');
			} else {
				window.console.warn('messagearea has gone', height_expression);
			}
			suggest_hit_highlight();
		}

		function fixModernMess() {
			if (jQueryPlus('#chatplusview #messages').length <= 0) {
				return;
			}
			if (! self.mobileFlag && !(opts.appearance.talking.useImageMap || opts.appearance.talking.useImageMapOffline)) {
				return;
			}

			if (jQueryPlus('#chatplusview #userOperationImage:visible > img').length > 0 && ! jQueryPlus('#chatplusview #userOperationImage:visible > img').prop('complete')) {
				jQueryPlus('#chatplusview #userOperationImage:visible > img').get(0).addEventListener('load', fixModernMess, {'once': true});
				return;
			}

			// modernテーマ メッセージエリア高さ調整
			var paddings = [
				// Math.max(jQueryPlus('#chatplusview #chatplusheader').height(), 0),
				Math.max(jQueryPlus('#chatplusview #textarea:visible').height(), 0),
				Math.max(jQueryPlus('#chatplusview #userOperation:visible').height(), 0),
				Math.max(jQueryPlus('#chatplusview .info-closed:visible').height(), 0),
			];
			jQueryPlus('#chatplusview #messages').css({'height': 'calc(100% - (' + paddings.join('px + ') + 'px))'});

			if (jQueryPlus('#chatplusview #userOperation').length > 0) {
				if(!jQueryPlus("#chatplusview-appendbtm")[0] && jQueryPlus("#chatplusview").hasClass("float")) {
					if (! (_ua.Mobile || _ua.Tablet)) {
						var viewHeight = jQueryPlus("#chatplusview").height();
						if (jQueryPlus("#chatplusview").hasClass("closed")) {
							viewHeight += jQueryPlus('#chatpluscontent #userOperation').height();
						}
						var viewBottom = "<style id='chatplusview-appendbtm'>#chatplusview.float.chatplusview-modern.closed { bottom:-" + String(viewHeight) + "px!important;}<\/style>";
						jQueryPlus(viewBottom).appendTo('head');
						jQueryPlus("#chatplusview").height(viewHeight);
					}
				}
				jQueryPlus("#chatplusview #chatpluscontent #userOperation").css({
					"height": "auto"
				});
			}
		}

		//riotタグのまま残ることがあるので、設定しなおす
		function replaceForIE() {
			if (! self.isIE) {return;}

			if (jQueryPlus("#cpatcn619").text().indexOf("opts.appearance.talking.counterName") != -1 ) {
					jQueryPlus("#cpatcn619").text( opts.appearance.talking.counterName || "カスタマーサポート" );
			}
			if( jQueryPlus("#oastn701").text().indexOf("opts.appearance.start.titleName") != -1 ) {
					jQueryPlus("#oastn701").text( opts.appearance.start.titleName || "名前" );
			}
			if( jQueryPlus("#oastc702").text().indexOf("opts.appearance.start.titleCompany") != -1 ) {
					jQueryPlus("#oastc702").text( opts.appearance.start.titleCompany || "会社名" );
			}
			if( jQueryPlus("#oaste703").text().indexOf("opts.appearance.start.titleEmail") != -1 ) {
					jQueryPlus("#oaste703").text( opts.appearance.start.titleEmail || "メールアドレス" );
			}
			if( jQueryPlus("#oastt704").text().indexOf("opts.appearance.start.titleTel") != -1 ) {
					jQueryPlus("#oastt704").text( opts.appearance.start.titleTel || "電話番号" );
			}
			if( jQueryPlus("#oastc705").text().indexOf("opts.appearance.start.titleContact") != -1 ) {
					jQueryPlus("#oastc705").text( opts.appearance.start.titleContact || "お問い合せ内容" );
			}
			if( jQueryPlus("#email_use").text().indexOf("opts.appearance.start.emailQuestion") != -1 ) {
					jQueryPlus("#email_use").text( opts.appearance.start.emailQuestion || "チャット終了後に、内容をメールで送信する。" );
			}
			if( jQueryPlus("#start_btn").text().indexOf("opts.appearance.start.buttonText") != -1 ) {
					jQueryPlus("#start_btn").text( opts.appearance.start.buttonText || "チャットを開始する" );
			}
			if( jQueryPlus("#submit_btn").text().indexOf("opts.appearance.talking.buttonText") != -1 ) {
					jQueryPlus("#submit_btn").text( opts.appearance.talking.buttonText || "送信" );
			}
			if( jQueryPlus("#oatubt707").text().indexOf("opts.appearance.talking.uploadButtonText") != -1 ) {
					jQueryPlus("#oatubt707").text( opts.appearance.talking.uploadButtonText || "アップロード" );
			}
			if( jQueryPlus("#oatuct708").text().indexOf("opts.appearance.talking.uploadCancelText") != -1 ) {
					jQueryPlus("#oatuct708").text( opts.appearance.talking.uploadCancelText || "キャンセル" );
			}
			if( jQueryPlus("#oatun709").text().indexOf("opts.appearance.talking.uploadNote") != -1 ) {
					jQueryPlus("#oatun709").text( opts.appearance.talking.uploadNote || "※10MB以内のファイルをアップロードしてください" );
			}
			if( jQueryPlus("#cpoadb710").text().indexOf("opts.appearance.disconnect_body") != -1 ) {
					jQueryPlus("#cpoadb710").text( chatClient.parseVariables(opts.appearance.disconnect_body) || "オペレーターは今対応できません。メッセージをお残しください。すぐにこちらからご連絡いたします。" );
			}
			if( jQueryPlus("#cpoadnt711").text().indexOf("opts.appearance.disconnect_nameTitle") != -1 ) {
					jQueryPlus("#cpoadnt711").text( opts.appearance.disconnect_nameTitle || "名前" );
			}
			if( jQueryPlus("#cpoadet712").text().indexOf("opts.appearance.disconnect_emailTitle") != -1 ) {
					jQueryPlus("#cpoadet712").text( opts.appearance.disconnect_emailTitle || "メールアドレス" );
			}
			if( jQueryPlus("#cpoadbt713").text().indexOf("opts.appearance.disconnect_buttonText") != -1 ) {
					jQueryPlus("#cpoadbt713").text( opts.appearance.disconnect_buttonText || "メッセージを残す" );
			}
			if( jQueryPlus("#cpoaeat721").text().indexOf("opts.appearance.end.afterText") != -1 ) {
					jQueryPlus("#cpoaeat721").text( self.status == 'close_chat_by_mute' ? (opts.appearance.end.afterText || "一定時間新しい発言がなかったためチャットを終了しました") : (opts.appearance.end.afterText || "チャットを終了しました") );
			}
			if( jQueryPlus("#cpoaert722").text().indexOf("opts.appearance.end.restartText") != -1 ) {
					jQueryPlus("#cpoaert722").text( opts.appearance.end.restartText || "チャットを再開する" );
			}
			if( jQueryPlus("#cpoaert723").text().indexOf("opts.appearance.end.restartText") != -1 ) {
					jQueryPlus("#cpoaert723").text( opts.appearance.end.restartText || "チャットを再開する" );
			}
			if( jQueryPlus("#cpoaecm731").text().indexOf("opts.appearance.end.confirmMessage") != -1 ) {
					jQueryPlus("#cpoaecm731").text( opts.appearance.end.confirmMessage || "チャットを終了しますか？" );
			}
			if( jQueryPlus("#cpoaeeb732").text().indexOf("opts.appearance.end.endButtonText") != -1 ) {
					jQueryPlus("#cpoaeeb732").text( opts.appearance.end.endButtonText || "はい" );
			}
			if( jQueryPlus("#cpoaecbt733").text().indexOf("opts.appearance.end.cancelButtonText") != -1 ) {
					jQueryPlus("#cpoaecbt733").text( opts.appearance.end.cancelButtonText || "キャンセル" );
			}
			if( jQueryPlus("#cpoaerm740").text().indexOf("opts.appearance.end.rateMessage") != -1 ) {
					jQueryPlus("#cpoaerm740").text( chatClient.parseVariables(opts.appearance.end.rateMessage) || "いかがでしたか。よろしければ今後の改善のため、評価をお願いします。" );
			}
			if( jQueryPlus("#cpoaenm740").text().indexOf("opts.appearance.end.noRateMessage") != -1 ) {
					jQueryPlus("#cpoaenm740").text( chatClient.parseVariables(opts.appearance.end.noRateMessage) || "チャットを終了しました。ご利用ありがとうございました。" );
			}
			if( jQueryPlus("#cpoaetr741").text().indexOf("opts.appearance.end.titleRate") != -1 ) {
					jQueryPlus("#cpoaetr741").text( opts.appearance.end.titleRate || "評価" );
			}
			if( jQueryPlus("#cpoaegr742").text().indexOf("opts.appearance.end.goodRate") != -1 ) {
					var goodRateTemp = '<i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-up fa-lg"></i>';
					goodRateTemp += (typeof(opts.appearance.end.goodRate) != "undefined" && opts.appearance.end.goodRate !== null)?opts.appearance.end.goodRate:"良かった";
					jQueryPlus("#cpoaegr742").html( goodRateTemp );
			}
			if( jQueryPlus("#cpoaebr743").text().indexOf("opts.appearance.end.badRate") != -1 ) {
					var badRateTemp = '<i role="presentation" aria-hidden="true" class="cpfar fa-thumbs-down fa-lg"></i>';
					badRateTemp += (typeof(opts.appearance.end.badRate) != "undefined" && opts.appearance.end.badRate !== null)?opts.appearance.end.badRate:"良くなかった";
					jQueryPlus("#cpoaebr743").html( badRateTemp );
			}
			if( jQueryPlus("#cpoatpb744").text().indexOf("opts.appearance.end.buttonText") != -1 ) {
					jQueryPlus("#cpoatpb744").text( opts.appearance.end.buttonText || "閉じる" );
			}

			if (jQueryPlus('#chatplusview #chatplusheader .title').text().indexOf('opts.appearance.talking.title') != -1) {
				var text = opts.appearance.talking.title || 'お困りではありませんか？';
				if (self.status == 'close_chat_by_visitor' || self.status == 'close_chat_by_agent' || self.status == 'close_chat_by_mute') {
					text = opts.appearance.end.title || 'ありがとうございました';
				} else if (self.status == 'wait_chat') {
					text = callingTitle || '担当者に接続中です'
				}
				jQueryPlus('#chatplusview #chatplusheader .title').text(text);
			}

			fixTextareaPlaceholder();
		}
		var fixTextareaPlaceholder = function() {
			jQueryPlus('#chatplusview [name="message"]').each(function() {
				var $this = jQueryPlus(this);
				var v = $this.val();
				var p = $this.attr('placeholder');
				if (! v || ! p) {return;}
				v = String(v).replace(/\r?\n/g, '\n');
				p = String(p).replace(/\r?\n/g, '\n');
				if (v === p) {
					$this.val(null);
				}
			});
		};

		var chatplusintervalcount=0;
		var chatplusintervalID = setInterval(function(opts){

			if(chatplusintervalcount>=12) {
				clearInterval( chatplusintervalID );
				jQueryPlus("#chatplusview #chatplusheader .name").show();

				carouselResizeAll();
				applyYubinBango();
			}

			if ( jQueryPlus("#chatplusheader").attr("id")=="chatplusheader" ) {
				if( opts.appearance.disconnect_title && jQueryPlus("#chatplusheader .name").text() && jQueryPlus("#chatplusheader .name").text().indexOf("opts.appearance.disconnect_title") != -1 ) {
					jQueryPlus("#chatplusheader .name").text(opts.appearance.disconnect_title);
				}
				if( opts.appearance.disconnect_body && jQueryPlus("#chatpluscontent #body h2").text() && jQueryPlus("#chatpluscontent #body h2").text().indexOf("opts.appearance.disconnect_body") != -1 ) {
					jQueryPlus("#chatpluscontent #body h2").text(opts.appearance.disconnect_body);
				}

				replaceForIE();

				clearInterval( chatplusintervalID );
				jQueryPlus("#chatplusheader .name").show();

				if (((self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline) && (self.imageMapState === 'show' || self.imageMapState === 'hide')) {
					fitChat();
				}

				carouselResizeAll();
				applyYubinBango();
			}
			chatplusintervalcount++;
		}.bind(undefined, opts), 300);

		this.variableTexts = {
			startExplanation: opts.appearance.start.explanation,
			startRemark: opts.appearance.start.remark,
			disconnectBody: opts.appearance.disconnect_body,
			disconnectRemark: opts.appearance.disconnect_remark,
			endNoRateMessage: opts.appearance.end.noRateMessage,
			endRateMessage: opts.appearance.end.rateMessage,
			endQuestionMessage: opts.appearance.end.questionMessage
		};

		var carouselResizeAll = function() {
			if (self.windowStatus == 'close' || !('slickchatplus' in jQueryPlus.fn)) {return;}

			jQueryPlus('#chatplusview .carousel_title[data-max_height], #chatplusview .carousel_content[data-max_height]').each(function() {
				var $this = jQueryPlus(this);
				var height = parseInt($this.attr('data-max_height'));
				if (height <= 0) {return;}
				var lineHeight = parseFloat($this.css('line-height'));
				$this.css({'height': lineHeight * height});
			});

			jQueryPlus('#chatplusview .slider-carousel').each(function(key) {
				var $this = jQueryPlus(this);

				if ($this.attr('id')) {
					$this.slickchatplus('refresh');
				} else {
					$this.attr('id', 'slider-carousel-' + key);
					var slickOptions = {
						'centerMode': true,
						'adaptiveHeight': false,
					};
					if ($this.is('[data-variable-width]')) {
						slickOptions['variableWidth'] = true;
						slickOptions['infinite'] = false;
					}
					if ($this.is('[data-infinite]')) {
						slickOptions['infinite'] = $this.is('[data-infinite="1"]');
					}
					if ($this.is('[data-left]')) {
						slickOptions['centerMode'] = false;
					}
					$this.slickchatplus(slickOptions);
				}
			});
		};

		var knowledgeSuggestResize = function(){
			var textareaHeight = document.getElementById('textarea') ? document.getElementById('textarea').clientHeight : 0;
			if (! jQueryPlus('#chatplusview').hasClass("chatplusview-modern")) {
				var footerHeight = document.getElementById('chatplusfooter') ? document.getElementById('chatplusfooter').clientHeight : 0;
				textareaHeight += footerHeight;
			}
			jQueryPlus("#chatplusview #knowledge_suggests").css("bottom", textareaHeight+"px");
		}
		var applyYubinBango = function() {
			if (! ('YubinBangoLoaded' in chatplus) || ! ('YubinBango' in window)) {
				return;
			}

			try {
				new window.YubinBango.MicroformatDom();
			} catch (ex) {
				console.error(ex);
				try {
					window.dispatchEvent(new ErrorEvent('error', {
						'error': ex,
						'message': 'YubinBango適用失敗',
						'filename': __cp_d + '/assets/js/riot-tags/chat.tag.js',
					}));
				} catch (ex2) {}
			}
		};

		this.parseVariableTexts = function() {
			var p = chatClient.parseVariables;
			var v = self.variableTexts;
			var a = opts.appearance;
			switch (self.status) {
				case 'no_chat':
					v.startExplanation = p(a.start.explanation);
					v.startRemark = p(a.start.remark);
					break;
				case 'no_agent':
					v.disconnectBody = p(a.disconnect_body);
					v.disconnectRemark = p(a.disconnect_remark);
					break;
				case 'wait_chat':
					//waitChatイベント内に記述
					break;
				case 'in_chat':
				case 'in_chatbot':
				case 'accept_chat':
					break;
				case 'close_chat_by_visitor':
				case 'close_chat_by_agent':
				case 'close_chat_by_mute':
				case 'quit':
					v.endNoRateMessage = p(a.end.noRateMessage);
					v.endRateMessage = p(a.end.rateMessage);
					v.endQuestionMessage = p(a.end.questionMessage);
					break;
			}
		}
		this.on('update', self.parseVariableTexts);
		this.parseVariableTexts();


		showPastMessages(ev) {
			if (self.pastMessagesLoading) {return;}
			self.pastMessagesLoading = true;
			chatClient.trigger('pastMessages');
		}

		chatClient.on('showPastMessages', function(data) {
			self.pastMessagesLoading = false;

			if (data.messages) {
				if (opts.appearance.themeName == "app") {
					self.pastMessagesPosition = 0;
					jQueryPlus('#chatplusview #messages .view-content').each(function() {
						self.pastMessagesPosition += jQueryPlus(this).outerHeight();
					});
					self.scrollDummyHeight = Math.max(jQueryPlus('#chatplusview #messages').height() - self.pastMessagesPosition, 0);
				} else {
					self.pastMessagesPosition = jQueryPlus('#chatplusview #messages .view').height();
					self.scrollDummyHeight = Math.max(jQueryPlus('#chatplusview #messages').height() - jQueryPlus('#chatplusview #messages .view').outerHeight(), 0);
				}

				var messages = [];
				var pastDate = null;

				for (var i = 0; i< data.messages.length; i ++) {
					var message = data.messages[i];
					message.body = message.body.replace(/[{}]/g, function(c) {return {'{':'&#x0007b;','}':'&#x0007d;'}[c];});
					message.past = 1;
					if (message.event_type != 12) {
						var messDate = message.created_at.split(" ")[0];
						if (pastDate != messDate) {
							messages.push({date: messDate, id:message.created_at, created_at:message.created_at, body:messDate});
							pastDate = messDate;
						}

						messages.push(message);
					}
				}

				if (self.messages.length && self.messages[0].date) {
					self.messages.shift();
				}

				if (self.messages.length) {
					var message = self.messages[0];
					var messDate = message.created_at.split(" ")[0];
					if (pastDate != messDate) {
						messages.push({date: messDate, id:message.created_at, created_at:message.created_at, body:messDate});
					}
				}

				self.messages = messages.concat(self.messages.map(function(m) {m.already = true; return m;}));
				self.pastMessagesUpdated = true;
			}
			if (data.end) {
				self.pastMessages = false;
			}

			self.update();
			carouselResizeAll();
		});

		if (opts.rewind && opts.rewind.enabled && opts.rewind.options.scroll) {
			var rewind_scroll_timerid = window.setInterval(function() {
				if ('IntersectionObserver' in window) {
					var target = document.querySelector('#chatplusview #messages #past-mess-block');
					if (! target) {return;}
					window.clearInterval(rewind_scroll_timerid);

					var io = new window.IntersectionObserver(function(entries) {
						if (self.pastMessagesLoading) {return;}
						if (! self.pastMessages) {io.disconnect(); return;}

						for (var i in entries) {
							if (entries[i].isIntersecting) {
								self.pastMessagesLoading = true;
								self.update();
								chatClient.trigger('pastMessages');
								break;
							}
						}
					}, {'threshold': 1.0});
					io.observe(target);
				} else {
					if (! document.querySelector('#chatplusview #messages')) {return;}
					window.clearInterval(rewind_scroll_timerid);

					document.querySelector('#chatplusview #messages').addEventListener('scroll', chatplus._.debounce(function() {
						if (! self.pastMessages || self.pastMessagesLoading) {return;}

						var elem = jQueryPlus('#chatplusview #messages');
						if (elem.scrollTop() < 1) {
							self.pastMessagesLoading = true;
							self.update();
							elem.scrollTop(1);
							chatClient.trigger('pastMessages');
						}
					}, 500), {'passive': true});
				}
			}, 200);
		}

		var scrollIntoMessage = function(msg_id) {
			var msg = jQueryPlus('#chatplusview #messages #msg_'+msg_id)[0];
			if (! msg) {return;}
			var margin = 0;
			if (jQueryPlus('#chatplusview').hasClass('chatplusview-modern')) {margin = 20;}
			else if (! jQueryPlus('#chatplusview').hasClass('float')) {margin = jQueryPlus('#chatplusview #messages')[0].offsetTop;}
			var top = msg.offsetTop - margin;
			jQueryPlus('#chatplusview #messages').animate({'scrollTop': top}, 'fast');
		};

		var fixImageMapMessage = function() {
			if (self.windowStatus === 'close') {return;}

			var fix = function() {
				var $img = this.parents('.msg').find('img');
				var width = $img.width();
				var coords = this.attr('data-coords').split(',');
				var fixed = $img.hasClass('fixed');
				if (fixed) {
					var attr_width = parseInt($img.attr('width'), 10);
					if (width < attr_width) {
						var attr_height = parseInt($img.attr('height'), 10);
						$img.css({'height': (attr_height * width / attr_width) + 'px'});
						coords = coords.map(function(e) {
							return Math.round(parseInt(e, 10) * width / attr_width);
						});
					} else {
						$img.css({'height': ''});
						coords = coords.map(function(e) {
							return parseInt(e, 10);
						});
					}
				} else {
					coords = coords.map(function(e) {
						return Math.round(parseInt(e, 10) / 1040 * width);
					});
				}
				this.attr({
					'coords': coords.join(','),
				});
			};

			jQueryPlus('#chatplusview .msg.imageMap area[data-coords]').each(function(i, area) {
				var $area = jQueryPlus(area);
				var $img = $area.parents('.msg').find('img');
				if ($img.prop('complete')) {
					fix.call($area);
				} else {
					$img.one('load', fix.bind($area));
				}
			});
		};

		var fixImageMapEyecatcher = function() {
			var fix = function() {
				var $img = this.parents('.eyecatcher-imagemap').find('img[usemap]');
				var base_w = parseInt($img.attr('data-width'), 10);
				var current_w = $img.width() || 298;
				var coords = this.attr('data-coords').split(',');
				coords = coords.map(function(e) {return Math.round(parseInt(e, 10) / base_w * current_w);});
				this.attr({
					'coords': coords.join(','),
				});
			};

			jQueryPlus('#chatplusview .eyecatcher-imagemap area[data-coords]').each(function(i, area) {
				var $area = jQueryPlus(area);
				var $img = $area.parents('.eyecatcher-imagemap').find('img[usemap]');
				if ($img.prop('complete')) {
					fix.call($area);
				} else {
					$img.one('load', fix.bind($area));
				}
			});
		};

		var fixImageMap = function() {
			if (self.imageMapState !== 'show' || isLandscape()) {return;}
			var imagemap = (self.online || self.imageMapOffline == null) ? self.imageMapOnline : self.imageMapOffline;
			if (! imagemap || imagemap.fixed) {return;}

			var fix = function() {
				var $img = jQueryPlus('#chatplusview #userOperationImage > img');
				var base_w = imagemap.width;
				var current_w = $img.width();
				var dataCoords = this.attr('data-coords').split(',');
				var coords = dataCoords.map(function(e) {return Math.round(parseInt(e, 10) / base_w * current_w);});
				this.attr({
					'coords': coords.join(','),
				});
			};

			jQueryPlus('#chatplusview map[name="JpChatPlusImageMap"] area[data-coords]').each(function(i, area) {
				var $area = jQueryPlus(area);
				var $img = jQueryPlus('#chatplusview #userOperationImage > img');
				if ($img.prop('complete')) {
					fix.call($area);
				} else {
					$img.one('load', fix.bind($area));
				}
			});
		};


		var tesseract_recognize = function(img, scanchar) {
			ChatplusScriptMedia.tesseractRecognize(img, function(result) {
				result_number = result.data.text.replace(/[^0-9]/g, '');
				var $input = jQueryPlus('#ocr_scan .ocr_scan_input input[name="scan_number"]');
				if (result_number.length > scanchar){
					// 桁数を超えていて、初めが1の場合は削る
					if(result_number.indexOf('1') == 0){
						result_number = result_number.slice(1);
					}
					// まだ桁数を超えていて、末尾が1の場合は削る
					if(result_number.length > scanchar && result_number.lastIndexOf( '1' ) == result_number.length - 1){
						result_number = result_number.slice(0, -1);
					}
				}

				if (result_number.length == scanchar){
					$input.val(result_number);
					self.reScanOcrVisible = true;
					self.update();
				} else if(result_number.length >= 1) {
					$input.val(result_number);
					self.ocrScanRecognize = true;
				} else {
					self.ocrScanRecognize = true;
				}
			});
		};

		var stopStreamedVideo = function() {
			var stream = document.getElementById('scan_video').srcObject;
			var tracks = stream.getTracks();

			tracks.forEach(function(track) {
				track.stop();
			});

			document.getElementById('scan_video').srcObject = null;
		};

		fixScan() {
			self.ocrScanVisible = false;
			window.clearInterval(self.ocrScanInterval);
			var number = jQueryPlus('#ocr_scan .ocr_scan_input input[name="scan_number"]').val();
			jQueryPlus('#chatplusview .msg.textform .ocrform input[data-serial-number="'+self.activeScanForm+'"]').val(number);
			self.update();
			jQueryPlus("#chatplusview #chattext").show();
			stopStreamedVideo();
		}

		closeScanWindow() {
			self.ocrScanVisible = false;
			window.clearInterval(self.ocrScanInterval);
			self.update();
			jQueryPlus("#chatplusview #chattext").show();
			stopStreamedVideo();
		}

		reScanOcr() {
			jQueryPlus('#ocr_scan .ocr_scan_input input[name="scan_number"]').val("");
			self.ocrScanRecognize = true;
			self.reScanOcrVisible = false;
			self.update();
		}

		resizeScanWindow(e) {
			var type = jQueryPlus(e.target).attr('data-type');
			switch (type) {
				case 'x-expand': {
					if(self.ocrScanBoxX > 20){
						self.ocrScanBoxX -= 10;
						try {window.localStorage.setItem('ocr_scan_box_x', self.ocrScanBoxX);} catch (e) {}
					}
					break;
				}
				case 'x-compress': {
					if(self.ocrScanBoxX < 300){
						self.ocrScanBoxX += 10;
						try {window.localStorage.setItem('ocr_scan_box_x', self.ocrScanBoxX);} catch (e) {}
					}
					break;
				}
				case 'y-expand': {
					if(self.ocrScanBoxH < 400){
						self.ocrScanBoxH += 10;
						try {window.localStorage.setItem('ocr_scan_box_h', self.ocrScanBoxH);} catch (e) {}
					}
					break;
				}
				case 'y-compress': {
					if(self.ocrScanBoxH > 20){
						self.ocrScanBoxH -= 10;
						try {window.localStorage.setItem('ocr_scan_box_h', self.ocrScanBoxH);} catch (e) {}
					}
					break;
				}
			}
		}

		var suggest_hit_highlight = function() {
			if(opts.appearance.talking.suggestSource === 'suggestknowledge' && self.knowledge_suggests){
				chatplus._.each(self.knowledge_suggests, function(content, i) {
					jQueryPlus('.knowledge_suggest_label_' + i).html(content['label_hit']);
				});
			}
		}

		showPrompt() {
			self.promptShown = true;
			try {window.localStorage.setItem('promptShown', window.chatplusData.chat_id + '|' + 1);} catch (e) {}
			setTimeout(updateMessageArea, 100);
		}
		hidePrompt() {
			self.promptShown = false;
			try {window.localStorage.setItem('promptShown', window.chatplusData.chat_id + '|' + 0);} catch (e) {}
			setTimeout(updateMessageArea, 100);
		}
		chatClient.on('promptState', function(mode) {
			switch (mode) {
				case 'hide': {
					self.hidePrompt();
					break;
				}
				case 'show': {
					self.showPrompt();
					break;
				}
				case 'toggle':
				default: {
					if (self.checkPromptShown()) {
						self.hidePrompt();
					} else {
						self.showPrompt();
					}
				}
			}
			self.update();
		});

		checkPromptShown() {
			if (self.promptShown !== null) {
				return self.promptShown;
			} else {
				if (opts.appearance.talking.hidePrompt) {
					return false;
				} else if (opts.appearance.talking.hidePromptWhenChatbot && (self.status == 'in_chatbot' || self.status == 'wait_chat' && self.inChatWaiting)) {
					return false;
				} else if (opts.appearance.talking.hidePromptWhenOffline && ! self.online && (self.status != 'in_chat' && self.status != 'suspend_chat')) {
					return false;
				} else {
					return true;
				}
			}
		}

		quoteEventToggle(ev) {
			var $msg = jQueryPlus(ev.target).parents('.msg');
			if (! $msg) {
				return;
			}
			var attr_id = $msg.attr('id');
			if (! /^msg_(\d+)$/.test(attr_id)) {
				console.warn(attr_id, ev);
				return;
			}
			var id = Number(/^msg_(\d+)$/.exec(attr_id)[1]);
			if (self.quoteTarget.id == id) {
				self.quoteTarget.id = null;
				self.quoteTarget.text = null;
				self.quoteTarget.time = null;
			} else {
				var text = $msg.find('.text > nlbr').attr('content') || $msg.find('.text cp-quote').attr('text') || $msg.find('.text a').text();
				if (typeof text === 'string') {
					if (/^<clientmess>(.*)<\/clientmess>$/.test(text)){
						text = text.replace(/^<clientmess>(.*)<\/clientmess>$/, '$1');
					} else if ('dotAll' in RegExp.prototype) {
						text = text.replace(new RegExp('<.*', 's'), '…');
					} else {
						text = text.replace(/<.*/, '…');
					}
					text = text.replace(/[\r\n]/g, ' ');
				}
				self.quoteTarget.id = id;
				self.quoteTarget.text = text;
				self.quoteTarget.time = '[' + $msg.find('.time').text().trim() + ']';
			}
			if (self.refs.quoteContent) {self.refs.quoteContent.update();}
		}
		quoteEventCancel(ev) {
			self.quoteTarget = {'id': null, 'text': null, 'time': null};
		}

		this.on('updated', function() {
			if (self.pastMessagesUpdated) {
				if (opts.appearance.themeName == "app") {
					var viewHeight = 0;
					jQueryPlus('#chatplusview #messages .view-content').each(function() {
						viewHeight += jQueryPlus(this).outerHeight();
					});
					if (self.scrollDummyHeight > 0) {
						jQueryPlus('#chatplusview #messages').scrollTop(2000000);
					} else {
						jQueryPlus('#chatplusview #messages').scrollTop(viewHeight - self.pastMessagesPosition);
					}
				} else {
					jQueryPlus('#chatplusview #messages').scrollTop(jQueryPlus('#chatplusview #messages .view').height() - self.pastMessagesPosition);
				}
				self.pastMessagesUpdated = false;
			}
			if (self.applyYubinbangoRequired) {
				self.applyYubinbangoRequired = false;
				applyYubinBango();
			}
		});
	</script>
</chat>

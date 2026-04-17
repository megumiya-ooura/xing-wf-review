var revico= (revico || {});
(function(revico){
var $ = null;
var _revico;
(function (_revico) {
    var MultiCommentApi = (function () {
        function MultiCommentApi() {
        }
        MultiCommentApi.prototype.getComments = function (param) {
            var def = $.Deferred();
            _revico.util.api.get(_revico.config.comment.apiUrlComment, param)
                .done(function (res) {
                def.resolve(res);
            }).fail(function (e) {
                def.reject(e);
            });
            return def.promise();
        };
        MultiCommentApi.prototype.getFilterData = function (productCds, noCommentFilter, tenantId, reviewerType, filterProductAttrGroup, evaluationItemFilterShowCondition) {
            var def = $.Deferred();
            var param = {};
            if (noCommentFilter === "true") {
                def.resolve({});
                return def.promise();
            }
            param.tenantId = tenantId;
            param.reviewerType = reviewerType;
            param.productAttrGroups = filterProductAttrGroup;
            param.evaluationItemFilterShowCondition = evaluationItemFilterShowCondition;
            if (Array.isArray(productCds) && productCds.length > 1) {
                param.productCd = null;
                param.evaluationItemFilterShowCondition = "inAllCase";
            }
            else {
                param.productCd = productCds && productCds.length === 1 ? productCds[0] : null;
            }
            _revico.util.api.get(_revico.config.comment.apiUrlFilter, param)
                .then(function (res) {
                def.resolve(res);
            })
                .fail(function (e) {
                def.reject(e);
            });
            return def.promise();
        };
        MultiCommentApi.prototype.getProductData = function (tenantId, productCd) {
            var def = $.Deferred();
            var param = { tenantId: tenantId, productCd: productCd };
            _revico.util.api.getProductDetail(param)
                .done(function (res) {
                def.resolve(res);
            }).fail(function (error) {
                def.reject(error);
            });
            return def.promise();
        };
        MultiCommentApi.prototype.getProductsData = function (productCds, tenantId) {
            var def = $.Deferred();
            var promises = [];
            if (!productCds || productCds.length === 0) {
                def.resolve([]);
                return def.promise();
            }
            for (var _i = 0, productCds_1 = productCds; _i < productCds_1.length; _i++) {
                var productCd = productCds_1[_i];
                promises.push(this.getProductData(tenantId, productCd));
            }
            $.when.apply($, promises)
                .done(function () {
                var results = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    results[_i] = arguments[_i];
                }
                def.resolve(results);
            })
                .fail(function (e) {
                def.reject(e);
            });
            return def.promise();
        };
        MultiCommentApi.prototype.getTagData = function (tenantId, reviewerType, productCds) {
            var def = $.Deferred();
            var productCd = "";
            if (Array.isArray(productCds) && productCds.length > 0) {
                productCd = productCds[0];
            }
            else {
                productCd = "";
            }
            var param = {
                tenantId: tenantId,
                reviewerType: reviewerType,
                productCd: productCd
            };
            _revico.util.api.get(_revico.config.comment.apiUrlTag, param)
                .done(function (res) {
                def.resolve(res);
            }).fail(function (e) {
                def.reject(e);
            });
            return def.promise();
        };
        return MultiCommentApi;
    }());
    _revico.MultiCommentApi = MultiCommentApi;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var MultiCommentEvent = (function () {
        function MultiCommentEvent(owner) {
            var _this = this;
            this.addPageFunc = function ($comment, state, api, renderer, currentDom) {
                return function () {
                    var $moreBtn = currentDom.find('.revico-comment-footer--more button');
                    $moreBtn.prop('disabled', true);
                    state.incrementPageIndex();
                    var gaAction = 'MoreView';
                    var gaCategory = 'MoreView';
                    _revico.util.ga.send(gaAction, gaCategory, "Page=".concat(state.pageIndex()));
                    _revico.util.loading.showLoading($comment);
                    state.prepareCommentRequestParam(state.commentRequest);
                    api.getComments(state.commentRequest)
                        .then(function (res) {
                        _revico.util.loading.remove($comment, function () {
                            $(':focus').blur();
                            _this.refreshComments(res, state, renderer, currentDom);
                            $moreBtn.prop('disabled', false);
                        });
                    });
                };
            };
            this._owner = owner;
        }
        MultiCommentEvent.prototype.bindAllEvents = function (currentDom, state, api, renderer) {
            this.bindHeaderPartsEvent(currentDom, state, api, renderer);
            this.bindFooterPartsEvent(currentDom, state, api, renderer);
            this.bindWriteButtonEvent(currentDom, state);
            this.bindCommentEvent(currentDom, state);
        };
        MultiCommentEvent.prototype.bindHeaderPartsEvent = function (currentDom, state, api, renderer) {
            var _this = this;
            var filter = state.commentFilterResponse().data;
            var tagFilter = state.tagCloudResponse().data;
            var $commentMain = currentDom.find('.revico-comment-main');
            var $header = $commentMain.find('.revico-comment-header');
            var $tagcloud = $commentMain.find('.revico-comment-tagcloud');
            this.bindSortDropdown($header.find('.revico-comment-sort'), $header.find('.revico-comment-sort-select'), 'click.revico.sort', '.revico-comment-sort-select');
            this.bindSortSelectItems($header.find('.revico-comment-sort-select li'), currentDom, $commentMain, state, api, renderer);
            $header.find('.revico-comment-filter').on('click', function () {
                var modal = renderer.makeFilterModalContents(filter, tagFilter, state);
                _this.bindEventModalContents(modal, state, api, renderer, currentDom);
                _revico.Modal.getInstance().addInnerClass('revico-comment-header-modal-filter_inner').showModal(modal);
            });
            $tagcloud.find('.revico-comment-tagcloud-tagitem').on('click', function (event) {
                var $main = currentDom.find('.revico-comment-main');
                var $rows = $main.find(".revico-review-comment-row-wrapper");
                var selectTag = $(event.currentTarget).data('tag-word');
                state.commentRequest.tagWord = selectTag;
                state.resetForSearch();
                _revico.util.loading.showLoading($header);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($main, function () {
                        $rows.remove();
                        currentDom.find(".revico-review-comment-row").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                $tagcloud.find('.revico-comment-tagcloud-tagitem').show();
                $(event.currentTarget).hide();
                $tagcloud.find('.revico-comment-tagcloud-description span').empty().append(selectTag).show();
            });
            $tagcloud.find('.revico-comment-tagcloud-description span').on('click', function (event) {
                var $main = currentDom.find('.revico-comment-main');
                var $rows = $main.find(".revico-review-comment-row-wrapper");
                state.commentRequest.tagWord = null;
                state.resetForSearch();
                _revico.util.loading.showLoading($header);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($main, function () {
                        $rows.remove();
                        currentDom.find(".revico-review-comment-row").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                $tagcloud.find('.revico-comment-tagcloud-tagitem').show();
                $tagcloud.find('.revico-comment-tagcloud-description span').empty().hide();
            });
        };
        MultiCommentEvent.prototype.bindFooterPartsEvent = function (currentDom, state, api, renderer) {
            var _this = this;
            var cnt = state.commentResponse().data.reviewCnt;
            var filter = state.commentFilterResponse().data;
            var tagFilter = state.tagCloudResponse().data;
            var $comment = currentDom.find(".revico-comment-main");
            var $footerWrapper = currentDom.find('.revico-comment-footer');
            if (cnt === 0 && (!filter || Object.keys(filter).length === 0)) {
                $comment.append($footerWrapper);
                return;
            }
            var $buttons = currentDom.find('.revico-comment-footer--paging-buttons');
            this.bindSortDropdown($buttons.find('.revico-comment-footer--sort'), $buttons.find('.revico-comment-footer--sort-select'), 'click.revico.sort', '.revico-comment-footer--sort-select');
            this.bindSortSelectItems($buttons.find('.revico-comment-footer--sort-select li'), currentDom, $comment, state, api, renderer);
            $buttons.find('.revico-comment-footer--filter').on('click', function () {
                var modal = renderer.makeFilterModalContents(filter, tagFilter, state);
                _this.bindEventModalContents(modal, state, api, renderer, currentDom);
                _revico.Modal.getInstance().addInnerClass('revico-comment-header-modal-filter_inner').showModal(modal);
            });
            var $more = currentDom.find('.revico-comment-footer--more');
            $more.on('click', this.addPageFunc($comment, state, api, renderer, currentDom));
            _revico.tracking.click.bind($more, state.apiTokenValue(), state.apiTokenName(), state.tenantId, null, _revico.util.cookie.getVisitorCookie(), _revico.config.click.more);
        };
        MultiCommentEvent.prototype.bindCommentEvent = function (currentDom, state) {
            var _this = this;
            state.calcPageCount();
            var startCnt = 0;
            if (state.pageIndex() > 0) {
                startCnt = (state.moreCnt * (state.pageIndex() - 1)) + state.initialCnt;
            }
            else {
                startCnt = 0;
            }
            var _loop_1 = function (i) {
                var $html = currentDom.find('.revico-review-comment-row-wrapper').eq(i + startCnt);
                var data = state.commentResponse().data.reviewDetailDtoList[i];
                var staffRecommendItems = $html.find('.revico-review-comment-detail--staff-recommend--item');
                $.each(staffRecommendItems, function (i, e) {
                    _this.addEventStaffRecommendProductInfo($(e).find('a'), $(e).data('nickname'), $(e).data('productcd'), $(e).data('review-productcd'), data.reviewId, data.staffId, $(e).data('variationgroup'), state);
                });
                this_1.addEventHelpful($html.find('.revico-review-comment-detail--action-helpful-click'), data.reviewId, state);
                this_1.addEventLike($html.find('.revico-review-comment-detail--action-like-click'), data.reviewId, state);
                _revico.tracking.click.bind($html.find('.revico-picture-slide-item img.revico-review-image'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.image);
                _revico.tracking.click.bind($html.find('.revico-picture-slide-item img.revico-review-movie-thumbnail'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.movie);
                _revico.tracking.click.bind($html.find('.revico-review-comment-detail--action-helpful-click'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.helpful);
                _revico.tracking.click.bind($html.find('.revico-review-comment-detail--action-sns--twitter'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.twitter);
                _revico.tracking.click.bind($html.find('.revico-review-comment-detail--action-sns--facebook'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.facebook);
                _revico.tracking.click.bind($html.find('.revico-review-comment-detail--action-sns--line'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.line);
                _revico.tracking.click.bind($html.find('.revico-review-comment-detail--product-name a'), state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.product);
                if (data.staffKind === 'スタッフ' || data.staffKind === 'オーサー') {
                    $html.find('.revico-review-comment-detail--product > a').off('click').on('click', function () {
                        var gaAction = 'StaffReviewProduct_Click';
                        var gaCategory = 'staff_' + data.reviewerName;
                        _revico.util.ga.send(gaAction, gaCategory, data.productCd);
                        _revico.ConversionLog.getInstance().sendStaffReviewConversionLog(state.tenantId, data.variationGroup, data.reviewId, data.staffId, "ClickStaffReviewProduct", state.apiTokenValue(), state.apiTokenName());
                    });
                }
                this_1.bindImageSlideEvents($html, '.revico-picture-slide-box', '.revico-picture-slide-next', '.revico-picture-slide-back');
                this_1.bindImageSlideEvents($html, '.revico-picture-slide-box--previous', '.revico-picture-slide-next--previous', '.revico-picture-slide-back--previous');
                var comment = _revico.util.string.replaceNewLine(_revico.util.string.htmlEscape(data.reviewComment));
                var _self = this_1;
                var charParLine = _revico.util.device.isPc() ? 70 : 25;
                var moreLine = 6;
                var lines = comment.split('<br>');
                var lineCount = lines.length;
                for (var i_1 = 0; i_1 < lines.length; i_1++) {
                    lineCount += Math.floor(lines[i_1].length / charParLine);
                }
                if (lineCount < moreLine) {
                    $html.find(".revico-review-comment-detail--comment .revico-review-comment-detail--comment--more").hide();
                }
                else {
                    $html.find(".revico-review-comment-detail--comment .revico-review-comment-detail--comment--more span").click(function () {
                        var totalHeight = 0;
                        var $el = $(this);
                        var $div = $el.parent();
                        var $up = $div.parent();
                        var $ps = $up.find(".revico-review-comment-detail--comment--content");
                        $ps.each(function () {
                            totalHeight += $(this).outerHeight();
                        });
                        $up.css({
                            "height": $up.height(),
                            "max-height": 9999
                        })
                            .animate({
                            "height": totalHeight
                        });
                        $div.fadeOut();
                        _revico.tracking.click.sendData(state.apiTokenValue(), state.apiTokenName(), state.tenantId, data.reviewId, _revico.util.cookie.getVisitorCookie(), _revico.config.click.comment_more);
                        if (data.staffKind === 'スタッフ' || data.staffKind === 'オーサー') {
                            _revico.ConversionLog.getInstance().sendStaffReviewConversionLog(state.tenantId, data.variationGroup, data.reviewId, data.staffId, "ClickMoreStaffReview", state.apiTokenValue(), state.apiTokenName());
                        }
                        return false;
                    });
                }
                if (data.reviewReply != null && data.reviewReply.reviewReplyBody != null && state.displayReviewReplyMoreButton) {
                    var replyBody = _revico.util.string.replaceNewLine(_revico.util.string.htmlEscape(data.reviewReply.reviewReplyBody));
                    var replyCharParLine = _revico.util.device.isPc() ? 65 : 20;
                    var replyLines = replyBody.split('<br>');
                    var replyLineCount = replyBody.split('<br>').length;
                    for (var i_2 = 0; i_2 < replyLines.length; i_2++) {
                        replyLineCount += Math.floor(replyLines[i_2].length / replyCharParLine);
                    }
                    if (replyLineCount <= moreLine) {
                        $html.find('.revico-review-comment-detail--reply-comment--more').hide();
                    }
                    else {
                        $html.find('.revico-review-comment-detail--reply-comment--more span').on('click', function () {
                            var $content = $html.find('.revico-review-comment-detail--reply-comment--content');
                            var $more = $html.find('.revico-review-comment-detail--reply-comment--more');
                            var totalHeight = $content[0].scrollHeight;
                            $content.css('max-height', totalHeight + 'px');
                            $more.fadeOut();
                            return false;
                        });
                    }
                }
                else {
                    $html.find('.revico-review-comment-detail--reply-comment--content').css('max-height', 'none');
                    $html.find('.revico-review-comment-detail--reply-comment--more').hide();
                }
            };
            var this_1 = this;
            for (var i = 0; i < state.commentResponse().data.reviewDetailDtoList.length; i++) {
                _loop_1(i);
            }
            var conversionLogVariationGroup = null;
            var isSendProductCdConversionLog = state.commentRequest.productCd != null && state.commentRequest.productCd.length === 1
                && state.productDetailResponseList()[0].data != null;
            if (isSendProductCdConversionLog) {
                conversionLogVariationGroup = state.productDetailResponseList()[0].data.variationGroup;
                _revico.ConversionLog.getInstance().putConversionLogAccess(state.tenantId, conversionLogVariationGroup, state.apiTokenValue(), state.apiTokenName());
            }
            if (state.commentResponse().data.reviewDetailDtoList.length > 0) {
                var typeName = void 0;
                var productCd = void 0;
                if (state.commentRequest.productCd && state.commentRequest.productCd.length === 1) {
                    typeName = state.commentRequest.productCd[0];
                    productCd = state.commentRequest.productCd[0];
                }
                else {
                    typeName = _revico.config.comment.viewAllCommentReview;
                    productCd = null;
                }
                var isStaffReview = state.reviewerType === "1" ? true : false;
                _revico.ReviewAreaPvSend.getInstance().putAccessTracking(productCd, isStaffReview);
                _revico.ReviewAreaPvSend.getInstance().putReviewAreaViewTracking(currentDom.find(".revico-comment-main"), state.tenantId, state.apiTokenValue(), state.apiTokenName(), typeName, productCd, isStaffReview);
                if (isSendProductCdConversionLog) {
                    _revico.ConversionLog.getInstance().putConversionLogShowReview(currentDom.find(".revico-comment-main"), state.tenantId, conversionLogVariationGroup, state.apiTokenValue(), state.apiTokenName());
                }
            }
        };
        MultiCommentEvent.prototype.bindImageSlideEvents = function ($container, slideBoxSelector, nextButtonSelector, backButtonSelector) {
            var $box = $container.find(slideBoxSelector);
            if ($box.length === 0)
                return;
            var $images = $box.find('.revico-picture-slide-img-wrapper');
            $container.find(nextButtonSelector).on('click', function () {
                if ($box.scrollLeft() >= $images.width() * $images.length)
                    return;
                $box.animate({ scrollLeft: $box.scrollLeft() + $images.width() });
            });
            $container.find(backButtonSelector).on('click', function () {
                if ($box.scrollLeft() < 1)
                    return;
                $box.animate({ scrollLeft: $box.scrollLeft() - $images.width() });
            });
        };
        MultiCommentEvent.prototype.bindEventModalContents = function (modal, state, api, renderer, currentDom) {
            var _this = this;
            var $contents = modal;
            var $main = currentDom.find(".revico-comment-main");
            var $rows = $main.find(".revico-review-comment-row-wrapper");
            var $header = $main.find(".revico-comment-header");
            var $tagcloud = $main.find('.revico-comment-tagcloud');
            if (state.filterDisplayType === _revico.config.multicomment.filterTypeNameAccordion) {
                var $filterItemList = $contents.find(".revico-comment-filter--block-item-select-wrapper");
                for (var i = 0; i < $filterItemList.length; i++) {
                    var $filterItem = $($filterItemList[i]);
                    var checkedCount = $filterItem.find("input:checked").length;
                    if (checkedCount === 0) {
                        $filterItem.hide();
                    }
                    else {
                        $filterItem.prev(".revico-comment-filter--block-item-title").addClass("revico-comment-filter--accordion-open");
                    }
                }
                $contents.find(".revico-comment-filter--block-item-title").on("click", function () {
                    $(this).next(".revico-comment-filter--block-item-select-wrapper").slideToggle();
                    $(this).toggleClass("revico-comment-filter--accordion-open");
                });
            }
            $contents.find('.revico-comment-filter--most a').off('click').on("click", function (e) {
                state.commentRequest.isGood = ($(e.currentTarget).data("most") === "good");
                state.commentRequest.filterType = $contents.find('input[name="variation"]').filter(":checked").val();
                state.resetForSearch();
                _revico.util.loading.showLoading($main);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($main, function () {
                        $rows.remove();
                        currentDom.find(".revico-review-comment-row").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                _revico.Modal.getInstance().closeModal();
                var point = state.commentRequest.isGood ? _revico.config.click.best_helpful : _revico.config.click.worst_helpful;
                _revico.tracking.click.sendData(state.apiTokenValue(), state.apiTokenName(), state.tenantId, null, _revico.util.cookie.getVisitorCookie(), point);
            });
            $contents.find('.revico-comment-filter--block-button button').off('click').on('click', function () {
                state.commentRequest.filterType = $contents.find('input[name="variation"]').filter(":checked").val();
                state.commentRequest.star = [];
                var $starArea = $contents.find('[name="revico-comment-filter--block-item-star"]');
                var checkedStar = $starArea.find("input[type='checkbox']").filter(":checked").map(function () {
                    return $(this).val();
                }).get();
                checkedStar.forEach(function (value, index, array) {
                    var starValue = String(value);
                    state.commentRequest.star.push(starValue);
                });
                var rAttr = {};
                var $revAttrArea = $contents.find('[name="revico-comment-filter--block-item-revattr"]');
                $revAttrArea.each(function (i, e) {
                    var $e = $(e);
                    rAttr[$e.data("revattrid")] = $e.find("input[type='checkbox']").filter(":checked").map(function () {
                        return $(this).val();
                    }).get();
                });
                state.commentRequest.reviewerAttr = JSON.stringify(rAttr);
                var eva = {};
                var $evaArea = $contents.find('[name="revico-comment-filter--block-item-evaitem"]');
                $evaArea.each(function (i, e) {
                    var $e = $(e);
                    eva[$e.data("eiid")] = $e.find("input[type='checkbox']").filter(":checked").map(function () {
                        return $(this).val();
                    }).get();
                });
                state.commentRequest.evaluationItem = JSON.stringify(eva);
                if (!state.productPropAttr) {
                    var $proAttrArea = $contents.find('[name="revico-comment-filter--block-item-prodattr"]');
                    var checkedProdAttr = $proAttrArea.find("input[type='checkbox']").filter(":checked").map(function () {
                        return $(this).val();
                    }).get();
                    state.commentRequest.productAttr = [];
                    checkedProdAttr.forEach(function (value, index, array) {
                        var prodAttrValue = String(value);
                        state.commentRequest.productAttr.push(prodAttrValue);
                    });
                }
                var $tagArea = $contents.find('[name="revico-comment-filter--block-item-tag"]');
                var checkedTag = $tagArea.find("input[type='radio']").filter(":checked").val();
                state.commentRequest.tagWord = checkedTag;
                if (checkedTag) {
                    $tagcloud.find('.revico-comment-tagcloud-tagitem').show();
                    $tagcloud.find('.revico-comment-tagcloud-description span').empty().append(checkedTag).show();
                    $tagcloud.find("li[data-tag-word = \"".concat(checkedTag, "\"]")).hide();
                }
                var staffAttr = {};
                var $staffAttrArea = $contents.find('[name="revico-comment-filter--block-item-staffreview"]');
                $staffAttrArea.each(function (i, e) {
                    var $e = $(e);
                    staffAttr[$e.data("attrid")] = $e.find("input[type='checkbox']").filter(":checked").map(function () {
                        return $(this).val();
                    }).get();
                });
                state.commentRequest.staffReviewAttr = JSON.stringify(staffAttr);
                state.resetForSearch();
                _revico.util.loading.showLoading($header);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($header, function () {
                        $rows.remove();
                        currentDom.find(".revico-review-comment-row").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                _revico.Modal.getInstance().closeModal();
                _revico.tracking.click.sendData(state.apiTokenValue(), state.apiTokenName(), state.tenantId, null, _revico.util.cookie.getVisitorCookie(), _revico.config.click.search);
            });
            $contents.find('.revico-comment-filter--block-clear-button button').on("click", function () {
                state.clearFilters();
                state.resetForSearch();
                _revico.util.loading.showLoading($header);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($header, function () {
                        $rows.remove();
                        currentDom.find(".revico-review-comment-row").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                $tagcloud.find('.revico-comment-tagcloud-description span').empty().hide();
                $tagcloud.find('.revico-comment-tagcloud-tagitem').show();
                _revico.Modal.getInstance().closeModal();
            });
        };
        MultiCommentEvent.prototype.bindWriteButtonEvent = function (currentDom, state) {
            var $writeButton = currentDom.find('.revico-comment-footer--writebutton');
            var tenantMemberCd = $("#".concat(state.tenantMemberCdHiddenId)).val();
            var productCd = "";
            if (state.commentRequest.productCd != null && state.commentRequest.productCd.length === 1) {
                productCd = state.commentRequest.productCd[0];
            }
            var reviewUrl = "".concat(_revico.config.comment.reviewUrl, "?tenantId=").concat(state.tenantId, "&productCd=").concat(productCd, "&publishCookieId=").concat(_revico.util.cookie.get(_revico.config.common.visitorCookieName), "&reviewFrom=goodsdetail");
            if (tenantMemberCd && tenantMemberCd.trim().length > 0) {
                reviewUrl = reviewUrl + "&tenantMemberCd=".concat(tenantMemberCd);
            }
            $writeButton.off('click').on('click', function () {
                _revico.tracking.click.bind($writeButton, state.apiTokenValue(), state.apiTokenName(), state.tenantId, null, _revico.util.cookie.getVisitorCookie(), _revico.config.click.write_review);
                window.open(reviewUrl);
            });
        };
        MultiCommentEvent.prototype.addEventStaffRecommendProductInfo = function ($target, staffNickName, targetProductCd, reviewProductCd, reviewId, staffId, variationGroup, state) {
            $target.on('click', function (e) {
                var windowName = Math.floor(Math.random() * 10000).toString();
                window.open("", windowName);
                e.preventDefault();
                var gaAction = 'StaffRecommend_Click';
                var gaCategory = "staff_".concat(staffNickName);
                var label = "".concat(reviewProductCd, "->").concat(targetProductCd);
                _revico.util.ga.send(gaAction, gaCategory, label);
                _revico.ConversionLog.getInstance().sendStaffReviewConversionLog(state.tenantId, variationGroup, reviewId, staffId, "ClickStaffRecommendProduct", state.apiTokenValue(), state.apiTokenName());
                window.open($target.prop('href'), windowName);
            });
        };
        MultiCommentEvent.prototype.addEventHelpful = function ($target, reviewId, state) {
            $target.on('click.helpful', function () {
                var param = {};
                param.tenantId = state.tenantId;
                param.reviewId = reviewId;
                param.publishCookieId = _revico.util.cookie.get(_revico.config.common.visitorCookieName);
                param[state.apiTokenName()] = state.apiTokenValue();
                _revico.util.api.post(_revico.config.common.apiUrlAddHelpful, param);
                $target.fadeOut(null, function () {
                    $target.parent().find('p').fadeIn();
                });
            });
        };
        MultiCommentEvent.prototype.addEventLike = function ($target, reviewId, state) {
            $target.on('click.like', function () {
                var param = {};
                param.tenantId = state.tenantId;
                param.reviewId = reviewId;
                param.publishCookieId = _revico.util.cookie.get(_revico.config.common.visitorCookieName);
                param[state.apiTokenName()] = state.apiTokenValue();
                _revico.util.api.post(_revico.config.common.apiUrlAddLike, param);
                $target.fadeOut(null, function () {
                    $target.parent().find('p').fadeIn();
                });
            });
        };
        MultiCommentEvent.prototype.refreshComments = function (res, state, renderer, currentDom) {
            var _this = this;
            state.setCommentResponse(res);
            renderer.generateCommentHtml(currentDom, state, function (slideBoxSelector, $element) { return _this._owner.imgClick(slideBoxSelector, $element); });
            this.bindCommentEvent(currentDom, state);
            this.updateMoreButtonVisibility(res.data.reviewCnt, state, currentDom);
        };
        MultiCommentEvent.prototype.updateMoreButtonVisibility = function (cnt, state, currentDom) {
            var $moreBtn = currentDom.find(".revico-comment-footer--more");
            if (state.shouldShowMoreButton(cnt)) {
                $moreBtn.show();
            }
            else {
                $moreBtn.hide();
            }
        };
        MultiCommentEvent.prototype.bindSortDropdown = function ($trigger, $select, eventNamespace, outsideClickExcludeSelector) {
            $trigger.on('click', function (e) {
                if ($select.is(':visible')) {
                    $select.hide();
                    return;
                }
                var selected = $(this).find('span').text().replace('表示：', '');
                $select.find('li').each(function (i, el) {
                    var $el = $(el);
                    if ($el.text() === selected) {
                        $el.addClass('active');
                    }
                    else {
                        $el.removeClass('active');
                    }
                });
                $select.show();
                e.stopPropagation();
                $(document).off(eventNamespace).on(eventNamespace, function (event) {
                    if (!$(event.target).closest(outsideClickExcludeSelector).length) {
                        $select.hide();
                        $(document).off(eventNamespace);
                    }
                });
            });
        };
        MultiCommentEvent.prototype.bindSortSelectItems = function ($items, currentDom, $loadingTarget, state, api, renderer) {
            var _this = this;
            $items.on('click', function (e) {
                var $this = $(e.currentTarget);
                currentDom.find('.revico-comment-sort span, .revico-comment-footer--sort span').text('表示：' + $this.text());
                $this.parent().hide();
                state.commentRequest.sort = $this.data('sort');
                state.resetForSearch();
                _revico.util.loading.showLoading($loadingTarget);
                state.prepareCommentRequestParam(state.commentRequest);
                api.getComments(state.commentRequest)
                    .then(function (res) {
                    _revico.util.loading.remove($loadingTarget, function () {
                        $loadingTarget.find(".revico-review-comment-row-wrapper").remove();
                        _this.refreshComments(res, state, renderer, currentDom);
                    });
                });
                var point = "";
                switch ($this.data('sort')) {
                    case "date":
                        point = _revico.config.click.sort_date;
                        break;
                    case "helpful":
                        point = _revico.config.click.sort_helpful;
                        break;
                    case "like":
                        point = _revico.config.click.sort_like;
                        break;
                    case "rate":
                        point = _revico.config.click.sort_rate;
                        break;
                }
                _revico.tracking.click.sendData(state.apiTokenValue(), state.apiTokenName(), state.tenantId, null, _revico.util.cookie.getVisitorCookie(), point);
            });
        };
        return MultiCommentEvent;
    }());
    _revico.MultiCommentEvent = MultiCommentEvent;
})(_revico || (_revico = {}));
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
    var Modal = (function () {
        function Modal() {
        }
        Modal.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        Modal.prototype.init = function () {
            if ($('#revico-modal-switch').length > 0)
                return;
            var modal = '';
            modal += '<input class="revico-modal-state" id="revico-modal-switch" type="checkbox" />';
            modal += '<div class="revico-modal">';
            modal += '    <label class="revico-modal__bg" for="revico-modal-switch"></label>';
            modal += '    <label class="revico-modal__close" for="revico-modal-switch">×</label>';
            modal += '        <div class="revico-modal__inner revico-picture-modal-product">';
            modal += '        </div>';
            modal += '</div>';
            if ($('#revico-modal-switch').length === 0) {
                var $modal = $(modal);
                $modal.find('.revico-modal__bg, .revico-modal__close')
                    .off('click.bgscroll').on('click.bgscroll', this.enableBgScroll);
                $('body').append($modal);
            }
        };
        Modal.prototype.load = function () {
            var _this = this;
            var def = $.Deferred();
            _revico.util.loader.loadCss([_revico.config.common.cssUrlModal], function () {
                _this.init();
                def.resolve();
            });
            return def.promise();
        };
        Modal.prototype.showModal = function (contents, isStopVideoOnClose) {
            if (isStopVideoOnClose === void 0) { isStopVideoOnClose = false; }
            var $inner = $(".revico-modal__inner");
            var $close = $('.revico-modal .revico-modal__close');
            $inner.html(contents);
            $close.css("left", $inner.offset().left + $inner.outerWidth() - $close.outerWidth());
            $("#revico-modal-switch").prop("checked", true);
            this.disableBgScroll();
            if (isStopVideoOnClose) {
                this.stopVideoOnClose();
            }
        };
        Modal.prototype.closeModal = function () {
            $("#revico-modal-switch").prop("checked", false).trigger('change');
            this.enableBgScroll();
        };
        Modal.prototype.addInnerClass = function (cls) {
            $(".revico-modal__inner").addClass(cls);
            $('#revico-modal-switch').on('change.addclass', function () {
                setTimeout(function () {
                    $(".revico-modal__inner").removeClass(cls);
                }, 250);
                $('#revico-modal-switch').off('change.addclass');
            });
            return this;
        };
        Modal.prototype.disableBgScroll = function () {
            $('body').addClass("revico-modal-overflow-hidden");
            $('.revico-modal__inner').off('touchmove.bgscroll').on('touchmove.bgscroll', function (e) {
                var scroll = this.scrollTop;
                var range = this.scrollHeight - this.offsetHeight - 1;
                if (scroll < 0) {
                    e.preventDefault();
                    this.scrollTop = 1;
                }
                else if (scroll > range) {
                    this.scrollTop = range;
                }
            });
        };
        Modal.prototype.enableBgScroll = function () {
            $(".revico-modal__inner").scrollTop(0);
            $('body').removeClass("revico-modal-overflow-hidden");
            $('.revico-modal__inner').off('touchmove.bgscroll');
        };
        Modal.prototype.stopVideoOnClose = function () {
            var $inner = $(".revico-modal__inner");
            var $close = $('.revico-modal__bg, .revico-modal__close');
            $close.off('click.stopvideo').on('click.stopvideo', function () {
                $inner.find('video').each(function (i, e) {
                    var video = e;
                    video.pause();
                });
            });
        };
        return Modal;
    }());
    _revico.Modal = Modal;
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
    var VisitorCookie = (function () {
        function VisitorCookie() {
        }
        VisitorCookie.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        VisitorCookie.prototype.generateCookieId = function (tenantId, apiTokenName, apiToken) {
            var _this = this;
            _revico.util.cookie.deleteIllegalVisitorCookie();
            _revico.util.localStrage.deleteIllegalVisitorCookie();
            var defer = $.Deferred();
            if (revico.global.flag.createdVisitorCookie) {
                defer.resolve();
                return defer.promise();
            }
            revico.global.flag.createdVisitorCookie = true;
            this.getCookieByIframe(tenantId)
                .then(function (publishCookieId) {
                if (publishCookieId) {
                    _revico.util.cookie.set(_revico.config.common.visitorCookieName, publishCookieId, _revico.config.common.visitorCookieExpiredays);
                    if (_revico.util.localStrage.storageAvailable('localStorage')) {
                        _revico.util.localStrage.set(_revico.config.common.visitorCookieName, publishCookieId);
                    }
                }
                else {
                    if (_revico.util.localStrage.storageAvailable('localStorage')) {
                        var localId = _revico.util.localStrage.get(_revico.config.common.visitorCookieName);
                        if (localId) {
                            _revico.util.cookie.set(_revico.config.common.visitorCookieName, localId, _revico.config.common.visitorCookieExpiredays);
                        }
                    }
                }
                if (!_this.hasVisitorCookie()) {
                    _this.getCookieId(tenantId).then(function (res) {
                        _revico.util.cookie.set(res.data.cookieName, res.data.publishCookieId, _revico.config.common.visitorCookieExpiredays);
                        if (_revico.util.localStrage.storageAvailable('localStorage')) {
                            _revico.util.localStrage.set(_revico.config.common.visitorCookieName, res.data.publishCookieId);
                        }
                        _this.setCookieByIframe(res.data.publishCookieId).then(function () {
                            _this.removeIframe();
                            defer.resolve();
                        });
                    });
                }
                else {
                    var cookieValue_1 = _revico.util.cookie.get(_revico.config.common.visitorCookieName);
                    _this.postCookieId(tenantId, cookieValue_1, apiTokenName, apiToken)
                        .then(function () {
                        return _this.setCookieByIframe(cookieValue_1);
                    })
                        .then(function () {
                        _this.removeIframe();
                        defer.resolve();
                    });
                }
            });
            return defer.promise();
        };
        VisitorCookie.prototype.hasVisitorCookie = function () {
            return _revico.util.cookie.check(_revico.config.common.visitorCookieName);
        };
        VisitorCookie.prototype.getCookieId = function (tenantId) {
            var defer = $.Deferred();
            _revico.util.api.get(_revico.config.common.apiUrlCookie, { tenantId: tenantId })
                .then(function (res) {
                defer.resolve(res);
            });
            return defer.promise();
        };
        VisitorCookie.prototype.postCookieId = function (tenantId, publishCookieId, apiTokenName, apiToken) {
            var _this = this;
            var defer = $.Deferred();
            this.cleanReflectHistory();
            var reflectHistoryId = "".concat(tenantId, "_").concat(publishCookieId);
            if (this.hasReflectHistory(reflectHistoryId))
                return defer.resolve().promise();
            var param = {};
            param[apiTokenName] = apiToken;
            param.tenantId = tenantId;
            param.publishCookieId = publishCookieId;
            _revico.util.api.post(_revico.config.common.apiUrlCookieReflect, param)
                .then(function (res) {
                _this.addReflectHistory(reflectHistoryId);
                defer.resolve(res);
            });
            return defer.promise();
        };
        VisitorCookie.prototype.hasReflectHistory = function (reflectHistoryId) {
            if (!_revico.util.localStrage.storageAvailable())
                return false;
            var histName = _revico.config.common.reflectHistoryName;
            var historyStr = _revico.util.localStrage.get(histName);
            if (!historyStr)
                return false;
            var historyArray = JSON.parse(historyStr);
            return historyArray.some(function (x) { return x.id === reflectHistoryId; });
        };
        VisitorCookie.prototype.cleanReflectHistory = function () {
            if (!_revico.util.localStrage.storageAvailable())
                return;
            var histName = _revico.config.common.reflectHistoryName;
            var historyStr = _revico.util.localStrage.get(histName);
            if (!historyStr)
                return;
            var historyArray = JSON.parse(historyStr);
            var expired = Date.now() - 1000 * 60 * 60 * 24 * 7;
            var newHistoryArray = historyArray.filter(function (h) { return h.ts > expired; });
            _revico.util.localStrage.set(histName, JSON.stringify(newHistoryArray));
        };
        VisitorCookie.prototype.addReflectHistory = function (reflectHistoryId) {
            if (!_revico.util.localStrage.storageAvailable())
                return;
            var histName = _revico.config.common.reflectHistoryName;
            var historyStr = _revico.util.localStrage.get(histName);
            var historyArray = historyStr ? JSON.parse(historyStr) : [];
            var current = {
                id: reflectHistoryId,
                ts: Date.now()
            };
            historyArray.push(current);
            _revico.util.localStrage.set(histName, JSON.stringify(historyArray));
        };
        VisitorCookie.prototype.getCookieByIframe = function (tenantId) {
            var defer = $.Deferred();
            var locationOrigin = location.origin;
            if (locationOrigin === undefined) {
                locationOrigin = location.protocol + "//" + location.hostname;
            }
            var url = "".concat(_revico.config.common.frontUrlPutRevicoCookie, "?tenantid=").concat(tenantId, "&origin=").concat(encodeURI(locationOrigin));
            var $frame = $("<iframe src=\"".concat(url, "\" id=\"revico-cookie-iframe\" width=\"0\" height=\"0\" style=\"display:none;\"></iframe>"));
            $('body').append($frame);
            $(window).on('message.revico-cookie-get', function (event) {
                if (event.originalEvent.origin !== _revico.config.common.frontUrl) {
                    return;
                }
                $(this).off('message.revico-cookie-get');
                defer.resolve(event.originalEvent.data);
            });
            $frame.on('load', function () {
                $frame[0].contentWindow.postMessage(_revico.config.common.revicoPutCookiePrefix, _revico.config.common.frontUrlPutRevicoCookie);
            });
            return defer.promise();
        };
        VisitorCookie.prototype.setCookieByIframe = function (publishCookieId) {
            var defer = $.Deferred();
            var $frame = $('#revico-cookie-iframe');
            $(window).on('message.revico-cookie-set', function (event) {
                if (event.originalEvent.origin !== _revico.config.common.frontUrl) {
                    return;
                }
                $(this).off('message.revico-cookie-set');
                defer.resolve(event.originalEvent.data);
            });
            $frame[0].contentWindow.postMessage(_revico.config.common.revicoPutCookiePrefix + publishCookieId, _revico.config.common.frontUrlPutRevicoCookie);
            return defer.promise();
        };
        VisitorCookie.prototype.removeIframe = function () {
            $('#revico-cookie-iframe').remove();
        };
        return VisitorCookie;
    }());
    _revico.VisitorCookie = VisitorCookie;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var ReviewAreaPvSend = (function () {
        function ReviewAreaPvSend() {
            this.sentStaffReviewHasViewProductCds = [];
            this.sentUserReviewHasViewProductCds = [];
            this.sentStaffReviewAreaViewProductCds = [];
            this.sentUserReviewAreaViewProductCds = [];
        }
        ReviewAreaPvSend.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        ReviewAreaPvSend.prototype.putAccessTracking = function (productCd, isStaffReview) {
            if (productCd) {
                if (isStaffReview) {
                    if (this.sentStaffReviewHasViewProductCds.indexOf(productCd) !== -1) {
                        return;
                    }
                    this.sentStaffReviewHasViewProductCds.push(productCd);
                    var gaAction = 'StaffReview_HasReview';
                    var gaCategory = 'StaffReview_HasReview';
                    _revico.util.ga.send(gaAction, gaCategory, productCd);
                }
                else {
                    if (this.sentUserReviewHasViewProductCds.indexOf(productCd) !== -1) {
                        return;
                    }
                    this.sentUserReviewHasViewProductCds.push(productCd);
                    var gaAction = 'HasReview';
                    var gaCategory = 'HasReview';
                    _revico.util.ga.send(gaAction, gaCategory, productCd);
                }
            }
            else {
                if (revico.global.flag.isSendAllReviewHasView) {
                    return;
                }
                revico.global.flag.isSendAllReviewHasView = true;
                var gaAction = 'HasReviewAll';
                var gaCategory = 'HasReviewAll';
                _revico.util.ga.send(gaAction, gaCategory, 'commentAll');
            }
        };
        ReviewAreaPvSend.prototype.putReviewAreaViewTracking = function ($target, tenantId, apiToken, apiName, reviewType, productCd, isStaffReview) {
            var _this = this;
            if (productCd) {
                if (isStaffReview) {
                    if (this.sentStaffReviewAreaViewProductCds.indexOf(productCd) === -1 && _revico.util.dom.isWatch($target)) {
                        this.sentStaffReviewAreaViewProductCds.push(productCd);
                        this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                    }
                    $(window).scroll(function () {
                        if (_this.sentStaffReviewAreaViewProductCds.indexOf(productCd) === -1 && _revico.util.dom.isWatch($target)) {
                            _this.sentStaffReviewAreaViewProductCds.push(productCd);
                            _this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                        }
                    });
                }
                else {
                    if (this.sentUserReviewAreaViewProductCds.indexOf(productCd) === -1 && _revico.util.dom.isWatch($target)) {
                        this.sentUserReviewAreaViewProductCds.push(productCd);
                        this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                    }
                    $(window).scroll(function () {
                        if (_this.sentUserReviewAreaViewProductCds.indexOf(productCd) === -1 && _revico.util.dom.isWatch($target)) {
                            _this.sentUserReviewAreaViewProductCds.push(productCd);
                            _this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                        }
                    });
                }
            }
            else {
                if (!revico.global.flag.isSendStaffReviewAreaView && _revico.util.dom.isWatch($target)) {
                    revico.global.flag.isSendStaffReviewAreaView = true;
                    this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                }
                $(window).scroll(function () {
                    if (!revico.global.flag.isSendStaffReviewAreaView && _revico.util.dom.isWatch($target)) {
                        revico.global.flag.isSendStaffReviewAreaView = true;
                        _this.postView(tenantId, apiToken, apiName, reviewType, productCd, isStaffReview);
                    }
                });
            }
        };
        ReviewAreaPvSend.prototype.postView = function (tenantId, apiToken, apiName, reviewType, productCd, isStaffReview) {
            var defer = $.Deferred();
            var gaAction = 'View';
            var gaCategory = 'View';
            if (isStaffReview) {
                gaAction = 'StaffReview_View';
                gaCategory = 'StaffReview_View';
            }
            if (reviewType === _revico.config.comment.viewAllCommentReview) {
                gaAction = 'ViewAll';
                gaCategory = 'ViewAll';
            }
            _revico.util.ga.send(gaAction, gaCategory, reviewType);
            var param = {};
            param.tenantId = tenantId;
            param.cookieId = _revico.util.cookie.get(_revico.config.common.visitorCookieName) || _revico.config.common.visitorCookieDefaultId;
            param.url = location.href;
            param.productCd = productCd;
            param[apiName] = apiToken;
            _revico.util.api.post(_revico.config.common.apiUrlPvsend, param)
                .then(function () {
                defer.resolve();
            });
            return defer.promise();
        };
        return ReviewAreaPvSend;
    }());
    _revico.ReviewAreaPvSend = ReviewAreaPvSend;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var ConversionLog = (function () {
        function ConversionLog() {
            this.sentAccessVariationGroups = [];
            this.sentShowReviewVariationGroups = [];
        }
        ConversionLog.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        ConversionLog.prototype.putConversionLogAccess = function (tenantId, variationGroup, apiToken, apiName) {
            if (this.sentAccessVariationGroups.indexOf(variationGroup) === -1) {
                this.sendConversionLog(tenantId, variationGroup, "access", apiToken, apiName);
                this.sentAccessVariationGroups.push(variationGroup);
            }
        };
        ConversionLog.prototype.putConversionLogShowReview = function ($target, tenantId, variationGroup, apiToken, apiName) {
            var _this = this;
            if (this.sentShowReviewVariationGroups.indexOf(variationGroup) === -1 && _revico.util.dom.isWatch($target)) {
                this.sendConversionLog(tenantId, variationGroup, "showreview", apiToken, apiName);
                this.sentShowReviewVariationGroups.push(variationGroup);
            }
            $(window).scroll(function () {
                if (_this.sentShowReviewVariationGroups.indexOf(variationGroup) === -1 && _revico.util.dom.isWatch($target)) {
                    _this.sendConversionLog(tenantId, variationGroup, "showreview", apiToken, apiName);
                    _this.sentShowReviewVariationGroups.push(variationGroup);
                }
            });
        };
        ConversionLog.prototype.sendConversionLog = function (tenantId, variationGroup, logType, apiToken, apiName) {
            var _a;
            var postData = {
                tenantId: tenantId,
                variationGroup: variationGroup,
                publishCookieId: _revico.util.cookie.getVisitorCookie() || _revico.config.common.visitorCookieDefaultId,
                logType: logType
            };
            if (postData.publishCookieId === _revico.config.common.visitorCookieDefaultId) {
                return;
            }
            var defer = $.Deferred();
            $.ajax({
                url: _revico.config.common.apiUrlConversionLogSaveAccessV2,
                type: 'POST',
                data: JSON.stringify(postData),
                contentType: "application/json",
                headers: (_a = {
                        tenantId: tenantId
                    },
                    _a[apiName] = apiToken,
                    _a),
                timeout: _revico.config.common.apiDefaultTimeout
            }).done(function (data) {
                defer.resolve(data);
            }).fail(function (error) {
                var _a;
                $.ajax({
                    url: _revico.config.common.apiUrlConversionLogSaveAccess,
                    type: 'POST',
                    data: JSON.stringify(postData),
                    contentType: "application/json",
                    headers: (_a = {
                            tenantId: tenantId
                        },
                        _a[apiName] = apiToken,
                        _a),
                    timeout: _revico.config.common.apiDefaultTimeout
                }).done(function (data) {
                    defer.resolve(data);
                }).fail(function (error) {
                    defer.reject(error);
                });
            });
            return defer.promise();
        };
        ConversionLog.prototype.sendStaffReviewConversionLog = function (tenantId, variationGroup, reviewId, staffId, logType, apiToken, apiName) {
            var _a;
            var postData = {
                tenantId: tenantId,
                variationGroup: variationGroup,
                publishCookieId: _revico.util.cookie.getVisitorCookie() || _revico.config.common.visitorCookieDefaultId,
                reviewId: reviewId,
                staffId: staffId,
                logType: logType,
            };
            if (postData.publishCookieId === _revico.config.common.visitorCookieDefaultId) {
                return;
            }
            var defer = $.Deferred();
            $.ajax({
                url: _revico.config.common.apiUrlConversionLogSaveStaffReviewClick,
                type: 'POST',
                data: JSON.stringify(postData),
                contentType: "application/json",
                headers: (_a = {
                        tenantId: tenantId
                    },
                    _a[apiName] = apiToken,
                    _a),
                timeout: _revico.config.common.apiDefaultTimeout
            }).done(function (data) {
                defer.resolve(data);
            }).fail(function (error) {
                defer.reject(error);
            });
            return defer.promise();
        };
        return ConversionLog;
    }());
    _revico.ConversionLog = ConversionLog;
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
var _revico;
(function (_revico) {
    var tracking;
    (function (tracking) {
        var click;
        (function (click) {
            function sendData(token, tokenName, tenantId, reviewId, cookieId, point) {
                var param = {};
                param[tokenName] = token;
                param.tenantId = tenantId;
                param.reviewId = reviewId;
                param.publishCookieId = cookieId;
                param.clickPoint = point;
                return _revico.util.api.post(_revico.config.common.apiUrlClickTracking, param);
            }
            click.sendData = sendData;
            function bind($target, token, tokenName, tenantId, reviewId, cookieId, point) {
                $target.off('click.tracking').on('click.tracking', function () {
                    sendData(token, tokenName, tenantId, reviewId, cookieId, point);
                });
            }
            click.bind = bind;
        })(click = tracking.click || (tracking.click = {}));
    })(tracking = _revico.tracking || (_revico.tracking = {}));
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var NewRelic = (function () {
        function NewRelic() {
        }
        NewRelic.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        NewRelic.sendLog = function (tenantId, stackTrace) {
            var domain = location.host;
            var url = location.href;
            var param = {
                message: "【TenantId】" + tenantId + " 【URL】" + url + "【StackTrace】" + stackTrace,
                logtype: "FrontError",
                attribute: domain
            };
            _revico.util.api.postNewRelicLogApi(param);
        };
        NewRelic.sendWishlistMergeLog = function (tenantId, srcTenantMemberCd, destTenantMemberCd) {
            var domain = location.host;
            var url = location.href;
            var param = {
                message: "EC会員間でのウィッシュリストマージが行われます。【TenantId】" + tenantId + " 【元EC会員】" + srcTenantMemberCd + " 【先EC会員】" + destTenantMemberCd + "【URL】" + url,
                logtype: "CartDefender",
                attribute: domain
            };
            _revico.util.api.postNewRelicLogApi(param);
        };
        return NewRelic;
    }());
    _revico.NewRelic = NewRelic;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var FrontViewBase = (function () {
        function FrontViewBase() {
            this._includeShopReview = "true";
            this._cachedData = {};
            this._layoutData = {};
        }
        FrontViewBase.prototype.boot = function () {
            var _this = this;
            this.preLoad(function () {
                if (_this._existsJquery) {
                    $ = jQuery.noConflict(true);
                }
                else {
                    $ = jQuery;
                }
                _this.preProcess()
                    .then(function () {
                    return _this.readInfo();
                })
                    .then(function () {
                    return _this.requestData();
                })
                    .then(function () {
                    return _this.processData();
                })
                    .then(function () {
                    return _this.showWidget();
                })
                    .then(function () {
                    return _this.bindEvents();
                })
                    .then(function () {
                    return _this.bindCommonEvents();
                })
                    .fail(function (error) {
                    if (error == null) {
                        return;
                    }
                    var stackTrace = "undefined error";
                    if (error != null && error.stack != null) {
                        stackTrace = error.stack;
                    }
                    _revico.NewRelic.sendLog(_this._tenantId, stackTrace);
                    throw error;
                });
                ;
            });
        };
        FrontViewBase.prototype.preLoad = function (callback) {
            if (navigator.userAgent.indexOf('Trident') !== -1 && Object.getOwnPropertyNames(Array.prototype).indexOf('includes') === -1) {
                Object.defineProperty(Array.prototype, 'includes', {
                    value: function (searchElement, fromIndex) {
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }
                        var o = Object(this);
                        var len = o.length >>> 0;
                        if (len === 0) {
                            return false;
                        }
                        var n = fromIndex | 0;
                        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                        while (k < len) {
                            if (o[k] === searchElement) {
                                return true;
                            }
                            k++;
                        }
                        return false;
                    }
                });
            }
            this._existsJquery = (typeof jQuery !== 'undefined');
            _revico.util.loader.load(callback, this._individualCss, this._individualScript);
        };
        FrontViewBase.prototype.preProcess = function () {
            var _this = this;
            var d = $.Deferred();
            if (!this.checkDuplication()) {
                return d.reject().promise();
            }
            this.getRevicoProp();
            this.getApiToken(this._tenantId)
                .then(function () {
                return _revico.VisitorCookie.getInstance().generateCookieId(_this._tenantId, _this._apiTokenName, _this._apiToken);
            })
                .then(function () {
                d.resolve();
            });
            return d.promise();
        };
        FrontViewBase.prototype.checkDuplication = function () {
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
        FrontViewBase.prototype.getRevicoProp = function () {
            var $revico = this.getCurrentWidget();
            this._hiddenId = $revico.data("revico-hidden-id");
            this._productAttr = $revico.data("revico-product-attr");
            this._productPropAttr = $revico.data("revico-product-prop-attr");
            this._tenantId = $revico.data("revico-tenantid");
            this._layoutId = $revico.data("revico-layout");
            this._initialPageIndex = $revico.data("revico-initial-pageindex");
            this._morePageIndex = $revico.data("revico-more-pageindex");
            this._tenantMemberCdHiddenId = $revico.data("revico-tenant-member-cd");
            this._commentLeaderChars = $revico.data("comment-leader-chars");
            this._reviewerAttr = $revico.data("revico-reviewer-attr");
            this._evaluationItem = $revico.data("revico-product-evaluation");
            this._userId = $revico.data("revico-user-id");
            this._displayEvaluationGraph = $revico.filter('.revico-star-graph-design').data("display-evaluation-graph");
            this._pickUpReviewDisplayType = $revico.data("revico-pickup-review-display-type");
            this._reviewerTypeString = $revico.data("revico-reviewer-type");
            this._includeShopReview = $revico.attr("data-include-shop-review") === "false" ? "false" : "true";
        };
        FrontViewBase.prototype.getLayout = function (array) {
            var defer = $.Deferred();
            if (!array || array.length === 0) {
                defer.resolve();
                return defer.promise();
            }
            var param = {};
            param.tenantId = this._tenantId;
            param.tagCode = array;
            _revico.util.api.get(_revico.config.common.apiUrlLayout, param)
                .then(function (res) {
                defer.resolve(res);
            });
            return defer.promise();
        };
        FrontViewBase.prototype.addStyles = function (cssArray) {
            for (var i = 0; i < cssArray.length; i++) {
                var css = cssArray[i];
                if (!css)
                    continue;
                $("head").append($('<style>' + css + '</style>'));
            }
        };
        FrontViewBase.prototype.getApiToken = function (tenantId) {
            var _this = this;
            return _revico.util.api.getApiToken(tenantId)
                .then(function (res) {
                _this._apiTokenName = res.name;
                _this._apiToken = res.token;
            });
        };
        FrontViewBase.prototype.bindCommonEvents = function () {
            var bindReviCoLogoEvent = function ($logoDom) {
                if (!$logoDom || $logoDom.length === 0)
                    return;
                $logoDom.off('mouseover').on('mouseover', function (e) {
                    var revico_logo_width = jQuery(this).width();
                    var cursor_position_x = e.offsetX;
                    if (revico_logo_width - cursor_position_x < _revico.config.common.revicoLogoClickAreaWidth) {
                        jQuery(this).addClass('revico-logo-onmouse');
                    }
                });
                $logoDom.off('mouseleave').on('mouseleave', function (e) {
                    jQuery(this).removeClass('revico-logo-onmouse');
                });
                $logoDom.off('click').on('click', function (e) {
                    var revico_logo_width = jQuery(this).width();
                    var cursor_position_x = e.offsetX;
                    if (revico_logo_width - cursor_position_x < _revico.config.common.revicoLogoClickAreaWidth) {
                        window.open(_revico.config.common.revicoLogoClickUrl, '_blank');
                    }
                });
            };
            if (!this._currentDom)
                return $.Deferred().resolve().promise();
            if (Array.isArray(this._currentDom)) {
                for (var _i = 0, _a = this._currentDom; _i < _a.length; _i++) {
                    var dom = _a[_i];
                    bindReviCoLogoEvent(dom.find('.revico-logo'));
                }
            }
            else {
                bindReviCoLogoEvent(this._currentDom.find('.revico-logo'));
            }
            return $.Deferred().resolve().promise();
        };
        return FrontViewBase;
    }());
    _revico.FrontViewBase = FrontViewBase;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var DotSlider = (function () {
        function DotSlider() {
        }
        DotSlider.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        DotSlider.prototype.load = function ($targetElement, maxDisplayDotCnt) {
            var _this = this;
            var def = $.Deferred();
            if ($targetElement.children().length <= 1 || maxDisplayDotCnt <= 1)
                return;
            _revico.util.loader.loadCss([_revico.config.common.cssUrlDotSlider], function () {
                _this.init($targetElement, maxDisplayDotCnt);
                def.resolve();
            });
            return def.promise();
        };
        DotSlider.prototype.init = function ($targetElement, maxDisplayDotCnt) {
            var slideContentCnt = $targetElement.children().length;
            var $dotHtml = $("\n                <div class=\"revico--slider-wrapper\">\n                    <div class=\"revico--slider\">\n                        <div class=\"revico--slider-dots\">\n                        </div>\n                    </div>\n                </div>\n            ");
            var $sliderDots = $dotHtml.find('.revico--slider-dots');
            for (var i = 0; i < slideContentCnt; i++) {
                if (i < maxDisplayDotCnt) {
                    switch (i) {
                        case 0:
                            $sliderDots.append('<div class="revico--slider-dot revico--slider-dot-display revico--slider-dot-display-first"></div>');
                            break;
                        case maxDisplayDotCnt - 1:
                        case slideContentCnt - 1:
                            $sliderDots.append('<div class="revico--slider-dot revico--slider-dot-display revico--slider-dot-display-last"></div>');
                            break;
                        default:
                            $sliderDots.append('<div class="revico--slider-dot revico--slider-dot-display"></div>');
                            break;
                    }
                }
                else {
                    $sliderDots.append('<div class="revico--slider-dot"></div>');
                }
            }
            $sliderDots.children().first().addClass('revico--slider-active-dot');
            if (slideContentCnt > maxDisplayDotCnt) {
                $dotHtml.find('.revico--slider-dot-display').last().addClass('revico--slider-dot-small');
            }
            $targetElement.after($dotHtml);
            this.dotSliderBindEvents($targetElement, slideContentCnt, maxDisplayDotCnt);
        };
        ;
        DotSlider.prototype.dotSliderBindEvents = function ($targetElement, slideContentCnt, maxDisplayDotCnt) {
            var activeDotClassName = 'revico--slider-active-dot';
            var smallDotClassName = 'revico--slider-dot-small';
            var displayDotClassName = 'revico--slider-dot-display';
            var firstDotClassName = 'revico--slider-dot-display-first';
            var lastDotClassName = 'revico--slider-dot-display-last';
            var sideDotDisplay = function ($targetElementParent, slideContentCnt, smallDotClassName) {
                var displayFirstIndex = $targetElementParent.find('.revico--slider-dot-display-first').index();
                if (displayFirstIndex != 0) {
                    $targetElementParent.find('.revico--slider-dot-display-first').addClass(smallDotClassName);
                }
                else {
                    $targetElementParent.find('.revico--slider-dot-display-first').remove(smallDotClassName);
                }
                var displayLastIndex = $targetElementParent.find('.revico--slider-dot-display-last').index();
                if (displayLastIndex != slideContentCnt - 1) {
                    $targetElementParent.find('.revico--slider-dot-display-last').addClass(smallDotClassName);
                }
                else {
                    $targetElementParent.find('.revico--slider-dot-display-last').remove(smallDotClassName);
                }
            };
            var startX = 0;
            var endX = 0;
            $targetElement.on('touchstart', function (e) {
                startX = e.touches[0].pageX;
            });
            $targetElement.on('touchmove', function (e) {
                endX = e.touches[0].pageX;
            });
            $targetElement.on('touchend', function (e) {
                if ($targetElement.is(":animated")) {
                    return;
                }
                var $targetElementParent = $targetElement.parent();
                var $activeDot = $targetElementParent.find('.revico--slider-active-dot');
                if (startX > endX) {
                    if ($activeDot.nextAll().length < 1)
                        return;
                    $activeDot.removeClass(activeDotClassName).next().addClass(activeDotClassName);
                    $targetElement.animate({ scrollLeft: $targetElement.scrollLeft() + $targetElement.width() });
                    if (slideContentCnt <= maxDisplayDotCnt)
                        return;
                    var dotAtDisplay = $targetElementParent.find('.revico--slider-dot-display').index($targetElementParent.find('.revico--slider-active-dot'));
                    var dotAtAll = $targetElementParent.find('.revico--slider-active-dot').index();
                    if (dotAtDisplay === maxDisplayDotCnt - 2 && dotAtAll != slideContentCnt - 2) {
                        $targetElementParent.find('.revico--slider-dot-display-first').removeClass(displayDotClassName).removeClass(firstDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display').first().addClass(displayDotClassName).addClass(firstDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display-last').removeClass(lastDotClassName).removeClass(smallDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display').last().next().addClass(displayDotClassName).addClass(lastDotClassName);
                    }
                    sideDotDisplay($targetElementParent, slideContentCnt, smallDotClassName);
                }
                else {
                    if ($activeDot.prevAll().length < 1)
                        return;
                    $activeDot.removeClass(activeDotClassName).prev().addClass(activeDotClassName);
                    $targetElement.animate({ scrollLeft: $targetElement.scrollLeft() - $targetElement.width() });
                    if (slideContentCnt <= maxDisplayDotCnt)
                        return;
                    var dotAtDisplay = $targetElementParent.find('.revico--slider-dot-display').index($targetElementParent.find('.revico--slider-active-dot'));
                    var dotAtAll = $targetElementParent.find('.revico--slider-active-dot').index();
                    if (dotAtDisplay === 1 && dotAtAll != 1) {
                        $targetElementParent.find('.revico--slider-dot-display-last').removeClass(displayDotClassName).removeClass(lastDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display').last().addClass(displayDotClassName).addClass(lastDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display-first').removeClass(firstDotClassName).removeClass(smallDotClassName);
                        $targetElementParent.find('.revico--slider-dot-display').first().prev().addClass(displayDotClassName).addClass(firstDotClassName);
                    }
                    sideDotDisplay($targetElementParent, slideContentCnt, smallDotClassName);
                }
            });
        };
        return DotSlider;
    }());
    _revico.DotSlider = DotSlider;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var MultiCommentState = (function () {
        function MultiCommentState() {
            this._pageIndex = 0;
            this.initialCnt = 0;
            this.moreCnt = 0;
            this._displayProductCds = {};
            this.reviewerType = "0";
            this.noCommentFilter = "false";
            this.evaluationItemFilterShowCondition = "filteredByProductCdCase";
            this.filterProductAttrGroup = "";
            this.displayReviewReplyMoreButton = false;
            this.hasPreviousReviewOnly = false;
        }
        MultiCommentState.prototype.commentResponse = function () {
            return this._commentResponse;
        };
        MultiCommentState.prototype.setCommentResponse = function (response) {
            this._commentResponse = response;
        };
        MultiCommentState.prototype.layoutResponse = function () {
            return this._layoutResponse;
        };
        MultiCommentState.prototype.setLayoutResponse = function (response) {
            this._layoutResponse = response;
        };
        MultiCommentState.prototype.commentFilterResponse = function () {
            return this._commentFilterResponse;
        };
        MultiCommentState.prototype.setCommentFilterResponse = function (response) {
            this._commentFilterResponse = response;
        };
        MultiCommentState.prototype.productDetailResponseList = function () {
            return this._productDetailResponseList;
        };
        MultiCommentState.prototype.setProductDetailResponseList = function (responseList) {
            this._productDetailResponseList = responseList;
        };
        MultiCommentState.prototype.tagCloudResponse = function () {
            return this._tagCloudResponse;
        };
        MultiCommentState.prototype.setTagCloudResponse = function (response) {
            this._tagCloudResponse = response;
        };
        MultiCommentState.prototype.pageIndex = function () {
            return this._pageIndex;
        };
        MultiCommentState.prototype.setPageIndex = function (pageIndex) {
            this._pageIndex = pageIndex;
        };
        MultiCommentState.prototype.setApiToken = function (tokenName, tokenValue) {
            this._apiTokenName = tokenName;
            this._apiTokenValue = tokenValue;
        };
        MultiCommentState.prototype.apiTokenName = function () {
            return this._apiTokenName;
        };
        MultiCommentState.prototype.apiTokenValue = function () {
            return this._apiTokenValue;
        };
        MultiCommentState.prototype.getReviCoProp = function (target) {
            this.hiddenId = target.data("revico-hidden-id");
            this.filterStaffIdHiddenId = target.data("revico-filter-staffid-hidden-id");
            this.filterTenantMemberCdHiddenId = target.data("revico-filter-tenant-member-cd-hidden-id");
            this.productAttr = target.data("revico-product-attr");
            this.productPropAttr = target.data("revico-product-prop-attr");
            this.tenantId = target.data("revico-tenantid");
            this.layoutId = target.data("revico-layout");
            this.initialPageIndex = target.data("revico-initial-pageindex");
            this.morePageIndex = target.data("revico-more-pageindex");
            this.tenantMemberCdHiddenId = target.data("revico-tenant-member-cd");
            this.commentLeaderChars = target.data("comment-leader-chars");
            this.reviewerAttr = target.data("revico-reviewer-attr");
            this.evaluationItem = target.data("revico-product-evaluation");
            this.userId = target.data("revico-user-id");
            this.displayEvaluationGraph = target.filter('.revico-star-graph-design').data("display-evaluation-graph");
            this.reviewerType = (target.data("staff-review") != null && $.isNumeric(target.data("staff-review"))) ? String(target.data("staff-review")) : "2";
            this.includeShopReview = target.attr("data-include-shop-review") == "false" ? "false" : "true";
            this.pickUpReviewDisplayType = target.data("revico-pickup-review-display-type");
            this.noCommentFilter = target.attr("data-revico-skip-comment-filter");
            this.filterProductAttrGroup = target.attr("data-filter-product-attribute-group");
            this.tagWordHiddenId = target.data("revico-tag-word-hidden-id");
            this.filterDisplayType = target.data("revico-filter-display-type");
            this.initialSortType = target.data("initial-sort-type");
            this.evaluationItemFilterShowCondition = target.attr("data-revico-evaluation-item-filter-show-condition");
            this.filterProductCdsHiddenId = target.data("revico-filter-product-cds-hidden-id");
            this.displayReviewReplyMoreButton = target.data("revico-display-review-reply-more-button") === true ? true : false;
            var endPublishReviewBehavior = target.data("revico-end-publish-review-behavior");
            this.endPublishReviewBehavior = endPublishReviewBehavior != null ? endPublishReviewBehavior : _revico.config.multicommentcommon.endpublishreviewbehavior.showAll;
            this.hasPreviousReviewOnly = target.data("revico-has-previous-review-only") === true ? true : false;
        };
        MultiCommentState.prototype.getTargetInfo = function () {
            var _a, _b;
            var apiRequest = {};
            var reviewerAttr = this.reviewerAttr;
            var evaluationItem = this.evaluationItem;
            var userId = this.userId;
            if (this.productAttr) {
                var productCd = $("input[" + this.productAttr + "]").attr(this.productAttr);
                if (productCd) {
                    apiRequest.productCd = [productCd];
                }
            }
            if (!apiRequest.productCd && this.hiddenId) {
                var productCd = $("#".concat(this.hiddenId)).val();
                if (productCd) {
                    apiRequest.productCd = [productCd];
                }
            }
            if (this.productPropAttr) {
                var productAttrVal = $("input[" + this.productPropAttr + "]").attr(this.productPropAttr);
                var productAttrArr = [];
                if (productAttrVal) {
                    productAttrArr.push(productAttrVal);
                }
                apiRequest.productAttr = productAttrArr;
            }
            if (reviewerAttr) {
                var attr = $("input[" + reviewerAttr + "]").attr(reviewerAttr);
                var value = $("input[" + reviewerAttr + "]").attr(reviewerAttr + '-value');
                apiRequest.reviewerAttr = JSON.stringify((_a = {}, _a[attr] = [value], _a));
            }
            if (evaluationItem) {
                var attr = $("input[" + evaluationItem + "]").attr(evaluationItem);
                var value = $("input[" + evaluationItem + "]").attr(evaluationItem + '-value');
                apiRequest.evaluationItem = JSON.stringify((_b = {}, _b[attr] = [value], _b));
            }
            if (userId) {
                apiRequest.userId = $("input[" + userId + "]").attr(userId);
            }
            if (this.filterStaffIdHiddenId) {
                apiRequest.staffId = $("#".concat(this.filterStaffIdHiddenId)).val();
            }
            if (this.filterTenantMemberCdHiddenId) {
                apiRequest.tenantMemberCd = $("#".concat(this.filterTenantMemberCdHiddenId)).val();
            }
            if (this.filterProductCdsHiddenId) {
                var val = $("#".concat(this.filterProductCdsHiddenId)).val();
                if (typeof val === "string" && val.trim().length > 0) {
                    apiRequest.productCd = val.split(',');
                }
            }
            if (this.tagWordHiddenId) {
                apiRequest.tagWord = $("#".concat(this.tagWordHiddenId)).val();
            }
            return apiRequest;
        };
        MultiCommentState.prototype.setParamByAnker = function () {
            var _a;
            var _b;
            var urlParam = location.search.substring(1);
            if (urlParam) {
                var param = urlParam.split('&');
                for (var i = 0; i < param.length; i++) {
                    var paramItem = param[i].split('=');
                    if (paramItem[0] === _revico.config.common.commentAnchorParamStar) {
                        (_a = (_b = this.commentRequest).star) !== null && _a !== void 0 ? _a : (_b.star = []);
                        this.commentRequest.star.push(paramItem[1]);
                        break;
                    }
                }
            }
        };
        MultiCommentState.prototype.calcPageCount = function () {
            var isSP = !_revico.util.device.isPc();
            var limit = isSP ? _revico.config.comment.commentLimitSp : _revico.config.comment.commentLimit;
            var initialPageIndex = this.initialPageIndex;
            this.initialCnt = ($.isNumeric(initialPageIndex) && initialPageIndex > 0) ? initialPageIndex : limit;
            var morePageIndex = this.morePageIndex;
            this.moreCnt = ($.isNumeric(morePageIndex) && morePageIndex > 0) ? morePageIndex : limit;
        };
        MultiCommentState.prototype.shouldShowMoreButton = function (reviewTotalCount) {
            if (!reviewTotalCount) {
                return false;
            }
            this.calcPageCount();
            if (this._pageIndex === 0) {
                return this.initialCnt < reviewTotalCount;
            }
            return this._pageIndex * this.moreCnt + this.initialCnt < reviewTotalCount;
        };
        MultiCommentState.prototype.resetForSearch = function () {
            this._pageIndex = 0;
            this.setCommentResponse({});
        };
        MultiCommentState.prototype.clearFilters = function () {
            var _a = this.commentRequest, productCd = _a.productCd, productAttr = _a.productAttr, reviewerAttr = _a.reviewerAttr, evaluationItem = _a.evaluationItem, userId = _a.userId, sort = _a.sort;
            var nextRequestParam = {
                productCd: productCd,
                sort: sort,
            };
            if (this.productPropAttr) {
                nextRequestParam.productAttr = productAttr;
            }
            if (this.reviewerAttr) {
                nextRequestParam.reviewerAttr = reviewerAttr;
            }
            if (this.evaluationItem) {
                nextRequestParam.evaluationItem = evaluationItem;
            }
            if (this.userId) {
                nextRequestParam.userId = userId;
            }
            this.commentRequest = nextRequestParam;
            this.resetForSearch();
        };
        MultiCommentState.prototype.incrementPageIndex = function () {
            this._pageIndex++;
        };
        MultiCommentState.prototype.isStarChecked = function (star) {
            return (this.commentRequest.star && this.commentRequest.star.indexOf(star) !== -1) ? "checked" : "";
        };
        MultiCommentState.prototype.isProductAttrChecked = function (attrCd) {
            return (this.commentRequest.productAttr && this.commentRequest.productAttr.indexOf(attrCd) !== -1) ? "checked" : "";
        };
        MultiCommentState.prototype.isReviewerAttrChecked = function (revAttrId, revAttrChoiceId) {
            var attr = JSON.parse(this.commentRequest.reviewerAttr || "{}");
            return (attr && attr[revAttrId] && attr[revAttrId].includes(revAttrChoiceId)) ? "checked" : "";
        };
        MultiCommentState.prototype.isEvaluationItemChecked = function (evaId, evaChoiceId) {
            var eva = JSON.parse(this.commentRequest.evaluationItem || "{}");
            return (eva && eva[evaId] && eva[evaId].includes(evaChoiceId)) ? "checked" : "";
        };
        MultiCommentState.prototype.markProductCdDisplayed = function (productCd) {
            if (!this._displayProductCds[productCd]) {
                this._displayProductCds[productCd] = true;
                return true;
            }
            return false;
        };
        MultiCommentState.prototype.isTagChecked = function (word) {
            return (this.commentRequest.tagWord && this.commentRequest.tagWord === word) ? "checked" : "";
        };
        MultiCommentState.prototype.isStaffReviewAttrChecked = function (staffReviewId, displayName) {
            var staffReview = JSON.parse(this.commentRequest.staffReviewAttr || "{}");
            return (staffReview && staffReview[staffReviewId] && staffReview[staffReviewId].includes(displayName)) ? "checked" : "";
        };
        MultiCommentState.prototype.isSortChecked = function (sort) {
            return (this.commentRequest.sort && this.commentRequest.sort === sort) ? "checked" : "";
        };
        MultiCommentState.prototype.isVariationChecked = function (type) {
            return (this.commentRequest.filterType && this.commentRequest.filterType === type) ? "checked" : "";
        };
        MultiCommentState.prototype.resetAll = function () {
            this.commentRequest = {};
            this.setCommentFilterResponse({});
            this.setCommentResponse({});
            this.setProductDetailResponseList([]);
            this.setTagCloudResponse({});
            this.setLayoutResponse({});
            this.setPageIndex(0);
            this._displayProductCds = {};
        };
        MultiCommentState.prototype.prepareCommentRequestParam = function (param) {
            this.calcPageCount();
            param.initialCnt = this.initialCnt;
            param.moreCnt = this.moreCnt;
            param.pageIndex = this._pageIndex;
            param.tenantId = this.tenantId;
            param.reviewerType = this.reviewerType;
            param.pickUpReviewDisplayType = this.pickUpReviewDisplayType;
            param.includeShopReview = this.includeShopReview;
            param.excludeEndPublishProductReview = this.endPublishReviewBehavior === _revico.config.multicommentcommon.endpublishreviewbehavior.hideAll ? true : false;
            param.hasPreviousReviewOnly = this.hasPreviousReviewOnly;
        };
        return MultiCommentState;
    }());
    _revico.MultiCommentState = MultiCommentState;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var MultiCommentRenderer = (function () {
        function MultiCommentRenderer() {
        }
        MultiCommentRenderer.prototype.generateCommentHtml = function (currentDom, state, onClickImage) {
            var reviewDetailDtoList = state.commentResponse().data.reviewDetailDtoList;
            var _tmpl = state.layoutResponse().data[0];
            var maxDisplayDotCnt = 3;
            if (!reviewDetailDtoList || reviewDetailDtoList.length === 0) {
                var comment_class = '';
                if ((state.commentRequest.star && state.commentRequest.star.length > 0)
                    || state.commentRequest.reviewerAttr
                    || (state.commentRequest.productAttr && state.commentRequest.productAttr.length > 0)
                    || state.commentRequest.filterType === 'product') {
                    comment_class = '.revico-review-comment-row-no-match-review';
                }
                else {
                    comment_class = '.revico-review-comment-row-no-review';
                }
                var $row = $('<dummy></dummy>').append($(_tmpl.htmlPart)).find(comment_class);
                var $html = $('<div class="revico-review-comment-row-wrapper"></div>').append($row);
                currentDom.find(".revico-comment-main .revico-comment-footer").before($html.hide().fadeIn());
            }
            else {
                for (var i = 0; i < reviewDetailDtoList.length; i++) {
                    var isFirst = state.markProductCdDisplayed(reviewDetailDtoList[i].productCd);
                    var $html = this.replaceTemplate(reviewDetailDtoList[i], _tmpl.htmlPart, isFirst, state.commentRequest, state.commentLeaderChars);
                    $html.find('.revico-picture-slide-box .revico-picture-slide-item a').off('click').on("click", function () { onClickImage('.revico-picture-slide-box', $(this)); });
                    $html.find('.revico-picture-slide-box--previous .revico-picture-slide-item a').off('click').on("click", function () { onClickImage('.revico-picture-slide-box--previous', $(this)); });
                    currentDom.find(".revico-comment-main .revico-comment-footer").before($html.hide().fadeIn());
                    var $ignorePickupElements = $('.revico-review-multicomment[data-revico-pickup-review-display-type="ignore"]');
                    var $targetCommentRows = $ignorePickupElements
                        .nextUntil('.revico-review-multicomment', '.revico-multicomment-top')
                        .first()
                        .find('.revico-review-comment-row');
                    $targetCommentRows.removeAttr('data-pickup-review');
                    switch (state.endPublishReviewBehavior) {
                        case _revico.config.multicommentcommon.endpublishreviewbehavior.showReviewDisableLink:
                            if (reviewDetailDtoList[i].productStatus === 'EndPublish') {
                                var $product = $html.find('.revico-review-comment-detail--product');
                                $product.find('a').contents().unwrap();
                                $product.find('span').remove();
                                $product.css('pointer-events', 'none');
                            }
                            break;
                        case _revico.config.multicommentcommon.endpublishreviewbehavior.hideAll:
                        case _revico.config.multicommentcommon.endpublishreviewbehavior.showAll:
                        default:
                            break;
                    }
                    var staffRecommend = reviewDetailDtoList[i].staffRecommendProducts;
                    if (!_revico.util.device.isPc() && staffRecommend && staffRecommend.length > 0) {
                        _revico.DotSlider.getInstance().load($html.find('ul.revico-review-comment-detail--staff-recommend--box'), maxDisplayDotCnt);
                    }
                }
                _revico.Modal.getInstance().load();
            }
        };
        MultiCommentRenderer.prototype.generateTag = function (currentDom, tagCloudResponse, targetTagWord) {
            var tagData = tagCloudResponse.data;
            if (tagData && tagData.length > 0) {
                var $tagMain = $("<div class=\"revico-comment-tagcloud\"></div>");
                var $tagWrapper = $("<div class=\"revico-comment-tagcloud-wrapper\"></div>");
                var $tagList = $("<ul class=\"revico-comment-tagcloud-taglist\" ></ul>");
                for (var i = 0; i < tagData.length; i++) {
                    var word = tagData[i].word;
                    $tagList.append($("<li class=\"revico-comment-tagcloud-tagitem\" data-tag-word=\"".concat(word, "\" >").concat(word, "</li>")));
                }
                $tagWrapper.append("<p class=\"revico-comment-tagcloud-description\">\u6C17\u306B\u306A\u308B\u30EC\u30D3\u30E5\u30FC\u3092\u8868\u793A<span style=\"display: none;\"></p>");
                $tagWrapper.append($("<p class=\"revico-comment-tagcloud-tag\" >").append($tagList));
                if (targetTagWord) {
                    $tagWrapper.find('.revico-comment-tagcloud-description span').append(targetTagWord).show();
                    $tagList.find('[data-tag-word="' + targetTagWord + '"]').hide();
                }
                $tagMain.append($tagWrapper);
                currentDom.find(".revico-comment-header").after($tagMain.hide().fadeIn());
            }
        };
        MultiCommentRenderer.prototype.makeHeaderReviCoLabel = function (layoutId, targetTag) {
            var $commentMain = $("<div class=\"revico-multicomment-top revico-common-background-style\" data-layout-tag-name=\"".concat(layoutId, "\"><div class=\"revico-multicomment-inner\"><div class=\"revico-comment-main revico-widget\"><div class=\"revico-logo\"></div></div></div></div>"));
            targetTag.after($commentMain);
            return $commentMain;
        };
        MultiCommentRenderer.prototype.makeHeaderParts = function (currentDom, initialSortType) {
            var $commentMain = currentDom.find('.revico-comment-main');
            var $header = $("<div class=\"revico-comment-header\">\n                                <div class=\"revico-comment-header-wrapper\">\n                                    <div class=\"revico-comment-filter revico-common-button-style revico-common-filter-icon-style\"><span>\u7D5E\u308A\u8FBC\u307F</span></div>\n                                    <div class=\"revico-comment-sort revico-common-button-style revico-common-sort-icon-style\"><span>\u8868\u793A\uFF1A\u65B0\u3057\u3044\u9806</span></div>\n                                    <ul class=\"revico-comment-sort-select revico-common-sort-select-style\" style=\"display: none;\">\n                                        <li data-sort=\"date\">\u65B0\u3057\u3044\u9806</li>\n                                        <li data-sort=\"helpful\">\u53C2\u8003\u306B\u306A\u3063\u305F\u9806</li>\n                                        <li data-sort=\"like\">Like!\u304C\u591A\u3044\u9806</li>\n                                        <li data-sort=\"rate\">\u8A55\u4FA1\u304C\u9AD8\u3044\u9806</li>\n                                    </ul>\n                                </div>\n                               </div>");
            $commentMain.append($header);
            var $sortHeaderDisplay = currentDom.find('.revico-comment-sort span');
            switch (initialSortType) {
                case "helpful":
                case "like":
                case "rate":
                    $sortHeaderDisplay.text('表示：' + $header.find('[data-sort="' + initialSortType + '"]').text());
                    break;
                default:
                    $sortHeaderDisplay.text('表示：' + $header.find('[data-sort=date]').text());
                    break;
            }
        };
        MultiCommentRenderer.prototype.makeFooterParts = function (currentDom, state) {
            var cnt = (state.commentResponse().data || {}).reviewCnt || 0;
            var filter = (state.commentFilterResponse() || {}).data;
            var $comment = currentDom.find(".revico-comment-main");
            var $footerWrapper = $('<div class="revico-comment-footer"></div>');
            if (cnt === 0 && (!filter || Object.keys(filter).length === 0)) {
                $comment.append($footerWrapper);
                return;
            }
            var $buttons = $("<div class=\"revico-comment-footer--paging-buttons\">\n                                    <button type=\"button\" class=\"revico-comment-footer--filter revico-common-button-style revico-common-filter-icon-style\"><span>\u7D5E\u308A\u8FBC\u307F</span></button>\n                                    <button type=\"button\" class=\"revico-comment-footer--sort revico-common-button-style revico-common-sort-icon-style\"><span>\u8868\u793A\uFF1A\u65B0\u3057\u3044\u9806</span></button>\n                                    <ul class=\"revico-comment-footer--sort-select revico-common-sort-select-style\" style=\"display: none;\">\n                                        <li data-sort=\"date\">\u65B0\u3057\u3044\u9806</li>\n                                        <li data-sort=\"helpful\">\u53C2\u8003\u306B\u306A\u3063\u305F\u9806</li>\n                                        <li data-sort=\"like\">Like!\u304C\u591A\u3044\u9806</li>\n                                        <li data-sort=\"rate\">\u8A55\u4FA1\u304C\u9AD8\u3044\u9806</li>\n                                    </ul>\n                                </div>");
            var $more = $("<div class=\"revico-comment-footer--more\"><button type=\"button\" class=\"revico-common-button-style\"><span>\u3082\u3063\u3068\u898B\u308B</span></button></div>");
            $comment.append($footerWrapper.append($more).append($buttons));
            if (state.shouldShowMoreButton(cnt)) {
                $more.show();
            }
            else {
                $more.hide();
            }
            var $sortFooterDisplay = currentDom.find('.revico-comment-footer--sort span');
            switch (state.initialSortType) {
                case "helpful":
                case "like":
                case "rate":
                    $sortFooterDisplay.text('表示：' + $footerWrapper.find('[data-sort="' + state.initialSortType + '"]').text());
                    break;
                default:
                    $sortFooterDisplay.text('表示：' + $footerWrapper.find('[data-sort=date]').text());
                    break;
            }
        };
        MultiCommentRenderer.prototype.makeOuterHtml = function (currentDom, state) {
            var layout = state.layoutResponse().data[0];
            if (layout.headerPart)
                currentDom.before("<div class=\"revico-comment-outer-head\" data-layout-tag-name=\"".concat(state.layoutId, "\" data-review-count=\"").concat(state.commentResponse().data.reviewCnt, "\">").concat(layout.headerPart, "</div>"));
            if (layout.footerPart)
                currentDom.after("<div class=\"revico-comment-outer-foot\" data-layout-tag-name=\"".concat(state.layoutId, "\" data-review-count=\"").concat(state.commentResponse().data.reviewCnt, "\">").concat(layout.footerPart, "</div>"));
        };
        MultiCommentRenderer.prototype.makeWriteReviewButton = function (currentDom, productDetailList, requestParam, reviewerType) {
            if (!productDetailList)
                return;
            if (requestParam.productCd &&
                requestParam.productCd.length == 1 &&
                productDetailList[0].data.reviewTargetFlag === true &&
                reviewerType !== "1") {
                var $writeButtonWrapper = $('<div class="revico-comment-footer--writebutton-wrapper"></div>');
                var $writeButton = $('<button type="button" class="revico-comment-footer--writebutton revico-common-button-style"><span>レビューを書く</span></button>');
                currentDom.find('.revico-comment-footer').append($writeButtonWrapper.append($writeButton));
            }
        };
        MultiCommentRenderer.prototype.replaceTemplate = function (data, tmpl, isFirst, requestParam, commentLeaderChars) {
            var $content = $('<dummy></dummy>').append($(tmpl)).find(".revico-review-comment-row");
            var $dummy = $('<dummy></dummy>').append($('<div class="revico-review-comment-row-wrapper"></div>').attr('data-product-first-view', isFirst ? 'true' : 'false').append($content));
            var html = $dummy.html();
            var twitterImg = "<a href=\"".concat(_revico.util.sns.makeTwitterUrl(data.productPageUrl, _revico.util.string.htmlEscape(data.reviewerName), data.rating.toString(), _revico.util.string.htmlEscape(data.reviewComment), _revico.util.string.htmlEscape(data.productName)), "\" target=\"_blank\"><img class=\"revico-review-comment-detail--action-sns--twitter\" src=\"").concat(_revico.config.common.frontUrl, "/img/twi.png\" alt=\"\"></a>");
            var twitterShareUrl = _revico.util.sns.makeTwitterUrl(data.productPageUrl, _revico.util.string.htmlEscape(data.reviewerName), data.rating.toString(), _revico.util.string.htmlEscape(data.reviewComment), _revico.util.string.htmlEscape(data.productName));
            var facebookImg = "<a href=\"".concat(_revico.util.sns.makeFacebookUrl(data.productPageUrl), "\" target=\"_blank\"><img class=\"revico-review-comment-detail--action-sns--facebook\" src=\"").concat(_revico.config.common.frontUrl, "/img/fb.png\" alt=\"\"></a>");
            var facebookShareUrl = _revico.util.sns.makeFacebookUrl(data.productPageUrl);
            var lineImg = "<a href=\"".concat(_revico.util.sns.makeLineUrl(data.productPageUrl, _revico.util.string.htmlEscape(data.reviewerName), data.rating.toString(), _revico.util.string.htmlEscape(data.reviewComment), _revico.util.string.htmlEscape(data.productName)), "\" target=\"_blank\"><img class=\"revico-review-comment-detail--action-sns--line\" src=\"").concat(_revico.config.common.frontUrl, "/img/line.png\" alt=\"\"></a>");
            var lineShareUrl = _revico.util.sns.makeLineUrl(data.productPageUrl, _revico.util.string.htmlEscape(data.reviewerName), data.rating.toString(), _revico.util.string.htmlEscape(data.reviewComment), _revico.util.string.htmlEscape(data.productName));
            var staffRecommendProducts = data.staffRecommendProducts;
            var staffRecommend = '';
            var staffRecommendCount = 0;
            if (staffRecommendProducts && staffRecommendProducts.length > 0) {
                staffRecommendCount = staffRecommendProducts.length;
                for (var i = 0; i < staffRecommendCount; i++) {
                    var recommendProducts = staffRecommendProducts[i];
                    var variationName = '';
                    variationName += recommendProducts.variationName1 ? "<li>".concat(_revico.util.string.htmlEscape(recommendProducts.variationName1), "</li>") : '';
                    variationName += recommendProducts.variationName2 ? "<li>".concat(_revico.util.string.htmlEscape(recommendProducts.variationName2), "</li>") : '';
                    var recommendComment = '';
                    if (recommendProducts.comment) {
                        recommendComment = "<div class=\"revico-review-comment-detail--staff-recommend--staff-recommend-info\">\n                                               <div class=\"revico-review-comment-detail--staff-recommend--staff-recommend-info--comment-balloon\">\n                                                   <span class=\"revico-review-comment-detail--staff-recommend--staff-recommend-info--comment-balloon-tail\"></span>\n                                                   <div class=\"revico-review-comment-detail--staff-recommend--staff-recommend-info--comment-balloon-title\">\u304A\u3059\u3059\u3081\u30B3\u30E1\u30F3\u30C8</div>\n                                                   <div class=\"revico-review-comment-detail--staff-recommend--staff-recommend-info--comment-balloon-body\">".concat(recommendProducts.comment, "</div>\n                                               </div>\n                                           </div>");
                    }
                    staffRecommend += "<li class=\"revico-review-comment-detail--staff-recommend--item\"\n                                            data-productcd=\"".concat(_revico.util.string.htmlEscape(recommendProducts.productCd), "\"\n                                            data-variationgroup=\"").concat(_revico.util.string.htmlEscape(recommendProducts.variationGroup), "\"\n                                            data-nickname=\"").concat(_revico.util.string.htmlEscape(data.reviewerName), "\"\n                                            data-review-productcd=\"").concat(_revico.util.string.htmlEscape(data.productCd), "\">\n                                            <div class=\"revico-review-comment-detail--staff-recommend--product-info\">\n                                                <a href=\"").concat(_revico.util.string.htmlEscape(recommendProducts.productPageUrl), "\" target=\"_blank\">\n                                                    <div class=\"revico-review-comment-detail--staff-recommend--product-info--product-image-wrapper\">\n                                                            <div class=\"revico-review-comment-detail--staff-recommend--product-info--product-image\">\n                                                                <img src=\"").concat(_revico.util.string.htmlEscape(recommendProducts.productImageUrl), "\" alt=\"\">\n                                                            </div>\n                                                    </div>\n                                                        <div class=\"revico-review-comment-detail--staff-recommend--product-info--product-name\">\n                                                            ").concat(_revico.util.string.htmlEscape(recommendProducts.productName), "\n                                                        </div>\n                                                    <div class=\"revico-review-comment-detail--staff-recommend--product-info--variation\">\n                                                        <ul>\n                                                            ").concat(variationName, "\n                                                        </ul>\n                                                    </div>\n                                                </a>\n                                            </div>\n                                            ").concat(recommendComment, "\n                                        </li>");
                }
            }
            var staffAndReviewerAttr = '';
            if (data.staffAttributeAnswer) {
                staffAndReviewerAttr += "<li><span>".concat(_revico.util.string.htmlEscape(data.staffAttributeAnswer), "</span></li>");
            }
            var staffAttr = '';
            if (data.staffAttributeAnswer) {
                var staffAttrParts = data.staffAttributeAnswer.split('/');
                for (var _i = 0, staffAttrParts_1 = staffAttrParts; _i < staffAttrParts_1.length; _i++) {
                    var part = staffAttrParts_1[_i];
                    var trimmed = part.trim();
                    if (!trimmed)
                        continue;
                    var colonIndex = trimmed.indexOf(':');
                    if (colonIndex !== -1) {
                        var title = trimmed.substring(0, colonIndex).trim();
                        var choice = trimmed.substring(colonIndex + 1).trim();
                        staffAttr += "<li data-revico-staff-attributeanswer-name=\"".concat(_revico.util.string.htmlEscape(title), "\"><span class=\"revico-review-comment-head--staff-attributeanswer-title\">").concat(_revico.util.string.htmlEscape(title), ":</span><span class=\"revico-review-comment-head--staff-attributeanswer-choice\">").concat(_revico.util.string.htmlEscape(choice), "</span></li>");
                    }
                    else {
                        staffAttr += "<li data-revico-staff-attributeanswer-name=\"".concat(_revico.util.string.htmlEscape(trimmed), "\"><span class=\"revico-review-comment-head--staff-attributeanswer-title\">").concat(_revico.util.string.htmlEscape(trimmed), "</span></li>");
                    }
                }
            }
            var reviewerAttr = '';
            var attrAnswers = data.reviewAttributeAnswers;
            for (var i = 0; i < attrAnswers.length; i++) {
                var ra = attrAnswers[i];
                staffAndReviewerAttr += "<li data-revico-reviewer-evaluationanswer-id=\"".concat(_revico.util.string.htmlEscape(ra.reviewerAttributeId), "\"><span class=\"revico-review-comment-head--reviewer-evaluationanswer-title\">").concat(_revico.util.string.htmlEscape(ra.displayName), ":</span><span class=\"revico-review-comment-head--reviewer-evaluationanswer-choice\">").concat(_revico.util.string.htmlEscape(ra.choice_DisplayName), "</span></li>");
                reviewerAttr += "<li data-revico-reviewer-evaluationanswer-id=\"".concat(_revico.util.string.htmlEscape(ra.reviewerAttributeId), "\"><span class=\"revico-review-comment-head--reviewer-evaluationanswer-title\">").concat(_revico.util.string.htmlEscape(ra.displayName), ":</span><span class=\"revico-review-comment-head--reviewer-evaluationanswer-choice\">").concat(_revico.util.string.htmlEscape(ra.choice_DisplayName), "</span></li>");
            }
            var evaluation = '';
            var evAnswers = data.reviewEvaluationAnswers;
            for (var i = 0; i < evAnswers.length; i++) {
                var ea = evAnswers[i];
                evaluation += "<li data-revico-evaluationanswer-cd=\"".concat(_revico.util.string.htmlEscape(ea.evaluationCd), "\"><span class=\"revico-review-comment-detail--addition-evaluationanswer--label\">").concat(_revico.util.string.htmlEscape(ea.displayName), "</span><span class=\"revico-review-comment-detail--addition-evaluationanswer--status\">:").concat(_revico.util.string.htmlEscape(ea.choice_DisplayName), "</span></li>");
            }
            var movies = '';
            var dataMovies = data.movies;
            var dataMovieCount = 0;
            if (dataMovies != null && dataMovies.length > 0) {
                dataMovieCount = dataMovies.length;
                for (var i = 0; i < dataMovies.length; i++) {
                    movies += "<li class=\"revico-picture-slide-item\">\n                                   <div class=\"revico-picture-slide-img-wrapper\">\n                                       <a href=\"javascript:void(0);\" data-id=\"".concat(data.reviewId, "\" data-index=\"").concat(i, "\">\n                                           <img class=\"revico-review-movie-thumbnail\" data-src=\"").concat(dataMovies[i].thumbnailUrl, "\" data-video-src=\"").concat(dataMovies[i].movieUrl, "\" loading=\"lazy\" alt=\"\">\n                                           <div class=\"revico-movie-play-button\"></div>\n                                       </a>\n                                   </div>\n                               </li>");
                }
            }
            var images = '';
            var dataImages = data.images;
            var dataImageCount = 0;
            if (dataImages && dataImages.length > 0) {
                dataImageCount = dataImages.length;
                for (var i = 0; i < dataImages.length; i++) {
                    var url = dataImages[i];
                    images += "<li class=\"revico-picture-slide-item\">\n                                   <div class=\"revico-picture-slide-img-wrapper\">\n                                       <a href=\"javascript:void(0);\" data-id=\"".concat(data.reviewId, "\" data-index=\"").concat(i + dataMovieCount, "\">\n                                           <img class=\"revico-review-image\" data-src=\"").concat(url, "\" loading=\"lazy\" alt=\"\">\n                                       </a>\n                                   </div>\n                               </li>");
                }
            }
            var purchase = (data.purchased === 1) ? '購入確認済み' : '';
            var staffKind = data.staffKind;
            if (staffKind) {
                purchase = _revico.util.string.htmlEscape(staffKind);
            }
            var isAllProductReview = true;
            if (requestParam.productCd && requestParam.productCd.length === 1)
                isAllProductReview = false;
            html = html.replace(/\$\{IsAllProductReview\}/g, isAllProductReview ? 'true' : 'false');
            html = html.replace(/\$\{ReviewerImg\}/g, data.reviewerIcon);
            html = html.replace(/\$\{ReviewerName\}/g, _revico.util.string.htmlEscape(data.reviewerName));
            html = html.replace(/\$\{Purchased\}/g, purchase);
            html = html.replace(/\$\{IsStaffReview\}/g, _revico.util.string.htmlEscape((data.staffId != null).toString()));
            html = html.replace(/\$\{StaffProfile\}/g, _revico.util.string.htmlEscape(data.staffProfile));
            html = html.replace(/\$\{StaffRecommendProducts\}/g, staffRecommend);
            html = html.replace(/\$\{StaffRecommendCount\}/g, staffRecommendCount + "");
            html = html.replace(/\$\{ReviewerAttrAnswers\}/g, staffAndReviewerAttr);
            html = html.replace(/\$\{StaffAttr\}/g, staffAttr);
            html = html.replace(/\$\{ReviewerAttr\}/g, reviewerAttr);
            html = html.replace(/\$\{VariationName1\}/g, _revico.util.string.htmlEscape(data.variationName1));
            html = html.replace(/\$\{VariationName2\}/g, _revico.util.string.htmlEscape(data.variationName2));
            html = html.replace(/\$\{EvaluationAnswers\}/g, evaluation);
            html = html.replace(/\$\{ReviewTitle\}/g, _revico.util.string.htmlEscape(data.reviewTitle));
            var comment;
            if (commentLeaderChars > 0) {
                comment = _revico.util.string.removeNewLine(_revico.util.string.htmlEscape(data.reviewComment.substr(0, commentLeaderChars))) + "…";
            }
            else {
                comment = _revico.util.string.replaceNewLine(_revico.util.string.htmlEscape(data.reviewComment));
            }
            html = html.replace(/\$\{Pickup\}/g, data.isPickUpReview === 1 ? 'true' : 'false');
            html = html.replace(/\$\{ReviewComment\}/g, comment);
            html = html.replace(/\$\{ReviewId\}/g, data.reviewId);
            html = html.replace(/\$\{Images\}/g, movies + images);
            html = html.replace(/\$\{HelpfulCount\}/g, data.helpfulCount.toString());
            html = html.replace(/\$\{LikeCount\}/g, data.likeCount.toString());
            html = html.replace(/\$\{StarRating\}/g, data.rating.toString());
            html = html.replace(/\$\{TwitterImg\}/g, twitterImg);
            html = html.replace(/\$\{TwitterShareUrl\}/g, twitterShareUrl);
            html = html.replace(/\$\{FacebookImg\}/g, facebookImg);
            html = html.replace(/\$\{FacebookShareUrl\}/g, facebookShareUrl);
            html = html.replace(/\$\{LineImg\}/g, lineImg);
            html = html.replace(/\$\{LineShareUrl\}/g, lineShareUrl);
            var ymd = new Date(data.reviewDate);
            html = html.replace(/\$\{yyyy\}/g, ymd.getFullYear() + "");
            html = html.replace(/\$\{mm\}/g, (ymd.getMonth() + 1) + "");
            html = html.replace(/\$\{dd\}/g, ymd.getDate() + "");
            var reviewReply = data.reviewReply;
            var reviewReplyDate = '';
            var reviewReplyBody = '';
            var existsReviewReply = reviewReply && reviewReply.reviewReplyBody;
            if (existsReviewReply) {
                reviewReplyBody = _revico.util.string.replaceNewLine(reviewReply.reviewReplyBody);
                var replyYmd = new Date(reviewReply.reviewReplyDate);
                reviewReplyDate = replyYmd.getFullYear() + '.' + (replyYmd.getMonth() + 1) + '.' + replyYmd.getDate();
            }
            html = html.replace(/\$\{ReviewReply\}/g, existsReviewReply ? "true" : "false");
            html = html.replace(/\$\{ReviewReplyDate\}/g, reviewReplyDate);
            html = html.replace(/\$\{ReviewReplyBody\}/g, reviewReplyBody);
            html = html.replace(/\$\{ProductImageUrl\}/g, data.productImageUrl ? _revico.util.string.htmlEscape(data.productImageUrl) : '../../img/no_image.png');
            html = html.replace(/\$\{ProductPageUrl\}/g, data.productPageUrl ? _revico.util.string.htmlEscape(data.productPageUrl) : '');
            html = html.replace(/\$\{ProductName\}/g, _revico.util.string.htmlEscape(data.productName));
            html = html.replace(/\$\{ProductCd\}/g, _revico.util.string.htmlEscape(data.productCd));
            html = html.replace(/\$\{FrontUrl\}/g, _revico.config.common.frontUrl);
            html = html.replace(/\$\{ImageCount\}/g, dataImageCount.toString());
            html = html.replace(/\$\{ImportFlag\}/g, data.importFlag.toString());
            var orderExtraDataList = data.orderExtraData;
            if (orderExtraDataList !== null && orderExtraDataList !== undefined && orderExtraDataList.length > 0) {
                orderExtraDataList.forEach(function (item) {
                    var placeholder = new RegExp("\\${OrderExtraData\\.".concat(item.key, "}"), 'g');
                    html = html.replace(placeholder, item.value);
                });
            }
            html = html.replace(/\${OrderExtraData\.[^}]+}/g, '');
            var previousReview = data.previousReview;
            html = this.replacePreviousReviewTemplate(html, previousReview);
            html = html.replace(/data-src=/g, 'src=');
            var $html = $(html);
            return $html;
        };
        MultiCommentRenderer.prototype.replacePreviousReviewTemplate = function (html, previousReview) {
            html = html.replace(/\$\{HasPreviousReview\}/g, previousReview != null ? 'true' : 'false');
            if (previousReview == null) {
                html = html.replace(/\${PreviousReview\.[^}]+}/g, '');
                return html;
            }
            var previousReviewTitle = _revico.util.string.htmlEscape(previousReview.reviewTitle) || '';
            var previousReviewComment = _revico.util.string.replaceNewLine(_revico.util.string.htmlEscape(previousReview.reviewComment)) || '';
            var previousReviewStarRating = previousReview.rating || '';
            var previousReviewDate = new Date(previousReview.reviewDate);
            html = html.replace(/\$\{PreviousReview.ReviewTitle\}/g, previousReviewTitle);
            html = html.replace(/\$\{PreviousReview.ReviewComment\}/g, previousReviewComment);
            html = html.replace(/\$\{PreviousReview.StarRating\}/g, previousReviewStarRating.toString());
            html = html.replace(/\$\{PreviousReview.yyyy\}/g, previousReviewDate.getFullYear() + "");
            html = html.replace(/\$\{PreviousReview.mm\}/g, (previousReviewDate.getMonth() + 1) + "");
            html = html.replace(/\$\{PreviousReview.dd\}/g, previousReviewDate.getDate() + "");
            var previousMovies = '';
            var previousMovieCount = 0;
            if (previousReview.movies != null && previousReview.movies.length > 0) {
                previousMovieCount = previousReview.movies.length;
                for (var i = 0; i < previousReview.movies.length; i++) {
                    previousMovies += "<li class=\"revico-picture-slide-item\">\n                               <div class=\"revico-picture-slide-img-wrapper\">\n                                   <a href=\"javascript:void(0);\" data-index=\"".concat(i, "\">\n                                       <img class=\"revico-review-movie-thumbnail\" data-src=\"").concat(previousReview.movies[i].thumbnailUrl, "\" data-video-src=\"").concat(previousReview.movies[i].movieUrl, "\" loading=\"lazy\" alt=\"\">\n                                       <div class=\"revico-movie-play-button\"></div>\n                                   </a>\n                               </div>\n                           </li>");
                }
            }
            var previousImages = '';
            var previousImageCount = 0;
            if (previousReview.images != null && previousReview.images.length > 0) {
                previousImageCount = previousReview.images.length;
                for (var i = 0; i < previousReview.images.length; i++) {
                    var url = previousReview.images[i];
                    previousImages += "<li class=\"revico-picture-slide-item\">\n                               <div class=\"revico-picture-slide-img-wrapper\">\n                                   <a href=\"javascript:void(0);\" data-index=\"".concat(i + previousMovieCount, "\">\n                                       <img class=\"revico-review-image\" data-src=\"").concat(url, "\" loading=\"lazy\" alt=\"\">\n                                   </a>\n                               </div>\n                           </li>");
                }
            }
            html = html.replace(/\$\{PreviousReview.Images\}/g, previousMovies + previousImages);
            html = html.replace(/\$\{PreviousReview.ImageCount\}/g, (previousMovieCount + previousImageCount).toString());
            return html;
        };
        MultiCommentRenderer.prototype.makeModalContent = function ($slideBoxImages, index) {
            var getImageContent = function (src, index) { return "<img class=\"revico-review-modal-product-image--img\" src=\"".concat(src, "\" data-index=\"").concat(index, "\" alt=\"\"/>"); };
            var getVideoContent = function (src) { return "\n                <video class=\"revico-review-modal-product-image--movie\" muted autoplay controls loop>\n                    <source src=\"".concat(src, "\">\n                    <p>\u52D5\u753B\u3092\u518D\u751F\u3059\u308B\u306B\u306F\u3001video\u30BF\u30B0\u3092\u30B5\u30DD\u30FC\u30C8\u3057\u305F\u30D6\u30E9\u30A6\u30B6\u304C\u5FC5\u8981\u3067\u3059\u3002</p>\n                </video>\n            "); };
            var updateModalContent = function (idx) {
                var $image = $($slideBoxImages[idx]);
                var imageSrc = $image.find('img').attr('src');
                var videoSrc = $image.find('img').data('video-src');
                return videoSrc != null ? getVideoContent(videoSrc) : getImageContent(imageSrc, idx);
            };
            var modalContents = updateModalContent(index);
            var $inner = $("\n                <div class=\"revico-modal-content\">\n                    <div class=\"revico-review-modal-wrapper\">\n                        <div class=\"revico-review-modal-product-image\">\n                            <div class=\"revico-review-modal-product-image--main\">\n                                <span class=\"revico-review-modal-product-image--back\"><img src=\"".concat(_revico.config.common.frontUrl, "/img/slide_back.png\" alt=\"\"/></span>\n                                ").concat(modalContents, "\n                                <span class=\"revico-review-modal-product-image--next\"><img src=\"").concat(_revico.config.common.frontUrl, "/img/slide_next.png\" alt=\"\"/></span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            "));
            $inner.find('.revico-review-modal-product-image--back').on('click', function () {
                index = (index - 1 + $slideBoxImages.length) % $slideBoxImages.length;
                var newContent = updateModalContent(index);
                $inner.find('.revico-review-modal-product-image--img, .revico-review-modal-product-image--movie').replaceWith(newContent);
            });
            $inner.find('.revico-review-modal-product-image--next').on('click', function () {
                index = (index + 1) % $slideBoxImages.length;
                var newContent = updateModalContent(index);
                $inner.find('.revico-review-modal-product-image--img, .revico-review-modal-product-image--movie').replaceWith(newContent);
            });
            if ($slideBoxImages.length === 1) {
                $inner.find('.revico-review-modal-product-image--back, .revico-review-modal-product-image--next').hide();
            }
            return $inner;
        };
        MultiCommentRenderer.prototype.makeFilterModalContents = function (commentFilter, tagFilter, state) {
            var _a;
            var reviewerAttr = "";
            if (commentFilter.reviewerAttr) {
                reviewerAttr += '<div class="revico-comment-filter-category">プロフィールで絞り込む</div>';
                for (var i = 0; i < commentFilter.reviewerAttr.length; i++) {
                    var ra = commentFilter.reviewerAttr[i];
                    var rAttr = this.makeReviewerAttrFilter(ra, state);
                    reviewerAttr += rAttr;
                }
            }
            var evaluationItem = "";
            if (commentFilter.evaluationItem) {
                evaluationItem += '<div class="revico-comment-filter-category">評価で絞り込む</div>';
                for (var i = 0; i < commentFilter.evaluationItem.length; i++) {
                    var ei = commentFilter.evaluationItem[i];
                    var eva = this.makeEvaluationItemFilter(ei, state);
                    evaluationItem += eva;
                }
            }
            var proAttrGroup = "";
            if (commentFilter.productAttrGroup) {
                for (var i = 0; i < commentFilter.productAttrGroup.length; i++) {
                    var pa = commentFilter.productAttrGroup[i];
                    var proAttr = this.makeProductAttrFilter(pa.productAttributeGroupId, pa.displayName, pa.values, state);
                    proAttrGroup += proAttr;
                }
            }
            var tagCloud = "";
            if (tagFilter && tagFilter.length > 0) {
                tagCloud += '<div class="revico-comment-filter-category">キーワードで絞り込む</div>';
                tagCloud += this.makeTagCloudFilter(tagFilter, state);
            }
            var mostDisplay = "";
            var variationDisplay = "";
            if (!state.commentRequest.productCd || state.commentRequest.productCd.length !== 1) {
                variationDisplay = "display:none;";
                mostDisplay = "display:none;";
            }
            var staffReviewAttr = "";
            if (commentFilter.staffReviewAttr) {
                staffReviewAttr += '<div class="revico-comment-filter-category">スタッフ属性</div>';
                for (var i = 0; i < commentFilter.staffReviewAttr.length; i++) {
                    var attrGrp = commentFilter.staffReviewAttr[i];
                    var attrAnswerBlock = this.makeStaffReviewerAttributeFilter(attrGrp.staffReviewerAttributeId, attrGrp.displayName, attrGrp.values, state);
                    staffReviewAttr += attrAnswerBlock;
                }
            }
            var contents = "<div class=\"revico-modal-content\" data-layout-tag-name=\"".concat(state.layoutId, "\" data-revico-filter-type=\"").concat((_a = state.filterDisplayType) !== null && _a !== void 0 ? _a : '', "\">\n                                <div class=\"revico-comment-header-modal\">\n                                  <div class=\"revico-comment-header-modal-filter\">\n                                    <div class=\"revico-comment-header-modal-title\"><span>\u30EC\u30D3\u30E5\u30FC\u306E\u7D5E\u308A\u8FBC\u307F</span></div>\n                                    <div class=\"revico-comment-filter-wrapper\">\n                                      <div class=\"revico-comment-filter--block\">\n\n                                      <div class=\"revico-comment-filter--most\" style=\"").concat(mostDisplay, "\">\n                                        <a href=\"javascript:void(0)\" data-most=\"good\">\u6700\u3082\u53C2\u8003\u306B\u306A\u3063\u305F\u9AD8\u8A55\u4FA1\u30EC\u30D3\u30E5\u30FC<span>\u25B6\uFE0E</span></a>\n                                        <a href=\"javascript:void(0)\" data-most=\"bad\">\u6700\u3082\u53C2\u8003\u306B\u306A\u3063\u305F\u4F4E\u8A55\u4FA1\u30EC\u30D3\u30E5\u30FC<span>\u25B6\uFE0E</span></a></div>\n                                      <div class=\"revico-comment-filter--variation\" style=\"").concat(variationDisplay, "\"><span>\n                                          <label for=\"all-variation\">\u5168\u30D0\u30EA\u30A8\u30FC\u30B7\u30E7\u30F3\u306E\u30EC\u30D3\u30E5\u30FC\u3092\u8868\u793A</label>\n                                          <input id=\"all-variation\" value=\"variation\" checked=\"checked\" type=\"radio\"\n                                            name=\"variation\">\n                                        </span> <span>\n                                          <label for=\"only-product\">\u3053\u306E\u5546\u54C1\u306E\u30EC\u30D3\u30E5\u30FC\u306E\u307F\u8868\u793A</label>\n                                          <input id=\"only-product\" value=\"product\" type=\"radio\" name=\"variation\" ").concat(state.isVariationChecked("product"), ">\n                                        </span> </div>\n\n                                        <div id=\"revico-rating-filter\">\n                                          <div class=\"revico-comment-filter-category\">\u661F\u3067\u7D5E\u308A\u8FBC\u3080</div>\n                                          <div class=\"revico-comment-filter--block-item\" name=\"revico-comment-filter--block-item-star\">\n                                            <div class=\"revico-comment-filter--block-item-title\">\u661F\u6570</div>\n                                              <div class=\"revico-comment-filter--block-item-select-wrapper\">\n                                                <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--star-5\">\n                                                  <input id=\"revico-comment-filter--star-5\" type=\"checkbox\" value=\"5\" ").concat(state.isStarChecked("5"), ">\n                                                  <span>\u2605\u2605\u2605\u2605\u2605</span>\n                                                </label>\n                                                <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--star-4\">\n                                                  <input id=\"revico-comment-filter--star-4\" type=\"checkbox\" value=\"4\" ").concat(state.isStarChecked("4"), ">\n                                                  <span>\u2605\u2605\u2605\u2605<span>\u2605</span></span>\n                                                </label>\n                                                <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--star-3\">\n                                                  <input id=\"revico-comment-filter--star-3\" type=\"checkbox\" value=\"3\" ").concat(state.isStarChecked("3"), ">\n                                                  <span>\u2605\u2605\u2605<span>\u2605\u2605</span></span>\n                                                </label>\n                                                <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--star-2\">\n                                                  <input id=\"revico-comment-filter--star-2\" type=\"checkbox\" value=\"2\" ").concat(state.isStarChecked("2"), ">\n                                                  <span>\u2605\u2605<span>\u2605\u2605\u2605</span></span>\n                                                </label>\n                                                <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--star-1\">\n                                                  <input id=\"revico-comment-filter--star-1\" type=\"checkbox\" value=\"1\" ").concat(state.isStarChecked("1"), ">\n                                                  <span>\u2605<span>\u2605\u2605\u2605\u2605</span></span>\n                                                </label>\n                                              </div>\n                                          </div>\n                                        </div>\n                                        ").concat(evaluationItem, "\n                                        ").concat(staffReviewAttr, "\n                                        ").concat(reviewerAttr, "\n                                        ").concat(proAttrGroup, "\n                                        ").concat(tagCloud, "\n                                      </div>\n                                      <div class=\"revico-comment-filter--block-button-wrapper\">\n                                        <div class=\"revico-comment-filter--block-button\">\n                                          <button type=\"button\">\u7D5E\u308A\u8FBC\u3080</button>\n                                        </div>\n                                        <div class=\"revico-comment-filter--block-clear-button\">\n                                          <button type=\"button\">\u89E3\u9664</button>\n                                        </div>\n                                      </div>\n                                    </div>\n                                  </div>\n                                </div>\n                              </div>\n                            </div>");
            var $contents = $(contents);
            if (state.reviewerType == "1") {
                $contents.find('#revico-rating-filter').hide();
            }
            return $contents;
        };
        MultiCommentRenderer.prototype.makeReviewerAttrFilter = function (reviewerAttribute, state) {
            var selects = "";
            var id = reviewerAttribute.reviewerAttributeId;
            var name = reviewerAttribute.displayName;
            var options = reviewerAttribute.values;
            for (var i = 0; i < options.length; i++) {
                var op = options[i];
                var item = "<label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--attr-".concat(id, "_").concat(op.attributeChoiceId, "\">\n                                <input id=\"revico-comment-filter--attr-").concat(id, "_").concat(op.attributeChoiceId, "\" type=\"checkbox\" value=\"").concat(op.attributeChoiceId, "\" ").concat(state.isReviewerAttrChecked(id, op.attributeChoiceId), ">\n                                <span>").concat(_revico.util.string.htmlEscape(op.displayName), "</span>\n                              </label>");
                selects += item;
            }
            var select = "<div class=\"revico-comment-filter--block-item\" name=\"revico-comment-filter--block-item-revattr\" data-revattrid=\"".concat(id, "\">\n                            <div class=\"revico-comment-filter--block-item-title\">").concat(name, "</div>\n                               <div class=\"revico-comment-filter--block-item-select-wrapper\">\n                               ").concat(selects, "\n                               </div>\n                          </div>");
            return select;
        };
        MultiCommentRenderer.prototype.makeEvaluationItemFilter = function (evaluationItem, state) {
            var selects = "";
            var id = evaluationItem.evaluationId;
            var name = evaluationItem.displayName;
            var options = evaluationItem.values;
            for (var i = 0; i < options.length; i++) {
                var op = options[i];
                var item = "<label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--evaluation-".concat(id, "_").concat(op.evaluationChoiceId, "\">\n                                <input id=\"revico-comment-filter--evaluation-").concat(id, "_").concat(op.evaluationChoiceId, "\" type=\"checkbox\" value=\"").concat(op.evaluationChoiceId, "\" ").concat(state.isEvaluationItemChecked(id, op.evaluationChoiceId), ">\n                                <span>").concat(_revico.util.string.htmlEscape(op.displayName), "</span>\n                              </label>");
                selects += item;
            }
            var select = "<div class=\"revico-comment-filter--block-item\" name=\"revico-comment-filter--block-item-evaitem\" data-eiid=\"".concat(id, "\">\n                            <div class=\"revico-comment-filter--block-item-title\">").concat(name, "</div>\n                               <div class=\"revico-comment-filter--block-item-select-wrapper\">\n                               ").concat(selects, "\n                               </div>\n                          </div>");
            return select;
        };
        MultiCommentRenderer.prototype.makeProductAttrFilter = function (paId, paName, options, state) {
            var selects = "";
            for (var i = 0; i < options.length; i++) {
                var op = options[i];
                var item = "<label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--product-attr-".concat(op.productAttributeCd, "\" data-revico-comment-filter-prodattr-cd=\"").concat(op.productAttributeCd, "\">\n                                <input id=\"revico-comment-filter--product-attr-").concat(op.productAttributeCd, "\" type=\"checkbox\" value=\"").concat(op.productAttributeCd, "\" ").concat(state.isProductAttrChecked(op.productAttributeCd), ">\n                                <span>").concat(_revico.util.string.htmlEscape(op.displayName), "</span>\n                              </label>");
                selects += item;
            }
            var select = "<div class=\"revico-comment-filter--block-item revico-comment-filter--block-item\"  name=\"revico-comment-filter--block-item-prodattr\" data-revico-comment-filter-prodattr-group-name=\"".concat(paName, "\">\n                            <div class=\"revico-comment-filter--block-item-title\">").concat(paName, "</div>\n                               <div class=\"revico-comment-filter--block-item-select-wrapper\">\n                               ").concat(selects, "\n                               </div>\n                          </div>");
            return select;
        };
        MultiCommentRenderer.prototype.makeTagCloudFilter = function (tagFilter, state) {
            var item = "<div class=\"revico-comment-filter--block-item revico-comment-filter--block-item--keyword\" name=\"revico-comment-filter--block-item-tag\">\n                            <div class=\"revico-comment-filter--block-item-title\">\u30AD\u30FC\u30EF\u30FC\u30C9</div>\n                                <div class=\"revico-comment-filter--block-item-select-wrapper\">";
            for (var i = 0; i < tagFilter.length; i++) {
                var word = tagFilter[i].word;
                item += "           <label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--tag-".concat(word, "\">\n                                        <input id=\"revico-comment-filter--tag-").concat(word, "\" name = \"revico-comment-filter--tag\" type=\"radio\" value=\"").concat(tagFilter[i].word, "\"  ").concat(state.isTagChecked(word), ">\n                                        <span>").concat(_revico.util.string.htmlEscape(word), "</span>\n                                    </label>");
            }
            item += "           </div>\n                            </div>\n                        </div>";
            return item;
        };
        MultiCommentRenderer.prototype.makeStaffReviewerAttributeFilter = function (attrId, attrName, options, state) {
            var selects = "";
            for (var i = 0; i < options.length; i++) {
                var op = options[i];
                var item = "<label class=\"revico-comment-filter--block-item-select\" for=\"revico-comment-filter--staffreview-".concat(attrId, "\">\n                                <input id=\"revico-comment-filter--staffreview-").concat(attrId, "\" type=\"checkbox\" value=\"").concat(_revico.util.string.htmlEscape(op.displayName), "\" ").concat(state.isStaffReviewAttrChecked(attrId, op.displayName), ">\n                                <span>").concat(_revico.util.string.htmlEscape(op.displayName), "</span>\n                              </label>");
                selects += item;
            }
            var select = "<div class=\"revico-comment-filter--block-item\" name=\"revico-comment-filter--block-item-staffreview\" data-attrid=\"".concat(attrId, "\">\n                            <div class=\"revico-comment-filter--block-item-title\">").concat(attrName, "</div>\n                               <div class=\"revico-comment-filter--block-item-select-wrapper\">\n                               ").concat(selects, "\n                               </div>\n                          </div>");
            return select;
        };
        MultiCommentRenderer.prototype.makeErrorMsg = function (currentDom) {
            var $wrapper = $('<div class="revico-review-comment-row-no-comment"></div>');
            var $noComment = $("<div>\u73FE\u5728\u3001\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u305B\u3093\u3002</div>");
            currentDom.find(".revico-comment-main .revico-comment-footer").before($wrapper.append($noComment).hide().fadeIn());
        };
        return MultiCommentRenderer;
    }());
    _revico.MultiCommentRenderer = MultiCommentRenderer;
})(_revico || (_revico = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _revico;
(function (_revico) {
    var MultiComment = (function (_super) {
        __extends(MultiComment, _super);
        function MultiComment(ele) {
            var _this = _super.call(this) || this;
            _this._individualCss = _revico.config.multicomment.cssUrls;
            _this.imgClick = function (slideBoxSelector, $element) {
                var index = $element.data("index");
                var $slideBoxImages = $element.parents(slideBoxSelector).find('li.revico-picture-slide-item');
                var $html = _this._renderer.makeModalContent($slideBoxImages, index);
                var isStopVideoOnClose = true;
                _revico.Modal.getInstance().showModal($html, isStopVideoOnClose);
            };
            _this._targetTag = $(ele);
            _this._api = new _revico.MultiCommentApi();
            _this._state = new _revico.MultiCommentState();
            _this._renderer = new _revico.MultiCommentRenderer();
            _this._eventBinder = new _revico.MultiCommentEvent(_this);
            return _this;
        }
        MultiComment.getInstance = function (ele) {
            return new this(ele);
        };
        MultiComment.prototype.getCurrentWidget = function () {
            return this._targetTag;
        };
        MultiComment.prototype.checkDuplication = function () {
            return true;
        };
        MultiComment.prototype.getRevicoProp = function () {
            _super.prototype.getRevicoProp.call(this);
            var $revico = this.getCurrentWidget();
            this._state.getReviCoProp($revico);
        };
        MultiComment.prototype.readInfo = function () {
            var d = $.Deferred();
            this._state.commentRequest = this._state.getTargetInfo();
            this._state.setParamByAnker();
            return d.resolve().promise();
        };
        MultiComment.prototype.requestData = function () {
            var _this = this;
            var d = $.Deferred();
            this._state.commentRequest.sort = this._state.initialSortType;
            this._state.prepareCommentRequestParam(this._state.commentRequest);
            $.when(this._api.getComments(this._state.commentRequest), this.getLayout([this._state.layoutId]), this._api.getFilterData(this._state.commentRequest.productCd, this._state.noCommentFilter, this._state.tenantId, this._state.reviewerType, this._state.filterProductAttrGroup, this._state.evaluationItemFilterShowCondition), this._api.getProductsData(this._state.commentRequest.productCd, this._state.tenantId), this._api.getTagData(this._state.tenantId, this._state.reviewerType, this._state.commentRequest.productCd))
                .done(function (res, layout, filter, product, tag) {
                _this._state.setCommentResponse(res);
                _this._state.setLayoutResponse(layout);
                _this._state.setCommentFilterResponse(filter);
                _this._state.setProductDetailResponseList(product);
                _this._state.setTagCloudResponse(tag);
                d.resolve();
            })
                .fail(function () {
                _this._state.setCommentResponse({});
                _this._currentDom = _this._renderer.makeHeaderReviCoLabel(_this._state.layoutId, _this._targetTag);
                _this._renderer.makeFooterParts(_this._currentDom, _this._state);
                _this._renderer.makeErrorMsg(_this._currentDom);
            });
            return d.promise();
        };
        MultiComment.prototype.processData = function () {
            var d = $.Deferred();
            if (this._state.layoutResponse() && this._state.layoutResponse().data && Object.keys(this._state.layoutResponse().data).length > 0) {
                var css = _revico.util.object.values(this._state.layoutResponse().data).map(function (v) { return v.cssPart; });
                this.addStyles(css);
            }
            return d.resolve().promise();
        };
        MultiComment.prototype.showWidget = function () {
            var _this = this;
            var d = $.Deferred();
            if (!this._state.commentResponse())
                return d.reject().promise();
            this._currentDom = this._renderer.makeHeaderReviCoLabel(this._state.layoutId, this._targetTag);
            this._currentDom.attr('data-review-count', this._state.commentResponse().data.reviewCnt);
            if (this._state.commentResponse().data.reviewCnt > 0) {
                this._renderer.makeHeaderParts(this._currentDom, this._state.initialSortType);
            }
            this._renderer.makeFooterParts(this._currentDom, this._state);
            this._renderer.makeWriteReviewButton(this._currentDom, this._state.productDetailResponseList(), this._state.commentRequest, this._state.reviewerType);
            this._renderer.generateCommentHtml(this._currentDom, this._state, function (slideBoxSelector, $element) { return _this.imgClick(slideBoxSelector, $element); });
            this._renderer.generateTag(this._currentDom, this._state.tagCloudResponse(), this._state.commentRequest.tagWord);
            this._renderer.makeOuterHtml(this._currentDom, this._state);
            return d.resolve().promise();
        };
        MultiComment.prototype.bindEvents = function () {
            var d = $.Deferred();
            this._state.setApiToken(this._apiTokenName, this._apiToken);
            this._eventBinder.bindAllEvents(this._currentDom, this._state, this._api, this._renderer);
            this.execAnker();
            this._currentDom.append('<script>(function() { if (typeof revico_multicomment_complete === "function") { revico_multicomment_complete(); } })();<\/script>');
            return d.resolve().promise();
        };
        MultiComment.prototype.getLayout = function (array) {
            var defer = $.Deferred();
            if (!array || array.length === 0) {
                defer.resolve();
                return defer.promise();
            }
            var param = {};
            param.tenantId = this._state.tenantId;
            param.tagCode = array;
            _revico.util.api.get(_revico.config.common.apiUrlLayout, param)
                .then(function (res) {
                defer.resolve(res);
            });
            return defer.promise();
        };
        MultiComment.prototype.postponedPreProcess = function () {
            var _this = this;
            var d = $.Deferred();
            this.getApiToken(this._state.tenantId)
                .then(function () {
                return _revico.VisitorCookie.getInstance().generateCookieId(_this._state.tenantId, _this._apiTokenName, _this._apiToken);
            })
                .then(function () {
                d.resolve();
            });
            return d.promise();
        };
        MultiComment.prototype.execAnker = function () {
            var urlHash = location.hash;
            try {
                if (urlHash && $(urlHash).length > 0) {
                    var position = $(urlHash).offset().top;
                    $('html,body').scrollTop(position);
                }
            }
            catch (_a) {
            }
        };
        MultiComment.prototype.reExec = function () {
            var _this = this;
            this._currentDom = this._currentDom || this._targetTag.nextAll('.revico-multicomment-top').first();
            this._currentDom.prev('.revico-comment-outer-head').remove();
            this._currentDom.next('.revico-comment-outer-foot').remove();
            this._currentDom.remove();
            this._state.resetAll();
            this.getRevicoProp();
            this.readInfo()
                .then(function () {
                return _this.requestData();
            })
                .then(function () {
                return _this.processData();
            })
                .then(function () {
                return _this.showWidget();
            })
                .then(function () {
                return _this.postponedPreProcess();
            })
                .then(function () {
                return _this.bindEvents();
            })
                .then(function () {
                return _this.bindCommonEvents();
            });
        };
        return MultiComment;
    }(_revico.FrontViewBase));
    _revico.MultiComment = MultiComment;
})(_revico || (_revico = {}));
var _revico;
(function (_revico) {
    var MultiCommentManager = (function () {
        function MultiCommentManager() {
            this._listMultiComment = new Array();
        }
        MultiCommentManager.getInstance = function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        };
        MultiCommentManager.prototype.boot = function () {
            var _this = this;
            var manager = this;
            manager.preLoad(function () {
                if (_this._existsJquery) {
                    $ = jQuery.noConflict(true);
                }
                else {
                    $ = jQuery;
                }
                $.each($(".revico-multicomment"), function (indexArray, valueOfElement) {
                    var obj = _revico.MultiComment.getInstance(valueOfElement);
                    obj.boot();
                    _this._listMultiComment.push(obj);
                });
            });
        };
        MultiCommentManager.prototype.preLoad = function (callback) {
            if (navigator.userAgent.indexOf('Trident') !== -1 && Object.getOwnPropertyNames(Array.prototype).indexOf('includes') === -1) {
                Object.defineProperty(Array.prototype, 'includes', {
                    value: function (searchElement, fromIndex) {
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }
                        var o = Object(this);
                        var len = o.length >>> 0;
                        if (len === 0) {
                            return false;
                        }
                        var n = fromIndex | 0;
                        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                        while (k < len) {
                            if (o[k] === searchElement) {
                                return true;
                            }
                            k++;
                        }
                        return false;
                    }
                });
            }
            this._existsJquery = (typeof jQuery !== 'undefined');
            _revico.util.loader.load(callback, this._individualCss, this._individualScript);
        };
        MultiCommentManager.prototype.reBoot = function () {
            var _this = this;
            var manager = this;
            manager.preLoad(function () {
                if (_this._existsJquery) {
                    $ = jQuery.noConflict(true);
                }
                else {
                    $ = jQuery;
                }
                _this._listMultiComment = [];
                $.each($(".revico-multicomment"), function (indexArray, valueOfElement) {
                    var obj = _revico.MultiComment.getInstance(valueOfElement);
                    obj.reExec();
                    _this._listMultiComment.push(obj);
                });
            });
        };
        return MultiCommentManager;
    }());
    _revico.MultiCommentManager = MultiCommentManager;
})(_revico || (_revico = {}));
_revico.MultiCommentManager.getInstance().boot();
revico.global.multicomment.reExec = function () { return _revico.MultiCommentManager.getInstance().reBoot(); };
//# sourceMappingURL=multicomment.js.map
})(revico);

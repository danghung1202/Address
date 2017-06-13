(function ($) {
    var methods = {
        init: function (options) {
            var config = {
                url: "",
                currentPage: 1,
                totalResults: 100,
                perPage: 25,
                pagerVar: "p",
                container: "body",
                outerHeightItemInPage: 40,
                range: 5,
                loaderImgPath: "http://rs.golden.net.vn/icon/pleasewait.gif"
            };

            if (options) {
                $.extend(config, options);
            }
            // set default container element as body if config var is empty
            config.container = (config.container != "") ? config.container : "body";
            config.outerHeightItemInPage =(config.outerHeightItemInPage != "") ? config.outerHeightItemInPage : 40 ;
            var loading = false;

            return this.each(function () {
                var self = $(this),
                    height = self.height(), heightContent, scrollTop, result;

                self.scrollTop(0);
                self.append("<div class='pleaseWait' style='display: none; width: 100%; text-align: center;'><img alt='loading...' src='" + config.loaderImgPath + "'></img></div>");

                self.scroll(function () {
                    scrollTop = self.scrollTop();
                    //var h = $('.history_row').height();
                    heightContent = config.outerHeightItemInPage * config.perPage * config.currentPage;  //self.find(config.container).height();
                    result = heightContent - height;

                    if (config.currentPage >= 0 && (config.perPage * (config.currentPage + 1) < config.totalResults)
                        && !loading && scrollTop >= (result - config.range) && scrollTop <= result + config.range) {
                        // this automatically prevents any further attempts to execute another ajax call until the current ajax call has returned a result
                        loading = true;
                        // set a default url if none specified.
                        // Note: this needs to be calculated just before the ajax call since our currentPage counter is updated each time the event is executed
                        if (config.url != "") {
                            //config.url += (config.url.indexOf("?") !== -1 ? "&" : "?") + config.pagerVar + "=" + (config.currentPage + 1);
                        } else {
                            // the default url is the current window location with the pageVar and currentPage values attached
                            config.url = window.location + (window.location.search != '' ? "&" : "?") + config.pagerVar + "=" + (config.currentPage + 1);
                        }
                        self.find('div.pleaseWait').show();
                        // execute our ajax call and deal with the result.
                        $.ajax({
                            type: "GET",
                            url: config.url,
                            cache: false,
                            dataType: "html",
                            data: config.pagerVar + "=" + (config.currentPage + 1) ,
                            success: function (html) {
                                html = $.trim(html);
                                if (html) {
                                    self.find(config.container).append(html);
                                    config.currentPage++;
                                } else {
                                    // prevent any further attempts to execute the ajax call since the backend is not returning a useable result.
                                    //config.currentPage = -1;
                                }
                            },
                            complete: function () {
                                // allow ajax call to be executed again if necessary and hide the loader
                                loading = false;
                                self.find('div.pleaseWait').hide();
                            }
                        });
                    }
                });

            });
        }
    };
    $.fn.gsScrollPagination = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.gsScrollPagination');
        }
    };

})(jQuery);
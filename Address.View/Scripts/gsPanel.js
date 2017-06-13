
jQuery.cachedScript = function(url, options) {
  // allow user to set any option except for dataType, cache, and url
  options = $.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax(options);
};


(function ($) {
    var methods = {
        init: function (options) {
            var settings = {
                "titleToHide": "Click to hide",
                "titleToShow": "Click to show",
                "height": 400, //Chiều cao của cột bên phải
                "widthToShow": 250,  //Chiều rộng của cột bên phải khi show
                "widthToHide": 28,  //Chiều rộng của cột bên phải khi an
                "autoHide": false  //Có tự động ẩn cột bên phải không, mặc định là false
            };
            if (options) {
                $.extend(settings, options);
            }
            return this.each(function () {
                $(this).children().eq(0).after('<div/>');
                var $divs = $(this).children();
                var length = $divs.length;
                if (length < 3) { return; }
                //CSS For div
                $divs.eq(0).css({ "float": "right", "width": settings.widthToShow,'overflow': 'hidden', "height": settings.height });
                $divs.eq(1).css({ "float": "right", "height": settings.height, 'width': 0, "display": "none", "cursor": "pointer", 'background-color': '#CCCCCC' });
                $divs.eq(2).attr('style', 'overflow: inherit !important');
                $divs.eq(2).css({ "height": settings.height });
                if (!settings.autoHide) {
                    $divs.eq(2).css({ "margin-right": settings.widthToShow });
                } else {
                    $divs.eq(2).css({ "margin-right": settings.widthToHide });
                }

                $divs.eq(0).wrapInner("<div class='rightPanelContentWraper'><div class='rightPanelContent' /></div>");
                $(this).find(".rightPanelContentWraper").prepend("<div class='rightPanelTitle' style='cursor: pointer;'>&raquo;&raquo;" + settings.titleToHide + "</div>");

                $divs.eq(1).html('&laquo;&laquo;<svg xmlns="http://www.w3.org/2000/svg"><text id="thetext" transform="rotate(270, 12, 0) translate(-140,0)">' + settings.titleToShow + '</text> </svg>');

                $(this).find(".rightPanelTitle").click(function () {
                    $(this).find(".rightPanelContentWraper").animate({ marginRight: "-" + settings.widthToShow }, 500);
                    $divs.eq(0).animate({ width: "0px", opacity: 0 }, 400);
                    $divs.eq(1).show("normal").animate({ width: settings.widthToHide, opacity: 1 }, 200);
                    $divs.eq(2).animate({ marginRight: settings.widthToHide }, 500);
                });
                $divs.eq(1).click(function () {
                    $divs.eq(2).animate({ marginRight: settings.widthToShow }, 200);
                    $(this).find(".rightPanelContentWraper").animate({ marginRight: "0px" }, 400);
                    $divs.eq(0).animate({ width: settings.widthToShow, opacity: 1 }, 400);
                    $divs.eq(1).animate({ width: "0px", opacity: 0 }, 600).hide("slow");
                });
                if (settings.autoHide) {
                    //$(this).find(".rightPanelTitle").trigger('click');
                    $(this).find(".rightPanelContentWraper").css({ marginRight: "-" + settings.widthToShow });
                    $divs.eq(0).css({ width: "0px", opacity: 0 });
                    $divs.eq(1).css({ 'display': 'block', 'width': settings.widthToHide, 'opacity': 1 });
                }
            });
        }
        ,setHeight: function(height) {
            return this.each(function () {
                var $divs = $(this).children();
                $divs.eq(0).css({"height": height});
                $divs.eq(1).css({"height": height});
                $divs.eq(2).css({ "height": height });
            });
        }
    };
    $.fn.slidePanel = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.slidePanel');
        }
    };

})(jQuery);





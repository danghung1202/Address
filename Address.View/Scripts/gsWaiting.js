(function ($) {
    var methods = {
        init: function (options) {
            var settings = {
                opacity: 0.6,
                loaderImgPath: "http://rs.golden.net.vn/icon/pleasewait.gif"
            };
            if (options) {
                $.extend(true, settings, options);
            }
            var heightOverlay, widthOverlay;
            this.css({ 'position': 'relative' });
            return this.each(function () {
                heightOverlay = $(this).height();
                widthOverlay = $(this).width();
                $(this).append('<div class="waiting_overlay" style="top: 0; left: 0; background-color: #CCC; position:absolute; display: none; opacity:' + settings.opacity + '; width:' + widthOverlay + 'px;height:' + heightOverlay + 'px; "></div>');
                $(this).find('div.waiting_overlay').append('<div class="waiting_img" style="position:absolute; display: block; text-align: center;"><img src="' + settings.loaderImgPath + '" /></div>');
                $(this).find('div.waiting_img').css({ 'top': heightOverlay / 2 });
                $(this).find('div.waiting_img').css({ 'left': widthOverlay / 2 });

            });
        },
        show: function () {
            return this.each(function () {
                $(this).find('div.waiting_overlay').show();
            });
        }
        , hide: function () {
            return this.each(function () {
                $(this).find('div.waiting_overlay').hide();
            });
        }
    };
    $.fn.gsWaiting = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.gsWaiting');
        }
    };

})(jQuery);
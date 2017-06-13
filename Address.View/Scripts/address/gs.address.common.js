//HungDV
//Validate input textbox
function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");

        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        o.addClass("ui-state-error");

        return false;
    } else {
        return true;
    }
}

function displayImageLoading(selectorJquery) {
    $(selectorJquery).css('visibility', 'visible');
}

function hideImageLoading(selectorJquery) {
    $(selectorJquery).css('visibility', 'hidden');
}

function closeDialog() {
    $("#address_dialog").dialog('close');
    $("#poly_dialog").dialog('close');
}


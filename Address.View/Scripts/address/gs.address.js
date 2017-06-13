//Var
var GLOBE = new function () {
    this.MAP_LARGE = undefined
    this.MAP_CONTROL_DOM = {
        'AddPolygonDiv': undefined
        , 'EditPolygonDiv': undefined
        , 'AddLocationBtn': undefined
    }
    this.ADD_MODE = false
    this.EDIT_MODE = false
    this.HISTORY_MODE = false
}

var ADDRESS = new function () {
    this.MARKER_CURRENT = undefined
    this.POLY_CURRENT = undefined
    this.POLYLINE_CURRENT = undefined
    this.EVENT_CURRENT = {
        'poly_current': undefined,
        'marker_current': undefined
    }

    this.PATHS = {
        "1": undefined,
        "2": undefined,
        "4": undefined,
        "8": undefined,
        "16": undefined
    }
    this.POINTS = {
        "1": undefined,  //Quốc gia
        "2": undefined,    //Tỉnh/Thành phố
        "4": undefined,    //Quận/Huyện
        "8": undefined,    //Phường
        "16": undefined    //Đường
    }
    this.IDS = {
        "1": undefined,  //Quốc gia
        "2": undefined,    //Tỉnh/Thành phố
        "4": undefined,    //Quận/Huyện
        "8": undefined,    //Phường
        "16": undefined    //Đường
    }
    this.PARENTIDS = {
        "1": undefined,  //Quốc gia
        "2": undefined,    //Tỉnh/Thành phố
        "4": undefined,    //Quận/Huyện
        "8": undefined,    //Phường
        "16": undefined    //Đường
    }
    this.LEVEL_CURRENT = undefined

    this.MARKER_DRAFT = undefined
    this.POLY_DRAFT = undefined
    this.POLYLINE_DRAFT = undefined
};

var ADDRESS_OBJECT = new function () {
    this.A_ID = undefined
    this.A_NAME = undefined
    this.A_DESCRIPTION = undefined
    this.A_LEVEL = undefined
    this.A_PARENT = undefined
    this.A_CENTER = undefined
    this.A_BORDER = undefined
    this.DESTROY = function () {
        this.A_NAME = '';
        this.A_DESCRIPTION = '';
        this.A_LEVEL = undefined;
        this.A_PARENT = undefined;
        this.A_CENTER = undefined;
        this.A_BORDER = undefined;
    }
}

//Method Utilities
function toggleTwoDivs(selectorDiv1, selectorDiv2) {
    $(selectorDiv1).toggle(true);
    $(selectorDiv2).toggle(false);
}

function toLatLng(lnglat) {
    var point = lnglat.split(" ");
    var latLng = new google.maps.LatLng(point[1], point[0]);
    return latLng;
}
//flag cho biết path lấy ra có điểm đầu trùng điểm cuối không. Mặc định là true (điểm đầu trùng điểm cuối)
function toMVCArray(lngLats, flag) {
    if (flag == undefined) { flag = true; }
    var path = new google.maps.MVCArray();
    $.each(lngLats, function (index, item) {

        if (item != "") {
            path.insertAt(path.length, toLatLng(item));
        }
    });
    if (!flag) {
        path.removeAt(path.length - 1);
    }
    return path;
}
//flag cho biết path lấy ra có điểm đầu trùng điểm cuối không. Mặc định là true (điểm đầu trùng điểm cuối)
function toMVCArrayFromString(latLngs, flag) {
    if (flag == undefined) { flag = true; }
    var path = new google.maps.MVCArray();

    var arrayLatLong = latLngs.split(','), item = "";
    for (var i = 0; i < arrayLatLong.length; i = i + 2) {
        if (arrayLatLong[i] != "") {
            item = arrayLatLong[i + 1] + " " + arrayLatLong[i];
            path.insertAt(path.length, new google.maps.LatLng(arrayLatLong[i], arrayLatLong[i + 1]));
        }
    }
    if (!flag) {
        path.removeAt(path.length - 1);
    }
    return path;
}

function showPointsInPoly() {
    $("#poly_dialog").dialog('option', 'title', 'dữ liệu đường nét');
    //$("#poly_dialog").empty();
    $("#poly_dialog").dialog('open');
}

//ve polygon tu du lieu lay tu trang muabannhadat.com.vn
function drawPolyFromPoints() {
    if (GLOBE.ADD_MODE) {
        ADDRESS.POLY_DRAFT.stopEdit();
        ADDRESS.POLY_DRAFT.setPath(toMVCArrayFromString($('#extracted_data').val(), false));
        $('.map_canvas').gsMap('setEditablePoly', ADDRESS.POLY_DRAFT, true);
        $('.map_canvas').gsMap("fitBounds", ADDRESS.POLY_DRAFT);
        $("#poly_dialog").dialog('close');
    } else if (GLOBE.EDIT_MODE) {
        ADDRESS.POLY_CURRENT.stopEdit();
        ADDRESS.POLY_CURRENT.setPath(toMVCArrayFromString($('#extracted_data').val(), false));
        $('.map_canvas').gsMap('setEditablePoly', ADDRESS.POLY_CURRENT, true);
        $('.map_canvas').gsMap("fitBounds", ADDRESS.POLY_CURRENT);
        $("#poly_dialog").dialog('close');
    }
}

function toDataForBindSelectTag(dataArray) {
    var options = '<option value="">Chọn địa danh</option>';
    $.each(dataArray, function (index, item) {
        if (item != "") {
            options = options + '<option value="' + item.A_ID + '" >' + item.A_Name + '</option>';
        }
    });
    return options;
}
function toLevel(selector) {
    switch (selector) {
        case '1':
            return 0;
        case '2':
            return 1;
        case '4':
            return 2;
        case '8':
            return 3;
        case '16':
            return 4;
    }
}

function toSelecor(level) {
    switch (level) {
        case 1:
            return "#national_select";
        case 2:
            return "#province_select";
        case 4:
            return "#district_select";
        case 8:
            return "#block_select";
        case 16:
            return "#road_select";
    }
}

//Method Data
function showAddress(level) {
    if (GLOBE.EDIT_MODE || GLOBE.ADD_MODE) {
        alert("Bạn hãy hoàn thành các thao tác trước khi tiếp tục!");
    } else {
        ADDRESS.LEVEL_CURRENT = level;
        var current = level.toString();

        if (ADDRESS.POLYLINE_CURRENT != undefined) {
            ADDRESS.POLYLINE_CURRENT.setMap(null);
            ADDRESS.POLYLINE_CURRENT = undefined;
        }
        if (ADDRESS.POLY_CURRENT != undefined) {
            ADDRESS.POLY_CURRENT.setMap(null);
        }
        if (level != 16) {
            ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap("addPolygon", { path: toMVCArray(ADDRESS.PATHS[current], false) });
        }
        else {
            ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap("addPolyline", { strokeWeight: 8.5, path: toMVCArray(ADDRESS.PATHS[current]) });
        }

        $('.map_canvas').gsMap("fitBounds", ADDRESS.POLY_CURRENT);
        google.maps.event.clearListeners(ADDRESS.POLY_CURRENT, "click");
        ADDRESS.EVENT_CURRENT["poly_current"] = $('.map_canvas').gsMap("addEvent", ADDRESS.POLY_CURRENT, 'click', polyClickHandler);

        if (ADDRESS.MARKER_CURRENT != undefined) {
            ADDRESS.MARKER_CURRENT.setMap(null);
        }
        ADDRESS.MARKER_CURRENT = $('.map_canvas').gsMap("addMarker", {
            draggable: false,
            raiseOnDrag: true,
            position: toLatLng(ADDRESS.POINTS[current])
        });
    }
}

function getAddress(current, selector_bind_data) {
    var id = $(current).val();
    var name = $(current + ' option:selected').text();
    if (id != "" && id != undefined) {
        $.ajax({
            type: "POST",
            url: "/address/getaddress",
            data: { id: id },
            dataType: 'json',
            success: function (data) {
                var selector_current = data.A_Level.toString();
                ADDRESS.IDS[selector_current] = data.A_ID;
                ADDRESS.PARENTIDS[selector_current] = data.A_ParentID;
                ADDRESS.POINTS[selector_current] = data.A_Center
                ADDRESS.PATHS[selector_current] = data.Points;

                var index = toLevel(selector_current);
                $('#location_current  span').filter(function (jndex) { return jndex >= index }).remove();

                $('.select_address_container  select').filter(function (jndex) { return jndex > index + 1 }).empty();

                var a = '<span> > <a href="javascript:void(0)" onclick="showAddress(' + data.A_Level + ');">' + data.A_Name + '</a> </span>';

                $('#location_current').append(a);

                showAddress(data.A_Level);
                $(toSelecor(ADDRESS.LEVEL_CURRENT) + ' option:selected').text(data.A_Name);

                $(selector_bind_data).html(toDataForBindSelectTag(data.A_Children));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ':' + errorThrown);
            }
        });
    }
}

//Method 
// Tính & Gán giá trị chiều cao (height) cho các đối tượng cần ...
function _dowhat() {
    $('.page').css('height', $(window).height() - 1 + 'px');
    var _height = $('.page').height() - $('.page-banner').height() - $('.page-footer').height(); // Chiều cao (Height) của phần giữa trang (Page-Container)
    $('.page-content').css('height', _height + 'px');
    $('.layout_panel').slidePanel('setHeight', _height);
    return _height;
};

$(document).ready(function () {
    // Tính & Gán lần đầu
    var height = _dowhat();
    var resizeTimer = null;
    // Tính & Gán khi window resize
    $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(_dowhat, 100);
    });
    $('.layout_panel').slidePanel({ 'autoHide': false, 'height': height, 'widthToShow': 350, 'widthToHide': 25, 'titleToHide': '<b>Các cấp hành chính</b>' });
    GLOBE.MAP_LARGE = $('.map_canvas').gsMap({
        'mapProvider': 'google',
        'mapGoogleOptions': {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            panControl: false,
            scaleControl: false,
            streetViewControl: false
        }
    });
    $('.map_canvas').gsMap('addSearchBox', google.maps.ControlPosition.TOP_LEFT);

    GLOBE.MAP_CONTROL_DOM["AddPolygonDiv"] = $('.map_canvas').gsMap('addControl', google.maps.ControlPosition.TOP_CENTER
    , '<div><span class="showinfo">đường nét ngoài</span><input type="button" title="thêm đường nét ngoài"  class="button" value="thêm" onclick="addPoly();" /><input type="button" title="kiểm tra tồn tại địa danh tại vị trí đánh dấu"  class="button" value="kiểm tra" onclick="checkExists();" /><input  class="button savePoly" onclick="savePoly();" type="button" value="lưu lại" /><input  class="button cancerPoly" onclick="cancerPoly();" type="button" value="hủy" /></div>',
        { 'background': 'none repeat scroll 0 0 #000', 'opacity': 0, 'display': 'none', 'color': '#F51A1A', 'font-size': '14px', 'font-weight': 'bold' });

    GLOBE.MAP_CONTROL_DOM["EditPolygonDiv"] = $('.map_canvas').gsMap('addControl', google.maps.ControlPosition.TOP_CENTER
    , '<div><input type="button" class="button" value="vẽ mới" onclick="newPoly();" /><input type="button" class="button" value="khôi phục" onclick="refreshPoly();" /><input  class="button savePoly" onclick="updatePoly();" type="button" value="lưu lại" /><input  class="button cancerPoly" onclick="exitEditPoly();" type="button" value="hủy" /></div>',
        { 'background': 'none repeat scroll 0 0 #000', 'opacity': 0, 'display': 'none', 'color': '#F51A1A', 'font-size': '14px', 'font-weight': 'bold' });

    GLOBE.MAP_CONTROL_DOM["AddLocationBtn"] = $('.map_canvas').gsMap('addControl', google.maps.ControlPosition.LEFT_TOP, '<input class="button addMarker" type="button" value="Thêm địa danh" onclick="authorize(addAddress);" />'); //

    $('.map_canvas').bind('resize', function () {
        google.maps.event.trigger(GLOBE.MAP_LARGE, 'resize');
    });

    //    $('.map_canvas').gsMap('event', 'resize', function () {
    //        $('.map_canvas').gsMap('fitBounds', ADDRESS.POLY_CURRENT);
    //    })

    getAddress('#national_select', '#province_select');
    $(".div_inline_block").gsWaiting();

    $(".history_container").gsScrollPagination({
        url: "/address/gethistories",
        currentPage: 1,
        totalResults: 15000,
        perPage: 15,
        pagerVar: "p",
        container: ".history_content",
        outerHeightItemInPage: 40,
        range: 10
    });

    $(".history_container").toggle(false);

    $(".newest_container").gsScrollPagination({
        url: "/address/newest",
        currentPage: 1,
        totalResults: 1000,
        perPage: 15,
        pagerVar: "p",
        container: ".newest_content",
        outerHeightItemInPage: 40,
        range: 10
    });

    $('.select_address_container select').removeAttr('disabled');
});

//Authorize User
function authorize(methodNeedAuthorize) {
    $.ajax({
        type: "POST",
        url: "/address/authorize",
        cache: false,
        dataType: 'Json',
        success: function (data) {
            if (data.isAuthorize) {
                var exec = new methodNeedAuthorize;
            } else {
                alert("Bạn cần đăng nhập để sử dụng chức năng này!");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //hideImageLoading();
            alert(jqXHR.status + ':' + errorThrown);
        }
    });
}


//Hien thi duong bien cua mot address
function showOnlyBorder(current) {
    if (ADDRESS.MARKER_CURRENT != undefined) {
        ADDRESS.MARKER_CURRENT.setMap(null);
    }
    if (ADDRESS.POLY_CURRENT != undefined) {
        ADDRESS.POLY_CURRENT.setMap(null);
        //ADDRESS.POLY_CURRENT.setOptions({ fillOpacity: 0.0, strokeColor: '#0000FF' });
    }
    if (ADDRESS.POLYLINE_CURRENT != undefined) {
        ADDRESS.POLYLINE_CURRENT.setMap(null);
    }
    ADDRESS.POLYLINE_CURRENT = $('.map_canvas').gsMap("addPolyline", { path: toMVCArray(ADDRESS.PATHS[current]), strokeColor: '#0000FF' });
    $('.map_canvas').gsMap("fitBounds", ADDRESS.POLYLINE_CURRENT);
    //alert(GLOBE.MAP_LARGE.getZoom() + 1);
    GLOBE.MAP_LARGE.setZoom(GLOBE.MAP_LARGE.getZoom() + 1);
}

/*
Thêm địa danh
*/
var addAddress = function () {
    $('.select_address_container select').attr('disabled', true);
    $('.map_canvas').gsMap('removeDraftLines');
    if (!GLOBE.ADD_MODE) {
        showOnlyBorder(ADDRESS.LEVEL_CURRENT.toString());
    }
    GLOBE.ADD_MODE = true;
    if (ADDRESS.MARKER_DRAFT) {
        ADDRESS.MARKER_DRAFT.setMap(null);
        ADDRESS.MARKER_DRAFT = undefined;
    }
    ADDRESS.MARKER_DRAFT = $('.map_canvas').gsMap('addMarker');
    $(GLOBE.MAP_CONTROL_DOM["AddPolygonDiv"]).css({ 'display': 'block' });
    $(GLOBE.MAP_CONTROL_DOM["AddPolygonDiv"]).animate({ 'opacity': 0.7 }, 200);
    if (ADDRESS.POLY_DRAFT) {
        ADDRESS.POLY_DRAFT.setMap(null);
        ADDRESS.POLY_DRAFT.stopEdit();
        ADDRESS.POLY_DRAFT = undefined;
    }
    //    if (ADDRESS.LEVEL_CURRENT < 8) {
    //        ADDRESS.POLY_DRAFT = $('.map_canvas').gsMap('createPolygon');
    //    } else {
    //        ADDRESS.POLY_DRAFT = $('.map_canvas').gsMap('createPolyline');
    //    }

}

function checkExists() {

    ADDRESS_OBJECT.A_PARENT = ADDRESS.IDS[ADDRESS.LEVEL_CURRENT.toString()];
    if (ADDRESS.LEVEL_CURRENT < 16) {
        ADDRESS_OBJECT.A_LEVEL = ADDRESS.LEVEL_CURRENT * 2;
    } else {
        ADDRESS_OBJECT.A_LEVEL = ADDRESS.LEVEL_CURRENT;
    }
    ADDRESS_OBJECT.A_CENTER = ADDRESS.MARKER_DRAFT.toGeoString();

    $.ajax({
        type: "POST",
        url: "/address/exists",
        cache: false,
        data: { level: ADDRESS_OBJECT.A_LEVEL, pid: ADDRESS_OBJECT.A_PARENT, center: ADDRESS_OBJECT.A_CENTER },
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var add = '';
                $.each(data, function (index, item) {
                    add = add + item.A_Name + ' ';
                });
                alert("Địa danh " + add + "đã có tại vị trí đánh dấu!");
            } else {
                alert("Tại vị trí đánh dấu chưa có địa danh nào!");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //hideImageLoading();
            alert(jqXHR.status + ':' + errorThrown);
        },
        complete: function () {
            $('#addBtn').removeAttr('disabled');
        }
    });

}

//thêm mới một đường nét ngoài cho địa danh
function addPoly() {
    if (ADDRESS.POLY_DRAFT) {
        ADDRESS.POLY_DRAFT.setMap(null);
        ADDRESS.POLY_DRAFT.stopEdit();
        ADDRESS.POLY_DRAFT = undefined;
    }

    if (ADDRESS.LEVEL_CURRENT < 8) {
        ADDRESS.POLY_DRAFT = $('.map_canvas').gsMap('createPolygon');
        //Hỗ trợ nhập từ dữ liệu có sẵn
        $('.map_canvas').gsMap("addEvent", ADDRESS.POLY_DRAFT, 'rightclick', showPointsInPoly);
    } else {
        ADDRESS.POLY_DRAFT = $('.map_canvas').gsMap('createPolyline');
    }
}


//Bien flag cho biet co chạy hàm showAddress không, false: không chạy, true, chạy, mặc định là chạy
function cancerPoly(flag) {
    if (flag == undefined) flag = true;
    GLOBE.ADD_MODE = false;
    if (ADDRESS.MARKER_DRAFT) {
        ADDRESS.MARKER_DRAFT.setMap(null);
        ADDRESS.MARKER_DRAFT = undefined;
    }
    if (ADDRESS.POLY_DRAFT) {
        ADDRESS.POLY_DRAFT.stopEdit();
        ADDRESS.POLY_DRAFT.setMap(null);
        ADDRESS.POLY_DRAFT = undefined;
    }
    $('.map_canvas').gsMap('removeDraftLines');
    $(GLOBE.MAP_CONTROL_DOM["AddPolygonDiv"]).animate({ 'opacity': 0 }, 200, function () { $(GLOBE.MAP_CONTROL_DOM["AddPolygonDiv"]).css({ 'display': 'none' }); });
    if (flag) {
        showAddress(ADDRESS.LEVEL_CURRENT);
        $("#address_dialog").dialog('close');
    }
    $('.select_address_container select').removeAttr('disabled');

}

function savePoly() {
    if (ADDRESS.POLY_DRAFT != undefined && ADDRESS.POLY_DRAFT.toGeoString(true) != "") {
        $.ajax({
            type: "GET",
            url: "/address/add",
            data: {},
            dataType: 'html',
            success: function (data) {
                $("#address_dialog").html(data);
                $('#A_Name').val(ADDRESS_OBJECT.A_NAME);
                $('#A_Description').val(ADDRESS_OBJECT.A_DESCRIPTION);
                $("#address_dialog").dialog('option', 'title', 'thêm địa danh');
                $("#address_dialog").dialog('open');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status + ':' + errorThrown);
            }
        });
    } else {
        alert("Đường nét chưa hoàn thành!");
    }
}

function saveAddress() {
    var bValid = true;
    bValid = bValid && checkLength($('#A_Name'), "tên địa danh", 1, 1000);
    if (bValid) {
        $('#addBtn').attr('disabled', true);
        ADDRESS_OBJECT.A_NAME = $('#A_Name').val();
        ADDRESS_OBJECT.A_PARENT = ADDRESS.IDS[ADDRESS.LEVEL_CURRENT.toString()];
        ADDRESS_OBJECT.A_DESCRIPTION = $('#A_Description').val();
        if (ADDRESS.LEVEL_CURRENT < 16) {
            ADDRESS_OBJECT.A_LEVEL = ADDRESS.LEVEL_CURRENT * 2;
        } else {
            ADDRESS_OBJECT.A_LEVEL = ADDRESS.LEVEL_CURRENT;
        }
        ADDRESS_OBJECT.A_CENTER = ADDRESS.MARKER_DRAFT.toGeoString();
        ADDRESS_OBJECT.A_BORDER = ADDRESS.POLY_DRAFT.toGeoString(true);

        $.ajax({
            type: "POST",
            url: "/address/add",
            cache: false,
            data: { aname: ADDRESS_OBJECT.A_NAME, adesc: ADDRESS_OBJECT.A_DESCRIPTION, alevel: ADDRESS_OBJECT.A_LEVEL, aparent: ADDRESS_OBJECT.A_PARENT, acenter: ADDRESS_OBJECT.A_CENTER, aborder: ADDRESS_OBJECT.A_BORDER },
            dataType: 'html',
            success: function (data) {
                $("#address_dialog").find('div.add_address_result').remove();
                $("#address_dialog").append(data);
                if ($("#address_dialog").find('div.add_address_success').length > 0) {
                    //alert("Cập nhật không thành công!");
                    //alert("Cập nhật địa danh thành công!");
                    $("#address_dialog").find('div.add_address_container').remove();
                    cancerPoly(false);
                    ADDRESS_OBJECT.DESTROY();
                    if (ADDRESS.LEVEL_CURRENT < 16) {
                        getAddress(toSelecor(ADDRESS.LEVEL_CURRENT), toSelecor(ADDRESS.LEVEL_CURRENT * 2));
                    } else {
                        getAddress(toSelecor(ADDRESS.LEVEL_CURRENT / 2), toSelecor(ADDRESS.LEVEL_CURRENT));
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //hideImageLoading();
                alert(jqXHR.status + ':' + errorThrown);
            },
            complete: function () {
                $('#addBtn').removeAttr('disabled');
            }
        });
    }
}


/*
Sửa địa danh
*/
var polyClickHandler = function () {
    $("#address_dialog").dialog('option', 'title', 'chi tiết địa danh');
    $("#address_dialog").empty();
    $("#address_dialog").dialog('open');
    $.ajax({
        type: "GET",
        url: "/address/detail",
        cache: false,
        data: { id: ADDRESS.IDS[ADDRESS.LEVEL_CURRENT.toString()] },
        dataType: 'html',
        success: function (data) {
            $("#address_dialog").html(data);
        },
        complete: function () {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            //hideImageLoading();
            alert(jqXHR.status + ':' + errorThrown);
        }
    });

}

var editAddress = function () {
    $("#address_dialog").find('div.history_detail_container').css({ 'display': 'none' });
    closeDialog();
    GLOBE.EDIT_MODE = true;
    $('.select_address_container select').attr('disabled', true);
    $(GLOBE.MAP_CONTROL_DOM["AddLocationBtn"]).css({ 'display': 'none' });
    $(GLOBE.MAP_CONTROL_DOM["EditPolygonDiv"]).css({ 'display': 'block' });
    $(GLOBE.MAP_CONTROL_DOM["EditPolygonDiv"]).animate({ 'opacity': 0.7 }, 200);

    if (ADDRESS.LEVEL_CURRENT > 1) {
        if (ADDRESS.POLYLINE_CURRENT != undefined) {
            ADDRESS.POLYLINE_CURRENT.setMap(null);
            ADDRESS.POLYLINE_CURRENT = undefined;
        }
        ADDRESS.POLYLINE_CURRENT = $('.map_canvas').gsMap("addPolyline", { path: toMVCArray(ADDRESS.PATHS[(ADDRESS.LEVEL_CURRENT / 2).toString()]), strokeColor: '#0713FB', strokeOpacity: 1 });
    }

    $('.map_canvas').gsMap('setEditablePoly', ADDRESS.POLY_CURRENT, true);
    $('.map_canvas').gsMap("addEvent", ADDRESS.POLY_CURRENT, 'rightclick', showPointsInPoly);

    google.maps.event.clearListeners(ADDRESS.POLY_CURRENT, "click");

    ADDRESS.MARKER_CURRENT.setDraggable(true);
    //ADDRESS.POLY_CURRENT.setEditable(true);

}

function newPoly() {
    if (ADDRESS.POLY_CURRENT) {
        ADDRESS.POLY_CURRENT.setMap(null);
        ADDRESS.POLY_CURRENT.stopEdit();
        ADDRESS.POLY_CURRENT = undefined;
    }

    if (ADDRESS.LEVEL_CURRENT < 16) {
        ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap('createPolygon');
    } else {
        ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap('createPolyline');
    }
}

function refreshPoly() {
    $('.map_canvas').gsMap('removeDraftLines');
    if (ADDRESS.POLY_CURRENT) {
        ADDRESS.POLY_CURRENT.stopEdit();
        ADDRESS.POLY_CURRENT.setPath(toMVCArray(ADDRESS.PATHS[ADDRESS.LEVEL_CURRENT.toString()], false));
        $('.map_canvas').gsMap('setEditablePoly', ADDRESS.POLY_CURRENT, true);
        ADDRESS.MARKER_CURRENT.setPosition(toLatLng(ADDRESS.POINTS[ADDRESS.LEVEL_CURRENT.toString()]));
        //ADDRESS.POLY_CURRENT.setEditable(true);
    }
}

function updatePoly() {
    if (ADDRESS.POLY_CURRENT != undefined && ADDRESS.POLY_CURRENT.toGeoString(true) != "") {
        $("#address_dialog").find('div.add_address_result').remove();
        $("#address_dialog").dialog('option', 'title', 'sửa địa danh');
        $("#address_dialog").find('div.detail_address_form').css({ 'display': 'none' });
        $("#address_dialog").find('div.edit_address_form').css({ 'display': 'block' });
        $("#address_dialog").dialog('open');
    } else {
        alert("Đường nét chưa hoàn thành!");
    }
}

var editInfoAddress = function () {
    $("#address_dialog").dialog('option', 'title', "sửa địa danh");
    $("#address_dialog").find('div.detail_address_form').css({ 'display': 'none' });
    $("#address_dialog").find('div.history_detail_container').css({ 'display': 'none' });
    $("#address_dialog").find('div.edit_address_form').css({ 'display': 'block' });
}

function exitEditPoly(flag) {
    if (flag == undefined) flag = true;

    GLOBE.EDIT_MODE = false;
    $('.map_canvas').gsMap('setEditablePoly', ADDRESS.POLY_CURRENT, false);
    ADDRESS.MARKER_CURRENT.setDraggable(false);

    $('.map_canvas').gsMap('removeDraftLines');
    $(GLOBE.MAP_CONTROL_DOM["AddLocationBtn"]).css({ 'display': 'block' });
    $(GLOBE.MAP_CONTROL_DOM["EditPolygonDiv"]).animate({ 'opacity': 0 }, 200, function () { $(GLOBE.MAP_CONTROL_DOM["EditPolygonDiv"]).css({ 'display': 'none' }); });
    if (flag) {
        showAddress(ADDRESS.LEVEL_CURRENT);
        ADDRESS.EVENT_CURRENT["poly_current"] = $('.map_canvas').gsMap("addEvent", ADDRESS.POLY_CURRENT, 'click', polyClickHandler);
        $("#address_dialog").dialog('close');
    }

    if (ADDRESS.POLYLINE_CURRENT != undefined) {
        ADDRESS.POLYLINE_CURRENT.setMap(null);
        ADDRESS.POLYLINE_CURRENT = undefined;
    }
    $('.select_address_container select').removeAttr('disabled');
}

function updateAddress() {
    var bValid = true;
    bValid = bValid && checkLength($('#A_Name'), "tên địa danh", 1, 1000);
    if (bValid) {
        $('#updateBtn').attr('disabled', true);
        ADDRESS_OBJECT.A_ID = ADDRESS.IDS[ADDRESS.LEVEL_CURRENT.toString()];
        ADDRESS_OBJECT.A_NAME = $('#A_Name').val();
        ADDRESS_OBJECT.A_DESCRIPTION = $('#A_Description').val();
        ADDRESS_OBJECT.A_LEVEL = ADDRESS.LEVEL_CURRENT;
        ADDRESS_OBJECT.A_PARENT = ADDRESS.PARENTIDS[ADDRESS.LEVEL_CURRENT.toString()];
        ADDRESS_OBJECT.A_CENTER = ADDRESS.MARKER_CURRENT.toGeoString();
        ADDRESS_OBJECT.A_BORDER = ADDRESS.POLY_CURRENT.toGeoString(true);

        $.ajax({
            type: "POST",
            url: "/address/update",
            cache: false,
            data: { aid: ADDRESS_OBJECT.A_ID, aname: ADDRESS_OBJECT.A_NAME, adesc: ADDRESS_OBJECT.A_DESCRIPTION, alevel: ADDRESS_OBJECT.A_LEVEL, aparent: ADDRESS_OBJECT.A_PARENT, acenter: ADDRESS_OBJECT.A_CENTER, aborder: ADDRESS_OBJECT.A_BORDER },
            dataType: 'html',
            success: function (data) {
                $("#address_dialog").find('div.add_address_result').remove();
                $("#address_dialog").find('div.detail_address_container').after(data);
                if ($("#address_dialog").find('div.add_address_success').length > 0) {  //Cập nhật thành công

                    $("#address_dialog").find('div.detail_address_container').remove();
                    $("#address_dialog").find('div.history_detail_container').remove();
                    exitEditPoly(false);

                    //if (ADDRESS.LEVEL_CURRENT < 16) {
                    getAddress(toSelecor(ADDRESS.LEVEL_CURRENT), toSelecor(ADDRESS.LEVEL_CURRENT * 2));


                    //$('#location_current  span').filter(function (jndex) { return jndex == toLevel(ADDRESS.LEVEL_CURRENT.toString()) }).find('a').text(ADDRESS_OBJECT.A_NAME);
                    ADDRESS_OBJECT.DESTROY();
                    //} else {
                    //getAddress(toSelecor(ADDRESS.LEVEL_CURRENT / 2), toSelecor(ADDRESS.LEVEL_CURRENT));
                    //}
                }
            },
            complete: function () {
                $('#updateBtn').removeAttr('disabled');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //hideImageLoading();
                alert(jqXHR.status + ':' + errorThrown);
            }
        });
    }

}

/*
    Xóa địa danh
*/

var beginDelAddress = function () {
    $("#address_dialog").dialog('option', 'title', "xóa địa danh");
    $("#address_dialog").find('div.detail_address_form').css({ 'display': 'none' });
    $("#address_dialog").find('div.delete_address_form').css({ 'display': 'block' });

}

function backToDetail() {
    $("#address_dialog").dialog('option', 'title', "chi tiết địa danh");
    $("#address_dialog").find('div.delete_address_form').css({ 'display': 'none' });
    $("#address_dialog").find('div.edit_address_form').css({ 'display': 'none' });
    $("#address_dialog").find('div.detail_address_form').css({ 'display': 'block' });
    $("#address_dialog").find('div.history_detail_container').css({ 'display': 'block' });
}

function deleteAddress() {

    var bValid = true;
    bValid = bValid && checkLength($('#reasons'), "lý do xóa địa danh", 5, 1000);
    if (bValid && confirm("Bạn chắc chắn muốn xóa địa danh này!")) {
        $('#deleteBtn').attr('disabled', true);
        ADDRESS_OBJECT.A_ID = ADDRESS.IDS[ADDRESS.LEVEL_CURRENT.toString()];
        $.ajax({
            type: "POST",
            url: "/address/delete",
            cache: false,
            data: { aid: ADDRESS_OBJECT.A_ID, reasons: $('#reasons').val() },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    $("#address_dialog").html('<div style="text-align:center;"><h4>cập nhật địa danh thành công</h4></div><div style="text-align: right;"><input type="button" onclick="closeDialog();" value="đóng" /></div>');
                    if (data.urole > 2) { //Nếu user là admin xóa thì đánh dấu xóa luôn
                        //reload lai thang cha cua dia chi nay
                        if (ADDRESS.LEVEL_CURRENT > 1) {
                            getAddress(toSelecor(ADDRESS.LEVEL_CURRENT / 2), toSelecor(ADDRESS.LEVEL_CURRENT));
                        } else {
                            ADDRESS.POLY_CURRENT.setMap(null);
                            ADDRESS.MARKER_CURRENT.setMap(null);
                            $('.select_address_container  select').filter(function (jndex) { return jndex > 0 }).empty();
                        }
                    }
                }
                else {
                    $("#address_dialog").find('div.delete_address_form').append('div style="text-align:center; color: Red;">cập nhật địa danh không thành công</div>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //hideImageLoading();
                alert(jqXHR.status + ':' + errorThrown);
            }
            , complete: function () {
                $('#deleteBtn').removeAttr('disabled');
            }
        });
    }

}

/*
xu ly lich su
*/

function getDetailHistory(hid) {
    GLOBE.HISTORY_MODE = true;
    $('div.history_address_container').find('.history_address_row').removeClass('history_row_selected');
    $('div.history_address_container').find('.' + hid).addClass('history_row_selected');
    $.ajax({
        type: "POST",
        url: "/address/historydetail",
        cache: false,
        data: { id: hid },
        dataType: 'json',
        success: function (data) {
            $('.detail_address_form').find('span#display_name').text(data.H_Name);
            $('.detail_address_form').find('textarea#display_desc').text(data.H_Description);

            $('.edit_address_form').find('input#A_Name').val(data.H_Name);
            $('.edit_address_form').find('textarea#A_Description').text(data.H_Description);

            if (data.H_Level != 16) {
                ADDRESS.POLY_CURRENT.setPath(toMVCArray(data.Points, false));
            } else {
                ADDRESS.POLY_CURRENT.setPath(toMVCArray(data.Points, true));
            }
            ADDRESS.POLY_CURRENT.setOptions({ strokeColor: '#0000FF' });
            ADDRESS.MARKER_CURRENT.setPosition(toLatLng(data.H_Center));

            $('.map_canvas').gsMap("fitBounds", ADDRESS.POLY_CURRENT);
            $("#address_dialog").scrollTop(0);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //hideImageLoading();
            alert(jqXHR.status + ':' + errorThrown);
        }
    });

}

function toggleHistoryView(flag) {
    if (!flag) {
        $("#address_dialog").dialog("option", "title", "lịch sử cập nhật");
        $("#address_dialog").dialog("option", "position", ['left', 'top']);
        $("#address_dialog").dialog("option", "width", 200);
        $("#address_dialog").dialog("option", "height", 220);
        $("#address_dialog").find('div.detail_address_container').hide();
        $("#address_dialog").find('div.history_detail_container').hide();
        $("#address_dialog").find('div.history_summary_container').show();
    } else {
        $("#address_dialog").dialog("option", "title", "chi tiết địa danh");
        $("#address_dialog").dialog("option", "position", [150, 80]);
        $("#address_dialog").dialog("option", "width", 740);
        $("#address_dialog").dialog("option", "height", 470);
        $("#address_dialog").find('div.detail_address_container').show();
        $("#address_dialog").find('div.history_detail_container').show();
        $("#address_dialog").find('div.history_summary_container').hide();
    }
}

function historyClick(current, hid) {
    if (GLOBE.EDIT_MODE || GLOBE.ADD_MODE) {
        alert("Bạn hãy hoàn thành các thao tác trước khi tiếp tục!");
    } else {
        $(".div_inline_block").has($(current)).gsWaiting('show');
        $.ajax({
            type: "POST",
            url: "/address/historydetail",
            cache: false,
            data: { id: hid },
            dataType: 'json',
            success: function (data) {
                var htmlHistoryForm = '';
                htmlHistoryForm += '<div class="detail_address_container"><div class="detail_address_form">';
                htmlHistoryForm += '<div><label>tên địa danh</label></div>';
                htmlHistoryForm += '<div><span class="text" id="display_name">' + data.H_Name + '</span></div>';
                htmlHistoryForm += '<div><label>miêu tả địa danh</label></div>';
                htmlHistoryForm += '<div><textarea rows="16" cols="10" name="A_Description" readonly="readonly" id="display_desc"  >' + data.H_Description + '</textarea></div>';
                htmlHistoryForm += '<div style="text-align: left;">';
                htmlHistoryForm += '<div><b>' + data.H_Action + ' - ' + data.H_ActionDetail + '</b></div>';
                htmlHistoryForm += '<div><b>tạo bởi ' + data.H_CreatedByUser + '</b></div>';
                htmlHistoryForm += '</div>';
                htmlHistoryForm += '<div style="text-align: right;">';
                htmlHistoryForm += '<input type="button"  onclick="closeDialog();" value="đóng" />';
                htmlHistoryForm += '</div>';
                htmlHistoryForm += '</div></div>';
                $("#address_dialog").dialog('option', 'title', 'chi tiết lịch sử');
                $("#address_dialog").html(htmlHistoryForm);
                if (ADDRESS.POLY_CURRENT) {
                    ADDRESS.POLY_CURRENT.setMap(null);
                    ADDRESS.MARKER_CURRENT.setMap(null);
                }
                //            if (ADDRESS.POLY_DRAFT) {
                //                ADDRESS.POLY_DRAFT.setMap(null);
                //                ADDRESS.POLY_DRAFT = undefined;
                //            }

                if (data.H_Level != 16) {
                    ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap('addPolygon', { path: toMVCArray(data.Points, false), strokeColor: '#0000FF' });
                } else {
                    ADDRESS.POLY_CURRENT = $('.map_canvas').gsMap('addPolyline', { path: toMVCArray(data.Points), strokeWeight: 8.5 });
                }
                ADDRESS.MARKER_CURRENT = $('.map_canvas').gsMap('addMarker', { position: toLatLng(data.H_Center) })

                $('.map_canvas').gsMap("fitBounds", ADDRESS.POLY_CURRENT);
                google.maps.event.clearListeners(ADDRESS.POLY_CURRENT, "click");
                ADDRESS.EVENT_CURRENT["poly_current"] = $('.map_canvas').gsMap("addEvent", ADDRESS.POLY_CURRENT, 'click', function () { $("#address_dialog").dialog('open'); });

            },
            complete: function () {
                $(".div_inline_block").has($(current)).gsWaiting('hide');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //hideImageLoading();
                alert(jqXHR.status + ':' + errorThrown);
            }
        });
    }
}

function restoreHistory(hid) {
    $.ajax({
        type: "POST",
        url: "/address/restore",
        cache: false,
        data: { hid: hid },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                var htmlHistoryForm = '';
                htmlHistoryForm += '<div class="detail_address_container">';
                htmlHistoryForm += '<div style="text-align: left;">';
                htmlHistoryForm += '<span><b>áp dụng lịch sử thành công</b></span>';
                htmlHistoryForm += '</div>';
                htmlHistoryForm += '<div style="text-align: right;">';
                htmlHistoryForm += '<input type="button"  onclick="closeDialog();" value="đóng" />';
                htmlHistoryForm += '</div>';
                htmlHistoryForm += '</div>';
                $("#address_dialog").dialog('option', 'title', 'lịch sử');
                $("#address_dialog").html(htmlHistoryForm);
                getAddress(toSelecor(ADDRESS.LEVEL_CURRENT), toSelecor(ADDRESS.LEVEL_CURRENT * 2));
            } else {
                alert("áp dụng lịch sử không thành công");
            }
        },
        complete: function () {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            //hideImageLoading();
            alert(jqXHR.status + ':' + errorThrown);
        }
    });
}
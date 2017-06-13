/*
* jQuery plugin for map - v1.0 - 05/2012
* 
* Copyright (c) 2012 "badboy" Đặng Việt Hùng
* Email: danghung1202@gmail.com
* Dual licensed under the MIT and GPL licenses.
* http://dangviethung.web.golden.net.com/about/license/
*/
(function ($) {
    var methods = {
        //khởi tạo bản đồ
        init: function (options) {
            var settings = {
                'mapProvider': 'Google',  //đơn vị cung cấp bản đồ, mặc định là Google
                'mapWidth': 0,              
                'mapHeight': 0,
                'mapGoogleOptions': {
                    zoom: 12,
                    center: new google.maps.LatLng(21.02867, 105.84148), //mặc định là thu do Ha Noi
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_RIGHT
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_CENTER
                    },
                    panControl: true,
                    scaleControl: true,
                    streetViewControl: true
                },
                'mapBingOptions': {}
            };
            if (options) {
                $.extend(true, settings, options);
            }
            var map;
            this.each(function () {
                if (settings.mapHeight != 0) {
                    $(this).css({ 'height': settings.mapHeight });
                }
                if (settings.mapWidth != 0) {
                    $(this).css({ 'width': settings.mapWidth });
                }

                if (settings.mapProvider) {
                    $(this).data('provider', { mapProvider: settings.mapProvider });
                }

                switch (settings.mapProvider.toLowerCase()) {
                    case 'google':
                        map = new google.maps.Map($(this)[0], settings.mapGoogleOptions);
                        $(this).data('map', { map: map });
                        $(this).data('line', { line1: undefined, line2: undefined });

                        break;
                    case 'bing':
                        map = new Microsoft.Maps.Map($(this)[0], settings.mapBingOptions);
                        $(this).data('map', { map: map });


                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
            return map;
        },
        //thêm sự kiện  như click, mouse, drag, zoom... cho bản đồ
        //event:string - tên sự kiện, handler:function() { } - hàm callback xử lý sự kiện
        event: function (event, handler) {
            var myListener = null;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        myListener = google.maps.event.addListener(map, event, handler);

                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });
            return myListener;
        },
        //thêm sự kiện cho các overlayer như polyline, polygon, marker
        //overlay:object - đối tượng overlayer, event:string - tên sự kiện, handler:function() { } hàm callback xử lý sự kiện
        addEvent: function (overlay, event, handler) {
            var myListener = null;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        myListener = google.maps.event.addListener(overlay, event, handler);

                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });
            return myListener;
        },

        addMarker: function (options) {
            var markerOptions = {
                draggable: true,
                raiseOnDrag: true
            };
            if (options) {
                $.extend(true, markerOptions, options);
            }
            var marker;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        if (!markerOptions.position) {
                            $.extend(true, markerOptions, { position: map.getCenter() });
                        }
                        marker = new google.maps.Marker(markerOptions);
                        marker.setMap(map);
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });
            return marker;
        },
        addPolygon: function (options) {
            var polygonOptions = {
                path: [],
                strokeColor: '#ff0000',
                strokeOpacity: 0.8,
                strokeWeight: 1.5,
                fillOpacity: 0.1,
                editable: false
            };
            if (options) {
                $.extend(true, polygonOptions, options);
            }
            if (polygonOptions.editable) {
                polygonOptions.editable = false;
            }
            var polygon;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        polygon = new google.maps.Polygon(polygonOptions);
                        polygon.setMap(map);
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });

            return polygon;
        },
        addPolyline: function (options) {
            var polylineOptions = {
                path: [],
                strokeColor: '#ff0000',   //'#0C04F9',
                strokeOpacity: 0.5,
                strokeWeight: 1.5,
                editable: false
            };
            if (options) {
                $.extend(true, polylineOptions, options);
            }
            if (polylineOptions.editable) {
                polylineOptions.editable = false;
            }
            var polyline;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        polyline = new google.maps.Polyline(polylineOptions);
                        polyline.setMap(map);
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });

            return polyline;
        },
        addControl: function (position, content, cssOptions, id) {
            var cssSettings = {
                'padding': '3px 5px',
                'width': 'auto',
                'z-index': '1000002',
                'border': 'none'
            }
            if (cssOptions) {
                $.extend(true, cssSettings, cssOptions);
            }
            var div;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        div = document.createElement('DIV');
                        $(div).attr('id', id);
                        $(div).css(cssSettings);
                        $(div).html(content);
                        var map = $(this).data('map').map;
                        if (!position) {
                            position = google.maps.ControlPosition.TOP_LEFT;
                        }
                        map.controls[position].push(div);
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
            return div;
        },
        addSearchBox: function (position, content, cssOptions, id) {
            var div = this.gsMap('addControl', position, '<span>tìm kiếm</span><input style="margin-left: 4px; width:200px;" type="text" id="searchPlaceAuto" />', { 'background': 'none repeat scroll 0 0 #000', 'opacity': 1, 'display': 'block', 'color': '#F51A1A', 'font-size': '14px', 'font-weight': 'bold' });
            var autocomplete = new google.maps.places.Autocomplete($(div).find('input#searchPlaceAuto')[0]);
            var map;
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        map = $(this).data('map').map;
                        autocomplete.bindTo('bounds', map);
                        autocomplete.setTypes(['geocode']);
                        google.maps.event.addListener(autocomplete, 'place_changed', function () {
                            var place = autocomplete.getPlace();
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);  // Why 17? Because it looks good.
                            }
                        });
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });

            return div;
        },
        //tạo polygon
        createPolygon: function (options) {
            var polygon;
            this.gsMap('removeDraftLines');
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map, followLine1, followLine2;
                        map.setOptions({ draggableCursor: 'crosshair' });

                        followLine1 = new google.maps.Polyline({
                            clickable: false,
                            map: map,
                            path: [],
                            //strokeColor: "#787878",
                            strokeOpacity: 1,
                            strokeWeight: 1.5
                        });
                        followLine2 = new google.maps.Polyline({
                            clickable: false,
                            map: map,
                            path: [],
                            //strokeColor: "#787878",
                            strokeOpacity: 1,
                            strokeWeight: 1.5
                        });

                        polygon = new google.maps.Polygon({
                            map: map,
                            //strokeColor: '#ff0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 1.5,
                            fillOpacity:0.15,
                            path: []
                        });

                        var mapTypeId = map.getMapTypeId();
                        if (mapTypeId == 'roadmap') {
                            followLine1.setOptions({ strokeColor: "#787878" });
                            followLine2.setOptions({ strokeColor: "#787878" });
                            polygon.setOptions({ strokeColor: "#ff0000" });
                        } else {
                            followLine1.setOptions({ strokeColor: "#fff" });
                            followLine2.setOptions({ strokeColor: "#fff" });
                            polygon.setOptions({ strokeColor: "#F7FB09" });
                        }

                        $(this).data('line', { line1: followLine1, line2: followLine2 });


                        google.maps.event.addListener(map, 'click', function (point) {
                            polygon.stopEdit();
                            polygon.getPath().push(point.latLng);
                            if (polygon.getPath().getLength() == 3) {
                                google.maps.event.clearListeners(map, "mousemove");
                                google.maps.event.clearListeners(map, "click");
                                followLine1.setMap(null);
                                followLine2.setMap(null);
                                map.setOptions({ draggableCursor: 'default' });
                            }
                            polygon.runEdit(true);
                        });

                        google.maps.event.addListener(map, 'mousemove', function (point) {
                            var pathLength = polygon.getPath().getLength();
                            if (pathLength >= 1) {
                                var startingPoint1 = polygon.getPath().getAt(pathLength - 1);
                                var followCoordinates1 = [startingPoint1, point.latLng];
                                followLine1.setPath(followCoordinates1);

                                var startingPoint2 = polygon.getPath().getAt(0);
                                var followCoordinates2 = [startingPoint2, point.latLng];
                                followLine2.setPath(followCoordinates2);
                            } //*/
                        });
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
            return polygon;
        },
        createPolyline: function (options) {
            var polyline;
            this.gsMap('removeDraftLines');
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map, followLine1;
                        map.setOptions({ draggableCursor: 'crosshair' });

                        followLine1 = new google.maps.Polyline({
                            clickable: false,
                            map: map,
                            path: [],
                            //strokeColor: "#787878",
                            strokeOpacity: 1,
                            strokeWeight: 3.5
                        });

                        polyline = new google.maps.Polyline({
                            map: map,
                            //strokeColor: '#ff0000',
                            strokeOpacity: 0.5,
                            strokeWeight: 5.5,
                            path: []
                        });

                        var mapTypeId = map.getMapTypeId();
                        if (mapTypeId == 'roadmap') {
                            followLine1.setOptions({ strokeColor: "#787878" });
                            polyline.setOptions({ strokeColor: "#ff0000" });
                        } else {
                            followLine1.setOptions({ strokeColor: "#fff" });
                            polyline.setOptions({ strokeColor: "#F7FB09" });
                        }

                        $(this).data('line', { line1: followLine1, line2: undefined });

                        google.maps.event.addListener(map, 'click', function (point) {
                            polyline.stopEdit();
                            polyline.getPath().push(point.latLng);
                            if (polyline.getPath().getLength() == 4) {
                                google.maps.event.clearListeners(map, "mousemove");
                                google.maps.event.clearListeners(map, "click");
                                followLine1.setMap(null);
                                map.setOptions({ draggableCursor: 'default' });
                            }
                            polyline.runEdit(true);
                        });

                        google.maps.event.addListener(map, 'mousemove', function (point) {
                            var pathLength = polyline.getPath().getLength();
                            if (pathLength >= 1) {
                                var startingPoint1 = polyline.getPath().getAt(pathLength - 1);
                                var followCoordinates1 = [startingPoint1, point.latLng];
                                followLine1.setPath(followCoordinates1);

                            } //*/
                        });
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
            return polyline;
        },
        removeDraftLines: function () {
            return this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        if ($(this).data('line').line1) {
                            $(this).data('line').line1.setMap(null);
                        }
                        if ($(this).data('line').line2) {
                            $(this).data('line').line2.setMap(null);
                        }
                        map.setOptions({ draggableCursor: 'default' });
                        google.maps.event.clearListeners(map, "click");
                        google.maps.event.clearListeners(map, "mousemove");
                        google.maps.event.clearListeners(map, "rightclick");
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
        },
        //các phương thức linh tinh khác
        option: function (optionName, value) {
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':

                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });
            return poly;
        },
        setEditablePoly: function (overlayObject, isEnable) {
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        if (isEnable) {
                            if (overlayObject) overlayObject.runEdit(true);
                        }
                        else {
                            if (overlayObject) overlayObject.stopEdit();
                        }
                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }
            });
        },
        fitBounds: function (poly) {
            this.each(function () {
                switch ($(this).data('provider').mapProvider.toLowerCase()) {
                    case 'google':
                        var map = $(this).data('map').map;
                        map.fitBounds(poly.getBounds());

                        break;
                    case 'bing':
                        break;
                    default:
                        alert(settings.mapProvider);
                }

            });
            return poly;
        },
        getMap: function (index, item) {
            var maps = [], map;
            this.each(function () {
                map = $(this).data('map').map;
                maps.push(map);
            });
            return map;
        }
    };
    $.fn.gsMap = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.gsMap');
        }
    };

})(jQuery);


/**
* @name polygonEdit for Google Maps V3 API
* @version 1.0.0 [January 29, 2011]
* @author: ryshkin@gmail.com
* @fileoverview <b>Author:</b> ryshkin@gmail.com<br/> <b>Licence:</b>
*               Licensed under <a
*               href="http://opensource.org/licenses/mit-license.php">MIT</a>
*               license.<br/> This library Extends the functionality of a
*               class google.maps.Polygon by methods runEdit() and stopEdit()<br/>
*               Enjoy guys:)
*               <br/>Special thanks <code>Jan Pieter Waagmeester jieter@jpwaag.com</code> for the idea of using the library google.maps.geometry , which performs spherical linear interpolation between the two locations.
*               <br/>Special thanks <code>James Ratcliff falazar@yahoo.com</code> for the idea of extending my previous script polylineEdit.js to polygonEdit.js   
*/
/**
* @name google
* @class The fundamental namespace for Google APIs 
*/
/**
* @name google.maps
* @class The fundamental namespace for Google Maps V3 API 
*/
/**
* @name google.maps.Polygon
* @class Extends standart class google.maps.Polygon by methods runEdit() and
*        stopEdit()
*/

if (typeof (google.maps.Polygon.prototype.runEdit) === "undefined") {
    /**
    * Starts editing the polygon. Optional parameter <code>flag</code>
    * indicates the use of ghost markers in the middle of each segment. By
    * default, the <code>flag</code> is true.
    * 
    * @param {}
    *            flag - (true) include additional points in the middle of each
    *            segment
    */
    google.maps.Polygon.prototype.runEdit = function (flag) {
        if (!flag) {
            //flag = true;
        }
        var self = this;
        if (flag) {
            var imgGhostVertex = new google.maps.MarkerImage(
                'http://rs.golden.net.vn/polygonEdit/vertexOver.png', new google.maps.Size(11, 11),
                new google.maps.Point(0, 0), new google.maps.Point(6, 6));
            var imgGhostVertexOver = new google.maps.MarkerImage(
                'http://rs.golden.net.vn/polygonEdit/ghostVertexOver.png', new google.maps.Size(11, 11),
                new google.maps.Point(0, 0), new google.maps.Point(6, 6));
            var ghostPath = new google.maps.Polygon({
                map: this.getMap(),
                strokeColor: this.strokeColor,
                strokeOpacity: 0.2,
                strokeWeight: this.strokeWeight
            });
            var vertexGhostMouseOver = function () {
                this.setIcon(imgGhostVertexOver);
            };
            var vertexGhostMouseOut = function () {
                this.setIcon(imgGhostVertex);
            };
            var vertexGhostDrag = function () {
                if (ghostPath.getPath().getLength() === 0) {
                    if (this.marker.inex < self.getPath().getLength() - 1) {
                        ghostPath.setPath([this.marker.getPosition(), this.getPosition(), self.getPath().getAt(this.marker.inex + 1)]);
                    } else {
                        if (this.marker.inex === self.getPath().getLength() - 1) {
                            ghostPath.setPath([this.marker.getPosition(), this.getPosition(), self.getPath().getAt(0)]);
                        }
                    }
                }
                ghostPath.getPath().setAt(1, this.getPosition());
            };
            var moveGhostMarkers = function (marker) {
                var Vertex = self.getPath().getAt(marker.inex);
                if (marker.inex === 0) {
                    var prevVertex = self.getPath().getAt(self.getPath().getLength() - 1);
                } else {
                    var prevVertex = self.getPath().getAt(marker.inex - 1);
                }
                if ((typeof (Vertex) !== "undefined") && (typeof (Vertex.ghostMarker) !== "undefined")) {
                    if (typeof (google.maps.geometry) === "undefined") {
                        if (marker.inex < self.getPath().getLength() - 1) {
                            Vertex.ghostMarker.setPosition(new google.maps.LatLng(Vertex.lat() + 0.5 * (self.getPath().getAt(marker.inex + 1).lat() - Vertex.lat()), Vertex.lng() + 0.5 * (self.getPath().getAt(marker.inex + 1).lng() - Vertex.lng())));
                        } else {
                            if (marker.inex === self.getPath().getLength() - 1) {
                                Vertex.ghostMarker.setPosition(new google.maps.LatLng(Vertex.lat() + 0.5 * (self.getPath().getAt(0).lat() - Vertex.lat()), Vertex.lng() + 0.5 * (self.getPath().getAt(0).lng() - Vertex.lng())));
                            }
                        }
                    } else {
                        if (marker.inex < self.getPath().getLength() - 1) {
                            Vertex.ghostMarker.setPosition(google.maps.geometry.spherical.interpolate(Vertex, self.getPath().getAt(marker.inex + 1), 0.5));
                        } else {
                            if (marker.inex === self.getPath().getLength() - 1) {
                                Vertex.ghostMarker.setPosition(google.maps.geometry.spherical.interpolate(Vertex, self.getPath().getAt(0), 0.5));
                            }
                        }
                    }
                }
                if ((typeof (prevVertex) !== "undefined") && (typeof (prevVertex.ghostMarker) !== "undefined")) {
                    if (typeof (google.maps.geometry) === "undefined") {
                        prevVertex.ghostMarker.setPosition(new google.maps.LatLng(prevVertex.lat() + 0.5 * (marker.getPosition().lat() - prevVertex.lat()), prevVertex.lng() + 0.5 * (marker.getPosition().lng() - prevVertex.lng())));
                    } else {
                        prevVertex.ghostMarker.setPosition(google.maps.geometry.spherical.interpolate(prevVertex, marker.getPosition(), 0.5));
                    }
                }
            };
            var vertexGhostDragEnd = function () {
                ghostPath.getPath().forEach(function () {
                    ghostPath.getPath().pop();
                });
                self.getPath().insertAt(this.marker.inex + 1, this.getPosition());
                createMarkerVertex(self.getPath().getAt(this.marker.inex + 1)).inex = this.marker.inex + 1;

                moveGhostMarkers(this.marker);
                createGhostMarkerVertex(self.getPath().getAt(this.marker.inex + 1));
                self.getPath().forEach(function (vertex, inex) {
                    if (vertex.marker) {
                        vertex.marker.inex = inex;
                    }
                });
            };
            var createGhostMarkerVertex = function (point) {
                if (point.marker.inex < self.getPath().getLength() - 1) {
                    var markerGhostVertex = new google.maps.Marker({
                        position: (typeof (google.maps.geometry) === "undefined") ? new google.maps.LatLng(
                                                                          point.lat() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lat() - point.lat()),
                                                                          point.lng() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lng() - point.lng()))
                       : google.maps.geometry.spherical.interpolate(point, self.getPath().getAt(point.marker.inex + 1), 0.5),
                        map: self.getMap(),
                        icon: imgGhostVertex,
                        draggable: true,
                        raiseOnDrag: false
                    });
                    google.maps.event.addListener(markerGhostVertex, "mouseover", vertexGhostMouseOver);
                    google.maps.event.addListener(markerGhostVertex, "mouseout", vertexGhostMouseOut);
                    google.maps.event.addListener(markerGhostVertex, "drag", vertexGhostDrag);
                    google.maps.event.addListener(markerGhostVertex, "dragend", vertexGhostDragEnd);
                    point.ghostMarker = markerGhostVertex;
                    markerGhostVertex.marker = point.marker;
                    return markerGhostVertex;
                } else {
                    if (point.marker.inex === self.getPath().getLength() - 1) {
                        var markerGhostVertex = new google.maps.Marker({
                            position: (typeof (google.maps.geometry) === "undefined") ? new google.maps.LatLng(
                                                                             point.lat() + 0.5 * (self.getPath().getAt(0).lat() - point.lat()),
                                                                             point.lng() + 0.5 * (self.getPath().getAt(0).lng() - point.lng()))
                          : google.maps.geometry.spherical.interpolate(point, self.getPath().getAt(0), 0.5),
                            map: self.getMap(),
                            icon: imgGhostVertex,
                            draggable: true,
                            raiseOnDrag: false
                        });
                        google.maps.event.addListener(markerGhostVertex, "mouseover", vertexGhostMouseOver);
                        google.maps.event.addListener(markerGhostVertex, "mouseout", vertexGhostMouseOut);
                        google.maps.event.addListener(markerGhostVertex, "drag", vertexGhostDrag);
                        google.maps.event.addListener(markerGhostVertex, "dragend", vertexGhostDragEnd);
                        point.ghostMarker = markerGhostVertex;
                        markerGhostVertex.marker = point.marker;
                        return markerGhostVertex;
                    }
                }
                return null;
            };
        }
        var imgVertex = new google.maps.MarkerImage('http://rs.golden.net.vn/polygonEdit/vertex.png',
      new google.maps.Size(11, 11), new google.maps.Point(0, 0),
      new google.maps.Point(6, 6));
        var imgVertexOver = new google.maps.MarkerImage('http://rs.golden.net.vn/polygonEdit/vertexOver.png',
      new google.maps.Size(11, 11), new google.maps.Point(0, 0),
      new google.maps.Point(6, 6));
        var vertexMouseOver = function () {
            this.setIcon(imgVertexOver);
        };
        var vertexMouseOut = function () {
            this.setIcon(imgVertex);
        };
        var vertexDrag = function () {
            var movedVertex = this.getPosition();
            movedVertex.marker = this;
            movedVertex.ghostMarker = self.getPath().getAt(this.inex).ghostMarker;
            self.getPath().setAt(this.inex, movedVertex);
            if (flag) {
                moveGhostMarkers(this);
            }
        };
        var vertexRightClick = function () {
            if (flag) {
                var Vertex = self.getPath().getAt(this.inex);
                if (this.inex === 0) {
                    var prevVertex = self.getPath().getAt(self.getPath().getLength() - 1);
                } else {
                    var prevVertex = self.getPath().getAt(this.inex - 1);
                }
                if (typeof (Vertex.ghostMarker) !== "undefined") {
                    Vertex.ghostMarker.setMap(null);
                }
                self.getPath().removeAt(this.inex);
                self.getPath().forEach(function (vertex, inex) {
                    if (vertex.marker) {
                        vertex.marker.inex = inex;
                    }
                });
                if (typeof (prevVertex) !== "undefined") {
                    if (this.inex <= self.getPath().getLength()) {
                        moveGhostMarkers(prevVertex.marker);
                    } else {
                        prevVertex.ghostMarker.setMap(null);
                        prevVertex.ghostMarker = undefined;
                    }
                }
            }
            else {
                self.getPath().removeAt(this.inex);
            }
            this.setMap(null);
            if (self.getPath().getLength() === 1) {
                prevVertex.ghostMarker.setMap(null);
                self.getPath().pop().marker.setMap(null);
            }
        };
        var createMarkerVertex = function (point) {
            var markerVertex = new google.maps.Marker({
                position: point,
                map: self.getMap(),
                icon: imgVertex,
                draggable: true,
                raiseOnDrag: false
            });
            google.maps.event.addListener(markerVertex, "mouseover", vertexMouseOver);
            google.maps.event.addListener(markerVertex, "mouseout", vertexMouseOut);
            google.maps.event.addListener(markerVertex, "drag", vertexDrag);
            google.maps.event.addListener(markerVertex, "rightclick", vertexRightClick);
            point.marker = markerVertex;
            return markerVertex;
        };
        this.getPath().forEach(function (vertex, inex) {
            createMarkerVertex(vertex).inex = inex;
            if (flag) {
                createGhostMarkerVertex(vertex);
            }
        });
    };
}
if (typeof (google.maps.Polygon.prototype.stopEdit) === "undefined") {
    /**
    * Stops editing Polygon
    */
    google.maps.Polygon.prototype.stopEdit = function () {
        this.getPath().forEach(function (vertex, inex) {
            if (vertex.marker) {
                vertex.marker.setMap(null);
                vertex.marker = undefined;
            }
            if (vertex.ghostMarker) {
                vertex.ghostMarker.setMap(null);
                vertex.ghostMarker = undefined;
            }
        });
    };
}



/**
* @name polylineEdit for Google Maps V3 API
* @version 1.0.1 [January 29, 2011]
* @author: ryshkin@gmail.com
* @fileoverview <b>Author:</b> ryshkin@gmail.com<br/> <b>Licence:</b>
*               Licensed under <a
*               href="http://opensource.org/licenses/mit-license.php">MIT</a>
*               license.<br/> This library Extends the functionality of a
*               class google.maps.Polyline by methods runEdit() and stopEdit()<br/>
*               Enjoy guys:)<br/>
*               Special thanks <code>Jan Pieter Waagmeester jieter@jpwaag.com</code> for the idea of using the library google.maps.geometry , which performs spherical linear interpolation between the two locations.
*/
/**
* @name google
* @class The fundamental namespace for Google APIs 
*/
/**
* @name google.maps
* @class The fundamental namespace for Google Maps V3 API 
*/
/**
* @name google.maps.Polyline
* @class Extends standart class google.maps.Polyline by methods runEdit() and
*        stopEdit()
*/
if (typeof (google.maps.Polyline.prototype.runEdit) === "undefined") {
    /**
    * Starts editing the polyline. Optional parameter <code>flag</code>
    * indicates the use of ghost markers in the middle of each segment. By
    * default, the <code>flag</code> is true.
    * 
    * @param {}
    *            flag - (true) include additional points in the middle of each
    *            segment
    */
    google.maps.Polyline.prototype.runEdit = function (flag) {
        if (!flag) {
            //flag = true;
        }
        var self = this;
        if (flag) {
            var imgGhostVertex = new google.maps.MarkerImage(
                'http://rs.golden.net.vn/polygonEdit/vertex.png', new google.maps.Size(11, 11),
                new google.maps.Point(0, 0), new google.maps.Point(6, 6));
            var imgGhostVertexOver = new google.maps.MarkerImage(
                'http://rs.golden.net.vn/polygonEdit/vertexOver.png', new google.maps.Size(11, 11),
                new google.maps.Point(0, 0), new google.maps.Point(6, 6));
            var ghostPath = new google.maps.Polyline({
                map: this.getMap(),
                strokeColor: this.strokeColor,
                strokeOpacity: 0.2,
                strokeWeight: this.strokeWeight
            });
            var vertexGhostMouseOver = function () {
                this.setIcon(imgGhostVertexOver);
            };
            var vertexGhostMouseOut = function () {
                this.setIcon(imgGhostVertex);
            };
            var vertexGhostDrag = function () {
                if (ghostPath.getPath().getLength() === 0) {
                    ghostPath.setPath([this.marker.getPosition(), this.getPosition(), self.getPath().getAt(this.marker.inex + 1)]);
                }
                ghostPath.getPath().setAt(1, this.getPosition());
            };
            var moveGhostMarkers = function (marker) {
                var Vertex = self.getPath().getAt(marker.inex);
                var prevVertex = self.getPath().getAt(marker.inex - 1);
                if ((typeof (Vertex) !== "undefined") && (typeof (Vertex.ghostMarker) !== "undefined")) {
                    if (typeof (google.maps.geometry) === "undefined") {
                        Vertex.ghostMarker.setPosition(new google.maps.LatLng(Vertex.lat() + 0.5 * (self.getPath().getAt(marker.inex + 1).lat() - Vertex.lat()), Vertex.lng() + 0.5 * (self.getPath().getAt(marker.inex + 1).lng() - Vertex.lng())));
                    } else {
                        Vertex.ghostMarker.setPosition(google.maps.geometry.spherical.interpolate(Vertex, self.getPath().getAt(marker.inex + 1), 0.5));
                    }
                }
                if ((typeof (prevVertex) !== "undefined") && (typeof (prevVertex.ghostMarker) !== "undefined")) {
                    if (typeof (google.maps.geometry) === "undefined") {
                        prevVertex.ghostMarker.setPosition(new google.maps.LatLng(prevVertex.lat() + 0.5 * (marker.getPosition().lat() - prevVertex.lat()), prevVertex.lng() + 0.5 * (marker.getPosition().lng() - prevVertex.lng())));
                    } else {
                        prevVertex.ghostMarker.setPosition(google.maps.geometry.spherical.interpolate(prevVertex, marker.getPosition(), 0.5));
                    }
                }
            };
            var vertexGhostDragEnd = function () {
                ghostPath.getPath().forEach(function () {
                    ghostPath.getPath().pop();
                });
                self.getPath().insertAt(this.marker.inex + 1, this.getPosition());
                createMarkerVertex(self.getPath().getAt(this.marker.inex + 1)).inex = this.marker.inex + 1;

                moveGhostMarkers(this.marker);
                createGhostMarkerVertex(self.getPath().getAt(this.marker.inex + 1));
                self.getPath().forEach(function (vertex, inex) {
                    if (vertex.marker) {
                        vertex.marker.inex = inex;
                    }
                });
            };
            var createGhostMarkerVertex = function (point) {
                if (point.marker.inex < self.getPath().getLength() - 1) {
                    var markerGhostVertex = new google.maps.Marker({
                        position: (typeof (google.maps.geometry) === "undefined") ? new google.maps.LatLng(
                                                                          point.lat() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lat() - point.lat()),
                                                                          point.lng() + 0.5 * (self.getPath().getAt(point.marker.inex + 1).lng() - point.lng()))
                       : google.maps.geometry.spherical.interpolate(point, self.getPath().getAt(point.marker.inex + 1), 0.5),
                        map: self.getMap(),
                        icon: imgGhostVertex,
                        draggable: true,
                        raiseOnDrag: false
                    });
                    google.maps.event.addListener(markerGhostVertex, "mouseover", vertexGhostMouseOver);
                    google.maps.event.addListener(markerGhostVertex, "mouseout", vertexGhostMouseOut);
                    google.maps.event.addListener(markerGhostVertex, "drag", vertexGhostDrag);
                    google.maps.event.addListener(markerGhostVertex, "dragend", vertexGhostDragEnd);
                    point.ghostMarker = markerGhostVertex;
                    markerGhostVertex.marker = point.marker;
                    return markerGhostVertex;
                }
                return null;
            };
        }
        var imgVertex = new google.maps.MarkerImage('http://rs.golden.net.vn/polygonEdit/vertex.png',
      new google.maps.Size(11, 11), new google.maps.Point(0, 0),
      new google.maps.Point(6, 6));
        var imgVertexOver = new google.maps.MarkerImage('http://rs.golden.net.vn/polygonEdit/vertexOver.png',
      new google.maps.Size(11, 11), new google.maps.Point(0, 0),
      new google.maps.Point(6, 6));
        var vertexMouseOver = function () {
            this.setIcon(imgVertexOver);
        };
        var vertexMouseOut = function () {
            this.setIcon(imgVertex);
        };
        var vertexDrag = function () {
            var movedVertex = this.getPosition();
            movedVertex.marker = this;
            movedVertex.ghostMarker = self.getPath().getAt(this.inex).ghostMarker;
            self.getPath().setAt(this.inex, movedVertex);
            if (flag) {
                moveGhostMarkers(this);
            }
        };
        var vertexRightClick = function () {
            if (flag) {
                var Vertex = self.getPath().getAt(this.inex);
                var prevVertex = self.getPath().getAt(this.inex - 1);
                if (typeof (Vertex.ghostMarker) !== "undefined") {
                    Vertex.ghostMarker.setMap(null);
                }
                self.getPath().removeAt(this.inex);
                if (typeof (prevVertex) !== "undefined") {
                    if (this.inex < self.getPath().getLength()) {
                        moveGhostMarkers(prevVertex.marker);
                    }
                    else {
                        prevVertex.ghostMarker.setMap(null);
                        prevVertex.ghostMarker = undefined;
                    }
                }
            }
            else {
                self.getPath().removeAt(this.inex);
            }
            this.setMap(null);
            self.getPath().forEach(function (vertex, inex) {
                if (vertex.marker) {
                    vertex.marker.inex = inex;
                }
            });
            if (self.getPath().getLength() === 1) {
                self.getPath().pop().marker.setMap(null);
            }
        };
        var createMarkerVertex = function (point) {
            var markerVertex = new google.maps.Marker({
                position: point,
                map: self.getMap(),
                icon: imgVertex,
                draggable: true,
                raiseOnDrag: false
            });
            google.maps.event.addListener(markerVertex, "mouseover", vertexMouseOver);
            google.maps.event.addListener(markerVertex, "mouseout", vertexMouseOut);
            google.maps.event.addListener(markerVertex, "drag", vertexDrag);
            google.maps.event.addListener(markerVertex, "rightclick", vertexRightClick);
            point.marker = markerVertex;
            return markerVertex;
        };
        this.getPath().forEach(function (vertex, inex) {
            createMarkerVertex(vertex).inex = inex;
            if (flag) {
                createGhostMarkerVertex(vertex);
            }
        });
    };
}
if (typeof (google.maps.Polyline.prototype.stopEdit) === "undefined") {
    /**
    * Stops editing polyline
    */
    google.maps.Polyline.prototype.stopEdit = function () {
        this.getPath().forEach(function (vertex, inex) {
            if (vertex.marker) {
                vertex.marker.setMap(null);
                vertex.marker = undefined;
            }
            if (vertex.ghostMarker) {
                vertex.ghostMarker.setMap(null);
                vertex.ghostMarker = undefined;
            }
        });
    };
}


/*
Google Maps v3 API doesn't natively support a getBounds() method for the google.maps.Polygon class. 
This seems strange given the fact that the google.maps.Map class has a fitBounds() method, which is exactly what you're looking for.. 
If you use the Google Maps API with any kind of frequency then this should be in your bag of tricks ::
getBounds() method for the google.maps.Polygon class
*/
if (typeof (google.maps.Polygon.prototype.getBounds) === "undefined") {
    google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;
        for (var i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            for (var ii = 0; ii < path.getLength(); ii++) {
                bounds.extend(path.getAt(ii));
            }
        }
        return bounds;
    }
}


if (typeof (google.maps.Polyline.prototype.getBounds) === "undefined") {
    google.maps.Polyline.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        var path = this.getPath();

        for (var i = 0; i < path.getLength(); i++) {
            bounds.extend(path.getAt(i));
        }
        return bounds;
    }
}

/*
    Chuyen poly sang dịnh dang string cua sql geography de chen vao csdl
*/
if (typeof (google.maps.Polygon.prototype.toGeoString) === "undefined") {
    google.maps.Polygon.prototype.toGeoString = function (isValidate) {
        var result = "", len;
        if (isValidate == undefined || !isValidate) {
            len = 0;
        } else {
            len = 2;
        }

        var paths = this.getPaths(), path;
        if (paths.length > 0) {
            path = paths.getAt(0);
            if (path.length > len) {
                for (var ii = 0; ii < path.getLength(); ii++) {
                    result = result + path.getAt(ii).lng() + " " + path.getAt(ii).lat() + ",";
                }
                result = result + path.getAt(0).lng() + " " + path.getAt(0).lat();
            }
        }
        return result;
    }
}

if (typeof (google.maps.Polyline.prototype.toGeoString) === "undefined") {
    google.maps.Polyline.prototype.toGeoString = function (isValidate) {
        var result = "", len;
        if (isValidate == undefined || !isValidate) {
            len = 0;
        } else {
            len = 1;
        }
        var path = this.getPath(), length = path.length;
        if (length > len) {
            for (var i = 0; i < length - 1; i++) {
                result = result + path.getAt(i).lng() + " " + path.getAt(i).lat() + ",";
            }
            result = result + path.getAt(length - 1).lng() + " " + path.getAt(length - 1).lat();
        }
        return result;
    }
}

if (typeof (google.maps.Marker.prototype.toGeoString) === "undefined") {
    google.maps.Marker.prototype.toGeoString = function () {
        var point = this.getPosition();   
        return point.lng() + " " + point.lat();
    }
}
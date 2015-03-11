// ==UserScript==
// @name         iDo
// @namespace    http://your.homepage/
// @version      0.1
// @description  iDigitalocean
// @author       You
// @match        https://cloud.digitalocean.com/droplets
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// ==/UserScript==

(function(win, $, undef, doc) {
    $(doc).ready(function() {
        'use strict';

        /*
         *   This global variable should hold any Id selector
         */
        var idSelectors = {
            shippingAddressFormContainer: "#shipping_address_form_container",
        };

        var classSelectors = {
            pages: ".page"
        };

        /*
         *   Some SETTINGS that should be modified before launch
        */

        var iDO = {
            init: function() {
                this.events();
            },
            events: function() {
                $(document).on('keydown', null, 'ctrl+shift+]', this.getAllIps);
                $(document).on('keydown', null, 'ctrl+shift+/', this.getAllIpsWithUser);

                $(classSelectors.pages).length && this.GetServersInAllPages();
            },
            GetServersInAllPages: function(){
                var _this = this;
                // Get uri for all pages
                var allPagesUri = $(".page").not(".active").attr("href");

                // The current page droplet container
                var droplets_container = $(".droplet-listing");

                // The origin of the current page
                var origin = window.location.origin;

                // If one page only all pages will be a string
                if (typeof allPagesUri === "string"){
                    allPagesUri = [allPagesUri];
                }
                
                $.each(allPagesUri, function(index, value){
                    // Get the droplets on the second page and append them to the current one
                    var resp = $.get(origin+value, function(data){
                        // HTML code of the page
                        var code = $(data);
                        var droplets = code.find(".droplet-listing tbody tr");
                        droplets_container.append(droplets);
                    })
                    .done(function() {
                        _this._sortAlphabitatically();
                        _this._removePagination();
                    });
                });
            },
            _sortAlphabitatically: function(){
                //--- Get the table we want to sort.
                var jTableToSort = $("table.droplet-listing");

                //--- Get the rows to sort, but skip the first row, since it contains column titles.
                var jRowsToSort = jTableToSort.find ("tr:gt(0)");

                jRowsToSort.sort(this.SortByFirstColumnTextAscending).appendTo (jTableToSort);
            },
            _removePagination: function(){
                $(".pagination-holder").hide();
            },
            SortByFirstColumnTextAscending: function(zA, zB)
            {
                 var ValA_Text  = $(zA).find ("td:eq(1)").text ();
                 var ValB_Text  = $(zB).find ("td:eq(1)").text ();

                 if (ValA_Text  >  ValB_Text)
                    return 1;
                 else if (ValA_Text  <  ValB_Text)
                    return -1;
                 else
                    return 0;
            },
            getAllIps: function(){
                ips = [];
                $( ".ip" ).each(function() {
                  ips.push($( this ).html());
                });
                
                var div = $("<div>"+ips.join("<br>")+"</div>");
                $(".pagination-holder").html(div);
            },
            getAllIpsWithUser: function(){
                ips = [];
                $( ".ip" ).each(function() {
                  ips.push($( this ).html().trim());
                });
                
                var div = $("<div>"+ips.join("<br>root@")+"</div>");
                $(".pagination-holder").html(div);
            }

        };

        //initiate codi on its own page
        iDO.init();
    });
})(window, window.jQuery, undefined, document);
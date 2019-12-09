﻿/**
* @author Christopher Cook
* @copyright Webprofusion Pty Ltd https://webprofusion.com
*/

import { AppConfig } from './../../core/AppConfig';
import { MappingAPI } from './interfaces/mapping';
import { Utils } from '../../core/Utils';

declare var ocm_app: any;
declare var plugin: any;

function initGoogleMapsCompleted() {
    ocm_app.mappingManager.externalAPILoaded(MappingAPI.GOOGLE_WEB);
    ocm_app.initPlacesAutocomplete();
}

function loadGoogleMaps() {
    // load google maps script async, if google API is selected
    if (ocm_app.mappingManager.mapOptions.mapAPI != MappingAPI.GOOGLE_WEB) {
        {
            if (console) {
                console.log("Google Maps Web API not selected [" +
                    MappingAPI[ocm_app.mappingManager.mapOptions.mapAPI] +
                    "]. Loading API anyway.");
            }
        }
    }

    if (ocm_app.appState.isRunningUnderCordova) {
        let mappingManager = ocm_app.mappingManager;
        return;

        /*if (mappingManager.mapOptions.mapAPI != MappingAPI.GOOGLE_NATIVE) {
            //for cordova, switch over to native google maps, if available
            if ((<any>window).plugin && plugin.google && plugin.google.maps) {
                plugin.google.maps.Map.isAvailable(function (isAvailable, message) {
                    if (isAvailable) {
                        mappingManager.log("Native maps available, switching API.");
                        mappingManager.setMapAPI(MappingAPI.GOOGLE_NATIVE);
                        mappingManager.mapAPIReady = true;
                    } else {
                        mappingManager.log("Google Play Services not available, fallback to web maps API");
                    }
                });
            } else {
                mappingManager.log("Running under cordova but no native maps plugin available.");
            }
        }*/
    }

    if (console) { console.log("Starting load of Google Maps Web API"); }

    let script = document.createElement('script');
    script.type = 'text/javascript';

    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=' + new AppConfig().googleMapsAPIKey
        + '&signed_in=true&callback=initGoogleMapsCompleted';
    document.body.appendChild(script);
}

if (Utils.isFeatureEnabled('GOOGLE_MAPS')) {
    // if we are not running under cordova then we use Google Maps Web API, otherwise we still use API for distance etc
    window.onload = loadGoogleMaps;
}

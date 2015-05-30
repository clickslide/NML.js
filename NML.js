/**
 * NML is an extensible object oriented JavaScript library for connecting and communicating with Datadipity.com APIs. This is designed to drasitically reduce development time when building connected products and software. Copyright 2014 Clickslide Limited. All rights reserved.
 * @namespace NML
 */

/*jshint unused: false */
/* global window, $ */
//============================================================
// Register Namespace
//------------------------------------------------------------
var NML = NML || {};

(function () {
    "use strict";

    //============================================================
    // Constructor - MUST BE AT TOP OF FILE
    //------------------------------------------------------------
    /**
     * @description An NML object
     * @class NML
     * @memberOf NML
     * @global
     */
    NML = function () {
        this.created = true;
    };

    //============================================================
    // Member Functions & Variables
    //------------------------------------------------------------
    NML.prototype = {

        /**
         * @description Was NML() created?
         * @protected
         * @memberOf NML
         * @property {boolean} created
         * @inner
         */
        created: false,

        /**
         * @description The URL for the API. This variable is used internally. It can be set using the method setBaseUrl() of the NML object.
         * @protected
         * @memberOf NML
         * @property {string} BaseUrl
         * @inner
         */
        BaseUrl: null,

        /**
         * @description This is a reference object to the NML object created in the app. This helps with scope and referencing.
         * @protected
         * @memberOf NML
         * @property {NML} appnml
         * @inner
         */
        appnml: null,

        /**
         * @description A reference to the app config array.
         * @protected
         * @memberOf NML
         * @property {array} appconfig
         * @inner
         */
        appconfig: [],

        /**
         * @description Set the config for the app and save it as a serialized string using JSON.stringify to the localstorage.
         * @function setAppConfig
         * @memberOf NML
         * @public
         * @param {object} _config - pass the appconfig object from the App
         * @return null
         * @inner
         */
        setAppConfig:function(_config){
            this.appconfig = _config;
            window.localStorage.appconfig = JSON.stringify(_config);
        },

        /**
         * @description This is a reference to a method in the A
         * @protected
         * @memberOf NML
         * @property {function} handleLogin
         * @inner
         */
        handleLogin: null,

        /**
         * @description After login, load the first API data from the appconfig.
         * @protected
         * @memberOf NML
         * @property {boolean} initWithData
         * @inner
         */
        initWithData: true,

        /**
         * @description Keeps track of which API we are logged into.
         * @protected
         * @memberOf NML
         * @property {integer} loginIndex
         * @inner
         */
        loginIndex: 0,

        /**
         * @description A custom callback after loadDialogs completes to be triggered in the App instead of the built in methods.
         * @protected
         * @memberOf NML
         * @property {function} loadDialogCallback
         * @inner
         */
        loadDialogCallback: null,

        /**
         * @description The ID of the home page as described in the NML document
         * @protected
         * @memberOf NML
         * @property {string|number} homePageId
         * @inner
         */
        homePageId: null,

        /**
         * @description Track if the app is running on phonegap or browser
         * @property {boolean} isGap
         * @memberOf NML
         * @public
         * @inner
         */
        isGap: false,

        /**
         * @description A function used to handle NML data when it is returned from the server.
         * @public
         * @memberOf NML
         * @callback onGetData
         * @inner
         */
        onGetData: null,

        /**
         * @description Whether or not search is enabled in the API
         * @private
         * @memberOf NML
         * @property search
         */
        search: "0",

        /**
         * @description Set the homePageId parameter.
         * @function setHomePageId
         * @memberOf NML
         * @public
         * @param {String} id - id of the homepage
         * @return null
         * @inner
         */
        setHomePageId: function (id) {
            this.homePageId = id;
        },

        /**
         * @description Get the homePageId parameter.
         * @function setHomePageId
         * @public
         * @memberOf NML
         * @return null
         * @inner
         */
        getHomePageId: function () {
            return this.homePageId;
        },

        /**
         * @description Set the BaseUrl parameter.
         * @function setBaseUrl
         * @memberOf NML
         * @public
         * @param {string} url - the url as developer/app based on your Datadipity API.
         * @param {string} protocol - http or https, always https for Datadipity.com
         * @param {string} host - datadipity.com
         * @return null
         * @inner
         */
        setBaseUrl: function (url, protocol, host) {
            this.BaseUrl = protocol + "://" + host + "/" + url;
        },
        /**
         * @description Get the BaseUrl.
         * @function getBaseUrl
         * @public
         * @memberOf NML
         * @return {string} BaseUrl - The base url variable
         * @inner
         */
        getBaseUrl: function () {
            return this.BaseUrl;
        },

        /**
         * @description Set the session ID in local storage.
         * @function setSession
         * @public
         * @memberOf NML
         * @return null
         * @inner
         */
        setSession: function (sess, index) {
            try{
                var a = JSON.parse(window.localStorage.appconfig);
                a[index].sessid = sess;
                window.localStorage.appconfig = JSON.stringify(a);
            }catch(err){
                console.log("ERROR");
                console.log(err);
            }
        },
        /**
         * @description get the session ID from local storage.
         * @function getSession
         * @public
         * @memberOf NML
         * @return {string} Session - The session ID
         * @inner
         */
        getSession: function (index) {
            var a = JSON.parse(window.localStorage.appconfig);
            return a[index].sessid;
            //return window.localStorage.sessid[index];
            //return this.appconfig[index].sessid;
        },

        /**
         * @function Register
         * @memberOf NML
         * @public
         * @description Registration and Login use similar functionality. New users and possibly returning users will have to authorize API services. Once logged in or registered, if authorization is required, Clickslide will return a "registerApis=true" in its JSON response. The manageAuthRedirect Method in the example handles this behavior. It is altered slightly in Cordova Phonegap.
         * @param {string} userName - Name of user to register
         * @param {string} userEmail - Email address of the user ro register
         * @param {string} userPassword1 - Email address of the user to register
         * @param {string} userPassword2 - Verify the user password
         * @param {function} callback - a custom function to override the onRegister method. This method will take a data object as an argument.
         * @return null
         * @inner
         */
        Register: function (userName, userEmail, userPassword1, userPassword2, callback) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.onRegister;
            }
            // simple validation
            if (userEmail.length === 0) {
                alert("Enter valid email address");
                return false;
            }
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(userEmail)) {
                alert("Enter valid email address");
                return false;
            }
            if (userName.length === 0) {
                alert("Enter name");
                return false;
            }
            if (userPassword1.length === 0) {
                alert("Enter password");
                return false;
            }
            if (userPassword2.length === 0) {
                alert("Repeat password");
                return false;
            }
            if (userPassword1 !== userPassword2) {
                alert("Password is not the same");
                return false;
            }

            var nml = this;

            $.ajax({
                type: "POST",
                url: this.BaseUrl + "/register/doRegister.json",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                crossDomain: true,
                data: {
                    name: userName,
                    email: userEmail,
                    password: userPassword1
                },
                success: function (data) {
                    next(data, nml);
                },
                error: function (err) {
                    console.log("Registration Failed!");
                    console.log(JSON.stringify(err));
                }
            });
        },

        /**
         * @description Default callback for the Register method.. This function does nothing at the moment except log the data returned. You should override this in your app by sending a <callback> function to the Register function.
         * @function onRegister
         * @private
         * @memberOf Datadipity
         * @param {object} data - This is the JSON object coming from the server.
         * @param {object} nml - This is the NML object used to maintain scope.
         * @return null
         * @inner
         */
        onRegister: function (data, _nml) {
            // default callback for Login
            console.log(data);
            // TODO? validate NML has been instantiated?
            if (data.success === true || data.success == "true") {

                _nml.setSession(data.session.id, this.loginIndex);

                if (data.registerApis === true || data.registerApis == "true") {

                    // force redirect Browser
                    //window.location = nml.BaseUrl+'/register/apis';
                    // App;
                    window.open(_nml.BaseUrl + "/register/apis?PHPSESSID=" + _nml.getSession(), "App Authorization", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350");
                }
            }
        },
        /**
         * @description Logout an App user or developer to their Clickslide account.
         * @method Logout
         * @public
         * @memberOf NML
         * @param {string} sessid - Session ID
         * @param {asyncCallback} callback - a custom function to override the onLogin method. This method will take a data object as an argument.
         * @return null
         * @todo Make sure the server accepts POST requests and not GET requests for LOGOUT. GET is too insecure.
         * @inner
         */
        Logout: function (sessid, callback, _nml) {
            console.log(this.appnml);
            var next = null;
            if (callback !== null) {
                // pass the nml{} object around
                next = callback;
            } else {
                next = this.onLogin;
            }
            this.appnml.setBaseUrl(
                this.appconfig[this.loginIndex].url,
                "https",
                "datadipity.com"
            );
            $.ajax({
                type: "GET",
                url: this.appnml.BaseUrl + "/login/logout.json?PHPSESSID=" + sessid,
                crossDomain: true,
                success: function (data) {
                    next(data);
                },
                error: function (res, status, err) {
                    console.log("Logout Failed! - " + status);
                    console.log(JSON.stringify(err));
                }
            });
        },
        /**
         * @description Login an App user or developer to their Clickslide account.
         * @method Login
         * @public
         * @memberOf NML
         * @param {string} userEmail - Email address of the user to login
         * @param {string} userPassword - To be used once to connect for a session *DO NOT STORE THIS*
         * @param {asyncCallback} callback - a custom function to override the onLogin method. This method will take a data object as an argument.
         * @todo Make sure the server accepts POST requests and not GET requests for LOGIN. GET is too insecure.
         * @return null
         * @inner
         */
        Login: function (userEmail, userPassword, callback, _nml) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.onLogin;
            }

            var appnml = this.appnml;
            // TODO: switch to POST only
            $.ajax({
                type: "GET",
                url: _nml.BaseUrl + "/login/doLogin.json",
                crossDomain: true,
                data: {
                    email: userEmail,
                    password: userPassword
                },
                success: function (data) {
                    // Set Session Variable Here to maintain scope
                    next(data);
                },
                error: function (res, status, err) {
                    console.log("Login Failed! - " + status);
                    console.log(JSON.stringify(err));
                }
            });
        },

        /**
         * @description Default callback for the Login method.. This function sets the user session for this NML object. You can override this but we suggest calling NML.onLogin(data) in the first line of your custom callback to make sure the NML object maintains its session data properly.
         * @function onLogin
         * @private
         * @memberOf NML
         * @param {object} data - This is the JSON object coming from the server.
         * @summary This method will redirect to the API authentication page if the logged in user needs to authenticate with any APIs used in the application.
         * @return null
         * @inner
         * @TODO: somehow tie
         */
        onLogin: function (data) {
            // default callback for Login
            if (data.success === true || data.success === "true") {
                // save the session
                this.setSession(data.session.id, this.loginIndex);
            }
        },

        /**
         * @description POST data to Datadipity.com to create a new resource or trigger the "add" event for API communication. TODO: Add the ability to upload files.
         * @function add
         * @memberOf NML
         * @public
         * @param {string} action - This is an NML String representing the resource to add. This resource will be parsed and will trigger the API events on the server side. <BasicPage>...</BasicPage>
         * @param {string} pageType - A NML page type in lowercase and plural: basicpages, listpages, etc. It depends on the type of page you are posting to the ListPage and which type of page it accepts.
         * @param {asyncCallback} callback - A custom callback function to override the default. This takes an NML object as an argument.
         * @return null
         * @inner
         */
        add: function (action, pagesType, callback, index) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }

            // TODO: This URL should already be set from the App
            // post request to Datadipity.com
            this.setBaseUrl(this.appconfig[index].url, "https", "datadipity.com");

//            $.get(
//                this.BaseUrl + "/" + pagesType + ".xml?_method=post&_action=" + action + "&PHPSESSID=" + this.getSession(index)
//            ).done(next);

            // TODO: Create action templates in NML based on available data models
            var postUrl =  this.BaseUrl + "/" + pagesType + ".xml?_method=post&_action=" + action + "&PHPSESSID=" + this.getSession(index);
            $.ajax({
                type: "POST",
                url: postUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                crossDomain: true,
                data: {
                    _method: 'post',
                    _action: action
                },
                success: function (data) {
                    next(data, nml);
                },
                error: function (err) {
                    console.log("Registration Failed!");
                    console.log(JSON.stringify(err));
                }
            });
        },

        /**
         * @description POST Filedata to Datadipity.com to trigger the "get" event for API communication. This is used when the first API in your chain requires File input. An example of such an API would be an Image Recognition API.
         * @function getWithFile
         * @memberOf NML
         * @public
         * @param {FormData} Filedata - This is the object from the File Input tag in HTML
         * @param {asyncCallback} callback - A custom callback function to override the default. This takes an NML object as an argument.
         * @param {string} pageTypes - basicpages, linkpages, etc.
         * @todo Add ability to POST / PUT file to page ID to trigger update event
         * @return null
         * @inner
         */
        getWithFile: function (Filedata, callback, index, pageTypes) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            console.log(Filedata);

            var postUrl =  this.BaseUrl;

            // POST to the page to trigger "Add" event on API method
            if( pageTypes !== null ){
                postUrl += "/"+pageTypes;
            }

            // PUT to a page ID
//            if( pageTypes !== null && pageId !== null){
//                postUrl += "/"+pageTypes+"/"+pageId;
//            }

            postUrl += ".json?update&PHPSESSID=" + this.getSession(index);
            $.ajax({
                type: "POST",
                url: postUrl,
                crossDomain: true,
                processData: false,
                contentType: false,
                data: Filedata,
                success: function (data) {
                    next(data);
                },
                error: function (err) {
                    console.log("Registration Failed!");
                    console.log(JSON.stringify(err));
                }
            });
        },

        /**
         * @description Update an NML resource on the Datadipity server
         * @function update
         * @memberOf NML
         * @public
         * @param {string} action - This is an NML String representing the resource to add. This resource will be parsed and will trigger the API events on the server side. <BasicPage>...</BasicPage>
         * @param {string} pageType - A NML page type in lowercase and plural: basicpages, listpages, etc. It depends on the type of page you are posting to the ListPage and which type of page it accepts.
         * @param {asyncCallback} callback - A custom callback function to override the default. This takes an NML object as an argument.
         * @param {integer} index - the item to use from AppConfig
         * @return null
         * @inner
         */
        update: function (action, pageType, callback, index) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            // GET put request to Datadipity.com
            // post request to Datadipity.com
            this.setBaseUrl(
                this.appconfig[index].url,
                "https",
                "datadipity.com"
            );
//            $.get(
//                this.BaseUrl + "/" + pageType + ".xml?_method=put&_action=" + action + "&PHPSESSID=" + this.getSession()
//            ).done(next);
            var postUrl =   this.BaseUrl + "/" + pageType + ".xml?_method=put&_action=" + action + "&PHPSESSID=" + this.getSession(index);
            $.ajax({
                type: "POST",
                url: postUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                crossDomain: true,
                data: {
                    _method: 'put',
                    _action: action
                },
                success: function (data) {
                    next(data, nml);
                },
                error: function (err) {
                    console.log("Registration Failed!");
                    console.log(JSON.stringify(err));
                }
            });
        },

        /**
         * @description Remove a resource from the Datadipity server using basic pages as an example it would look similar to https://datadipity.com/developerurl/apiurl/pageType/pageId.xml?_method=delete
         * @function remove
         * @memberOf NML
         * @public
         * @param {string} pageType - the type of page eg: basicpages, listpages, linkpages, etc.
         * @param {string} pageId - Required to execute a delete on a resource
         * @param {integer} index - the item to use from AppConfig
         * @return null
         * @inner
         */
        remove: function (pageType, pageId, callback, index) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            // GET delete request to Datadipity.com using XML
            this.setBaseUrl(
                this.appconfig[index].url,
                "https",
                "datadipity.com"
            );
            $.get(
                this.BaseUrl + "/" + pageType + "/" + pageId + ".xml?_method=delete&PHPSESSID=" + this.getSession()
            ).done(next);
        },

        /**
         * @description A simple method to get a single NML object or a collection of objects. Urls for requests are formed as NML.AppUrl/pageUrl.json or NML.AppUrl/pageTypespageId.json. This uses JSON by default. This has an XML endpoint but is not implemented in JavaScript.
         * @function get
         * @memberOf NML
         * @public
         * @param {asyncCallback} callback - A function to override the default event listener.
         * @param {boolean} withUpdate - Adds ?update to force the API data provider to refresh
         * @param {array} postparams - Adds ?postparam[key]=val from [{name:key, value:val}] for every Object in the array
         * @param {string} pageType - basicpages, listpages, linkpages, etc.
         * @param {string} pageId - The ID parameter from the @attributes.id element
         * @param {string} pageUrl - This will override using pageType/pageId
         * @param {integer} index - the item to use from AppConfig
         * @todo More testing needs to be done using individual page types.
         * @return null
         * @inner
         */
        get: function (index, callback, withUpdate, postparams, pageType, pageId, pageUrl) {
            var next = null;
            if (callback) {
                next = callback;
            } else {
                next = null;
            }
            this.setBaseUrl(
                this.appconfig[index].url,
                "https",
                "datadipity.com"
            );
            // get request to Datadipity.com
            var reqUrl = this.BaseUrl;
            try {
                if ((pageType !== null && pageType !== undefined) && (pageId === null || pageId === undefined)) {
                    // get the collection
                    reqUrl = this.BaseUrl + "/" + pageType.toLowerCase();
                } else if ((pageId !== null && pageId !== undefined) && (pageType === null || pageType === undefined)) {
                    throw {
                        name: "Configuration Error",
                        level: "Cancel Request",
                        message: "pageType cannot be null when pageId is not. this.get()"
                    };
                } else if ((pageId !== null && pageId !== undefined) && (pageType !== null && pageType !== undefined)) {
                    // pageType and pageId are both set
                    reqUrl = this.BaseUrl + "/" + pageType.toLowerCase() + "/" + pageId.toLowerCase();
                }
            } catch (err) {
                console.log("error");
                console.log(err);
            }

            if (pageUrl !== null && pageUrl !== undefined) {
                reqUrl = this.BaseUrl + "/" + pageUrl.toLowerCase();
            }
            console.log("getting Session");
            console.log(index);

            var sessid = this.getSession(index);
            // include the session
            if (sessid != "null" && sessid != "undefined" && sessid !== null && sessid !== undefined) {
                if (withUpdate === true) {
                    reqUrl += ".json?update&PHPSESSID=" + sessid;
                } else {
                    reqUrl += ".json?PHPSESSID=" + sessid;
                }
            } else {
                if (withUpdate === true) {
                    reqUrl += ".json?update";
                } else {
                    reqUrl += ".json";
                }
            }

            // include postparams
            if ((postparams !== undefined && postparams !== null) && postparams.length > 0) {
                var c = postparams.length;
                for (var i = 0; i < c; i++) {
                    reqUrl += "&postparam[" + postparams[i].name + "]=" + postparams[i].value;
                }
            }

            // get the request
            console.log("Get: " + reqUrl);
            $.ajax({
                type: "GET",
                url: reqUrl,
                dataType: "text"
            }).done(next).fail(function (err) {
                console.log("GET Failed!", JSON.stringify(err));
                //console.log();
            });
        },
        /**
         * @description Logs any Ajax failures to the console
         * @function failedRequest
         * @memberOf NML
         * @private
         * @param {object} xhr The full Ajax request object
         * @param {string} status The Error message
         * @param {object} err The full Error object
         * @return null
         * @inner
         */
        failedRequest: function (xhr, status, err) {
            console.log(err);
        },
        /**
         * @description This sets the search boolean and the homepage ID
         * @function processPageData
         * @memberOf NML
         * @protected
         * @param {object} data
         * @return null
         * @inner
         */
        processPageData: function (data) {
            // load homepage template
            this.search = data.ListPage.search;
            this.setHomePageId(data.ListPage["@attributes"].id);
        },
        /**
         * @description Loads the login-register-auth template and the loading-progress templates into the appropriate DIVs. You may override this method by not calling it in your app. Login form uses nml.handleLoginFormSubmit for its callback and Register uses _nml.handleRegisterFormSubmit for its callback. Be sure to register a data handling fuction with nml.onGetData before calling this method.
         * @function loadDialogs
         * @memberOf NML
         * @public
         * @param {function} callback - A function to trigger once the Login/Register/Auth dialogs have been loaded from the template files.
         * @param {NML} appnml - A reference to the NML Object created in the app.
         * @return null
         * @inner
         */
        loadDialogs: function (callback, appnml, appconfig) {
            // var _nml = this;
            this.appnml = appnml;
            this.appconfig = appconfig;
            if (window.localStorage.appconfig !== null && window.localStorage.appconfig !== undefined) {
                window.localStorage.appconfig = window.localStorage.appconfig;
            } else {
                window.localStorage.appconfig = JSON.stringify(appconfig);
            }
            this.loadDialogCallback = callback;
            console.log("Loading Dialogs");
            if ($("#login-register-auth")) {
                $.get("templates/jsviews/login-register-auth.html").done(function (data) {
                    console.log("data got");
                    console.log(data);
                    $("#login-register-auth").html(data);
                    if ($("#loading-progress")) {
                        $.get("templates/jsviews/loading-progress.html").done(function (data) {
                            $("#loading-progress").html(data);
                            // Set Login/Register Form Listeners
                            $("#loginForm").on("submit", function (evt) {
                                evt.preventDefault();
                                appnml.handleLoginFormSubmit(evt, appnml);
                            });
                            $("#registerForm").on("submit", function (evt) {
                                evt.preventDefault();
                                appnml.handleRegisterFormSubmit(evt, appnml);
                            });
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        /**
         * @description This is a generic handler for both login and register. If a Session isn't returned then the user is registered but if it is and APIs require authorization the user is redirected to the Authorize APIs screen which opens in a new Window. The reason for opening in a new window is to enable oAuth 1 and oAuth 2 server handshakes. If APIs don't need auth then it will trigger the first download of data from the server.
         * @function onLoginOrRegister
         * @memberOf NML
         * @private
         * @param {object} data This is coming from the server
         * @param {object} _nml This is the NML() object
         * @return null
         * @inner
         */
        onLoginOrRegister: function (data, _nml) {
            // TODO: Check for login success
            if (data.session !== null && data.session !== undefined && data.session.id !== "undefined" && data.session !== "null") {
                $("#loadertext").html("Loading Tweets...");
                _nml.onLogin(data);
                // TODO: This may not quite be correct on the server.
                if (data.registerApis === true || data.registerApis === "true") {
                    _nml.manageAuthRedirect(_nml);
                    //nml.onRegister(data)
                } else {
                    // if we don't need to authorize APIs
                    console.log("Getting Data");
                    if
                        (_nml.loginIndex < (_nml.appconfig.length - 1)) {
                        // set Index ++
                        _nml.loginIndex++;
                        _nml.loadDialogs(_nml.loadDialogCallback, _nml, _nml.appconfig);

                    } else {
                       // _nml.get(_nml.onGetData, true);
                        // start GUI
                        if (_nml.initWithData === true) {
                            $("#loader").modal("toggle");
                            _nml.get(0, _nml.onGetData, true);
                        } else {
                            console.log("Gettign Data");
                            console.log(_nml);
                            _nml.onGetData();
                        }
                    }
                }
            } else {
                // add message to login modal
                $("#loginRegister").modal("toggle");
                $("#failedLogin").text(data.message);
            }
        },
        /**
         * @description When a user submits the Login form
         * @callback handleLoginFormSubmit
         * @memberOf NML
         * @private
         * @param {object} evt This is coming from the button Click
         * @param {object} _nml This is the NML() object
         * @return null
         * @inner
         */
        handleLoginFormSubmit: function (evt, _nml) {
            evt.preventDefault();
            var email = $("#loginEmail").val();
            var password = $("#loginPassword").val();
            _nml.setBaseUrl(_nml.appconfig[_nml.loginIndex].url, 'https', 'datadipity.com');
            console.log(_nml);
            $("#loginRegister").modal("toggle");
            $("#loginRegister").bind("hidden.bs.modal", function (evt) {
                $("#loginRegister").unbind("hidden.bs.modal");
                $("#loadertext").html("Logging In...");
                $("#loader").modal("toggle");
                console.log(_nml);
                if (_nml.getSession(_nml.loginIndex) === undefined || _nml.getSession(_nml.loginIndex) === "undefined") {
                    console.log("Wrong Session ID");
                    _nml.setSession(null, _nml.loginIndex);
                    _nml.Login(email, password, function (data) {
                        if (_nml.handleLogin !== null) {
                            _nml.handleLogin(data);
                        } else {
                            _nml.onLoginOrRegister(data, _nml);
                        }
                    });
                } else {
                    console.log(_nml);
                    _nml.Logout(_nml.getSession(_nml.loginIndex), function (data) {
                        _nml.setSession(null, _nml.loginIndex);
                        console.log("Logging In afgter logout");
                        _nml.Login(email, password, function (nData) {
                            if (_nml.handleLogin !== null) {
                                _nml.handleLogin(nData);
                            } else {
                                _nml.onLoginOrRegister(nData, _nml);
                            }
                        });
                    });
                }
            });
        },
        /**
         * @description When a user submits the Register form
         * @callback handleRegisterFormSubmit
         * @memberOf NML
         * @private
         * @param {object} evt This is coming from the button Click
         * @param {object} _nml This is the NML() object
         * @return null
         * @inner
         */
        handleRegisterFormSubmit: function (evt, _nml) {
            evt.preventDefault();
            var name = $("#registerName").val();
            var email = $("#registerEmail").val();
            var password = $("#registerPassword").val();
            var password2 = $("#registerPassword2").val();
            $("#loginRegister").modal("toggle");
            $("#loginRegister").bind("hidden.bs.modal", function (evt) {
                $("#loginRegister").unbind("hidden.bs.modal");
                $("#loadertext").html("Attempting Registration...");
                $("#loader").modal("toggle");
                _nml.Register(name, email, password, password2, _nml.onLoginOrRegister);
            });
        },
        /**
         * @description Verify APIs and redirect for Auth if necessary. This method ends by calling _nml.get(_nml.onGetData, true). Be sure to register a callback with onGetData before this gets called otherwise it will lose its scope.
         * @function manageAuthRedirect
         * @private
         * @memberOf NML
         * @param {object} _nml This is the NML() object
         * @return null
         * @inner
         */
        manageAuthRedirect: function (_nml) {
            // show redirect modal
            $("#loader").bind("hidden.bs.modal", function (evt) {
                $("#loader").unbind("hidden.bs.modal");
                $("#authlink").attr("href", _nml.BaseUrl + "/register/apis?PHPSESSID=" + _nml.getSession(_nml.loginIndex));
                console.log("OPEN AUTH LINK: " + _nml.BaseUrl + "/register/apis?PHPSESSID=" + _nml.getSession(_nml.loginIndex) );
                $("#authlink").click(function (evt) {
                    evt.preventDefault();
                    var url = evt.currentTarget.href;
                    console.log(url);

                    var popup = window.open(url, "_blank", "location=yes");
                    console.log("IS GAP? " + _nml.isGap);
                    if (!_nml.isGap) {
                        // do this in browser
                        var timer = setInterval(function (evt) {
                            if (popup.closed) {
                                console.log("Popup Closed");
                                clearInterval(timer);
                                $("#generic").bind(
                                    "hidden.bs.modal",
                                    function (evt) {
                                        $("#generic").unbind(
                                            "hidden.bs.modal"
                                        );
                                        console.log("LOgin Index: " + _nml.loginIndex);
                                        console.log("Login Length: " + _nml.appconfig.length);
                                        // login the next API
                                        if (_nml.loginIndex < (_nml.appconfig.length - 1)) {
                                            // set Index ++
                                            _nml.loginIndex++;
                                            _nml.loadDialogs(_nml.loadDialogCallback, _nml, _nml.appconfig);

                                        } else {

                                            // start GUI
                                            if (_nml.initWithData === true) {
                                                $("#loader").modal("toggle");
                                                _nml.get(_nml.onGetData, true);
                                            } else {
                                                console.log("Gettign Data");
                                                console.log(_nml);
                                                _nml.onGetData();
                                            }
                                        }
                                    }
                                );
                                $("#generic").modal("toggle");
                            }
                        }, 500);
                    } else {
                        // do this in phonegap
                        popup.addEventListener("exit", function () {
                            //clearInterval(timer);
                            $("#generic").bind(
                                "hidden.bs.modal",
                                function (evt) {
                                    $("#generic").unbind(
                                        "hidden.bs.modal"
                                    );
                                    console.log("LOgin Index: " + _nml.loginIndex);
                                    console.log("Login Length: " + _nml.appconfig.length);
                                    // login the next API
                                    if (_nml.loginIndex < (_nml.appconfig.length - 1)) {
                                        // set Index ++
                                        _nml.loginIndex++;
                                        _nml.loadDialogs(_nml.loadDialogCallback, _nml, _nml.appconfig);

                                    } else {

                                        // start GUI
                                        if (_nml.initWithData === true) {
                                            $("#loader").modal("toggle");
                                            _nml.get(_nml.onGetData, true);
                                        } else {
                                            console.log("Gettign Data");
                                            console.log(_nml);
                                            _nml.onGetData();
                                        }
                                    }
                                }
                            );
                            $("#generic").modal("toggle");
                        });
                    }

                });
                $("#generic").modal("toggle");
            });
            $("#loader").modal("toggle");
        },

        /**
         * @private
         * @description Extract the parentPage (if it exists) using a page ID
         * @function getParentPage
         * @memberOf NML
         * @param {string} pageid - the current page id
         * @return Object - the parent page
         * @todo This is not yet implemented
         * @inner
         */
        getParentPage: function (pageid) {
            // TODO: make this work
        }
    };
})();

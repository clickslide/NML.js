/**
 * NML is an extensible object oriented JavaScript library for connecting and communicating with Datadipity.com APIs. This is designed to drasitically reduce development time when building connected products and software. Copyright 2014 Clickslide Limited. All rights reserved.
 * @namespace NML
 */

/**
 * A callback definition used in NML class documentation.
 * @callback asyncCallback
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
     * An NML object
     * @constructor
     */
    NML = function () {
        this.created = true;
    };

    //============================================================
    // Member Functions & Variables
    //------------------------------------------------------------
    NML.prototype = {

        /** @protected */
        created: false,

        /** @protected */
        BaseUrl: null,

        /** @protected */
        homePageId: null,
        
        /** 
         * @description Track if the app is running on phonegap or browser
         * @property isGap
         * @public 
         */
        isGap: false,

        /** @public */ 
        onGetData: null,

        /** @public */
        search: "0",

        /**
         * @description Set the homePageId parameter.
         * @function setHomePageId
         * @memberOf NML
         * @param {String} id - id of the homepage
         * @return null
         */
        setHomePageId: function (id) {
            this.homePageId = id;
        },

        /**
         * @description Get the homePageId parameter.
         * @function setHomePageId
         * @memberOf NML
         * @return null
         */
        getHomePageId: function () {
            return this.homePageId;
        },

        /**
         * @description Set the BaseUrl parameter.
         * @function setBaseUrl
         * @memberOf NML
         * @param {string} url - the url as developer/app based on your Datadipity API.
         * @param {string} protocol - http or https, always https for Datadipity.com
         * @param {string} host - datadipity.com
         * @return null
         */
        setBaseUrl: function (url, protocol, host) {
            this.BaseUrl = protocol + "://" + host + "/" + url;
        },
        /**
         * @description Get the BaseUrl.
         * @function getBaseUrl
         * @memberOf NML
         * @return {string} BaseUrl - The base url variable
         */
        getBaseUrl: function () {
            return this.BaseUrl;
        },

        /**
         * @description Set the session ID in local storage.
         * @function setSession
         * @memberOf NML
         * @return {string} BaseUrl - The base url variable
         */
        setSession: function (sess) {
            window.localStorage.sessid = sess;
            //self.Session = sess;
        },
        /**
         * @description get the session ID from local storage.
         * @function getSession
         * @memberOf NML
         * @return {string} BaseUrl - The base url variable
         */
        getSession: function () {
            return window.localStorage.sessid;
        },

        /**
     * @function Register
     * @memberOf NML
     * @description Registration and Login use similar functionality. New users and possibly returning users will have to authorize API services. Once logged in or registered, if authorization is required, Clickslide will return a "registerApis=true" in its JSON response. The manageAuthRedirect Method in the example handles this behavior. It is altered slightly in Cordova Phonegap.
     * @param {string} userName - Name of user to register
     * @param {string} userEmail - Email address of the user ro register
     * @param {string} userPassword1 - Email address of the user to register
     * @param {string} userPassword2 - Verify the user password
     * @param {asyncCallback} callback - a custom function to override the onRegister method. This method will take a data object as an argument.
     * @return null
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
         * @memberOf Datadipity
         * @param {object} data - This is the JSON object coming from the server.
         * @param {object} nml - This is the NML object used to maintain scope.
         * @return null
         */
        onRegister: function (data, _nml) {
            // default callback for Login 
            console.log(data);

            if (data.success === true || data.success == "true") {

                _nml.setSession(data.session.id);

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
         * @memberOf NML
         * @param {string} sessid - Session ID
         * @param {asyncCallback} callback - a custom function to override the onLogin method. This method will take a data object as an argument.
         * @return null
         */
        Logout: function (sessid, callback) {
            var next = null;
            var nml = this;
            if (callback !== null) {
                // pass the nml{} object around
                next = callback;
            } else {
                next = this.onLogin;
            }

            $.ajax({
                type: "GET",
                url: this.BaseUrl + "/login/logout.json?PHPSESSID=" + sessid,
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
         * @memberOf NML
         * @param {string} userEmail - Email address of the user to login
         * @param {string} userPassword - To be used once to connect for a session *DO NOT STORE THIS*
         * @param {asyncCallback} callback - a custom function to override the onLogin method. This method will take a data object as an argument.
         * @todo Make sure the server accepts POST requests and not GET requests for LOGIN. GET is too insecure.
         * @return null
         */
        Login: function (userEmail, userPassword, callback) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.onLogin;
            }
            console.log("Getting: " + this.BaseUrl + "/login/doLogin.json");
            $.ajax({
                type: "GET",
                url: this.BaseUrl + "/login/doLogin.json",
                crossDomain: true,
                data: {
                    email: userEmail,
                    password: userPassword
                },
                success: function (data) {
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
         * @memberOf NML
         * @param {object} data - This is the JSON object coming from the server.
         * @summary This method will redirect to the API authentication page if the logged in user needs to authenticate with any APIs used in the application.
         * @return null
         */
        onLogin: function (data) {
            // default callback for Login 
            if (data.success === true || data.success === "true") {
                // save the session
                //window.localStorage.sessid = data.session.id;
                this.setSession(data.session.id);
            }
        },

        /**
         * @description POST data to Datadipity.com to create a new resource or trigger the "add" event for API communication. TODO: Add the ability to upload files.
         * @function add
         * @memberOf NML
         * @param {string} action - This is an NML String representing the resource to add. This resource will be parsed and will trigger the API events on the server side. <BasicPage>...</BasicPage>
         * @param {string} pageType - A NML page type in lowercase and plural: basicpages, listpages, etc. It depends on the type of page you are posting to the ListPage and which type of page it accepts.
         * @param {asyncCallback} callback - A custom callback function to override the default. This takes an NML object as an argument.
         * @return null
         */
        add: function (action, pagesType, callback) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            console.log(next);
            // post request to Datadipity.com
            $.get(
                this.BaseUrl + "/" + pagesType + ".xml?_method=post&_action=" + action + "&PHPSESSID=" + this.getSession()
            ).done(next);
        },

        /**
         * @description Update an NML resource on the Datadipity server
         * @function update
         * @memberOf NML
         * @param {string} action - This is an NML String representing the resource to add. This resource will be parsed and will trigger the API events on the server side. <BasicPage>...</BasicPage>
         * @param {string} pageType - A NML page type in lowercase and plural: basicpages, listpages, etc. It depends on the type of page you are posting to the ListPage and which type of page it accepts.
         * @param {asyncCallback} callback - A custom callback function to override the default. This takes an NML object as an argument.
         * @return null
         */
        update: function (action, pageType, callback) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            // GET put request to Datadipity.com
            // post request to Datadipity.com
            $.get(
                this.BaseUrl + "/" + pageType + ".xml?_method=put&_action=" + action + "&PHPSESSID=" + this.getSession()
            ).done(next);
        },

        /**
         * @description Remove a resource from the Datadipity server using basic pages as an example it would look similar to https://datadipity.com/developerurl/apiurl/pageType/pageId.xml?_method=delete
         * @function remove
         * @memberOf NML
         * @param {string} pageType - the type of page eg: basicpages, listpages, linkpages, etc.
         * @param {string} pageId - Required to execute a delete on a resource
         * @return null
         */
        remove: function (pageType, pageId, callback) {
            var next = null;
            if (callback !== null) {
                next = callback;
            } else {
                next = this.processPageData;
            }
            // GET delete request to Datadipity.com using XML
            $.get(
                this.BaseUrl + "/" + pageType + "/" + pageId + ".xml?_method=delete&PHPSESSID=" + this.getSession()
            ).done(next);
        },

        /**
         * @description A simple method to get a single NML object or a collection of objects. Urls for requests are formed as NML.AppUrl/pageUrl.json or NML.AppUrl/pageTypespageId.json. This uses JSON by default. This has an XML endpoint but is not implemented in JavaScript.
         * @function get
         * @memberOf NML
         * @param {asyncCallback} callback - A function to override the default event listener.
         * @param {boolean} withUpdate - Adds ?update to force the API data provider to refresh
         * @param {array} postparams - Adds ?postparam[key]=val from [{name:key, value:val}] for every Object in the array
         * @param {string} pageType - basicpages, listpages, linkpages, etc.
         * @param {string} pageId - The ID parameter from the @attributes.id element
         * @param {string} pageUrl - This will override using pageType/pageId
         * @todo More testing needs to be done using individual page types.
         * @return null
         */
        get: function (callback, withUpdate, postparams, pageType, pageId, pageUrl) {
            var next = null;
            if (callback) {
                next = callback;
            } else {
                next = null;
            }

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

            // include the session
            if (this.getSession() != "null" && this.getSession() != "undefined" && this.getSession() !== null && this.getSession() !== undefined) {
                if (withUpdate === true) {
                    reqUrl += ".json?update&PHPSESSID=" + this.getSession();
                } else {
                    reqUrl += ".json?PHPSESSID=" + this.getSession();
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
         * @param {object} xhr The full Ajax request object
         * @param {string} status The Error message
         * @param {object} err The full Error object
         * @return null
         */
        failedRequest: function (xhr, status, err) {
            console.log(err);
        },
        /**
         * @description This sets the search boolean and the homepage ID
         * @function processPageData
         * @memberOf NML
         * @param {object} data
         * @return null
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
         * @param null
         * @return null
         */
        loadDialogs: function (callback) {
            var _nml = this;
            console.log("Loading Dialogs");
            if ($("#login-register-auth")) {
                $.get("templates/jsviews/login-register-auth.html").done(function (data) {
                    $("#login-register-auth").html(data);
                    if ($("#loading-progress")) {
                        $.get("templates/jsviews/loading-progress.html").done(function (data) {
                            $("#loading-progress").html(data);
                            // Set Login/Register Form Listeners
                            $("#loginForm").on("submit", function (evt) {
                                _nml.handleLoginFormSubmit(evt, _nml);
                            });
                            $("#registerForm").on("submit", function (evt) {
                                _nml.handleRegisterFormSubmit(evt, _nml);
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
         * @param {object} data This is coming from the server
         * @param {object} _nml This is the NML() object
         * @return null
         */
        onLoginOrRegister: function (data, _nml) {
            // TODO: Check for login success
            if (data.session !== null && data.session !== undefined && data.session.id !== "undefined" && data.session !== "null") {
                $("#loadertext").html("Loading Tweets...");
                _nml.onLogin(data);
                if (data.registerApis === true || data.registerApis === "true") {
                    _nml.manageAuthRedirect(_nml);
                    //nml.onRegister(data)
                } else {
                    // if we don't need to authorize APIs
                    console.log("Getting Data");

                    _nml.get(_nml.onGetData, true);
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
         * @param {object} evt This is coming from the button Click
         * @param {object} _nml This is the NML() object
         * @return null
         */
        handleLoginFormSubmit: function (evt, _nml) {
            evt.preventDefault();
            var email = $("#loginEmail").val();
            var password = $("#loginPassword").val();
            $("#loginRegister").modal("toggle");
            $("#loginRegister").bind("hidden.bs.modal", function (evt) {
                $("#loginRegister").unbind("hidden.bs.modal");
                $("#loadertext").html("Logging In...");
                $("#loader").modal("toggle");
                console.log(_nml);
                if (_nml.getSession() === undefined || _nml.getSession() === "undefined") {
                    console.log("Wrong Session ID");
                    _nml.setSession(null);
                    _nml.Login(email, password, function (data) {
                        _nml.onLoginOrRegister(data, _nml);
                    });
                } else {
                    _nml.Logout(_nml.getSession(), function (data) {
                        _nml.setSession(null);
                        _nml.Login(email, password, function (nData) {
                            _nml.onLoginOrRegister(nData, _nml);
                        });
                    });
                }
            });
        },
        /**
         * @description When a user submits the Register form
         * @callback handleRegisterFormSubmit
         * @memberOf NML
         * @param {object} evt This is coming from the button Click
         * @param {object} _nml This is the NML() object
         * @return null
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
         * @memberOf NML
         * @param {object} _nml This is the NML() object
         * @return null
         */
        manageAuthRedirect: function (_nml) {
            // show redirect modal
            $("#loader").bind("hidden.bs.modal", function (evt) {
                $("#loader").unbind("hidden.bs.modal");
                $("#authlink").attr("href", _nml.BaseUrl + "/register/apis?PHPSESSID=" + _nml.getSession());
                $("#authlink").click(function (evt) {
                    evt.preventDefault();
                    var url = evt.currentTarget.href;
                    console.log(url);

                    var popup = window.open(url, "_blank", "location=yes,closebuttoncaption=done,clearcache=yes,clearsessioncache=yes");
                    if (!_nml.isGap) {
                        // do this in browser
                        var timer = setInterval(function (evt) {
                            if (popup.closed) {
                                clearInterval(timer);
                                $("#generic").bind(
                                    "hidden.bs.modal",
                                    function (evt) {
                                        $("#generic").unbind(
                                            "hidden.bs.modal"
                                        );
                                        $("#loader").modal("toggle");
                                        _nml.get(_nml.onGetData, true);
                                    }
                                );
                                $("#generic").modal("toggle");
                            }
                        }, 500);
                    } else {
                        // do this in phonegap
                        popup.addEventListener("exit", function () {
                            $("#generic").bind(
                                "hidden.bs.modal",
                                function (evt) {
                                    $("#generic").unbind(
                                        "hidden.bs.modal"
                                    );
                                    $("#loader").modal("toggle");
                                    _nml.get(_nml.onGetData, true);
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
         * @protected
         * @description Extract the parentPage (if it exists) using a page ID
         * @function getParentPage
         * @memberOf NML
         * @param {string} pageid - the current page id
         * @return Object - the parent page
         * @todo This is not yet implemented
         */
        getParentPage: function (pageid) {
            // TODO: make this work
        }
    };
})();
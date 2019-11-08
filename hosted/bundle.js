"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
};

var orderDomo = function orderDomo(e) {
    e.preventDefault();

    sendAjax('GET', '/getDomos', null, function (data) {
        var sortType = $("#sort").val();
        var orderType = $("#order").val();

        switch (sortType) {
            case 'Name':
                if (orderType === "Ascending") {
                    data.domos.sort(function (a, b) {
                        return a.name > b.name ? 1 : -1;
                    });
                } else {
                    data.domos.sort(function (a, b) {
                        return a.name < b.name ? 1 : -1;
                    });
                }
                break;
            case 'Age':
                if (orderType === "Ascending") {
                    data.domos.sort(function (a, b) {
                        return a.age > b.age ? 1 : -1;
                    });
                } else {
                    data.domos.sort(function (a, b) {
                        return a.age < b.age ? 1 : -1;
                    });
                }
                break;
            case 'Level':
                if (orderType === "Ascending") {
                    data.domos.sort(function (a, b) {
                        return a.level > b.level ? 1 : -1;
                    });
                } else {
                    data.domos.sort(function (a, b) {
                        return a.level < b.level ? 1 : -1;
                    });
                }
                break;
            default:
                break;
        }

        ReactDOM.render(React.createElement(
            "form",
            { id: "orderDomo",
                name: "orderDomo",
                onSubmit: orderDomo,
                action: "/maker",
                method: "GET",
                className: "orderDomo" },
            React.createElement(
                "select",
                { name: "options", id: "sort", className: "orderSelect" },
                React.createElement(
                    "option",
                    null,
                    "Name"
                ),
                React.createElement(
                    "option",
                    null,
                    "Age"
                ),
                React.createElement(
                    "option",
                    null,
                    "Level"
                )
            ),
            React.createElement(
                "select",
                { name: "options", id: "order", className: "orderSelect" },
                React.createElement(
                    "option",
                    null,
                    "Ascending"
                ),
                React.createElement(
                    "option",
                    null,
                    "Descending"
                )
            ),
            React.createElement("input", { type: "submit", value: "Order By", className: "sortButton" }),
            React.createElement(DomoList, { domos: data.domos })
        ), document.querySelector("#domos"));
    });
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            name: "domoForm",
            onSubmit: handleDomo,
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "level" },
            "Level: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "Domo Level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                " Level: ",
                domo.level,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(
            "form",
            { id: "orderDomo",
                name: "orderDomo",
                onSubmit: orderDomo,
                action: "/maker",
                method: "GET",
                className: "orderDomo" },
            React.createElement(
                "select",
                { name: "options", id: "sort" },
                React.createElement(
                    "option",
                    null,
                    "Name"
                ),
                React.createElement(
                    "option",
                    null,
                    "Age"
                ),
                React.createElement(
                    "option",
                    null,
                    "Level"
                )
            ),
            React.createElement(
                "select",
                { name: "options", id: "order" },
                React.createElement(
                    "option",
                    null,
                    "Ascending"
                ),
                React.createElement(
                    "option",
                    null,
                    "Descending"
                )
            ),
            React.createElement("input", { type: "submit", value: "Order By", className: "sortButton" }),
            React.createElement(DomoList, { domos: data.domos })
        ), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoForm, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'toggle' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

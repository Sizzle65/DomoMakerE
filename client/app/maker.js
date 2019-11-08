const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
};

const orderDomo = (e) => {
    e.preventDefault();

    sendAjax('GET', '/getDomos', null, (data) => {        
        let sortType = $("#sort").val();
        let orderType = $("#order").val();

        switch(sortType){
            case 'Name':
                if(orderType === "Ascending"){
                    data.domos.sort((a, b) => (a.name > b.name) ? 1 : -1);
                }
                else{
                    data.domos.sort((a, b) => (a.name < b.name) ? 1 : -1);
                }
                break;
            case 'Age':
                if(orderType === "Ascending"){
                    data.domos.sort((a, b) => (a.age > b.age) ? 1 : -1);
                }
                else{
                    data.domos.sort((a, b) => (a.age < b.age) ? 1 : -1);
                }
                break;
            case 'Level':
                if(orderType === "Ascending"){
                    data.domos.sort((a, b) => (a.level > b.level) ? 1 : -1);
                }
                else{
                    data.domos.sort((a, b) => (a.level < b.level) ? 1 : -1);
                }
                break;
            default:
                break;
        }

        ReactDOM.render(
            <form id="orderDomo" 
            name="orderDomo"
            onSubmit={orderDomo}
            action="/maker"
            method="GET"
            className="orderDomo">
                <select name="options" id="sort" className="orderSelect"> 
                    <option>Name</option>
                    <option>Age</option>
                    <option>Level</option>
                </select>
                <select name="options" id="order" className="orderSelect"> 
                    <option>Ascending</option>
                    <option>Descending</option>
                </select>
                <input type="submit" value="Order By" className="sortButton"/>
                <DomoList domos={data.domos} />
            </form>, document.querySelector("#domos")
        );
    });
};

const DomoForm = (props) => {
    return(
        <form id="domoForm" 
            name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>    
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>  
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>  
            <input type="hidden" name="_csrf" value={props.csrf}/>   
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoLevel"> Level: {domo.level} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <form id="orderDomo" 
            name="orderDomo"
            onSubmit={orderDomo}
            action="/maker"
            method="GET"
            className="orderDomo">
                <select name="options" id="sort"> 
                    <option>Name</option>
                    <option>Age</option>
                    <option>Level</option>
                </select>
                <select name="options" id="order"> 
                    <option>Ascending</option>
                    <option>Descending</option>
                </select>
                <input type="submit" value="Order By" className="sortButton"/>
                <DomoList domos={data.domos} />
            </form>, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoForm domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});
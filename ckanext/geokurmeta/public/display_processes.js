var endpointUrl = "https://geokur-dmp2.geo.tu-dresden.de/fuseki/geokur_process_store/sparql";
var sparqlQuery = [
"PREFIX prov: <http://www.w3.org/ns/prov#>",
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
    "PREFIX dct: <http://purl.org/dc/terms/>",
    "SELECT ?id ?label ?description ?link ?versionOf ?versionOfLabel ?partOf ?partOfLabel WHERE {",
    "?id a prov:Activity . ",
    "OPTIONAL {?id rdfs:label ?label }",
    "OPTIONAL {?id rdfs:comment ?description }",
    "OPTIONAL {?id foaf:page ?link}",
    "OPTIONAL {?id dct:isVersionOf ?versionOf. ?versionOf rdfs:label ?versionOfLabel}",
    "OPTIONAL {?id dct:isPartOf ?partOf. ?partOf rdfs:label ?partOfLabel}",
    "} order by asc(UCASE(str(?label)))"
].join(" ");
var settings = {
    headers: { Accept: "application/sparql-results+json" },
    data: { query: sparqlQuery }
};
$.ajax(endpointUrl, settings).then(function (data) {
    var results = data["results"]["bindings"];
    for (let i = 0; i < results.length; i++) {
        var process = document.createElement("div");
        process.setAttribute("id", results[i]["id"]["value"]);
        var processTitle = document.createElement("h2");
        var processTitleText = document.createElement("a");        
        processTitleText.setAttribute("href", results[i]["id"]["value"]);
        processTitleText.innerHTML = results[i]["label"]["value"];
        processTitle.appendChild(processTitleText)
        process.appendChild(processTitle)

        var description = document.createElement("p")
        if (results[i]["description"]) {
            var descriptionText = document.createTextNode(results[i]["description"]["value"])
            description.appendChild(descriptionText)
        }
        else{
            var descriptionText = document.createTextNode("Description: ")
            description.appendChild(descriptionText)
        }
        process.appendChild(description)

        var additionalInfo = document.createElement("h3");
        additionalInfo.innerHTML = "Additional Info";
        process.appendChild(additionalInfo)

        var tbl = document.createElement("table");
        tbl.setAttribute("class", "table table-striped table-bordered table-condensed");

        var tblHead = document.createElement("thead")
        var headRow = document.createElement("tr")        
        var field = document.createElement("th")
        field.setAttribute('scope', 'col')
        field.innerHTML = "Field"
        var value = document.createElement("th")
        value.setAttribute('scope', 'col')
        value.innerHTML = "Value"
        headRow.appendChild(field)
        headRow.appendChild(value)
        tblHead.appendChild(headRow)
        tbl.appendChild(tblHead)


        var tblBody = document.createElement("tbody");
        var row = document.createElement("tr");
        var cellName = document.createElement("td")
        cellName.setAttribute('scope', "row");
        cellName.setAttribute('class', 'dataset-label');
        var cellNameText = document.createTextNode("Documentation")
        cellName.appendChild(cellNameText)
        var cellValue = document.createElement("td")
        cellValue.setAttribute('class', 'dataset-details')
        if (results[i]["link"]){
            var cellValueText = document.createElement("a");
            cellValueText.setAttribute("href", results[i]["link"]["value"])
            cellValueText.innerHTML = (results[i]["link"]["value"])
            cellValue.appendChild(cellValueText)
        }
        else{
            var cellValueText = document.createTextNode("")
            cellValue.appendChild(cellValueText)
        }
        row.appendChild(cellName)
        row.appendChild(cellValue)
        tblBody.appendChild(row)                

        var row = document.createElement("tr"); 
        var cellName = document.createElement("td")
        cellName.setAttribute('scope', "row");
        cellName.setAttribute('class', 'dataset-label');
        var cellNameText = document.createTextNode("Is Version Of")                
        cellName.appendChild(cellNameText)
        var cellValue = document.createElement("td")
        cellValue.setAttribute('class', 'dataset-details')
        if (results[i]["versionOf"]){
            var cellValueText = document.createElement("a");
            cellValueText.setAttribute("href", results[i]["versionOf"]["value"])
            cellValueText.innerHTML = (results[i]["versionOfLabel"]["value"])
            cellValue.appendChild(cellValueText)
        }
        else{
            var cellValueText = document.createTextNode("")
            cellValue.appendChild(cellValueText)
        }
        row.appendChild(cellName)
        row.appendChild(cellValue)
        tblBody.appendChild(row)                

        var row = document.createElement("tr"); 
        var cellName = document.createElement("td")        
        cellName.setAttribute('scope', "row");
        cellName.setAttribute('class', 'dataset-label');
        var cellNameText = document.createTextNode("Is Part Of")
        cellName.appendChild(cellNameText)
        var cellValue = document.createElement("td")
        cellValue.setAttribute('class', 'dataset-details')
        if (results[i]["partOf"]){
            var cellValueText = document.createElement("a");
            cellValueText.setAttribute("href", results[i]["partOf"]["value"])
            cellValueText.innerHTML = (results[i]["partOfLabel"]["value"])
            cellValue.appendChild(cellValueText)
        }
        else{
            var cellValueText = document.createTextNode("")
            cellValue.appendChild(cellValueText)
        }
        row.appendChild(cellName)
        row.appendChild(cellValue)
        tblBody.appendChild(row)
        tbl.appendChild(tblBody)
        process.appendChild(tbl)

        var editDiv = document.createElement("div");
        editDiv.setAttribute('style', 'margin-bottom: 70px;')
        var edit = document.createElement("button")
        edit.innerHTML = "Edit"
        edit.setAttribute('class', 'btn btn-default')
        edit.setAttribute('style', 'float: right')
        edit.onclick = function(){
            window.open("/edit-process?uri=" + results[i]["id"]["value"])
        };
        editDiv.appendChild(edit)
        process.appendChild(editDiv)

        document.getElementById("processes").append(process)
        
        // console.log(sparqlQuery)
    }
    
});
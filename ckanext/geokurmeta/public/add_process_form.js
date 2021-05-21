var endpointUrl = "https://geokur-dmp2.geo.tu-dresden.de/fuseki/geokur_process_store/sparql";
    var sparqlQuery = [
        "PREFIX prov: <http://www.w3.org/ns/prov#>",
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
        "SELECT ?id ?label WHERE {",
        "?id a prov:Activity .",
        "?id rdfs:label ?label.",
        "}"
    ].join(" ");
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery }
    };
    $.ajax(endpointUrl, settings).then(function (data) {
        var results = data["results"]["bindings"];
        var process_ids = [];
        var process_labels = [];
        for (let i = 0; i < results.length; i++) {
            process_ids.push(results[i]["id"]["value"]);
            process_labels.push(results[i]["label"]["value"])
        }
        $("#process-input-form").alpaca({
            "data": {
                "id": "https://geokur-dmp.geo.tu-dresden.de/pages/processes#"
            },
            "schema": {
                "title": "Add new process to process store",
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "required": true
                    },
                    "id": {
                        "type": "string",
                        "title": "Identifier",
                        "format": "url"
                    },
                    "description": {
                        "type": "string",
                        "title": "Short Description/ Abstract",
                    },
                    "link": {
                        "type": "string",
                        "title": "Link to full documentation/ Paper",
                        "format": "url"
                    },
                    "is-version-of": {
                        "enum": []
                    },
                }
            },
            "options": {
                "fields": {
                    "name": {
                        "id": "name",
                        "validator": function (callback) {
                            var currentId = this.getParent().childrenByPropertyId["id"].getValue()
                            if (process_ids.includes(currentId)) {
                                callback({
                                    "status": false,
                                    "message": "A process with this ID already exists!"
                                });
                                return;
                            }
                            callback({
                                "status": true
                            });
                        }
                    },
                    "id": {
                        "id": "id",
                        "disabled": true,
                    },
                    "description": {
                        "id": "description",
                        "type": "textarea",
                        "markdown": {
                            "toolbar": ["bold", "italic", "heading", "|", "quote", "code", "ordered-list", "|", "preview", "|", "guide"],
                        },
                        "rows": 10,
                    },
                    "link": {
                        "id": "link"
                    },
                    "is-version-of": {
                        "type": "select",
                        "label": "Is new version of",
                        "id": "is-version-of"
                    }
                },
                "form": {
                    "buttons": {
                        "add-process": {
                            "label": "Add Process",

                            "click": function () {
                                if (this.isFormValid()) {
                                    var endpointUrl = "https://geokur-dmp2.geo.tu-dresden.de/fuseki/geokur_process_store/update";
                                    var insertQuery = [
                                        "PREFIX prov: <http://www.w3.org/ns/prov#>",
                                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
                                        "PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
                                        "PREFIX dct: <http://purl.org/dc/terms/>",
                                        "INSERT DATA {",
                                        "<" + $("#id").val() + "> a prov:Activity;",
                                        " rdfs:label \"" + $("#name").val() + "\";"]
                                    if ($("#description").val()) {
                                        insertQuery = insertQuery.concat(" rdfs:comment \"" + $("#description").val().replaceAll("\n", "\\n") + "\";")
                                    }
                                    if ($("#link").val()) {
                                        insertQuery = insertQuery.concat(" foaf:page \"" + $("#link").val() + "\";")
                                    }
                                    if ($("#is-version-of").val()) {
                                        insertQuery = insertQuery.concat(" dct:isVersionOf \"" + $("#is-version-of").val() + "\";")
                                    }
                                    insertQuery = insertQuery.concat("}");
                                    insertQuery = insertQuery.join(" ");
                                    var settings = {
                                        type: "POST",
                                        headers: { Accept: 'application/sparql-results+json' },
                                        data: { update: insertQuery },
                                    };
                                    $.ajax(endpointUrl, settings);
                                    window.location.reload()
                                }
                                else {
                                    alert("Form contains invalid entries!")
                                }
                            }
                        }
                    }
                }
            },
            "postRender": function (control) {
                control.childrenByPropertyId["is-version-of"].schema.enum = process_ids
                control.childrenByPropertyId["is-version-of"].options.optionLabels = process_labels
                control.childrenByPropertyId["is-version-of"].refresh()
                control.childrenByPropertyId["name"].on("change", function () {
                    control.childrenByPropertyId["id"].setValue("https://geokur-dmp.geo.tu-dresden.de/pages/processes#" + this.getValue().replaceAll(" ", "-").replaceAll("_", "-"));
                    control.refreshValidationState(true)
                });
            }
        });
    });
/* A module for creating 
 *
 * mode		- mandatory: 2 options
 *			- "json": 	Request external JSON data directly
 *			- "sparql":	Request a sparql endpoint with specified query to get response as JSON
 * source 	- mandatory
 *			- in json-mode: An url pointing to a JSON source.
 *			- in sparql-mode: An url pointing to a sparql endpoint
 * query 	- only for sparql mode
 *
 * Examples
 *	
 */


this.ckan.module('select-from-json', function (jQuery, _) {

  return {
    options: {
		mode: null,
		source: '',
		query: ''
    },
	
    initialize: function () {      

		jQuery.proxyAll(this, /_on/);
		this.el.ready(this._onReady);

    },

	requestSparql: async function(url = '') {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 
				'Accept': 'application/sparql-results+json'
			}
		});
		return response.json(); // parses JSON response into native JavaScript objects
	},
	
	requestJson: async function(url = '') {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 
				'Accept': 'application/json'
			}
		});
		return response.json(); // parses JSON response into native JavaScript objects
	},
	
	handleDataSparql: function(data = null) {
		for (var i = 0; i < data.results.bindings.length; i++){
			var label = data.results.bindings[i].subject.value.split("#")[1].replace(/([A-Z])/g, ' $1');
			if(data.results.bindings[i].subject.value == this.options.selected) {
				$(this.el[0]).append($('<option>', { 
					value: data.results.bindings[i].subject.value,
					text : label,
					selected : 'selected'
				}));
			}
			else {
				$(this.el[0]).append($('<option>', { 
					value: data.results.bindings[i].subject.value,
					text : label 
				}));
			}
		};
	},

    _onReady: function(){
		
		
		var sel = this.el[0];
		var options  = this.options;
		var divMain = $("#" + this.options.field + "-div")[0];
		var input = $("#" + this.options.field)[0];
		var btn = $("#" + this.options.field + "-btn")[0];
		var metrics = new Object();
		
		if(this.options.mode = "sparql") {
			var fullUrl = this.options.source + "?query=" + encodeURIComponent(this.options.query);
			
			this.requestSparql(fullUrl)		
			.then(data => this.handleDataSparql(data))
			.catch(error => {
				console.error('There has been a problem while fetching data from triple store:', error);
			});
		}
		else {
			// TODO:  handle json
		}

		var createBlock = function(url, values){
			
			var $block = $("<div>", {"class": "metrics-block"});
			$block.append('<label>' + url.split("#")[1].replace(/([A-Z])/g, ' $1') + '</label>');
			$block.append('<p class="tiny-metrics-url">' + url + '</p>');
			
			var $inputs = $("<div>", {"class": "input-group"});
			for(var value in values) {
				$inputs.append('<div class="input-group-row"><span class="input-group-addon">' + value + '</span><input name="' + url + '" type="text" value="' + values[value] + '" /></div>');
			}
			console.log($inputs);
			//TODO: hier weiter
			$inputs.children().on('input', function (e) {
				metrics[$(e.target).attr("name")][$(e.currentTarget).find('span').text()] = $(e.target).val();
				// console.log(metrics);
				$(input).val( JSON.stringify(metrics) );
			});
			$block.append( $inputs );
			$(divMain).append( $block );
	
		};
		
		var getEmptySubMetric = function(){
			var subLabels = options.sublabels.split("|");
			var result = {};
			
			for(var i = 0; i < subLabels.length; i++) {
				result[subLabels[i]] = "";
			}
			
			return result;
		};
		
		
		
		
		if(this.el.data('metrics_data')) {
			metrics = this.el.data('metrics_data');
			for (var metric in metrics) {
				createBlock(metric, metrics[metric]);
			}
		}
			
		// $(".metrics-block :input").on('focusout', function (e) {
			// console.log(e);
		// });
		
		// console.log($(".metrics-block :input"));
		
		$(btn).on('click', function (e) {
			e.preventDefault(); 
			
			if( $(sel).val() != "" ) 
			{
				// createBlock($(sel).children("option").filter(":selected").text(), $(sel).val());
				
				metrics[$(sel).val()] = getEmptySubMetric() ;

				// console.log(metrics)
				createBlock($(sel).val(), metrics[$(sel).val()]);
				//metrics.name = $(sel).children("option").filter(":selected").text()
				//metrics.value = $(sel).val()
				//metrics[$(sel).val()] = {"value1":"blubb","value2":"blubbi","value3":"blubb","value4":"blubbi"};
				//console.log($("#field-exfield_12-btn").text());
				//localStorage.setItem("metricsJSON", JSON.stringify(metrics));
				$(input).val( JSON.stringify(metrics) );
			}
		});
			
	}
  }
});
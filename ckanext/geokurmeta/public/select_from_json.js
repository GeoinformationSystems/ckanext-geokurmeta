

this.ckan.module('select-from-json', function (jQuery, _) {

  return {
    options: {
      i18n: {
      },
      styles: {
        default_:{
          color: '#B52',
          weight: 1,
          opacity: 1,
          fillColor: '#FCF6CF',
          fillOpacity: 0.4
        },
      },
      default_extent: [[60, 180], [-30, -180]]
    },


    initialize: function () {

		// console.log(this.el)
      
		this.selected = this.el.data('selected');
		
		// this.template = $('#' + this.el.data('input_id') + "-template")[0];
		// this.btn = $('#' + this.el.data('input_id') + "-btn")[0];
		// this.map_id = 'dataset-map-container';
			
		// $(this.template).hide();

		jQuery.proxyAll(this, /_on/);
		this.el.ready(this._onReady);

    },


    _onReady: function(){
		
		var options = this.el[0]
		console.log(this.selected)
		// var selected = this.selected
		// $(options).addClass('btn-default');
		fetch('https://inspire.ec.europa.eu/theme/theme.de.json')
		.then(response => {
			if (!response.ok) {
			  throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log(data.register.containeditems[0]);
			// let values = data.register.containeditems
			for (var i = 0; i < data.register.containeditems.length; i++){
				// console.log(data.register.containeditems[i].theme)
				// console.log($(selected))
				// console.log('<option value="' + data.register.containeditems[i].theme.id + '">' + data.register.containeditems[i].theme.label.text + '</option>');
				if(data.register.containeditems[i].theme.id == this.selected) {
					$(options).append($('<option>', { 
						value: data.register.containeditems[i].theme.id,
						text : data.register.containeditems[i].theme.label.text,
						selected : 'selected'
					}));
				}
				else {
					$(options).append($('<option>', { 
						value: data.register.containeditems[i].theme.id,
						text : data.register.containeditems[i].theme.label.text 
					}));
				}
			};
		})
		.catch(error => {
			console.error('There has been a problem while fetching data from triple store:', error);
		});
		// console.log("blubb");
	}
  }
});
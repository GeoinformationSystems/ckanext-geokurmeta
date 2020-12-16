
=============
ckanext-geokurmeta
=============

.. Put a description of your extension here:
   What does it do? What features does it have?
   Consider including some screenshots or embedding a video!


------------
Requirements
------------

Works with CKAN 2.9 and Python 2.7.

Install https://github.com/ckan/ckanext-scheming like this::

	. /usr/lib/ckan/default/bin/activate
	cd /usr/lib/ckan/default/src/ 
	pip install -e "git+https://github.com/ckan/ckanext-scheming.git#egg=ckanext-scheming"
	pip install -r ckanext-scheming/requirements.txt 

Recommended plugins
------------

Install https://github.com/ckan/ckanext-spatial like this::

	sudo apt-get install python-dev libxml2-dev libxslt1-dev libgeos-c1v5
	sudo apt-get install postgresql-11-postgis-2.5
	sudo apt-get install postgresql-11-postgis-2.5-scripts
	sudo -u postgres psql -d ckan_default

		CREATE EXTENSION postgis;
		SELECT PostGIS_version();
		\q

	sudo -u postgres psql -d ckan_default -c 'ALTER TABLE geometry_columns OWNER TO ckan_default;'
	sudo -u postgres psql -d ckan_default -c 'ALTER TABLE spatial_ref_sys OWNER TO ckan_default;'

	. /usr/lib/ckan/default/bin/activate
	cd /usr/lib/ckan/default/src/ 
	pip install -e "git+https://github.com/ckan/ckanext-spatial.git#egg=ckanext-spatial"
	pip install -r /usr/lib/ckan/default/src/ckanext-spatial/pip-requirements.txt

Install https://github.com/ckan/ckanext-geoview like this::

	. /usr/lib/ckan/default/bin/activate
	cd /usr/lib/ckan/default/src/
	git clone https://github.com/ckan/ckanext-geoview.git
	cd ckanext-geoview
	python setup.py develop

Activate all of these by adding ``spatial_metadata spatial_query geo_view geojson_view wmts_view shp_view scheming_datasets`` to the ``ckan.plugins`` setting in your CKAN config file (by default the config file is located at ``/etc/ckan/default/ckan.ini``).

Minimum requirement: ``scheming_datasets``

------------
(Developer) Installation
------------

.. Add any additional install steps to the list below.
   For example installing any non-Python dependencies or adding any required
   config settings.

To install ckanext-geokurmeta:

1. Activate your CKAN virtual environment, for example::

	. /usr/lib/ckan/default/bin/activate

2. Install the ckanext-geokurmeta Python package into your virtual environment::

	cd /usr/lib/ckan/default/src
	git clone https://github.com/GeoinformationSystems/ckanext-geokurmeta.git
	cd ckanext-geokurmeta
	python setup.py develop
	pip install -r requirements.txt

3. Add ``geokurmeta`` to the end of ``ckan.plugins`` setting in your CKAN config file (by default the config file is located at ``/etc/ckan/default/ckan.ini``).

4. Restart CKAN. For example if you've deployed CKAN with Supervisor on Ubuntu::

	sudo service supervisor restart


---------------
Config settings
---------------
.. Document any optional config settings here. For example::

.. # The minimum number of hours to wait before re-checking a resource
   # (optional, default: 24).
   ckanext.geokurmeta.some_setting = some_default_value


To use GeoKur metadata scheme set the following in your ``/etc/ckan/default/ckan.ini``::

	# Define scheming file to be used
	scheming.dataset_schemas = ckanext.geokurmeta:scheming_dataset.json
	# Define preset files to be used
	scheming.presets = ckanext.geokurmeta:scheming_presets.json ckanext.scheming:presets.json

Other usefull settings::
	
	# Setting for spatial search
	ckanext.spatial.search_backend = postgis
	
	# Add default views from geoview plugin if they should be created be default
	ckan.views.default_views = [...] geo_view geojson_view wmts_view shp_view





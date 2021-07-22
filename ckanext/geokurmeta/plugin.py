import ckan.plugins as p
import ckan.plugins.toolkit as tk

class GeokurmetaPlugin(p.SingletonPlugin, tk.DefaultDatasetForm):
    p.implements(p.IDatasetForm)
    p.implements(p.IConfigurer)
    p.implements(p.IValidators)
    p.implements(p.ITemplateHelpers)
    p.implements(p.IRoutes)

    def get_validators(self):
        return {
        }

    def get_helpers(self):
        return {
        }

    def is_fallback(self):
        # Return True to register this plugin as the default handler for
        # package types not handled by any other IDatasetForm plugin.
        return True

    def package_types(self):
        # This plugin doesn't handle any special package types, it just
        # registers itself as the default (above).
        return []

    def update_config(self, config):
        # Add this plugin's templates dir to CKAN's extra_template_paths, so
        # that CKAN will use this plugin's custom templates.
        tk.add_template_directory(config, 'templates')
        tk.add_public_directory(config, 'public')
        tk.add_resource('assets', 'ckanext-geokurmeta')


    def before_map(self, map):

        return map

    def after_map(self, map):
        map.connect('add_metric', '/add-metric',
                    controller='ckanext.geokurmeta.controller:GeokurmetaController',
                    action='add_metric')
        map.connect('edit_process', '/edit-process',
                    controller='ckanext.geokurmeta.controller:GeokurmetaController',
                    action='edit_process')
        map.connect('processes', '/processes',
                    controller='ckanext.geokurmeta.controller:GeokurmetaController',
                    action='processes')
        return map

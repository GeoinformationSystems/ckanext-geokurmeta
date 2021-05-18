import ckan.plugins as p
import ckan.plugins.toolkit as tk


from ckanext.geokurmeta.validation import (
    geokurmeta_scheming_choices,
    geokurmeta_check_required_field,
    if_not_missing_package_id_or_name_exists,
    if_not_missing_package_id_or_name_exists_list,
    link_list_string_convert,
    single_link_validator,
    decimal_validator,
    spatial_resolution_validator,
)

from ckanext.geokurmeta.helpers import (
    get_link_list,
    get_json_as_dict,
)


class GeokurmetaPlugin(p.SingletonPlugin, tk.DefaultDatasetForm):
    p.implements(p.IDatasetForm)
    p.implements(p.IConfigurer)
    p.implements(p.IValidators)
    p.implements(p.ITemplateHelpers)
    p.implements(p.IRoutes)

    def get_validators(self):
        return {
            'geokurmeta_scheming_choices': geokurmeta_scheming_choices,
            'geokurmeta_check_required_field': geokurmeta_check_required_field,
            'if_not_missing_package_id_or_name_exists': if_not_missing_package_id_or_name_exists,
            'if_not_missing_package_id_or_name_exists_list': if_not_missing_package_id_or_name_exists_list,
            'link_list_string_convert': link_list_string_convert,
            'single_link_validator': single_link_validator,
            'decimal_validator': decimal_validator,
            'spatial_resolution_validator': spatial_resolution_validator,
        }

    def get_helpers(self):
        return {
            'get_link_list': get_link_list,
            'get_json_as_dict': get_json_as_dict,
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
        tk.add_resource('public', 'ckanext-geokurmeta')

    def before_map(self, map):

        return map

    def after_map(self, map):
        map.connect('test', '/test',
                    controller='ckanext.geokurmeta.controller:GeokurmetaController',
                    action='index')
        return map

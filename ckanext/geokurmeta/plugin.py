import ckan.plugins as p
import ckan.plugins.toolkit as tk

from ckanext.geokurmeta.validation import (
    if_not_missing_package_id_or_name_exists,
    if_not_missing_package_id_or_name_exists_list,
    link_list_string_convert,
    single_link_validator,
)

from ckanext.geokurmeta.helpers import (
    get_link_list,
)


class GeokurmetaPlugin(p.SingletonPlugin, tk.DefaultDatasetForm):
    p.implements(p.IDatasetForm)
    p.implements(p.IConfigurer)
    p.implements(p.IValidators)
    p.implements(p.ITemplateHelpers)

    def get_validators(self):
        return {
            'if_not_missing_package_id_or_name_exists': if_not_missing_package_id_or_name_exists,
            'if_not_missing_package_id_or_name_exists_list': if_not_missing_package_id_or_name_exists_list,
            'link_list_string_convert': link_list_string_convert,
            'single_link_validator': single_link_validator,
            }
 
    def get_helpers(self):
        return {
            'get_link_list': get_link_list,
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
        tk.add_resource('fanstatic', 'geokurmeta')
        
        


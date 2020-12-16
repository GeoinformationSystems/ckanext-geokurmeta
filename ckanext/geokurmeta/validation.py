from ckan.plugins.toolkit import Invalid
from ckan.logic.validators import package_id_or_name_exists

def if_not_missing_package_id_or_name_exists(value, context):
    if value:
        if not package_id_or_name_exists(value, context):
            raise Invalid('%s: %s' % (_('Not found'), _('Dataset')))
    return value
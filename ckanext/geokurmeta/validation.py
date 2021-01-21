import string

from ckan.plugins.toolkit import Invalid, missing

from ckan.common import _

import ckanext.scheming.helpers as sh
from ckanext.scheming.validation import scheming_validator
from six import string_types
from six.moves.urllib.parse import urlparse
from decimal import Decimal, DecimalException


@scheming_validator
def geokurmeta_scheming_choices(field, schema):
    """
    Require that one of the field choices values is passed.
    
    Edit from original: minor fix for ignoring empty value 
    """
    def validator(value):
        if value is missing or not value:
            return value
        choices = sh.scheming_field_choices(field)
        for choice in choices:
            if value == choice['value']:
                return value
        raise Invalid(_('unexpected choice "%s"') % value)

    return validator

@scheming_validator
def geokurmeta_check_required_field(field, schema):
    """
    Require value if other field is defined.
    Define 'required_if_value_in' as field parameter in schema.
    """
    def validator(key, data, errors, context):
        value = data.get(key)
        try:
            other_value = data[(field.get('required_if_value_in'),)]
        except:
            other_value = ""
            
        if (not value or value is missing) :
            if (not other_value or other_value is missing):
                return value
            raise Invalid(_('Required since "%s" is defined.') % field.get('required_if_value_in'))
        return value
        
    return validator

def if_not_missing_package_id_or_name_exists(value, context):
    if value:

        model = context['model']
        session = context['session']

        result = session.query(model.Package).get(value)
        if result:
            return value

        result = session.query(model.Package).filter_by(name=value).first()
        if not result:
            raise Invalid('%s: %s' % (_('Dataset not found'), value))

    return value


def if_not_missing_package_id_or_name_exists_list(key, data, errors, context):
    '''Takes a list of package identifiers that is a comma-separated string and validates each.'''
    if isinstance(data[key], string_types):
        datasets = [ds.strip()
                    for ds in data[key].split(',')
                    if ds.strip()]
    else:
        datasets = data[key]

    for ds in datasets:
        if_not_missing_package_id_or_name_exists(ds, context)


def single_link_validator(value, context):
    ''' Checks that the provided value (if it is present) is a valid URL '''

    if value:
        pieces = urlparse(value)
        if all([pieces.scheme, pieces.netloc]) and \
           set(pieces.netloc) <= set(string.ascii_letters + string.digits + '-.') and \
           pieces.scheme in ['http', 'https']:
            return value
        else:
            raise Invalid('Please provide a valid link: %s' % value)
    return


def link_list_string_convert(key, data, errors, context):
    '''Takes a list of links that is a comma-separated string and validates each.'''

    if isinstance(data[key], string_types):
        links = [link.strip()
                 for link in data[key].split(',')
                 if link.strip()]
    else:
        links = data[key]

    for link in links:
        single_link_validator(link, context)


def decimal_validator(value, context):
    ''' Checks that the provided value (if it is present) is a valid decimal '''

    if value:
        try:
            Decimal(value)
        except DecimalException:
            raise Invalid('Invalid decimal')
    return value

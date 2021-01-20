import string

from ckan.plugins.toolkit import Invalid

from ckan.common import _

from six import string_types, iteritems
from six.moves.urllib.parse import urlparse
from decimal import Decimal, DecimalException


def scheming_validator(fn):
    """
    Decorate a validator that needs to have the scheming fields
    passed with this function. When generating navl validator lists
    the function decorated will be called passing the field
    and complete schema to produce the actual validator for each field.
    """
    fn.is_a_scheming_validator = True
    return fn


@scheming_validator
def scheming_multiple_choice(field, schema):
    """
    Accept zero or more values from a list of choices and convert
    to a json list for storage:
    1. a list of strings, eg.:
       ["choice-a", "choice-b"]
    2. a single string for single item selection in form submissions:
       "choice-a"
    """
    static_choice_values = None
    if 'choices' in field:
        static_choice_order = [c['value'] for c in field['choices']]
        static_choice_values = set(static_choice_order)

    def validator(key, data, errors, context):
        # if there was an error before calling our validator
        # don't bother with our validation
        if errors[key]:
            return

        value = data[key]
        if value is not missing:
            if isinstance(value, six.string_types):
                value = [value]
            elif not isinstance(value, list):
                errors[key].append(_('expecting list of strings'))
                return
        else:
            value = []

        choice_values = static_choice_values
        if not choice_values:
            choice_order = [c['value']
                            for c in sh.scheming_field_choices(field)]
            choice_values = set(choice_order)

        selected = set()
        for element in value:
            if element in choice_values:
                selected.add(element)
                continue
            errors[key].append(_('unexpected choice "%s"') % element)

        if not errors[key]:
            data[key] = json.dumps([v for v in
                                    (static_choice_order if static_choice_values else choice_order)
                                    if v in selected])

            if field.get('required') and not selected:
                errors[key].append(_('Select at least one'))

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

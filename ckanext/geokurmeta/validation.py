import string

from ckan.plugins.toolkit import Invalid
from ckan.logic.validators import package_id_or_name_exists, url_validator

from six import string_types, iteritems
from six.moves.urllib.parse import urlparse

def if_not_missing_package_id_or_name_exists(value, context):
    if value:
        if not package_id_or_name_exists(value, context):
            raise Invalid('%s: %s' % (_('Not found'), _('Dataset')))
    return value
    
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
    '''Takes a list of tags that is a comma-separated string (in data[key])
    and parses tag names. These are added to the data dict, enumerated. They
    are also validated.'''

    if isinstance(data[key], string_types):
        links = [link.strip() \
                for link in data[key].split(',') \
                if link.strip()]
    else:
        links = data[key]

    '''current_index = max( [int(k[1]) for k in data.keys() if len(k) == 3 and k[0] == 'tags'] + [-1] )

    for num, link in zip(count(current_index+1), links):
        data[('tags', num, 'name')] = link
    '''
    for link in links:
        single_link_validator(link, context)
        

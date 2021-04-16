
try:
    import json
except ImportError:
    import simplejson as json

try:
    from collections import OrderedDict
except ImportError:
    from sqlalchemy.util import OrderedDict


import logging
log = logging.getLogger(__name__)

def get_link_list(link_list):
    return link_list.split(',')

def get_json_as_dict(value):
    return json.loads(value, object_pairs_hook=OrderedDict)
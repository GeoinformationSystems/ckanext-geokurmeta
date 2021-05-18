

import ckan.plugins as p
import ckan.lib.helpers as h

import ckan.lib.base as base


class GeokurmetaController(base.BaseController):

    def test(self):
        return base.render('contentPage.html')

import ckan.plugins as p
import ckan.lib.helpers as h

import ckan.lib.base as base


class GeokurmetaController(base.BaseController):

    def add_process(self):
        return base.render('geokurmeta/add_process.html')
    def edit_process(self):
        return base.render('geokurmeta/edit_process.html')


import ckan.plugins as p
import ckan.lib.helpers as h

import ckan.lib.base as base


class GeokurmetaController(base.BaseController):

    def add_metric(self):
        return base.render('geokurmeta/add_metric.html')
    def edit_process(self):
        return base.render('geokurmeta/edit_process.html')
    def processes(self):
        return base.render('geokurmeta/processes.html')


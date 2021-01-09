from os.path import join, isfile, basename
from ray import serve

import glob
import importlib
import inspect
import os
import re
import sys

from .graph_utils import get_package_dir

ray_client = serve.connect()


def find_service_class(classname):
    pkg_dir = get_package_dir()

    # find files end with _service.py
    sys.path.append(pkg_dir)
    modules = glob.glob(join(pkg_dir, "*_service.py"))
    filenames = [basename(f) for f in modules if isfile(f)]

    # load services until found the one matching
    for filename in filenames:
        spec = importlib.util.spec_from_file_location("module.name", os.path.join(pkg_dir, filename))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        for att in dir(module):
            kclass = getattr(module, att)
            if inspect.isclass(kclass) and classname in kclass.__name__:
                return kclass

    return None


class Deployment:
    @staticmethod
    def delete(service_classname):
        ray_client.delete_backend(service_classname)
        return {
            "message": "deleted"
        }

    @staticmethod
    def create(service_classname):
        service_class = find_service_class(service_classname)  # load Graph class

        if not service_class:
            return {
                "error": 404,
                "message": "service not found"
            }

        backend_name = re.sub(r'(?<!^)(?=[A-Z])', '_', service_classname).lower()
        endpoint_name = backend_name
        route = "/%s" % endpoint_name

        if backend_name in ray_client.list_backends():
            ray_client.delete_endpoint(endpoint_name)
            ray_client.delete_backend(backend_name)
        
        ray_client.create_backend(backend_name, service_class)
        ray_client.create_endpoint(endpoint_name, backend=backend_name, route=route)

        return {
            "status": "ready",
            "url": route
        }

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


def set_path(filepath):
    paths = filepath.split('/')
    curPath = []
    for part in paths:
        curPath.append(part)
        full_path = '/'.join(curPath)
        if full_path not in sys.path:
            sys.path.append(full_path)


def find_all_service_class():
    pkg_dir = get_package_dir()

    # find files end with _service.py
    sys.path.append(pkg_dir)
    modules = glob.glob(join(pkg_dir, "**/*_service.py"), recursive=True)
    filenames = [f for f in modules if isfile(f)]

    classes = []

    # load services until found the one matching
    for filename in filenames:
        try:
            set_path(filename)
            sys.path.append(os.path.dirname(filename))
            spec = importlib.util.spec_from_file_location(
                "module.name", os.path.join(pkg_dir, filename))
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            for att in dir(module):
                kclass = getattr(module, att)
                if inspect.isclass(kclass) and 'service' in kclass.__name__.lower():
                    classes.append(kclass)
        except Exception as e:
            print('error with', filename)
            print(e)

    return classes


def find_service_class(classname):

    # find files end with _service.py
    classes = find_all_service_class()

    return [klass for klass in classes if klass.__name__ == classname][0]


class Deployment:
    @staticmethod
    def delete(service_classname, version):
        version_str = str(version)
        backend_name = re.sub(
            r'(?<!^)(?=[A-Z])', '_', service_classname).lower()

        backend_name_with_version = f'{backend_name}_{version_str}'

        ray_client.delete_endpoint(backend_name_with_version)
        ray_client.delete_backend(backend_name_with_version)

        return {
            "message": "deleted"
        }

    @staticmethod
    def create(service_classname, version):
        version_str = str(version)
        service_class = find_service_class(
            service_classname)  # load Graph class

        if not service_class:
            return {
                "status": "error",
                "error": 404,
                "message": "service not found"
            }

        backend_name = re.sub(
            r'(?<!^)(?=[A-Z])', '_', service_classname).lower()

        backend_name_with_version = f'{backend_name}_{version_str}'
        endpoint_name = backend_name_with_version
        route_name = '/%s' % backend_name
        route = f"/serving{route_name}/v{version_str}"

        if backend_name_with_version in ray_client.list_backends():
            ray_client.delete_endpoint(backend_name_with_version)
            ray_client.delete_backend(backend_name_with_version)

        ray_client.create_backend(backend_name_with_version, service_class)
        ray_client.create_endpoint(
            endpoint_name, backend=backend_name_with_version, route=route, methods=["GET", "POST"])

        return {
            "status": "ready",
            "url": route
        }

    @staticmethod
    def find_all_service_class():
        classes = find_all_service_class()

        return {
            "data": [klass.__name__ for klass in classes]
        }

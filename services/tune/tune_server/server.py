from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseSettings
from starlette import middleware
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware as StarletteCORSMiddleware


from ray import serve
from tune_server.runner import TuneConfig, TuneRunner

import os

from h1st.model_repository.explorer import ModelExplorer
from .graph_utils import find_graphs_in_package, get_graph_topology
from .db import ServingDb


class Settings(BaseSettings):
    project_root: str = os.getcwd()
    allowed_cors_origins: str = "localhost:3002,http://localhost:3002"


settings = Settings()
app = FastAPI()

if settings.allowed_cors_origins:
    origins = settings.allowed_cors_origins.split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# start ray server
try:
    # serve.init(
        
    # )

    ray_client = serve.start(
        detached=True,
        # http_options={
        #     "middleware": [
        #         Middleware(StarletteCORSMiddleware, allow_origins=["*"], allow_methods=["*"])
        #     ]
        # },
    )
except:
    ray_client = serve.connect()


@app.get("/api")
def info():
    return settings.dict()


@app.get("/api/models")
def get_models() -> dict:
    explorer = ModelExplorer(settings.project_root)
    models = explorer.discover_models()

    # TODO: fill with last config

    return {
        "items": list(models.values())
    }


@app.get("/api/tune")
def list_tune() -> dict:
    tuner = TuneRunner()
    return {
        "items": [i.dict() for i in tuner.list_runs()]
    }


@app.get("/api/tune/{run_id}")
def get_tune(run_id: str) -> dict:
    tuner = TuneRunner()
    item = tuner.get_run(run_id, True)

    if item.status == "success":
        result = tuner.get_analysis_result(run_id)
    else:
        result = None

    return {
        "item": item,
        "result": result,
    }


@app.post('/api/tune/start')
def start_tune(config: TuneConfig) -> dict:
    tuner = TuneRunner()
    run_id, _ = tuner.run(config)
    return {
        "item": {
            "id": run_id,
            "model_class": config.model_class,
        }
    }


@app.get("/api/graphs")
def get_graphs() -> dict:
    """
    @return:
        {
            [module_name]: list of graph classes
        }
    """

    graphs_dict = find_graphs_in_package()

    for k, v in graphs_dict.items():
        graphs_dict[k] = [i.__name__ for i in v]

    return graphs_dict


@app.get("/api/graphs/{graph_class_name}/topology")
def get_topology(graph_class_name: str) -> dict:
    """
    @return:
        {
            [node_id]: {
                node_name: string(node_id),
                node_type: 'condition' | 'action' | None,
                edges: [{
                    next_node_id: string,
                    edge_label: str
                }]
            }
        }
    """
    return get_graph_topology(graph_class_name)


from .deployment import Deployment


@app.get('/api/deployments/classes')
def get_service_classes():
    return Deployment.find_all_service_class()

@app.post("/api/deployments")
def create(inputs: dict):
    res = Deployment.create(inputs['service_class_name'])
    
    if res['status'] == 'ready':
        print('Save deployment')
        ServingDb.saveDeployment(inputs['service_class_name'], res['url'])
    
    return res

@app.get('/api/deployments')
def get_deployments():
    return ServingDb.read_data()

@app.delete("/api/deployments/{service_class_name}")
def delete(service_class_name: str) -> dict:
    result = Deployment.delete(service_class_name)
    ServingDb.stop_deployment(service_class_name)
    return result

@app.delete('/api/deployments-history/{id}')
def remove_deployment(id):
    ServingDb.remove_deployment(id)
    return {
        'result': 'success'
    }

import os
from sys import version
import uuid
import json
import datetime


# TODO: Convert this class to DB

class ServingDb:
  @staticmethod
  def saveDeployment(className, url):
    current_max_version = ServingDb.get_max_version_by_class(className)
    obj = {
      'id': str(uuid.uuid4()),
      'graph_name': className,
      'deployed_at': datetime.datetime.utcnow().isoformat(),
      'status': 'deployed',
      'url': url,
      'version': current_max_version + 1 if current_max_version else 1
    }

    deployments = ServingDb.read_data()
    if not deployments:
      deployments = []

    # # Change status of previous deployment -> Do versioning, do not use this
    # for deployment in deployments:
    #   if deployment['graph_name'] == className:
    #     deployment['status']= 'stopped'

    deployments.insert(0, obj)

    ServingDb.write_data(deployments)

  @staticmethod
  def stop_deployment(className, version):
    deployments = ServingDb.read_data()
    if not deployments:
      deployments = []

  
    for deployment in deployments:
      #Set all deployment for current graph to stop
      if deployment['graph_name'] == className and deployment['version'] == int(version):
        deployment['status']= 'stopped'

    ServingDb.write_data(deployments)


  @staticmethod
  def remove_deployment(id):
    deployments = ServingDb.read_data()
    filteded_deployments = [deployment for deployment in deployments if deployment['id'] != id]

    ServingDb.write_data(filteded_deployments)

  @staticmethod
  def get_deploymens_by_id(id):
    deployments = ServingDb.read_data()
    filteded_deployments = [deployment for deployment in deployments if deployment['id'] == id]

    return filteded_deployments[0]

  
  @staticmethod
  def get_max_version_by_class(className):
    deployments = ServingDb.read_data()
    graph_deployments = [deployment for deployment in deployments if deployment['graph_name'] == className]
    max_version = max(deployment['version'] for deployment in graph_deployments) if graph_deployments else 0
    return max_version

  # Helper functions
  @staticmethod
  def read_data():
    # Opening JSON file 
    if os.path.exists("serving.json"):
      with open('serving.json', 'r') as openfile: 
        # Reading from json file 
        servings = json.load(openfile) 
      return servings
    else:
      return []
    
  @staticmethod
  def write_data(data):
    with open('serving.json', 'w') as openfile:
      json.dump(data, openfile) 
import os
import uuid
import json
import datetime


# TODO: Convert this class to actial DB

class ServingDb:
  @staticmethod
  def saveDeployment(graphName, url):
    obj = {
      'id': str(uuid.uuid4()),
      'graph_name': graphName,
      'deployed_at': datetime.datetime.utcnow().isoformat(),
      'status': 'deployed',
      'url': url
    }

    deployments = ServingDb.read_data()
    if not deployments:
      deployments = []

    # Change status of previous deployment
    for deployment in deployments:
      if deployment['graph_name'] == graphName:
        deployment['status']= 'stopped'

    deployments.insert(0, obj)

    ServingDb.write_data(deployments)

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
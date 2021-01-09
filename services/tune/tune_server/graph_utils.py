import sys
import os
import importlib
import inspect
from h1st import Graph, Decision
from h1st.core.ensemble import Ensemble
from os.path import dirname, basename, isfile, join
import glob
from concurrent.futures import ProcessPoolExecutor

def get_package_dir():
    return os.environ.get('WORKBENCH_NAME', './SampleProject')

def find_graphs(module_name):
    graphs = []

    try:       
        if module_name in sys.modules:
            del sys.modules[module_name]
            
        module = importlib.import_module(module_name)
    except:
        return []

    for att in dir(module):
        klass = getattr(module, att)
        if inspect.isclass(klass) and issubclass(klass, Graph):
            graphs.append(klass)

    return graphs

def find_graphs_in_module(module_name):
    '''
    @return:
        list of graph classes
    '''

    # add package path to sys path
    sys.path.append(get_package_dir())

    return find_graphs(module_name)

def find_graphs_in_package():
    '''
    @return:
        {
            [module_name]: list of graph classes
        }
    '''

    # add package path to sys path
    sys.path.append(get_package_dir())

    # search module names
    modules = glob.glob(join(get_package_dir(), "*.py"))
    module_names = [ basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]

    # import modules and extract Graph classes parallelly
    graphs_dict = {}
    with ProcessPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(find_graphs, module_names))
        for i in range(len(results)):
            if results[i]:
                graphs_dict[module_names[i]] = results[i]

    return graphs_dict


def get_graph_topology(graph_name):
    '''
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
    '''

    topo = {}

    graphs_dict = find_graphs_in_package()
    graph_classes = []
    for arr in graphs_dict.values():
        graph_classes += [i for i in arr if i.__name__ == graph_name]
    
    if len(graph_classes) != 1:
        return topo
    else:
        g = graph_classes[0]()

    def dfs_visit(node):
        id = node.id        
        topo[id] = {
            'node_name': id,
            'node_type': 
                'condition'
                    if isinstance(node, Decision)
                    else ('action'
                        if id not in ['start', 'end']
                        else None),
            'ensemble_sub_models':
                [m.__class__.__name__ for m in node._containable._sub_models]
                    if isinstance(node._containable, Ensemble)
                    else None,
            'edges': [{
                'next_node_id': edge[0].id,
                'edge_label': edge[1]              
            } for edge in node.edges]   
        }

        for edge in node.edges:
            dfs_visit(edge[0])

    dfs_visit(g.nodes.start)
    return topo


if __name__ == "__main__":    
    print('all graphs in package:')
    graphs_dict = find_graphs_in_package()
    print(graphs_dict)

    print('all graphs in single module')
    items = find_graphs_in_module('my_o_k_graph')
    print(items)

    print('graph topology:')
    print(items[0].__name__)
    print(get_graph_topology(items[0].__name__))

import json
from flask import Flask, render_template, request
from queue_deque import Queue, Deque
from binary_tree import BinaryTree
from bst import BinarySearchTree
from collections import deque as PythonDeque

app = Flask(__name__)

queue = Queue()
deque = Deque()
tree = BinaryTree()
bst = BinarySearchTree()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/works")
def works():
    return render_template("works.html")

@app.route("/groupinfo")
def groupinfo():
    return render_template("groupinfo.html")

@app.route("/queue", methods=["GET", "POST"])
def queue_page():
    message = ""
    if request.method == "POST":
        action = request.form.get("action")
        value = request.form.get("value")
        print(f"DEBUG: Received POST action={action!r}, value={value!r}")

        if action == "enqueue" and value:
            queue.enqueue(value)
            message = f"Enqueued: {value}"
        elif action == "dequeue":
            removed = queue.dequeue()
            message = f"Dequeued: {removed}" if removed else "Queue is empty!"

    return render_template("queue.html",
                           elements=queue.display(),
                           message=message)

@app.route("/deque", methods=["GET", "POST"])
def deque_page():
    message = ""
    if request.method == "POST":
        action = request.form.get("action")
        value = request.form.get("value")

        if action == "insert_front" and value:
            deque.insert_front(value)
            message = f"Inserted at front: {value}"
        elif action == "insert_rear" and value:
            deque.insert_rear(value)
            message = f"Inserted at rear: {value}"
        elif action == "delete_front":
            removed = deque.delete_front()
            message = f"Deleted from front: {removed}" if removed else "Deque is empty!"
        elif action == "delete_rear":
            removed = deque.delete_rear()
            message = f"Deleted from rear: {removed}" if removed else "Deque is empty!"

    return render_template("deque.html",
                           elements=deque.display(),
                           message=message)

@app.route("/binary_tree", methods=["GET", "POST"])
def binary_tree_page():
    message = ""
    action = None
    val_int = None
    if request.method == "POST":
        action = request.form.get("action")
        value = request.form.get("value")

        if value:
            try:
                val_int = int(value)
                
                if action == "insert":
                    tree.root = tree.insert(tree.root, val_int)
                    message = f"Inserted: {val_int}"
                
                elif action == "delete":
                    tree.root = tree.delete_node(tree.root, val_int)
                    message = f"Deleted: {val_int}"
                
                elif action == "search":
                    result = tree.search(tree.root, val_int)
                    if result:
                        message = f"Found node: {result.key}"
                    else:
                        message = f"Node {val_int} not found."
                        
            except ValueError:
                message = "Input must be an integer."

    elements = tree.post_traversal(tree.root, [])
    tree_data = tree_to_dict(tree.root)
    highlight_val = val_int if (action == "search" and "Found" in message) else None
    
    return render_template("binary_tree.html", 
                           elements=elements, 
                           message=message,
                           tree_data=tree_data,
                           highlight_val=highlight_val)


@app.route("/bst", methods=["GET", "POST"])
def bst_page():
    message = ""
    action = None
    val_int = None 

    if request.method == "POST":
        action = request.form.get("action")
        value = request.form.get("value")
        
        try:
            val_int = int(value) if value else None
        except ValueError:
            val_int = None
            message = "Please enter a valid integer."

        if action == "insert" and val_int is not None:
            bst.root = bst.insert(bst.root, val_int)
            message = f"Inserted: {val_int}"
        
        elif action == "delete" and val_int is not None:
            bst.root = bst.delete(bst.root, val_int)
            message = f"Deleted: {val_int}"
        
        elif action == "search" and val_int is not None:
            found = bst.search(bst.root, val_int)
            message = f"Found node with key: {val_int}" if found else f"Key {val_int} not found"
        
        elif action == "height":
            h = bst.find_height(bst.root)
            message = f"Height of tree: {h}"
            
        elif action == "max":
            max_val = bst.get_max_value(bst.root)
            message = f"Max value: {max_val}" if max_val is not None else "Tree is empty"

    tree_data = tree_to_dict(bst.root)

    highlight_val = val_int if (action == "search" and "found node" in message.lower()) else None

    return render_template("bst.html", 
                           tree_data=tree_data,
                           elements=get_inorder_elements(bst.root), 
                           message=message,
                           highlight_val=highlight_val)

@app.route("/graph-train", methods=["GET", "POST"])
def bfs_page():
    path = None
    visited_order = None
    error = None
    start = None
    goal = None
    
    if request.method == "POST":
        start = request.form.get("start")
        goal = request.form.get("goal")
        
        if start and goal:
            path, visited_order = train.bfs_shortest_path(start, goal)
            if not path:
                error = "No path found."
        else:
            error = "Please select both stations."

    return render_template("graph-train.html", 
                           path=path, 
                           visited_order=visited_order,
                           error=error,
                           start=start,
                           goal=goal)

class TrainGraph:
    def __init__(self):
        self.graph = {}

    def add_station(self, station):
        if station not in self.graph:
            self.graph[station] = []

    def add_connection(self, s1, s2):
        if s1 in self.graph and s2 in self.graph:
            self.graph[s1].append(s2)
            self.graph[s2].append(s1)

    def bfs_shortest_path(self, start, goal):
        queue = PythonDeque([(start, [start])])
        visited = set()
        visited_order = []

        while queue:
            (vertex, path) = queue.popleft()

            if vertex not in visited:
                visited.add(vertex)
                visited_order.append(vertex)

                if vertex == goal:
                    return path, visited_order

                for neighbor in self.graph.get(vertex, []):
                    if neighbor not in visited:
                        queue.append((neighbor, path + [neighbor]))
        
        return None, visited_order

train = TrainGraph()

mrt3 = [
    "North Avenue", "Quezon Avenue", "GMA Kamuning", "Araneta Cubao",
    "Santolan-Annapolis", "Ortigas", "Shaw Boulevard", "Boni",
    "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft Avenue"
]

lrt1 = [
    "Fernando Poe Jr.", "Balintawak", "Monumento", "5th Avenue",
    "R. Papa", "Abad Santos", "Blumentritt", "Tayuman",
    "Bambang", "Doroteo Jose", "Carriedo", "Central Terminal",
    "United Nations", "Pedro Gil", "Quirino", "Vito Cruz",
    "Gil Puyat", "Libertad", "EDSA", "Baclaran"
]

lrt2 = [
    "Recto", "Legarda", "Pureza", "V. Mapa",
    "J. Ruiz", "Gilmore", "Betty Go-Belmonte",
    "Araneta Cubao", "Anonas", "Katipunan",
    "Santolan", "Marikina-Pasig", "Antipolo"
]

for line in [mrt3, lrt1, lrt2]:
    for station in line:
        train.add_station(station)

for line in [mrt3, lrt1, lrt2]:
    for i in range(len(line) - 1):
        train.add_connection(line[i], line[i + 1])

train.add_connection("EDSA", "Taft Avenue")
train.add_connection("Doroteo Jose", "Recto")

if __name__ == "__main__":
    app.run(debug=True)


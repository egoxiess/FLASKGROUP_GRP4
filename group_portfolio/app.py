import json
from flask import Flask, render_template, request
from queue_deque import Queue, Deque
from bst import BinarySearchTree

app = Flask(__name__)

queue = Queue()
deque = Deque()
bst = BinarySearchTree()

def get_inorder_elements(root):
    elements = []
    if root:
        elements = get_inorder_elements(root.left)
        elements.append(root.key)
        elements = elements + get_inorder_elements(root.right)
    return elements

def tree_to_dict(node):
    if node is None:
        return None
    return {
        "key": node.key,
        "left": tree_to_dict(node.left),
        "right": tree_to_dict(node.right)
    }

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

if __name__ == "__main__":
    app.run(debug=True)

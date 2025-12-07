from flask import Flask, render_template, request
from queue_deque import Queue, Deque
from bst import BinarySearchTree
from binary_tree import BinaryTree

app = Flask(__name__)

queue = Queue()
deque = Deque()
bst = BinarySearchTree()
tree = BinaryTree()

def get_inorder_elements(root):
    elements = []
    if root:
        elements = get_inorder_elements(root.left)
        elements.append(root.key)
        elements = elements + get_inorder_elements(root.right)
    return elements

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
    highlight_val = None
    if request.method == "POST":
        action = request.form.get("action")
        value = request.form.get("value")
        print(f"DEBUG: binary_tree POST action={action!r}, value={value!r}")

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
                        highlight_val = val_int
                        print(f"DEBUG: binary_tree set highlight_val={highlight_val}")
                    else:
                        message = f"Node {val_int} not found."

            except ValueError:
                message = "Input must be an integer."

    elements = tree.post_traversal(tree.root, [])
    
    print(f"DEBUG: binary_tree rendering highlight_val={highlight_val}")
    return render_template("binary_tree.html", 
                           root=tree.root,
                           elements=elements, 
                           message=message,
                           highlight_val=highlight_val)

@app.route("/bst", methods=["GET", "POST"])
def bst_page():
    message = ""
    highlight_val = None
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
            if found:
                message = f"Found node with key: {val_int}"
                highlight_val = val_int
                print(f"DEBUG: Set highlight_val to {highlight_val}, type: {type(highlight_val)}")
            else:
                message = f"Key {val_int} not found"
        
        elif action == "height":
            h = bst.find_height(bst.root)
            message = f"Height of tree: {h}"
            print(f"DEBUG: Calculated height={h}")
            
        elif action == "max":
            max_val = bst.get_max_value(bst.root)
            message = f"Max value: {max_val}" if max_val is not None else "Tree is empty"

    print(f"DEBUG: Rendering with highlight_val={highlight_val}")
    return render_template("bst.html", 
                           root=bst.root,
                           elements=get_inorder_elements(bst.root), 
                           message=message,
                           highlight_val=highlight_val)

if __name__ == "__main__":
    app.run(debug=True)

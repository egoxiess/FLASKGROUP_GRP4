class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, root, key):
        if root is None:
            return Node(key)
        
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        
        return root

    def search(self, root, key):
         if root is None or root.key == key:
              return root
         
         if key > root.key:
                return self.search(root.right, key)
         
         return self.search(root.left, key)

    def post_traversal(self, start, traversal):
            if start:
                self.post_traversal(start.left, traversal)
                self.post_traversal(start.right, traversal)
                traversal.append(start.key)
            return traversal
    
    def delete_node(self, root, key):
        if root is None:
              return root
         
        if key < root.key:
            root.left = self.delete_node(root.left, key)
        elif key > root.key:
            root.right = self.delete_node(root.right, key)
        else:
            if root.left is None:
                return root.right
            if root.right is None:
                return root.left
            
            temp = root.right
            while temp.left:
                temp = temp.left
            
            root.key = temp.key
            root.right = self.delete_node(root.right, temp.key)
        return root

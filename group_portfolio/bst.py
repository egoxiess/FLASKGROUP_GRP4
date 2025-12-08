class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

class BinarySearchTree:
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


    def delete(self, root, key):
        if root is None:
            return root

        if key < root.key:
            root.left = self.delete(root.left, key)
        elif key > root.key:
            root.right = self.delete(root.right, key)
        else:
            if root.left is None:
                return root.right

            if root.right is None:
                return root.left

            temp = root.right
            while temp.left:
                temp = temp.left

            root.key = temp.key
            root.right = self.delete(root.right, temp.key)

        return root

    def get_max_value(self, node):
        if node is None:
            return None
        
        while node.right:
            node = node.right

        return node.key


    def find_height(self, node):
        if node is None:
            return -1  

        left_h = self.find_height(node.left)
        right_h = self.find_height(node.right)

        return 1 + max(left_h, right_h)

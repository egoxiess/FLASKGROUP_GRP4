class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class Queue:
    def __init__(self):
        self.front = self.rear = None

    def enqueue(self, data):
        new_node = Node(data)
        if not self.rear:
            self.front = self.rear = new_node
            return
        self.rear.next = new_node
        self.rear = new_node

    def dequeue(self):
        if not self.front:
            return "Queue is empty"
        temp = self.front
        self.front = self.front.next
        if not self.front:
            self.rear = None
        return f"Dequeued: {temp.data}"

    def display(self):
        elements = []
        temp = self.front
        while temp:
            elements.append(temp.data)
            temp = temp.next
        return elements


class Deque:
    def __init__(self):
        self.front = self.rear = None

    def insert_front(self, data):
        new_node = Node(data)
        if not self.front:
            self.front = self.rear = new_node
        else:
            new_node.next = self.front
            self.front = new_node

    def insert_rear(self, data):
        new_node = Node(data)
        if not self.rear:
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node

    def delete_front(self):
        if not self.front:
            return "Deque is empty"
        temp = self.front
        self.front = self.front.next
        if not self.front:
            self.rear = None
        return f"Deleted from front: {temp.data}"

    def delete_rear(self):
        if not self.front:
            return "Deque is empty"
        if self.front == self.rear:
            data = self.rear.data
            self.front = self.rear = None
            return f"Deleted from rear: {data}"
        temp = self.front
        while temp.next != self.rear:
            temp = temp.next
        data = self.rear.data
        temp.next = None
        self.rear = temp
        return f"Deleted from rear: {data}"

    def display(self):
        elements = []
        temp = self.front
        while temp:
            elements.append(temp.data)
            temp = temp.next
        return elements
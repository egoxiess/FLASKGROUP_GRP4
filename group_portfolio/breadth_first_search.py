from collections import deque

class TrainGraph:
    def __init__(self):
        self.graph = {}

    def add_station(self, station):
        if station not in self.graph:
            self.graph[station] = []

    def add_connection(self, s1, s2):
        self.graph[s1].append(s2)
        self.graph[s2].append(s1)

    def bfs_shortest_path(self, start, goal):
        queue = deque([[start]])
        visited = set()

        while queue:
            path = queue.popleft()
            station = path[-1]

            if station == goal:
                return path

            if station not in visited:
                visited.add(station)
                for neighbor in self.graph.get(station, []):
                    queue.append(path + [neighbor])

        return None


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
    "Gil Puyat", "Libertad", "EDSA", "Baclaran", "Redemptorist-Aseana",
    "MIA Road", "PITX", "Ninoy Aquino Avenue", "Dr. Santos"
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

for i in range(len(mrt3) - 1):
    train.add_connection(mrt3[i], mrt3[i + 1])

for i in range(len(lrt1) - 1):
    train.add_connection(lrt1[i], lrt1[i + 1])

for i in range(len(lrt2) - 1):

    train.add_connection(lrt2[i], lrt2[i + 1])

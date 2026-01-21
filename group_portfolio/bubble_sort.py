def bubble_sort_steps(numbers):
    steps = []
    arr = numbers.copy()
    n = len(arr)
    
    for i in range(n):
        for j in range(0, n - i - 1):

            steps.append({
                'type': 'compare',
                'indices': [j, j + 1],
                'array': arr.copy()
            })
            
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                steps.append({
                    'type': 'swap',
                    'indices': [j, j + 1],
                    'array': arr.copy()
                })
    
    steps.append({
        'type': 'done',
        'indices': [],
        'array': arr.copy()
    })
    
    return steps
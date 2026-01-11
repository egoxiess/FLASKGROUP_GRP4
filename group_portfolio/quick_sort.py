def quick_sort_steps(numbers):
    steps = []
    arr = numbers.copy()
    
    def partition(low, high):
        pivot_index = high
        pivot = arr[pivot_index]
        
        steps.append({
            'type': 'pivot',
            'indices': [pivot_index],
            'array': arr.copy()
        })
        
        i = low - 1
        
        for j in range(low, high):
            steps.append({
                'type': 'compare',
                'indices': [j, pivot_index],
                'array': arr.copy()
            })
            
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                steps.append({
                    'type': 'swap',
                    'indices': [i, j],
                    'array': arr.copy()
                })
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        steps.append({
            'type': 'swap',
            'indices': [i + 1, high],
            'array': arr.copy()
        })
        
        steps.append({
            'type': 'sorted-pivot',
            'indices': [i + 1],
            'array': arr.copy()
        })
        
        return i + 1

    def quick_sort_recursive(low, high):
        if low < high:
            pi = partition(low, high)
            quick_sort_recursive(low, pi - 1)
            quick_sort_recursive(pi + 1, high)
        elif low == high:
            steps.append({
                'type': 'sorted-pivot',
                'indices': [low],
                'array': arr.copy()
            })

    quick_sort_recursive(0, len(arr) - 1)
    
    steps.append({
        'type': 'done',
        'indices': [],
        'array': arr.copy()
    })
    
    return steps
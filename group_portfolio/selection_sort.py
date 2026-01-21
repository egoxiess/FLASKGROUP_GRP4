def selection_sort_steps(numbers):
    steps = []
    arr = numbers.copy()
    n = len(arr)

    for i in range(n):
        min_idx = i
        steps.append({
            'type': 'min_update',
            'indices': [min_idx],
            'array': arr.copy()
        })
        for j in range(i + 1, n):
            steps.append({
                'type': 'compare',
                'indices': [min_idx, j],
                'array': arr.copy()
            })
            if arr[j] < arr[min_idx]:
                min_idx = j
                steps.append({
                    'type': 'min_update',
                    'indices': [min_idx],
                    'array': arr.copy()
                })

        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            steps.append({
                'type': 'swap',
                'indices': [i, min_idx],
                'array': arr.copy()
            })

    steps.append({
        'type': 'done',
        'indices': [],
        'array': arr.copy()
    })

    return steps

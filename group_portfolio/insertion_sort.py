def insertion_sort_steps(numbers):
    steps = []
    arr = numbers.copy()
    n = len(arr)

    for i in range(1, n):
        key = arr[i]
        j = i - 1

        steps.append({
            'type': 'compare',
            'indices': [j, j + 1],
            'array': arr.copy()
        })

        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]

            steps.append({
                'type': 'swap',
                'indices': [j, j + 1],
                'array': arr.copy()
            })

            j -= 1

            if j >= 0:
                steps.append({
                    'type': 'compare',
                    'indices': [j, j + 1],
                    'array': arr.copy()
                })

        arr[j + 1] = key

        steps.append({
            'type': 'insert',
            'indices': [j + 1],
            'array': arr.copy()
        })

    steps.append({
        'type': 'done',
        'indices': [],
        'array': arr.copy()
    })

    return steps

def merge_sort_steps(numbers):
    steps = []
    arr = numbers.copy()

    def merge_sort(left, right):
        if left < right:
            mid = (left + right) // 2
            merge_sort(left, mid)
            merge_sort(mid + 1, right)
            merge(left, mid, right)

    def merge(left, mid, right):
        i = left
        j = mid + 1

        while i <= mid and j <= right:
            steps.append({
                'type': 'compare',
                'indices': [i, j],
                'array': arr.copy()
            })

            if arr[i] <= arr[j]:
                i += 1
            else:
                value = arr[j]
                k = j
                while k > i:
                    arr[k] = arr[k - 1]
                    k -= 1
                arr[i] = value

                steps.append({
                    'type': 'swap',
                    'indices': [i, j],
                    'array': arr.copy()
                })

                i += 1
                mid += 1
                j += 1

    merge_sort(0, len(arr) - 1)

    steps.append({
        'type': 'done',
        'indices': [],
        'array': arr.copy()
    })

    return steps
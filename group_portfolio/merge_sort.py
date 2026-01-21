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
        left_part = arr[left:mid+1]
        right_part = arr[mid+1:right+1]

        steps.append({
            "type": "merge_start",
            "left": left,
            "mid": mid,
            "right": right,
            "array": arr.copy()
        })

        i = 0
        j = 0
        k = left

        while i < len(left_part) and j < len(right_part):
            steps.append({
                "type": "compare",
                "indices": [left + i, mid + 1 + j],
                "array": arr.copy()
            })

            if left_part[i] <= right_part[j]:
                arr[k] = left_part[i]
                i += 1
            else:
                arr[k] = right_part[j]
                j += 1

            steps.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": arr.copy()
            })
            k += 1

        while i < len(left_part):
            arr[k] = left_part[i]
            i += 1
            steps.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": arr.copy()
            })
            k += 1

        while j < len(right_part):
            arr[k] = right_part[j]
            j += 1
            steps.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": arr.copy()
            })
            k += 1

    merge_sort(0, len(arr) - 1)

    steps.append({
        "type": "done",
        "array": arr.copy()
    })

    return steps
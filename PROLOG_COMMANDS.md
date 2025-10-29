# 🔮 Prolog Query Reference Guide

## Quick Command Reference for BST Visualizer

### Building & Modifying Trees

#### `build_tree([values], T)`
Build a complete tree from a list of values.
```prolog
build_tree([50,30,70,20,40,60,80], T)
```

#### `insert(value, T)`
Insert a single value into the current tree.
```prolog
insert(45, T)
insert(25, T)
```

#### `delete(value, T)`
Delete a value from the current tree.
```prolog
delete(30, T)
delete(70, T)
```

#### `clear`
Clear the entire tree.
```prolog
clear
```

---

### Searching & Lookup

#### `lookup(value, T)`
Search for a value in the tree (shows animated path).
```prolog
lookup(40, T)
lookup(75, T)
```

---

### Traversals

#### `inorder(T, L)`
Get sorted list (Left-Root-Right) with animation.
```prolog
inorder(T, L)
```
Result: `L = [20, 30, 40, 50, 60, 70, 80]`

#### `preorder(T, L)`
Get preorder traversal (Root-Left-Right) with animation.
```prolog
preorder(T, L)
```
Result: `L = [50, 30, 20, 40, 70, 60, 80]`

#### `postorder(T, L)`
Get postorder traversal (Left-Right-Root) with animation.
```prolog
postorder(T, L)
```
Result: `L = [20, 40, 30, 60, 80, 70, 50]`

---

### Tree Statistics

#### `size(T, N)`
Get the total number of nodes.
```prolog
size(T, N)
```
Result: `N = 7`

#### `height(T, H)`
Get the height of the tree.
```prolog
height(T, H)
```
Result: `H = 3`

#### `find_min(T, Min)`
Find the minimum value in the tree.
```prolog
find_min(T, Min)
```
Result: `Min = 20`

#### `find_max(T, Max)`
Find the maximum value in the tree.
```prolog
find_max(T, Max)
```
Result: `Max = 80`

#### `count_leaves(T, Count)`
Count the number of leaf nodes.
```prolog
count_leaves(T, Count)
```
Result: `Count = 4`

---

### Validation

#### `is_valid_bst(T)`
Check if the tree satisfies BST properties.
```prolog
is_valid_bst(T)
```
Result: `true.` or `false.`

---

## 🎯 Example Session

```prolog
# Start with a new tree
?- build_tree([50,30,70,20,40,60,80], T)
true.
Tree built with values: [50, 30, 70, 20, 40, 60, 80]

# Check if a value exists
?- lookup(40, T)
true.
Value 40 found in tree!

# Get sorted list
?- inorder(T, L)
true.
L = [20, 30, 40, 50, 60, 70, 80]

# Insert a new value
?- insert(45, T)
true.
Inserted 45 into tree.

# Check the new sorted list
?- inorder(T, L)
true.
L = [20, 30, 40, 45, 50, 60, 70, 80]

# Delete a node
?- delete(30, T)
true.
Deleted 30 from tree.

# Get tree statistics
?- size(T, N)
true.
N = 7

?- height(T, H)
true.
H = 4

# Validate the tree
?- is_valid_bst(T)
true.
The tree is a valid BST.

# Clear everything
?- clear
true.
Tree cleared.
```

---

## 💡 Tips

1. **Variable `T`**: Always represents the current tree in memory
2. **Click Examples**: Click any example command to auto-fill the input
3. **Enter Key**: Press Enter to execute the query
4. **Animations**: Watch the tree animate during searches and traversals
5. **Statistics**: Updated automatically after each operation
6. **History**: Your last 5 commands are shown for quick re-execution

---

## 🎨 Visual Feedback

- **Blue nodes**: Normal nodes in the tree
- **Orange nodes**: Currently highlighted/selected
- **Green nodes**: Found during search
- **Animated paths**: Show traversal order or search path

---

## ⚠️ Important Notes

- Commands are case-insensitive
- Trailing periods (`.`) are optional
- Empty tree operations return appropriate messages
- Duplicate values are ignored during insertion
- The visualizer uses JavaScript for rendering, but mimics Prolog syntax

---

## 🚀 Advanced Queries

Combine operations in sequence:

```prolog
# Build, modify, and query
?- build_tree([50,30,70], T)
?- insert(20, T)
?- insert(40, T)
?- inorder(T, L)
L = [20, 30, 40, 50, 70]

# Test edge cases
?- build_tree([1], T)
?- is_valid_bst(T)
true.

# Large tree
?- build_tree([50,25,75,12,37,62,87,6,18,31,43,56,68,81,93], T)
?- height(T, H)
H = 4
```

---

**Happy querying! 🌳✨**

# 🌳 Binary Search Tree in Prolog

A comprehensive implementation of Binary Search Tree (BST) operations in Prolog with an interactive web-based visualization tool.

## 📋 Project Overview

This project demonstrates the power of Prolog for handling recursive data structures by implementing a complete Binary Search Tree with:

- **Core Operations**: Insert, Delete, Lookup
- **Traversals**: Inorder, Preorder, Postorder
- **Utilities**: Size, Height, Min/Max, Leaf Count, Validation
- **Web Visualization**: Interactive HTML5 Canvas-based tree renderer

## 🎯 Features

### Prolog Implementation (`bst.pl`)
- ✅ Insert values into the tree
- ✅ Delete nodes (handles all cases: leaf, one child, two children)
- ✅ Search/lookup operations
- ✅ All three traversal methods
- ✅ Tree statistics and validation
- ✅ BST property verification
- ✅ Pretty printing

### Web Visualizer
- 🎨 Beautiful, modern UI with gradient design
- 🖱️ Interactive tree visualization
- ⚡ Smooth animations for operations
- 📊 Real-time statistics display
- 🔍 Visual search path highlighting
- 🎯 Click nodes to select them
- 📱 Fully responsive design

## 📁 Project Structure

```
binary_tree/
├── bst.pl              # Main BST implementation
├── test_bst.pl         # Test suite and examples
├── server.pl           # HTTP server (optional)
├── index.html          # Web interface
├── bst_visualizer.js   # Visualization logic
├── styles.css          # Styling
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Prolog Only (No Web Interface)

**Requirements:**
- SWI-Prolog installed ([Download here](https://www.swi-prolog.org/download/stable))

**Usage:**

1. Open SWI-Prolog
2. Load the BST implementation:
   ```prolog
   ?- [bst].
   ```

3. Try some operations:
   ```prolog
   % Build a tree
   ?- build_tree([50, 30, 70, 20, 40, 60, 80], Tree).
   
   % Get sorted list (inorder traversal)
   ?- build_tree([50, 30, 70, 20, 40], T), inorder(T, L).
   L = [20, 30, 40, 50, 70].
   
   % Search for a value
   ?- build_tree([50, 30, 70], T), lookup(40, T).
   false.
   
   % Delete a node
   ?- build_tree([50, 30, 70, 20], T), delete(30, T, T2), inorder(T2, L).
   L = [20, 50, 70].
   
   % Get tree height
   ?- build_tree([50, 30, 70, 20], T), height(T, H).
   H = 3.
   
   % Validate BST
   ?- build_tree([50, 30, 70], T), is_valid_bst(T).
   true.
   ```

4. Run the test suite:
   ```prolog
   ?- [test_bst].
   ?- run_all_tests.
   ```

### Option 2: Web Visualizer (Standalone)

**Requirements:**
- Any modern web browser

**Usage:**

1. Simply open `index.html` in your web browser
2. The visualizer runs entirely in JavaScript (no server needed)
3. Use the control panel to:
   - Insert/delete values
   - Search for nodes
   - Build trees from lists
   - View traversals
   - Generate random trees

**Controls:**
- **Insert**: Enter a value and click "Insert"
- **Delete**: Enter a value and click "Delete"
- **Search**: Enter a value and click "Search" to see the path
- **Build Tree**: Enter comma-separated values (e.g., `50,30,70,20`)
- **Traversals**: Click buttons to see different traversal orders
- **Click nodes**: Directly click on tree nodes to select them

### Option 3: Full Integration (Prolog + Web Server)

**Requirements:**
- SWI-Prolog with HTTP library

**Usage:**

1. Start SWI-Prolog
2. Load and start the server:
   ```prolog
   ?- [server].
   ?- start_server(8080).
   ```

3. Open your browser to:
   ```
   http://localhost:8080
   ```

4. The web interface will now communicate with Prolog backend!

5. To stop the server:
   ```prolog
   ?- stop_server.
   ```

## 📚 API Reference

### Core Predicates

#### `insert(+Value, +Tree, -NewTree)`
Inserts a value into the tree.
```prolog
?- insert(50, empty, T).
T = tree(50, empty, empty).
```

#### `delete(+Value, +Tree, -NewTree)`
Deletes a value from the tree.
```prolog
?- build_tree([50, 30, 70], T), delete(30, T, T2).
```

#### `lookup(+Value, +Tree)`
Checks if a value exists in the tree.
```prolog
?- build_tree([50, 30, 70], T), lookup(30, T).
true.
```

#### `inorder(+Tree, -List)`
Returns sorted list of values (Left-Root-Right).
```prolog
?- build_tree([50, 30, 70], T), inorder(T, L).
L = [30, 50, 70].
```

#### `preorder(+Tree, -List)`
Returns preorder traversal (Root-Left-Right).

#### `postorder(+Tree, -List)`
Returns postorder traversal (Left-Right-Root).

#### `build_tree(+List, -Tree)`
Builds a tree from a list of values.
```prolog
?- build_tree([50, 30, 70, 20, 40], Tree).
```

### Utility Predicates

#### `size(+Tree, -N)`
Returns the number of nodes.

#### `height(+Tree, -H)`
Returns the height of the tree.

#### `find_min(+Tree, -Min)`
Finds the minimum value.

#### `find_max(+Tree, -Max)`
Finds the maximum value.

#### `count_leaves(+Tree, -Count)`
Counts leaf nodes.

#### `is_valid_bst(+Tree)`
Validates BST properties.

#### `print_tree(+Tree)`
Pretty prints the tree structure.

## 🎓 Example Session

```prolog
% Start Prolog
swipl

% Load the BST module
?- [bst].

% Create a tree
?- build_tree([50, 30, 70, 20, 40, 60, 80], Tree).
Tree = tree(50, tree(30, tree(20, empty, empty), tree(40, empty, empty)), 
             tree(70, tree(60, empty, empty), tree(80, empty, empty))).

% Get statistics
?- build_tree([50, 30, 70, 20, 40, 60, 80], T),
   size(T, S), height(T, H), count_leaves(T, L).
S = 7,
H = 3,
L = 4.

% Test all traversals
?- build_tree([50, 30, 70, 20, 40], T),
   inorder(T, In),
   preorder(T, Pre),
   postorder(T, Post).
In = [20, 30, 40, 50, 70],
Pre = [50, 30, 20, 40, 70],
Post = [20, 40, 30, 70, 50].

% Pretty print
?- build_tree([50, 30, 70, 20, 40], T), print_tree(T).
        70
    50
            40
        30
            20
```

## 🧪 Running Tests

Load and run the comprehensive test suite:

```prolog
?- [test_bst].
?- run_all_tests.
```

This will run tests for:
- Basic insertion
- Lookup operations
- All traversal methods
- Delete operations
- Utility functions
- BST validation
- Edge cases

## 🎨 Web Interface Features

### Operations Panel
- **Insert**: Add new values to the tree
- **Delete**: Remove values from the tree
- **Search**: Visual search with path highlighting
- **Build Tree**: Create tree from comma-separated values
- **Clear Tree**: Remove all nodes
- **Random Tree**: Generate random tree

### Traversal Panel
- View Inorder (sorted)
- View Preorder
- View Postorder
- Animated highlighting

### Statistics Panel
Real-time display of:
- Tree size
- Tree height
- Minimum value
- Maximum value
- Leaf count
- BST validity

### Canvas Controls
- 🔍+ Zoom in
- 🔍- Zoom out
- Reset View
- Animation speed slider

## 🎯 Use Cases

### Academic
- **Data Structures Course**: Perfect for learning BST concepts
- **Algorithm Visualization**: See how operations work step-by-step
- **Prolog Practice**: Learn recursive programming in Prolog

### Professional
- **Interview Preparation**: Practice BST problems
- **Teaching Tool**: Demonstrate BST concepts visually
- **Algorithm Testing**: Verify BST implementations

## 🛠️ Customization

### Modify Tree Appearance
Edit `bst_visualizer.js`:
```javascript
// Node colors
ctx.fillStyle = '#3498db';  // Normal node color
ctx.fillStyle = '#f39c12';  // Highlighted node color
ctx.fillStyle = '#27ae60';  // Found node color
```

### Change Animation Speed
Edit `bst_visualizer.js`:
```javascript
let animationSpeed = 1;  // Default speed
```

### Add New Operations
1. Add predicate to `bst.pl`
2. Add button to `index.html`
3. Add handler to `bst_visualizer.js`

## 📝 Data Representation

Trees are represented as:
- **Empty tree**: `empty`
- **Node**: `tree(Value, LeftChild, RightChild)`

Example:
```prolog
tree(50, 
     tree(30, empty, empty), 
     tree(70, empty, empty))
```

Represents:
```
    50
   /  \
  30   70
```

## 🤝 Contributing

Ideas for enhancements:
- [ ] AVL tree self-balancing
- [ ] Red-Black tree implementation
- [ ] Tree rotation animations
- [ ] Export tree as image
- [ ] Save/load tree state
- [ ] Step-by-step operation mode
- [ ] Compare multiple trees

## 📖 Learning Resources

### Prolog Resources
- [SWI-Prolog Documentation](https://www.swi-prolog.org/pldoc/doc_for?object=manual)
- [Learn Prolog Now!](http://www.learnprolognow.org/)

### BST Resources
- [Binary Search Tree - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search-tree-data-structure/)
- [BST Visualization](https://visualgo.net/en/bst)

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created for Prolog Project - October 30, 2025

## 🙏 Acknowledgments

- SWI-Prolog community
- Binary Search Tree algorithm creators
- HTML5 Canvas API

---

## 🎉 Quick Start Commands

```prolog
% Load and test
?- [bst], [test_bst], run_all_tests.

% Create and explore a tree
?- build_tree([50, 30, 70, 20, 40, 60, 80], T),
   print_tree(T),
   inorder(T, L),
   write('Sorted: '), write(L).

% Validate operations
?- build_tree([50, 30, 70], T1),
   insert(40, T1, T2),
   delete(70, T2, T3),
   is_valid_bst(T3).
```

**Enjoy exploring Binary Search Trees in Prolog! 🚀**

// Binary Search Tree Visualizer - JavaScript Implementation
// Author: Prolog Project
// Date: October 30, 2025

// ============================================================================
// DATA STRUCTURES & GLOBAL STATE
// ============================================================================

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.highlighted = false;
        this.found = false;
    }
}

let root = null;
let canvas, ctx;
let animationSpeed = 1;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let commandHistory = [];
let currentTree = null; // Store current tree for 'T' reference

// ============================================================================
// INITIALIZATION
// ============================================================================

window.onload = function() {
    canvas = document.getElementById('treeCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Canvas interaction
    canvas.addEventListener('click', handleCanvasClick);
    
    // Enter key for query execution
    document.getElementById('prologInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executePrologQuery();
        }
    });
    
    // Initialize with empty tree
    drawTree();
    showOutput('Welcome to BST Prolog Visualizer!\nType a command or click an example to get started.\n\nExample: build_tree([50,30,70,20,40,60,80], T)', 'info');
};

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawTree();
}

// ============================================================================
// PROLOG QUERY PARSER & EXECUTOR
// ============================================================================

function executePrologQuery() {
    const input = document.getElementById('prologInput');
    const query = input.value.trim();
    
    if (!query) {
        showOutput('Error: Empty query', 'error');
        return;
    }
    
    // Add to history
    addToHistory(query);
    
    // Parse and execute query
    try {
        const result = parsePrologQuery(query);
        if (result.success) {
            showOutput(`?- ${query}\n${result.output}`, 'success');
            if (result.updateTree) {
                currentTree = root;
                drawTree();
            }
        } else {
            showOutput(`?- ${query}\n${result.output}`, 'error');
        }
    } catch (error) {
        showOutput(`?- ${query}\nError: ${error.message}`, 'error');
    }
    
    input.value = '';
}

function parsePrologQuery(query) {
    // Remove trailing period if present
    query = query.replace(/\.\s*$/, '').trim();
    
    // Clear command
    if (query === 'clear' || query === 'clear_tree') {
        root = null;
        currentTree = null;
        return {
            success: true,
            output: 'true.\n\nTree cleared.',
            updateTree: true
        };
    }
    
    // build_tree([...], T)
    const buildMatch = query.match(/build_tree\s*\(\s*\[([^\]]+)\]\s*,\s*T\s*\)/i);
    if (buildMatch) {
        const values = buildMatch[1].split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        if (values.length === 0) {
            return { success: false, output: 'Error: No valid values provided' };
        }
        root = null;
        values.forEach(val => insert(val));
        currentTree = root;
        return {
            success: true,
            output: `true.\n\nTree built with values: [${values.join(', ')}]\nT = tree(${values[values.length - 1]}, ...)`,
            updateTree: true
        };
    }
    
    // insert(Value, T)
    const insertMatch = query.match(/insert\s*\(\s*(\d+)\s*,\s*T\s*\)/i);
    if (insertMatch) {
        const value = parseInt(insertMatch[1]);
        insert(value);
        currentTree = root;
        return {
            success: true,
            output: `true.\n\nInserted ${value} into tree.\nT = tree(...)`,
            updateTree: true
        };
    }
    
    // delete(Value, T)
    const deleteMatch = query.match(/delete\s*\(\s*(\d+)\s*,\s*T\s*\)/i);
    if (deleteMatch) {
        const value = parseInt(deleteMatch[1]);
        const sizeBefore = getSize(root);
        deleteNode(value);
        const sizeAfter = getSize(root);
        if (sizeBefore > sizeAfter) {
            currentTree = root;
            return {
                success: true,
                output: `true.\n\nDeleted ${value} from tree.\nT = tree(...)`,
                updateTree: true
            };
        } else {
            return {
                success: false,
                output: `false.\n\nValue ${value} not found in tree.`
            };
        }
    }
    
    // lookup(Value, T)
    const lookupMatch = query.match(/lookup\s*\(\s*(\d+)\s*,\s*T\s*\)/i);
    if (lookupMatch) {
        const value = parseInt(lookupMatch[1]);
        clearHighlights(root);
        const path = [];
        const found = searchNode(root, value, path);
        
        if (found) {
            animateSearch(path, () => {});
            return {
                success: true,
                output: `true.\n\nValue ${value} found in tree!`,
                updateTree: true
            };
        } else {
            return {
                success: false,
                output: `false.\n\nValue ${value} not found in tree.`
            };
        }
    }
    
    // inorder(T, L)
    const inorderMatch = query.match(/inorder\s*\(\s*T\s*,\s*L\s*\)/i);
    if (inorderMatch) {
        if (root === null) {
            return {
                success: true,
                output: 'true.\n\nL = []'
            };
        }
        const result = inorderTraversal(root);
        const nodes = getTraversalNodes(root, 'inorder');
        animateTraversal(nodes, () => {});
        return {
            success: true,
            output: `true.\n\nL = [${result.join(', ')}]`,
            updateTree: true
        };
    }
    
    // preorder(T, L)
    const preorderMatch = query.match(/preorder\s*\(\s*T\s*,\s*L\s*\)/i);
    if (preorderMatch) {
        if (root === null) {
            return {
                success: true,
                output: 'true.\n\nL = []'
            };
        }
        const result = preorderTraversal(root);
        const nodes = getTraversalNodes(root, 'preorder');
        animateTraversal(nodes, () => {});
        return {
            success: true,
            output: `true.\n\nL = [${result.join(', ')}]`,
            updateTree: true
        };
    }
    
    // postorder(T, L)
    const postorderMatch = query.match(/postorder\s*\(\s*T\s*,\s*L\s*\)/i);
    if (postorderMatch) {
        if (root === null) {
            return {
                success: true,
                output: 'true.\n\nL = []'
            };
        }
        const result = postorderTraversal(root);
        const nodes = getTraversalNodes(root, 'postorder');
        animateTraversal(nodes, () => {});
        return {
            success: true,
            output: `true.\n\nL = [${result.join(', ')}]`,
            updateTree: true
        };
    }
    
    // is_valid_bst(T)
    const validMatch = query.match(/is_valid_bst\s*\(\s*T\s*\)/i);
    if (validMatch) {
        const valid = isValidBST(root);
        return {
            success: valid,
            output: valid ? 'true.\n\nThe tree is a valid BST.' : 'false.\n\nThe tree is NOT a valid BST.'
        };
    }
    
    // size(T, N)
    const sizeMatch = query.match(/size\s*\(\s*T\s*,\s*N\s*\)/i);
    if (sizeMatch) {
        const size = getSize(root);
        return {
            success: true,
            output: `true.\n\nN = ${size}`
        };
    }
    
    // height(T, H)
    const heightMatch = query.match(/height\s*\(\s*T\s*,\s*H\s*\)/i);
    if (heightMatch) {
        const height = getHeight(root);
        return {
            success: true,
            output: `true.\n\nH = ${height}`
        };
    }
    
    // find_min(T, Min)
    const minMatch = query.match(/find_min\s*\(\s*T\s*,\s*Min\s*\)/i);
    if (minMatch) {
        if (root === null) {
            return { success: false, output: 'Error: Tree is empty' };
        }
        const min = findMin(root).value;
        return {
            success: true,
            output: `true.\n\nMin = ${min}`
        };
    }
    
    // find_max(T, Max)
    const maxMatch = query.match(/find_max\s*\(\s*T\s*,\s*Max\s*\)/i);
    if (maxMatch) {
        if (root === null) {
            return { success: false, output: 'Error: Tree is empty' };
        }
        const max = findMax(root).value;
        return {
            success: true,
            output: `true.\n\nMax = ${max}`
        };
    }
    
    // count_leaves(T, Count)
    const leavesMatch = query.match(/count_leaves\s*\(\s*T\s*,\s*Count\s*\)/i);
    if (leavesMatch) {
        const count = countLeaves(root);
        return {
            success: true,
            output: `true.\n\nCount = ${count}`
        };
    }
    
    return {
        success: false,
        output: `Error: Unknown query or syntax error.\n\nSupported queries:\n- build_tree([values], T)\n- insert(value, T)\n- delete(value, T)\n- lookup(value, T)\n- inorder(T, L)\n- preorder(T, L)\n- postorder(T, L)\n- is_valid_bst(T)\n- size(T, N)\n- height(T, H)\n- find_min(T, Min)\n- find_max(T, Max)\n- count_leaves(T, Count)\n- clear`
    };
}

function setQuery(query) {
    document.getElementById('prologInput').value = query;
    document.getElementById('prologInput').focus();
}

function addToHistory(query) {
    commandHistory.unshift(query);
    if (commandHistory.length > 10) {
        commandHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyDiv = document.getElementById('commandHistory');
    if (commandHistory.length === 0) {
        historyDiv.innerHTML = '<div style="color: #666; font-style: italic; padding: 10px;">No command history yet...</div>';
        return;
    }
    
    historyDiv.innerHTML = commandHistory.slice(0, 5).map((cmd, idx) => 
        `<div class="command-history-item" onclick="setQuery('${cmd.replace(/'/g, "\\'")}')">
            <div class="command-query">?- ${cmd}</div>
        </div>`
    ).join('');
}

function showOutput(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    
    // Create output line
    const lines = message.split('\n');
    let html = '';
    
    for (const line of lines) {
        if (line.startsWith('?-')) {
            html += `<div style="color: #3498db; font-weight: bold; margin-top: 10px;">${line}</div>`;
        } else if (line.startsWith('Error:') || line === 'false.') {
            html += `<div style="color: #e74c3c;">${line}</div>`;
        } else if (line === 'true.' || line.startsWith('true.')) {
            html += `<div style="color: #27ae60; font-weight: bold;">${line}</div>`;
        } else if (line.match(/^[A-Z]\s*=/)) {
            html += `<div style="color: #f39c12;">${line}</div>`;
        } else {
            html += `<div style="color: #95a5a6;">${line}</div>`;
        }
    }
    
    messageBox.innerHTML = html;
    messageBox.scrollTop = messageBox.scrollHeight;
}

// ============================================================================
// BST OPERATIONS (JavaScript Implementation)
// ============================================================================

function insert(value) {
    if (root === null) {
        root = new TreeNode(value);
        return true;
    } else {
        return insertNode(root, value);
    }
}

function insertNode(node, value) {
    if (value === node.value) {
        return false; // Duplicate
    } else if (value < node.value) {
        if (node.left === null) {
            node.left = new TreeNode(value);
            return true;
        } else {
            return insertNode(node.left, value);
        }
    } else {
        if (node.right === null) {
            node.right = new TreeNode(value);
            return true;
        } else {
            return insertNode(node.right, value);
        }
    }
}

function search(value) {
    const path = [];
    const found = searchNode(root, value, path);
    
    if (found) {
        animateSearch(path, () => {});
        return true;
    } else {
        animateSearch(path, () => {});
        return false;
    }
}

function searchNode(node, value, path) {
    if (node === null) return false;
    
    path.push(node);
    
    if (value === node.value) {
        node.found = true;
        return true;
    } else if (value < node.value) {
        return searchNode(node.left, value, path);
    } else {
        return searchNode(node.right, value, path);
    }
}

function deleteNode(value) {
    if (root === null) {
        return false;
    }
    
    const result = deleteNodeRecursive(root, value);
    root = result.node;
    return result.deleted;
}

function deleteNodeRecursive(node, value) {
    if (node === null) {
        return { node: null, deleted: false };
    }
    
    if (value < node.value) {
        const result = deleteNodeRecursive(node.left, value);
        node.left = result.node;
        return { node: node, deleted: result.deleted };
    } else if (value > node.value) {
        const result = deleteNodeRecursive(node.right, value);
        node.right = result.node;
        return { node: node, deleted: result.deleted };
    } else {
        // Node to delete found
        
        // Case 1: Leaf node
        if (node.left === null && node.right === null) {
            return { node: null, deleted: true };
        }
        
        // Case 2: One child
        if (node.left === null) {
            return { node: node.right, deleted: true };
        }
        if (node.right === null) {
            return { node: node.left, deleted: true };
        }
        
        // Case 3: Two children
        const successor = findMin(node.right);
        node.value = successor.value;
        const result = deleteNodeRecursive(node.right, successor.value);
        node.right = result.node;
        return { node: node, deleted: true };
    }
}

function findMin(node) {
    while (node.left !== null) {
        node = node.left;
    }
    return node;
}

function findMax(node) {
    while (node.right !== null) {
        node = node.right;
    }
    return node;
}

// ============================================================================
// TRAVERSAL OPERATIONS
// ============================================================================

function inorderTraversal(node, result = []) {
    if (node !== null) {
        inorderTraversal(node.left, result);
        result.push(node.value);
        inorderTraversal(node.right, result);
    }
    return result;
}

function preorderTraversal(node, result = []) {
    if (node !== null) {
        result.push(node.value);
        preorderTraversal(node.left, result);
        preorderTraversal(node.right, result);
    }
    return result;
}

function postorderTraversal(node, result = []) {
    if (node !== null) {
        postorderTraversal(node.left, result);
        postorderTraversal(node.right, result);
        result.push(node.value);
    }
    return result;
}

function getTraversalNodes(node, type, result = []) {
    if (node !== null) {
        if (type === 'preorder') result.push(node);
        getTraversalNodes(node.left, type, result);
        if (type === 'inorder') result.push(node);
        getTraversalNodes(node.right, type, result);
        if (type === 'postorder') result.push(node);
    }
    return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getSize(node) {
    if (node === null) return 0;
    return 1 + getSize(node.left) + getSize(node.right);
}

function getHeight(node) {
    if (node === null) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function countLeaves(node) {
    if (node === null) return 0;
    if (node.left === null && node.right === null) return 1;
    return countLeaves(node.left) + countLeaves(node.right);
}

function isValidBST(node, min = -Infinity, max = Infinity) {
    if (node === null) return true;
    if (node.value <= min || node.value >= max) return false;
    return isValidBST(node.left, min, node.value) && 
           isValidBST(node.right, node.value, max);
}

// ============================================================================
// VISUALIZATION - POSITION CALCULATION
// ============================================================================

function calculatePositions(node, x, y, horizontalSpacing, depth = 0) {
    if (node === null) return;
    
    node.x = x;
    node.y = y;
    
    const nextY = y + 80;
    const nextSpacing = horizontalSpacing / 2;
    
    if (node.left !== null) {
        calculatePositions(node.left, x - horizontalSpacing, nextY, nextSpacing, depth + 1);
    }
    if (node.right !== null) {
        calculatePositions(node.right, x + horizontalSpacing, nextY, nextSpacing, depth + 1);
    }
}

// ============================================================================
// VISUALIZATION - DRAWING
// ============================================================================

function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (root === null) {
        ctx.fillStyle = '#666';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Empty Tree - Type a Prolog command to start', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Calculate positions
    const treeHeight = getHeight(root);
    const initialSpacing = Math.min(canvas.width / 4, 150);
    calculatePositions(root, canvas.width / 2, 50, initialSpacing);
    
    // Draw edges first
    drawEdges(root);
    
    // Draw nodes on top
    drawNodes(root);
}

function drawEdges(node) {
    if (node === null) return;
    
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    
    if (node.left !== null) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.stroke();
        drawEdges(node.left);
    }
    
    if (node.right !== null) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.stroke();
        drawEdges(node.right);
    }
}

function drawNodes(node) {
    if (node === null) return;
    
    // Draw left and right subtrees first
    if (node.left !== null) drawNodes(node.left);
    if (node.right !== null) drawNodes(node.right);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
    
    // Set colors based on state
    if (node.found) {
        ctx.fillStyle = '#27ae60';
        ctx.strokeStyle = '#1e8449';
    } else if (node.highlighted) {
        ctx.fillStyle = '#f39c12';
        ctx.strokeStyle = '#d68910';
    } else {
        ctx.fillStyle = '#3498db';
        ctx.strokeStyle = '#2874a6';
    }
    
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw value
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, node.x, node.y);
}

// ============================================================================
// ANIMATION
// ============================================================================

function animateSearch(path, callback) {
    let index = 0;
    
    const animate = () => {
        if (index < path.length) {
            // Clear previous highlights
            clearHighlights(root);
            
            // Highlight current path
            for (let i = 0; i <= index; i++) {
                path[i].highlighted = true;
            }
            
            drawTree();
            index++;
            setTimeout(animate, 500 / animationSpeed);
        } else {
            if (callback) callback();
            setTimeout(() => {
                clearHighlights(root);
                drawTree();
            }, 2000 / animationSpeed);
        }
    };
    
    animate();
}

function animateTraversal(nodes, callback) {
    let index = 0;
    
    const animate = () => {
        if (index < nodes.length) {
            clearHighlights(root);
            nodes[index].highlighted = true;
            drawTree();
            index++;
            setTimeout(animate, 600 / animationSpeed);
        } else {
            if (callback) callback();
            setTimeout(() => {
                clearHighlights(root);
                drawTree();
            }, 1000 / animationSpeed);
        }
    };
    
    animate();
}

function clearHighlights(node) {
    if (node === null) return;
    node.highlighted = false;
    node.found = false;
    clearHighlights(node.left);
    clearHighlights(node.right);
}

// ============================================================================
// UI EVENT HANDLERS
// ============================================================================

// ============================================================================
// CANVAS CONTROLS
// ============================================================================

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedNode = findNodeAt(root, x, y);
    if (clickedNode) {
        clearHighlights(root);
        clickedNode.highlighted = true;
        drawTree();
        showOutput(`Selected node: ${clickedNode.value}`, 'info');
    }
}

function findNodeAt(node, x, y) {
    if (node === null) return null;
    
    const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
    if (distance <= 25) return node;
    
    const leftResult = findNodeAt(node.left, x, y);
    if (leftResult) return leftResult;
    
    return findNodeAt(node.right, x, y);
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keypress', (event) => {
    // Focus on input when typing (except when already in input)
    if (event.target.tagName !== 'INPUT' && event.key.match(/[a-zA-Z0-9]/)) {
        document.getElementById('prologInput').focus();
    }
});

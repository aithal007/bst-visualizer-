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
let currentTree = null; 
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let lastOffsetX = 0;
let lastOffsetY = 0;
window.onload = function() {
    canvas = document.getElementById('treeCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    document.getElementById('prologInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executePrologQuery();
        }
    });
    drawTree();
    showOutput('Welcome to BST Prolog Visualizer!\nType a command or click an example to get started.\n\nExample: build_tree([50,30,70,20,40,60,80], T)', 'info');
};
function zoomIn() {
    scale = Math.min(scale * 1.2, 3);
    drawTree();
}
function zoomOut() {
    scale = Math.max(scale / 1.2, 0.3);
    drawTree();
}
function resetView() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    drawTree();
}
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawTree();
}
function executePrologQuery() {
    const input = document.getElementById('prologInput');
    const query = input.value.trim();
    if (!query) {
        showOutput('Error: Empty query', 'error');
        return;
    }
    addToHistory(query);
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
    query = query.replace(/\.\s*$/, '').trim();
    if (query === 'clear' || query === 'clear_tree') {
        root = null;
        currentTree = null;
        return {
            success: true,
            output: 'true.\n\nTree cleared.',
            updateTree: true
        };
    }
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
    const validMatch = query.match(/is_valid_bst\s*\(\s*T\s*\)/i);
    if (validMatch) {
        const valid = isValidBST(root);
        return {
            success: valid,
            output: valid ? 'true.\n\nThe tree is a valid BST.' : 'false.\n\nThe tree is NOT a valid BST.'
        };
    }
    const sizeMatch = query.match(/size\s*\(\s*T\s*,\s*N\s*\)/i);
    if (sizeMatch) {
        const size = getSize(root);
        return {
            success: true,
            output: `true.\n\nN = ${size}`
        };
    }
    const heightMatch = query.match(/height\s*\(\s*T\s*,\s*H\s*\)/i);
    if (heightMatch) {
        const height = getHeight(root);
        return {
            success: true,
            output: `true.\n\nH = ${height}`
        };
    }
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
        return false; 
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
        if (node.left === null && node.right === null) {
            return { node: null, deleted: true };
        }
        if (node.left === null) {
            return { node: node.right, deleted: true };
        }
        if (node.right === null) {
            return { node: node.left, deleted: true };
        }
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
function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (root === null) {
        ctx.fillStyle = '#666';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Empty Tree - Type a Prolog command to start', canvas.width / 2, canvas.height / 2);
        return;
    }
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    const treeHeight = getHeight(root);
    const initialSpacing = Math.min(canvas.width / 4, 150);
    calculatePositions(root, canvas.width / 2, 50, initialSpacing);
    drawEdges(root);
    drawNodes(root);
    ctx.restore();
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
    if (node.left !== null) drawNodes(node.left);
    if (node.right !== null) drawNodes(node.right);
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
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
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, node.x, node.y);
}
function animateSearch(path, callback) {
    let index = 0;
    const animate = () => {
        if (index < path.length) {
            clearHighlights(root);
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
function handleCanvasClick(event) {
    if (isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - offsetX) / scale;
    const y = (event.clientY - rect.top - offsetY) / scale;
    const clickedNode = findNodeAt(root, x, y);
    if (clickedNode) {
        clearHighlights(root);
        clickedNode.highlighted = true;
        drawTree();
        showOutput(`Selected node: ${clickedNode.value}`, 'info');
    }
}
function handleWheel(event) {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(0.3, scale * zoomFactor), 3);
    offsetX = mouseX - worldX * newScale;
    offsetY = mouseY - worldY * newScale;
    scale = newScale;
    drawTree();
}
function handleMouseDown(event) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    lastOffsetX = offsetX;
    lastOffsetY = offsetY;
    canvas.style.cursor = 'grabbing';
}
function handleMouseMove(event) {
    if (!isDragging) return;
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    offsetX = lastOffsetX + dx;
    offsetY = lastOffsetY + dy;
    drawTree();
}
function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'default';
}
function findNodeAt(node, x, y) {
    if (node === null) return null;
    const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
    if (distance <= 25) return node;
    const leftResult = findNodeAt(node.left, x, y);
    if (leftResult) return leftResult;
    return findNodeAt(node.right, x, y);
}
document.addEventListener('keypress', (event) => {
    if (event.target.tagName !== 'INPUT' && event.key.match(/[a-zA-Z0-9]/)) {
        document.getElementById('prologInput').focus();
    }
});

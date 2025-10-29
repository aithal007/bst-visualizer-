/* ===========================================================================
   BINARY SEARCH TREE OPERATIONS IN PROLOG
   
   Data Representation:
   - Empty tree: empty
   - Node:       tree(Value, LeftChild, RightChild)
   
   Author: Prolog Project
   Date: October 30, 2025
   =========================================================================== */

/* ---------------------------------------------------------------------------
   CORE OPERATIONS: INSERT AND LOOKUP
   --------------------------------------------------------------------------- */

%% insert(+Value, +Tree, -NewTree)
%  Inserts Value into Tree to produce NewTree.
%  Assumes no duplicate values are inserted.

% Base case: Insert into an empty tree.
insert(V, empty, tree(V, empty, empty)).

% Case 1: Value is the same as root (do nothing, assumes no duplicates).
insert(V, tree(V, L, R), tree(V, L, R)).

% Case 2: Value is less than root (insert in left subtree).
insert(V, tree(Root, L, R), tree(Root, NewL, R)) :-
    V < Root,
    insert(V, L, NewL).

% Case 3: Value is greater than root (insert in right subtree).
insert(V, tree(Root, L, R), tree(Root, L, NewR)) :-
    V > Root,
    insert(V, R, NewR).

%% lookup(+Value, +Tree)
%  Succeeds if Value is found in the Tree.

% Base case: The value is at the root of this (sub)tree.
lookup(V, tree(V, _, _)).

% Recursive case 1: Value is smaller, look in the left subtree.
lookup(V, tree(Root, Left, _)) :-
    V < Root,
    lookup(V, Left).

% Recursive case 2: Value is larger, look in the right subtree.
lookup(V, tree(Root, _, Right)) :-
    V > Root,
    lookup(V, Right).

/* ---------------------------------------------------------------------------
   DELETE OPERATION
   --------------------------------------------------------------------------- */

%% delete(+Value, +Tree, -NewTree)
%  Deletes Value from Tree to produce NewTree.

% Case 0: Delete from an empty tree (do nothing).
delete(_, empty, empty).

% Case 1: Value is less than root (delete from left subtree).
delete(V, tree(Root, L, R), tree(Root, NewL, R)) :-
    V < Root,
    delete(V, L, NewL).

% Case 2: Value is greater than root (delete from right subtree).
delete(V, tree(Root, L, R), tree(Root, L, NewR)) :-
    V > Root,
    delete(V, R, NewR).

% Case 3: Value is at the root.
% 3a: Root is a leaf (no children).
delete(V, tree(V, empty, empty), empty).

% 3b: Root has only a right child.
delete(V, tree(V, empty, R), R) :-
    R \= empty.

% 3c: Root has only a left child.
delete(V, tree(V, L, empty), L) :-
    L \= empty.

% 3d: Root has two children.
%    We find the in-order successor (smallest value in the right subtree),
%    replace the root with it, and delete the successor from the right subtree.
delete(V, tree(V, L, R), tree(Successor, L, NewR)) :-
    L \= empty,
    R \= empty,
    find_min(R, Successor),
    delete(Successor, R, NewR).

%% find_min(+Tree, -MinValue)
%  Finds the minimum value (the leftmost node) in a non-empty tree.
%  This is a helper for delete/3.

% Base case: The leftmost node is the minimum.
find_min(tree(V, empty, _), V).

% Recursive case: Keep going left.
find_min(tree(_, Left, _), Min) :-
    Left \= empty,
    find_min(Left, Min).

/* ---------------------------------------------------------------------------
   TRAVERSAL OPERATIONS
   --------------------------------------------------------------------------- */

%% inorder(+Tree, -List)
%  Performs an in-order (Left-Value-Right) traversal.
%  For a BST, this produces a sorted list.
inorder(empty, []).
inorder(tree(V, L, R), List) :-
    inorder(L, LeftList),
    inorder(R, RightList),
    append(LeftList, [V | RightList], List).

%% preorder(+Tree, -List)
%  Performs a pre-order (Value-Left-Right) traversal.
preorder(empty, []).
preorder(tree(V, L, R), List) :-
    preorder(L, LeftList),
    preorder(R, RightList),
    append([V | LeftList], RightList, List).

%% postorder(+Tree, -List)
%  Performs a post-order (Left-Right-Value) traversal.
postorder(empty, []).
postorder(tree(V, L, R), List) :-
    postorder(L, LeftList),
    postorder(R, RightList),
    append(LeftList, RightList, TempList),
    append(TempList, [V], List).

/* ---------------------------------------------------------------------------
   UTILITY OPERATIONS
   --------------------------------------------------------------------------- */

%% find_max(+Tree, -MaxValue)
%  Finds the maximum value (the rightmost node) in a non-empty tree.
find_max(tree(V, _, empty), V).
find_max(tree(_, _, Right), Max) :-
    Right \= empty,
    find_max(Right, Max).

%% size(+Tree, -N)
%  Calculates the total number of nodes (N) in the Tree.
size(empty, 0).
size(tree(_, L, R), N) :-
    size(L, N_L),
    size(R, N_R),
    N is N_L + N_R + 1.

%% height(+Tree, -H)
%  Calculates the height (H) of the Tree. An empty tree has height 0.
height(empty, 0).
height(tree(_, L, R), H) :-
    height(L, H_L),
    height(R, H_R),
    max(H_L, H_R, MaxH),
    H is MaxH + 1.

% Helper for height/2
max(A, B, A) :- A >= B.
max(A, B, B) :- A < B.

%% build_tree(+List, -Tree)
%  A convenient predicate to build a Tree from a List of values.
build_tree([], empty).
build_tree([H|T], Tree) :-
    build_tree(T, TempTree),
    insert(H, TempTree, Tree).

/* ---------------------------------------------------------------------------
   VALIDATION PREDICATE
   --------------------------------------------------------------------------- */

%% is_valid_bst(+Tree)
%  Checks if the given Tree satisfies BST properties.
%  A valid BST must have all values in the left subtree < root
%  and all values in the right subtree > root.
is_valid_bst(Tree) :-
    is_valid_bst_helper(Tree, _, _).

% Helper predicate: is_valid_bst_helper(+Tree, -Min, -Max)
% Returns the minimum and maximum values in the tree.
is_valid_bst_helper(empty, inf, -inf).
is_valid_bst_helper(tree(V, L, R), Min, Max) :-
    is_valid_bst_helper(L, MinL, MaxL),
    is_valid_bst_helper(R, MinR, MaxR),
    % Check BST property
    (L = empty ; MaxL < V),
    (R = empty ; MinR > V),
    % Calculate overall min and max
    min_value(MinL, V, Min),
    max_value(MaxR, V, Max).

% Helper predicates for min/max calculation
min_value(inf, V, V) :- !.
min_value(V, _, V).

max_value(-inf, V, V) :- !.
max_value(V, _, V).

/* ---------------------------------------------------------------------------
   ADDITIONAL UTILITY PREDICATES
   --------------------------------------------------------------------------- */

%% count_leaves(+Tree, -Count)
%  Counts the number of leaf nodes in the tree.
count_leaves(empty, 0).
count_leaves(tree(_, empty, empty), 1).
count_leaves(tree(_, L, R), Count) :-
    (L \= empty ; R \= empty),
    count_leaves(L, CountL),
    count_leaves(R, CountR),
    Count is CountL + CountR.

%% contains_all(+List, +Tree)
%  Checks if all values in List are present in Tree.
contains_all([], _).
contains_all([H|T], Tree) :-
    lookup(H, Tree),
    contains_all(T, Tree).

%% tree_to_list(+Tree, -List)
%  Alias for inorder traversal (produces sorted list).
tree_to_list(Tree, List) :-
    inorder(Tree, List).

%% print_tree(+Tree)
%  Pretty prints the tree structure (simple version).
print_tree(Tree) :-
    print_tree_helper(Tree, 0).

print_tree_helper(empty, _).
print_tree_helper(tree(V, L, R), Indent) :-
    NewIndent is Indent + 4,
    print_tree_helper(R, NewIndent),
    tab(Indent),
    write(V), nl,
    print_tree_helper(L, NewIndent).

/* ---------------------------------------------------------------------------
   END OF FILE
   --------------------------------------------------------------------------- */

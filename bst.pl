% Binary Search Tree in Prolog
% Representation:
% - empty for an empty tree
% - tree(Value, Left, Right) for a node

% -------------------------------
% Insert and Lookup
% -------------------------------

insert(V, empty, tree(V, empty, empty)).
insert(V, tree(V, L, R), tree(V, L, R)).
insert(V, tree(Root, L, R), tree(Root, NewL, R)) :-
    V < Root,
    insert(V, L, NewL).
insert(V, tree(Root, L, R), tree(Root, L, NewR)) :-
    V > Root,
    insert(V, R, NewR).

lookup(V, tree(V, _, _)).
lookup(V, tree(Root, L, _)) :-
    V < Root,
    lookup(V, L).
lookup(V, tree(Root, _, R)) :-
    V > Root,
    lookup(V, R).

% -------------------------------
% Delete
% -------------------------------

delete(_, empty, empty).

delete(V, tree(Root, L, R), tree(Root, NewL, R)) :-
    V < Root,
    delete(V, L, NewL).

delete(V, tree(Root, L, R), tree(Root, L, NewR)) :-
    V > Root,
    delete(V, R, NewR).

delete(V, tree(V, empty, empty), empty).

delete(V, tree(V, empty, R), R) :-
    R \= empty.

delete(V, tree(V, L, empty), L) :-
    L \= empty.

delete(V, tree(V, L, R), tree(Successor, L, NewR)) :-
    L \= empty,
    R \= empty,
    find_min(R, Successor),
    delete(Successor, R, NewR).

find_min(tree(V, empty, _), V).
find_min(tree(_, L, _), Min) :-
    L \= empty,
    find_min(L, Min).

% -------------------------------
% Traversals
% -------------------------------

inorder(empty, []).
inorder(tree(V, L, R), List) :-
    inorder(L, Left),
    inorder(R, Right),
    append(Left, [V | Right], List).

preorder(empty, []).
preorder(tree(V, L, R), List) :-
    preorder(L, Left),
    preorder(R, Right),
    append([V | Left], Right, List).

postorder(empty, []).
postorder(tree(V, L, R), List) :-
    postorder(L, Left),
    postorder(R, Right),
    append(Left, Right, Temp),
    append(Temp, [V], List).

% -------------------------------
% Utility Functions
% -------------------------------

find_max(tree(V, _, empty), V).
find_max(tree(_, _, R), Max) :-
    R \= empty,
    find_max(R, Max).

size(empty, 0).
size(tree(_, L, R), N) :-
    size(L, NL),
    size(R, NR),
    N is NL + NR + 1.

height(empty, 0).
height(tree(_, L, R), H) :-
    height(L, HL),
    height(R, HR),
    max(HL, HR, MaxH),
    H is MaxH + 1.

max(A, B, A) :- A >= B.
max(A, B, B) :- A < B.

build_tree([], empty).
build_tree([H | T], Tree) :-
    build_tree(T, Temp),
    insert(H, Temp, Tree).

% -------------------------------
% Validation
% -------------------------------

is_valid_bst(Tree) :-
    is_valid_bst_helper(Tree, _, _).

is_valid_bst_helper(empty, inf, -inf).
is_valid_bst_helper(tree(V, L, R), Min, Max) :-
    is_valid_bst_helper(L, MinL, MaxL),
    is_valid_bst_helper(R, MinR, MaxR),
    (L = empty ; MaxL < V),
    (R = empty ; MinR > V),
    min_value(MinL, V, Min),
    max_value(MaxR, V, Max).

min_value(inf, V, V) :- !.
min_value(V, _, V).

max_value(-inf, V, V) :- !.
max_value(V, _, V).

% -------------------------------
% Extra Utilities
% -------------------------------

count_leaves(empty, 0).
count_leaves(tree(_, empty, empty), 1).
count_leaves(tree(_, L, R), Count) :-
    (L \= empty ; R \= empty),
    count_leaves(L, CL),
    count_leaves(R, CR),
    Count is CL + CR.

contains_all([], _).
contains_all([H | T], Tree) :-
    lookup(H, Tree),
    contains_all(T, Tree).

tree_to_list(Tree, List) :-
    inorder(Tree, List).

print_tree(Tree) :-
    print_tree_helper(Tree, 0).

print_tree_helper(empty, _).
print_tree_helper(tree(V, L, R), Indent) :-
    NewIndent is Indent + 4,
    print_tree_helper(R, NewIndent),
    tab(Indent),
    write(V), nl,
    print_tree_helper(L, NewIndent).

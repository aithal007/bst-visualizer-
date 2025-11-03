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
insert(V, empty, tree(V, empty, empty)).
insert(V, tree(V, L, R), tree(V, L, R)).
insert(V, tree(Root, L, R), tree(Root, NewL, R)) :-
    V < Root,
    insert(V, L, NewL).
insert(V, tree(Root, L, R), tree(Root, L, NewR)) :-
    V > Root,
    insert(V, R, NewR).
lookup(V, tree(V, _, _)).
lookup(V, tree(Root, Left, _)) :-
    V < Root,
    lookup(V, Left).
lookup(V, tree(Root, _, Right)) :-
    V > Root,
    lookup(V, Right).
/* ---------------------------------------------------------------------------
   DELETE OPERATION
   --------------------------------------------------------------------------- */
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
find_min(tree(_, Left, _), Min) :-
    Left \= empty,
    find_min(Left, Min).
/* ---------------------------------------------------------------------------
   TRAVERSAL OPERATIONS
   --------------------------------------------------------------------------- */
inorder(empty, []).
inorder(tree(V, L, R), List) :-
    inorder(L, LeftList),
    inorder(R, RightList),
    append(LeftList, [V | RightList], List).
preorder(empty, []).
preorder(tree(V, L, R), List) :-
    preorder(L, LeftList),
    preorder(R, RightList),
    append([V | LeftList], RightList, List).
postorder(empty, []).
postorder(tree(V, L, R), List) :-
    postorder(L, LeftList),
    postorder(R, RightList),
    append(LeftList, RightList, TempList),
    append(TempList, [V], List).
/* ---------------------------------------------------------------------------
   UTILITY OPERATIONS
   --------------------------------------------------------------------------- */
find_max(tree(V, _, empty), V).
find_max(tree(_, _, Right), Max) :-
    Right \= empty,
    find_max(Right, Max).
size(empty, 0).
size(tree(_, L, R), N) :-
    size(L, N_L),
    size(R, N_R),
    N is N_L + N_R + 1.
height(empty, 0).
height(tree(_, L, R), H) :-
    height(L, H_L),
    height(R, H_R),
    max(H_L, H_R, MaxH),
    H is MaxH + 1.
max(A, B, A) :- A >= B.
max(A, B, B) :- A < B.
build_tree([], empty).
build_tree([H|T], Tree) :-
    build_tree(T, TempTree),
    insert(H, TempTree, Tree).
/* ---------------------------------------------------------------------------
   VALIDATION PREDICATE
   --------------------------------------------------------------------------- */
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
/* ---------------------------------------------------------------------------
   ADDITIONAL UTILITY PREDICATES
   --------------------------------------------------------------------------- */
count_leaves(empty, 0).
count_leaves(tree(_, empty, empty), 1).
count_leaves(tree(_, L, R), Count) :-
    (L \= empty ; R \= empty),
    count_leaves(L, CountL),
    count_leaves(R, CountR),
    Count is CountL + CountR.
contains_all([], _).
contains_all([H|T], Tree) :-
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
/* ---------------------------------------------------------------------------
   END OF FILE
   --------------------------------------------------------------------------- */

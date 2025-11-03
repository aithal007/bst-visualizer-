/* ===========================================================================
   TEST FILE FOR BINARY SEARCH TREE OPERATIONS
   This file contains example queries and test cases for the BST implementation.
   Load both bst.pl and this file to run the tests.
   Usage: ?- [bst], [test_bst].
   =========================================================================== */
:- ['bst.pl'].
/* ---------------------------------------------------------------------------
   EXAMPLE TESTS
   --------------------------------------------------------------------------- */
test_basic_insert :-
    write('Test 1: Basic Insert'), nl,
    insert(50, empty, T1),
    insert(30, T1, T2),
    insert(70, T2, T3),
    insert(20, T3, T4),
    insert(40, T4, T5),
    insert(60, T5, T6),
    insert(80, T6, T7),
    write('Tree built: '), write(T7), nl,
    write('Test passed!'), nl, nl.
test_lookup :-
    write('Test 2: Lookup'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree),
    (lookup(40, Tree) -> write('Found 40: PASS') ; write('Found 40: FAIL')), nl,
    (lookup(99, Tree) -> write('Found 99: FAIL') ; write('Found 99 (not present): PASS')), nl,
    write('Test passed!'), nl, nl.
test_traversals :-
    write('Test 3: Traversals'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree),
    inorder(Tree, InList),
    write('Inorder:   '), write(InList), nl,
    preorder(Tree, PreList),
    write('Preorder:  '), write(PreList), nl,
    postorder(Tree, PostList),
    write('Postorder: '), write(PostList), nl,
    write('Test passed!'), nl, nl.
test_delete :-
    write('Test 4: Delete'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree),
    write('Original tree (inorder): '),
    inorder(Tree, L1), write(L1), nl,
    write('Deleting leaf node (20): '),
    delete(20, Tree, T1),
    inorder(T1, L2), write(L2), nl,
    write('Deleting node with one child (30 after 20 deleted): '),
    delete(30, T1, T2),
    inorder(T2, L3), write(L3), nl,
    write('Deleting node with two children (50): '),
    delete(50, Tree, T3),
    inorder(T3, L4), write(L4), nl,
    write('Test passed!'), nl, nl.
test_utilities :-
    write('Test 5: Utility Functions'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree),
    find_min(Tree, Min),
    write('Minimum value: '), write(Min), nl,
    find_max(Tree, Max),
    write('Maximum value: '), write(Max), nl,
    size(Tree, Size),
    write('Tree size: '), write(Size), nl,
    height(Tree, Height),
    write('Tree height: '), write(Height), nl,
    count_leaves(Tree, Leaves),
    write('Leaf count: '), write(Leaves), nl,
    write('Test passed!'), nl, nl.
test_validation :-
    write('Test 6: BST Validation'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], ValidTree),
    (is_valid_bst(ValidTree) -> 
        write('Valid BST recognized: PASS') ; 
        write('Valid BST recognized: FAIL')), nl,
    InvalidTree = tree(50, tree(60, empty, empty), tree(40, empty, empty)),
    (is_valid_bst(InvalidTree) -> 
        write('Invalid BST rejected: FAIL') ; 
        write('Invalid BST rejected: PASS')), nl,
    write('Test passed!'), nl, nl.
test_edge_cases :-
    write('Test 7: Edge Cases'), nl,
    write('Empty tree size: '),
    size(empty, S1), write(S1), nl,
    write('Empty tree height: '),
    height(empty, H1), write(H1), nl,
    insert(42, empty, SingleNode),
    write('Single node inorder: '),
    inorder(SingleNode, L1), write(L1), nl,
    write('Single node is valid BST: '),
    (is_valid_bst(SingleNode) -> write('YES') ; write('NO')), nl,
    write('Test passed!'), nl, nl.
run_all_tests :-
    write('========================================'), nl,
    write('  BINARY SEARCH TREE TEST SUITE'), nl,
    write('========================================'), nl, nl,
    test_basic_insert,
    test_lookup,
    test_traversals,
    test_delete,
    test_utilities,
    test_validation,
    test_edge_cases,
    write('========================================'), nl,
    write('  ALL TESTS COMPLETED!'), nl,
    write('========================================'), nl.
/* ---------------------------------------------------------------------------
   INTERACTIVE EXAMPLES
   --------------------------------------------------------------------------- */
example1 :-
    write('Example 1: Build tree from list'), nl,
    build_tree([15, 10, 20, 8, 12, 17, 25], Tree),
    write('Tree: '), write(Tree), nl,
    write('Sorted elements: '),
    inorder(Tree, List),
    write(List), nl.
example2 :-
    write('Example 2: Complete workflow'), nl,
    build_tree([50, 30, 70, 20, 40], Tree1),
    write('Initial tree: '), inorder(Tree1, L1), write(L1), nl,
    insert(60, Tree1, Tree2),
    write('After inserting 60: '), inorder(Tree2, L2), write(L2), nl,
    delete(30, Tree2, Tree3),
    write('After deleting 30: '), inorder(Tree3, L3), write(L3), nl,
    write('Tree height: '), height(Tree3, H), write(H), nl,
    write('Tree size: '), size(Tree3, S), write(S), nl.
example3 :-
    write('Example 3: Pretty print'), nl,
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree),
    print_tree(Tree).
/* ---------------------------------------------------------------------------
   PERFORMANCE TESTS (for larger trees)
   --------------------------------------------------------------------------- */
generate_numbers(0, []).
generate_numbers(N, [H|T]) :-
    N > 0,
    H is N * 7 mod 100,  
    N1 is N - 1,
    generate_numbers(N1, T).
test_performance :-
    write('Performance Test: Building tree with 100 nodes'), nl,
    generate_numbers(100, Numbers),
    build_tree(Numbers, Tree),
    size(Tree, Size),
    write('Tree size: '), write(Size), nl,
    height(Tree, Height),
    write('Tree height: '), write(Height), nl.
/* ---------------------------------------------------------------------------
   HELPFUL QUERIES TO TRY
   --------------------------------------------------------------------------- */
/*
   Try these queries in the Prolog interpreter:
   1. Run all tests:
      ?- run_all_tests.
   2. Build a tree and explore it:
      ?- build_tree([50, 30, 70, 20, 40, 60, 80], T), inorder(T, L).
   3. Check if value exists:
      ?- build_tree([10, 5, 15, 3, 7], T), lookup(7, T).
   4. Delete and see result:
      ?- build_tree([50, 30, 70], T), delete(30, T, T2), inorder(T2, L).
   5. Validate a tree:
      ?- build_tree([8, 3, 10, 1, 6], T), is_valid_bst(T).
   6. Pretty print a tree:
      ?- build_tree([50, 30, 70, 20, 40, 60, 80], T), print_tree(T).
   7. Get tree statistics:
      ?- build_tree([5, 3, 7, 2, 4, 6, 8], T), 
         size(T, S), height(T, H), count_leaves(T, L),
         format('Size: ~w, Height: ~w, Leaves: ~w~n', [S, H, L]).
*/

/* ===========================================================================
   PROLOG HTTP SERVER FOR BST VISUALIZER
   This server provides a web interface to interact with the Prolog BST
   implementation through HTTP endpoints.
   Requirements:
   - SWI-Prolog with http library
   To run:
   1. Load this file: ?- [server].
   2. Start server: ?- start_server(8080).
   3. Open browser: http://localhost:8080
   =========================================================================== */
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_files)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- ['bst.pl'].
/* ---------------------------------------------------------------------------
   HTTP ROUTE DEFINITIONS
   --------------------------------------------------------------------------- */
:- http_handler(root(.), http_redirect(see_other, '/index.html'), []).
:- http_handler(root('index.html'), serve_file('index.html'), []).
:- http_handler(root('styles.css'), serve_file('styles.css'), []).
:- http_handler(root('bst_visualizer.js'), serve_file('bst_visualizer.js'), []).
:- http_handler(root(api/insert), handle_insert, [method(post)]).
:- http_handler(root(api/delete), handle_delete, [method(post)]).
:- http_handler(root(api/lookup), handle_lookup, [method(post)]).
:- http_handler(root(api/traversal), handle_traversal, [method(post)]).
:- http_handler(root(api/build), handle_build, [method(post)]).
:- http_handler(root(api/stats), handle_stats, [method(post)]).
/* ---------------------------------------------------------------------------
   SERVER CONTROL
   --------------------------------------------------------------------------- */
start_server(Port) :-
    http_server(http_dispatch, [port(Port)]),
    format('~nBST Visualizer Server started on port ~w~n', [Port]),
    format('Open your browser to: http://localhost:~w~n~n', [Port]).
stop_server :-
    http_stop_server(_, []),
    format('Server stopped.~n').
/* ---------------------------------------------------------------------------
   FILE SERVING
   --------------------------------------------------------------------------- */
serve_file(File, Request) :-
    http_reply_file(File, [unsafe(true)], Request).
/* ---------------------------------------------------------------------------
   API HANDLERS
   --------------------------------------------------------------------------- */
handle_insert(Request) :-
    http_read_json_dict(Request, Data),
    Value = Data.value,
    Tree = Data.tree,
    json_to_tree(Tree, PrologTree),
    insert(Value, PrologTree, NewTree),
    tree_to_json(NewTree, JsonTree),
    reply_json_dict(_{
        success: true,
        tree: JsonTree,
        message: "Value inserted successfully"
    }).
handle_delete(Request) :-
    http_read_json_dict(Request, Data),
    Value = Data.value,
    Tree = Data.tree,
    json_to_tree(Tree, PrologTree),
    delete(Value, PrologTree, NewTree),
    tree_to_json(NewTree, JsonTree),
    reply_json_dict(_{
        success: true,
        tree: JsonTree,
        message: "Value deleted successfully"
    }).
handle_lookup(Request) :-
    http_read_json_dict(Request, Data),
    Value = Data.value,
    Tree = Data.tree,
    json_to_tree(Tree, PrologTree),
    (lookup(Value, PrologTree) ->
        Found = true,
        Message = "Value found in tree"
    ;
        Found = false,
        Message = "Value not found in tree"
    ),
    reply_json_dict(_{
        success: true,
        found: Found,
        message: Message
    }).
handle_traversal(Request) :-
    http_read_json_dict(Request, Data),
    Type = Data.type,
    Tree = Data.tree,
    json_to_tree(Tree, PrologTree),
    (   Type = "inorder" -> inorder(PrologTree, Result)
    ;   Type = "preorder" -> preorder(PrologTree, Result)
    ;   Type = "postorder" -> postorder(PrologTree, Result)
    ;   Result = []
    ),
    reply_json_dict(_{
        success: true,
        result: Result,
        type: Type
    }).
handle_build(Request) :-
    http_read_json_dict(Request, Data),
    Values = Data.values,
    build_tree(Values, Tree),
    tree_to_json(Tree, JsonTree),
    reply_json_dict(_{
        success: true,
        tree: JsonTree,
        message: "Tree built successfully"
    }).
handle_stats(Request) :-
    http_read_json_dict(Request, Data),
    Tree = Data.tree,
    json_to_tree(Tree, PrologTree),
    size(PrologTree, Size),
    height(PrologTree, Height),
    count_leaves(PrologTree, Leaves),
    (PrologTree = empty ->
        Min = null,
        Max = null
    ;
        find_min(PrologTree, Min),
        find_max(PrologTree, Max)
    ),
    (is_valid_bst(PrologTree) ->
        Valid = true
    ;
        Valid = false
    ),
    reply_json_dict(_{
        success: true,
        stats: _{
            size: Size,
            height: Height,
            leaves: Leaves,
            min: Min,
            max: Max,
            valid: Valid
        }
    }).
/* ---------------------------------------------------------------------------
   JSON CONVERSION HELPERS
   --------------------------------------------------------------------------- */
json_to_tree(null, empty) :- !.
json_to_tree("empty", empty) :- !.
json_to_tree(Json, tree(Value, Left, Right)) :-
    is_dict(Json),
    Value = Json.value,
    LeftJson = Json.left,
    RightJson = Json.right,
    json_to_tree(LeftJson, Left),
    json_to_tree(RightJson, Right).
tree_to_json(empty, null) :- !.
tree_to_json(tree(Value, Left, Right), Json) :-
    tree_to_json(Left, LeftJson),
    tree_to_json(Right, RightJson),
    Json = _{
        value: Value,
        left: LeftJson,
        right: RightJson
    }.
/* ---------------------------------------------------------------------------
   ERROR HANDLING
   --------------------------------------------------------------------------- */
:- multifile http:convert_reply_to_bytes/3.
http:convert_reply_to_bytes(json(Dict), Bytes, HdrExtra) :-
    with_output_to(codes(Bytes), json_write(current_output, Dict)),
    format(atom(CLen), '~w', [Bytes]),
    HdrExtra = [content_type('application/json'), content_length(CLen)].
/* ---------------------------------------------------------------------------
   UTILITY PREDICATES
   --------------------------------------------------------------------------- */
demo_tree(Tree) :-
    build_tree([50, 30, 70, 20, 40, 60, 80], Tree).
/* ---------------------------------------------------------------------------
   USAGE EXAMPLES
   --------------------------------------------------------------------------- */
/*
   To start the server:
   1. Start SWI-Prolog
   2. Load the server:
      ?- [server].
   3. Start the HTTP server on port 8080:
      ?- start_server(8080).
   4. Open your web browser to:
      http://localhost:8080
   5. To stop the server:
      ?- stop_server.
   Alternative ports:
   ?- start_server(3000).
   ?- start_server(5000).
   Testing from command line with curl:
   # Build tree
   curl -X POST http://localhost:8080/api/build \
     -H "Content-Type: application/json" \
     -d '{"values": [50, 30, 70, 20, 40]}'
   # Lookup value
   curl -X POST http://localhost:8080/api/lookup \
     -H "Content-Type: application/json" \
     -d '{"value": 30, "tree": {...}}'
*/
/* ---------------------------------------------------------------------------
   STANDALONE MODE (WITHOUT HTTP SERVER)
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   END OF FILE
   --------------------------------------------------------------------------- */

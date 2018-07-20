asTable = require ('as-table')

          asTable ([ { foo: true,  string: 'abcde',      num: 42 },
           { foo: false, string: 'qwertyuiop', num: 43 },
           {             string:  null,        num: 44 } ])

           console.log( asTable ([ { foo: true,  string: 'abcde',      num: 42 },
           { foo: false, string: 'qwertyuiop', num: 43 },
           {             string:  null,        num: 44 } ]));



var table= (
    [
     { " department_id ": 01," department_name ": " Electronics ",over_head_costs :10000},
     { " department_id ": 02," department_name ": " Books ",over_head_costs :1000},
     { " department_id ": 03," department_name ": " Clothes ",over_head_costs :3000},
     { " department_id ": 04," department_name ": " Movies ",over_head_costs :4000},
     { " department_id ": 05," department_name ": " Music ",over_head_costs :5500},
])           

console.log(asTable.configure({delimiter:'|'})(table));
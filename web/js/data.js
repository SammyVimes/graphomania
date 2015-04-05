/**
 * Created by Semyon on 05.04.2015.
 */

var result = {
    edges: [
        {"first_name":"Самсонов Вячеслав","second_name":"Сыромятников Михаил","coefficients":[{"id":1,"value":0.75},{"id":2,"value":0.23}],"people":1,"average":"0.66"},
        {"first_name":"Слабченко Михаил","second_name":"Сыромятников Михаил","coefficients":[{"id":1,"value":0.82},{"id":2,"value":0.62}],"people":0,"average":"0.48"},
        {"first_name":"Полякова Анастасия","second_name":"Рыжова Екатерина","coefficients":[{"id":1,"value":0.13},{"id":2,"value":0.11}],"people":1,"average":"0.41"},
        {"first_name":"Кулаков Илья","second_name":"Николенко Александр","coefficients":[{"id":1,"value":0.56},{"id":2,"value":0.62}],"people":0,"average":"0.39"},
        {"first_name":"Полякова Анастасия","second_name":"Слабченко Михаил","coefficients":[{"id":1,"value":0.58},{"id":2,"value":0.5}],"people":0,"average":"0.36"},
        {"first_name":"Кулаков Илья","second_name":"Сыромятников Михаил","coefficients":[{"id":1,"value":0.48}, {"id":2,"value":0.56}],"people":0,"average":"0.35"},
        {"first_name":"Сыромятников Михаил","second_name":"Табаков Андрей","coefficients":[{"id":1,"value":"­0.52"}, {"id":2,"value":0.66}],"people":1,"average":"0.38"},
        {"first_name":"Страхолис Василий","second_name":"Тихоненко Никита","coefficients":[{"id":1,"value":0.5},{"id":2,"value":0.01}],"people":0.5,"average":"0.34"},
        {"first_name":"Самсонов Вячеслав","second_name":"Слабченко Михаил","coefficients":[{"id":1,"value":0.77}, {"id":2,"value":0.23}],"people":0,"average":"0.33"},
        {"first_name":"Самсонов Вячеслав","second_name":"Табаков Андрей","coefficients":[{"id":1,"value":"­0.47"}, {"id":2,"value":0.43}],"people":1,"average":"0.32"},
        {"first_name":"Морев Константин","second_name":"Страхолис Василий","coefficients":[{"id":1,"value":0.33}, {"id":2,"value":0.59}],"people":0,"average":"0.31"}
    ]
};

var edges = result.edges;

var map = {};
result.nodes = [];

var nodes = result.nodes;

for (var i = 0; i < edges.length; i++) {
    var firstName = edges[i].first_name;
    var secondName = edges[i].second_name;
    var coefficients = edges[i].coefficients;
    coefficients.unshift({id: "people", value: edges[i].people});
    if (!map[firstName]) {
        nodes.push({name: firstName});
        map[firstName] = true;
    }
    if (!map[secondName]) {
        nodes.unshift({name: secondName});
        map[secondName] = true;
    }
}
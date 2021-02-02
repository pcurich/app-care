const helpers = {};

helpers.json = (context) => { return JSON.stringify(context);}

helpers.select = (selected, options) => {  return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');}

helpers.compare = (lvalue, operator, rvalue, options) => {

  var operators, result;

  if (arguments.length < 3) {
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  };

  if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
  }
  
  operators = {
      '==': function (l, r) { return l == r; },
      '===': function (l, r) { return l === r; },
      '!=': function (l, r) { return l != r; },
      '!==': function (l, r) { return l !== r; },
      '<': function (l, r) { return l < r; },
      '>': function (l, r) { return l > r; },
      '<=': function (l, r) { return l <= r; },
      '>=': function (l, r) { return l >= r; },
      'typeof': function (l, r) { return typeof l == r; }
  };
  
  if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }
  
  result = operators[operator](lvalue, rvalue);
  
  if (result) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
};

helpers.split = (data, regex) => { return data.split(regex).slice(-1,data.length); }

helpers.math = (lvalue, operator, rvalue) => {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue
  }[operator];
};

module.exports = helpers
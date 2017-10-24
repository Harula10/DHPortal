var functionArray = [        
        {"name" : "Abs", "hint" : "Returns the absolute value of same type for Numbers / returns the Modulus for Complex", "func_name" : "abs(x)"},
        {"name" : "Aggregate Function", "hint" : "Execute an aggregation function", "func_name" : "aggregation(function,attribute parameters)"},
        {"name" : "Append", "hint" : "Appends second parameter to first paramenter as string", "func_name" : "append(str1, str2)"},
        {"name" : "Arc Cosine", "hint" : "Inverse Cosine", "func_name" : "acos(x)"},
        //{"name" : "Arc Cosine Hyperbolic", "hint" : "Inverse Hyperbolic Cosine", "func_name" : "acosh(x)"},
        {"name" : "Arc Sine", "hint" : "Inverse Sine", "func_name" : "asin(x)"},
        //{"name" : "Arc Sine Hyperbolic", "hint" : "Inverse Hyperbolic Sine", "func_name" : "asinh(x)"},
        {"name" : "Arc Tangent", "hint" : "Inverse Tangent", "func_name" : "atan(x)"},
        {"name" : "Arc Tangent(2 parameters)", "hint" : "Inverse Tangent with 2 parameters", "func_name" : "atan2(y,x)"},
        //{"name" : "Arc Tangent Hyperbolic", "hint" : "Inverse Hyperbolic Tangent", "func_name" : "atanh(x)"},
        //{"name" : "Argument",  "hint" : "Argument of a complex number ",  "func_name" : "arg(c)"},
        //{"name" : "Binomial", "hint" : "Binomial coefficients", "func_name" : "binom(n,i)"},
        {"name" : "Ceiling", "hint" : "The smallest integer above the number", "func_name" : "ceil(x)"},
        //{"name" : "Complex PFMC", "hint" : "Converts a pair of real numbers to a complex number", "func_name" : "complex(x,y)"},
        //{"name" : "Complex conjugate", "hint" : "The complex conjugate of a number", "func_name" : "conj(c)"},
        {"name" : "Contains", "hint" : "Returns true if str contains the subStr at least once", "func_name" : "contains(str, subStr)"},
        {"name" : "ContainCount", "hint" : "Returns the number of occurrences of subStr within str", "func_name" : "containCount(str, subStr)"},
        {"name" : "Cosine", "hint" : "Cosine", "func_name" : "cos(x)"},
        {"name" : "Cosine Hyperbolic", "hint" : "Hyperbolic Cosine", "func_name" : "cosh(x)"},
        {"name" : "Current Year", "hint" : "Returns current year", "func_name" : "currentYear()"},
        {"name" : "Date", "hint" : "Returns current date", "func_name" : "date()"},
        {"name" : "DateTime", "hint" : "Returns current date in datetime format", "func_name" : "datetime()"},
        {"name" : "Exponential", "hint" : "The result of the exponential function (e^x)", "func_name" : "exp(x)"},
        {"name" : "Floor", "hint" : "The smallest integer below the number", "func_name" : "floor(x)"},
        //{"name" : "Func Generator", "hint" : "Gets a function from an input file", "func_name" : "funcGenerator(field,field,field,field)"},
        {"name" : "If", "hint" : "The if function; trueval will be returned if cond is >0 or True and falseval will be returned if cond is <= 0 or False", "func_name" : "if(cond, trueval, falseval)"},
        //{"name" : "Imaginary", "hint" : "Imaginary Component", "func_name" : "im(c)"},
        {"name" : "Index Of", "hint" : "Returns the position of the first occurrence of a specified value in a string", "func_name" : "indexof(str, subStr)"},
        {"name" : "Is Not Null", "hint" : "Tests if the argument is not null", "func_name" : "isNotNull(arg)"},
        {"name" : "Is Null", "hint" : "Tests if the argument is null", "func_name" : "isNull(arg)"},
        {"name" : "Is Numeric", "hint" : "Tests if the argument is numeric", "func_name" : "isNumeric(str)"},
        {"name" : "Length", "hint" : "Returns the length of a string", "func_name" : "len(str)"},
        {"name" : "Log", "hint" : "Logarithm base 10", "func_name" : "log(x)"},
        {"name" : "Ln", "hint" : "Natural Logarithm", "func_name" : "ln(x)"},
        {"name" : "Modulus", "hint" : "Calculates the modulus x % y of the arguments", "func_name" : "mod(x,y)"},
        {"name" : "Null", "hint" : "Returns null value", "func_name" : "null()"},
        //{"name" : "Polar", "hint" : "Constructs a complex number from modulus and argument", "func_name" : "polar(r, theta)"},
        {"name" : "Power", "hint" : "Computes the power of an number", "func_name" : "pow(x,y)"},
        //{"name" : "Real", "hint" : "Real Component", "func_name" : "re(c)"},
        {"name" : "Replace", "hint" : "In the first argument, find all occurences of the second argument and replace them with the third one ", "func_name" : "replace(str, text1, text2)"},
        {"name" : "Round", "hint" : "The closest integer to the argument. The second argument is optional and refers to decimal places", "func_name" : "round(x,[y])"},
        {"name" : "Sine", "hint" : "Sine", "func_name" : "sin(x)"},
        {"name" : "Sine Hyperbolic", "hint" : "Hyperbolic Sine", "func_name" : "sinh(x)"},
        {"name" : "Square Root", "hint" : "The square root of the parameter", "func_name" : "sqrt(x)"},
        {"name" : "Substring", "hint" : "Extract substring of first argument. Second argument is starting index, third argument is optional and it is the ending index", "func_name" : "substring(str, start, [end])"},
        {"name" : "Tangent", "hint" : "Tangent", "func_name" : "tan(x)"},
        {"name" : "Tangent Hyperbolic", "hint" : "Hyperbolic Tangent", "func_name" : "tanh(x)"},
        {"name" : "To Date", "hint" : "Converts a string to date format given a specific template pattern, e.g. \"MM/DD/YYYY\", for the input data, provided by the user", "func_name" : "todate(str, pattern)"},
        {"name" : "To Double", "hint" : "Returns the double value of a number", "func_name" : "todouble(x)"},
        {"name" : "To Integer", "hint" : "Returns the integer value of a number", "func_name" : "toint(x)"},
        {"name" : "To Lowercase", "hint" : "Converts a string to lowercase letters", "func_name" : "tolower(str)"},
        {"name" : "To String", "hint" : "Converts a data type to text", "func_name" : "tostring(data)"},
        {"name" : "To Uppercase", "hint" : "Converts a string to uppercase letters", "func_name" : "toupper(str)"}
    ];
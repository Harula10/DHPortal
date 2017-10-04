<?php	
	$f = $_GET['func'];
	$function = preg_replace('/\s+/', '', $f);
	$pattern = '/(?<=[\)\d]|[\']|\w)[\+\-\/*]/';
	//Get operators
	$operators = null;
	preg_match_all($pattern, $function, $operators,PREG_SET_ORDER, 0);
	$del = preg_split($pattern, $function);
	
	$csv = "";
	$j = 0;
	for($i = 0; $i < count($del); $i++){
		if(!is_numeric($del[$i])){
			if($csv!="" && $operators){
				$csv = $csv . $operators[$j][0];
				$j++;
			}
			if(strpos($del[$i], "(") === false){ //if the parameter is not a function then:
				if (strpos($del[$i], "'") === false && $del[$i]!='true' && $del[$i]!='false') { //if the parameter is not a string or a boolean
					$csv = $csv . "_mipmap_function_ "; //placeholder
				}else{
					$csv = $csv . $del[$i];
				}
			}else{ //else split the function
				$csv = $csv . splitExpression($del[$i]);
			}
		}else{
			if($csv!="" && $operators){
				$csv = $csv . $operators[$j][0];
				$j++;
			}
			$csv = $csv . $del[$i];
		}
	}
	echo $csv;

	function check($parameter){
		//strpos($parameter, "'") === false
	    if (!is_string($parameter)) { 
			if (!is_numeric($parameter) & $parameter!='true' & $parameter!='false') { 
				$parameter = "_mipmap_function_ "; 
			}
	    }
	    return $parameter;
	}
	
	function replaceVar($parameter){
	    if(preg_match("(=|>|<|<=|>=|!=)",$parameter)){
		    $s = null;
            preg_match_all("/(=|>|<|<=|>=|!=).*/", $parameter, $s, PREG_SET_ORDER, 0);
            $meta = $s[0][0];
			$str = preg_replace("/(?<=\)).*/","", $parameter);
			$parameter = check($str).$meta;
		}else{
		    $parameter = check($parameter);
		}
		return $parameter;
	}
	
	function splitExpression($function){
	    $func = null;
    	preg_match_all("/^[^\(]*/", $function, $func, PREG_SET_ORDER, 0);
    	$f = $func[0][0];
    	$result = preg_replace("/^[^\(]*/","", $function);
    	$result = preg_replace("/\[|\]/","", $result);
    	
    	if(substr($result,0,1)=="(" && substr($result,-1)==")"){
    	    $result = substr($result,0,-1);
		    $result = substr($result,1);
    	}
    	$parameters = preg_split('/,(?![^()]*(?:\([^()]*\))?\))/', $result);
    	
    	for($i = 0; $i < count($parameters); $i++){
			if(preg_match("/.*\(.*\)/",$parameters[$i])){
				$meta = "";
				if(preg_match("(==|>|<|<=|>=|!=)",$parameters[$i])){
				    $s = null;
    	            preg_match_all("/(?<=\)).*/", $parameters[$i], $s, PREG_SET_ORDER, 0);
    	            $meta = $s[0][0];
					$parameters[$i] = preg_replace("/(?<=\)).*/","", $parameters[$i]);
				}
				$parameters[$i] = splitExpression($parameters[$i]).$meta;
				//echo $parameters[$i]."\n";
			}
	    }
			
	    return replaceFunctionText($f,$parameters);
	}
	
	function replaceFunctionText($functionName, array $parameters){
		/*Constants*/
		$POSTGRES_DATE_FUNCTION = "current_date";
		$POSTGRES_CURRENT_YEAR_FUNCTION = "extract(year from current_date)";
		$output = "";
		
		switch ($functionName) {
			case "abs":
				$output = "abs(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "aggregation":
				//adds | to all logical operators
				$op = "|"; 
				$parameters[0] = preg_replace_callback( '/(==|!=|<|>|<=|>=)/', 
					function($match) use ($op) { return (($op.$match[0])); }, $parameters[1]); 
				$output = "aggregation(".replaceVar($parameters[0]).",".replaceVar($parameters[1]).")";
				break;
			case "append":
				$output = replaceVar($parameters[0]) ."||". replaceVar($parameters[1]);
				break;
			case "acos":
				$output = "acos(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "asin":
				$output = "asin(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "atan":
				$output = "atan(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "atan2":
				$output = "atan2(cast(" .replaceVar($parameters[0]). " as float), cast(" .replaceVar($parameters[1]). " as float))";
				break;
			case "ceil":
				$output = "ceil(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "contains":
				$output = replaceVar($parameters[0]) ." like '%". replaceVar(str_replace("\'","",$parameters[1])). "%'";
				break;
			case "containCount":
				$output = "(length(" .replaceVar($parameters[0]). ")-length(regexp_replace(" .replaceVar($parameters[0]).",".replaceVar($parameters[1])."," ."''". "," ."'g'))) / length(" .replaceVar($parameters[1]). ")";
				break; 
			case "cos":
				$output = "cos(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "cosh":
				$output = "(exp(cast(" .replaceVar($parameters[0]). " as float))+exp(-cast(" .replaceVar($parameters[1]). " as float)))/2";
				break;
			case "currentYear":
				$output = $POSTGRES_CURRENT_YEAR_FUNCTION;
				break;
			case "date":
				$output = $POSTGRES_DATE_FUNCTION;
				break;
			case "datetime":
				$output = "date_trunc('second',localtimestamp)";
				break;
			case "exp":
				$output = "exp(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "floor":
				$output = "floor(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "if":
				if(strpos($parameters[0], '==')!== false){
					$parameters[0] = str_replace("==","=",$parameters[0]);
				}
				$output = "case when " .replaceVar($parameters[0]). " then " .replaceVar($parameters[1]). " else " .replaceVar($parameters[2]). " end";                
				break;
			case "indexof":
				$output = "position(" .replaceVar($parameters[1]). " in " .replaceVar($parameters[0]). ")";
				break;
			case "isNull":
				$output = "".replaceVar($parameters[0]) ." is null";
				break;
			case "isNotNull":
				$output = "".replaceVar($parameters[0]) ." is not null";
				break;
			case "len":
				$output = "length(" .replaceVar($parameters[0]). ")";
				break;
			case "log":
				$output = "log(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "ln":
				$output = "ln(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "mod":
				$output = "mod(round(cast(" .replaceVar($parameters[0]). " as numeric)), round(cast(" .replaceVar($parameters[1]). " as numeric)))";
				break;
			case "null":
				$output = "null";
				break;
			case "pow":
				$output = "power(cast(" .replaceVar($parameters[0]). " as float), cast(" .replaceVar($parameters[1]). " as float))";
				break;
			case "replace":
				$output = "replace(". replaceVar($parameters[0]) .",". " " .replaceVar($parameters[1]).", ".replaceVar($parameters[2]). ")";
				break;                    
			case "round":
				//optional second parameter
				if ($parameters.length==2){
					$output = "round(cast(" .replaceVar($parameters[0]). " as numeric),cast(cast(" .replaceVar($parameters[1]). " as numeric) as integer))";
				}else{
					$output = "round(cast(" .replaceVar($parameters[0]). " as float))";
				}
				break;
			case "sin":
				$output = "sin(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "sinh":
				$output = "(exp(cast(" .replaceVar($parameters[0]). " as float))-exp(-cast(" .replaceVar($parameters[0]). " as float)))/2";
				break;
			case "sqrt":
				$output = "sqrt(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "substring":
				//optional third parameter
				if (count($parameters)==3){
				   $output = "substring(" .replaceVar($parameters[0]). " from " .replaceVar($parameters[1]). "+1 for " .replaceVar($parameters[2]). "-" .replaceVar($parameters[1]). ")"; 
				}else{
					$output = "substring(" .replaceVar($parameters[0]). " from " .replaceVar($parameters[1]). "+ 1)"; 
				}
				break;
			case "tan":
				$output = "tan(cast(" .replaceVar($parameters[0]). " as float))";
				break;
			case "tanh":
				$output = "(exp(cast(" .replaceVar($parameters[0]). " as float))-exp(-cast(" .replaceVar($parameters[0]). " as float)))/(exp(cast(" .replaceVar($parameters[0]). " as float))+exp(-cast(" .replaceVar($parameters[0]). " as float)))";
				break;
			case "todate":
				$output = "to_date(" .replaceVar($parameters[0]). "," .replaceVar($parameters[1]). ")";
				break;
			case "todouble":
				$output = "cast(" .replaceVar($parameters[0]). " as float)";
				break;
			case "toint":
				$output = "round(cast(" .replaceVar($parameters[0]). " as numeric))";
				break;
			case "tolower":
				$output = "lower(" .replaceVar($parameters[0]). ")";
				break;
			case "tostring":
				$output = "cast(" .replaceVar($parameters[0]). " as text)";
				break;
			case "toupper":
				$output = "upper(" .replaceVar($parameters[0]). ")";
				break;
			case "isNumeric":
				$output = "".replaceVar($parameters[0]). " ~ \'^[-]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$\'"; 
				break;
			default:
				break;
		}
		return $output;
	}
	
?>
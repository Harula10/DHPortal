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
	
	
function splitExpression($function){
	//$function: if(x==0,'YES',value)
	$parameters = preg_split('/(?=.+)(\(|,|==|>|<|<=|>=|!=|\))/', $function);
	//$parameters: [if,x,0,'YES',value]
	$functionName = $parameters[0];
	$replaced_params = replaceVars($parameters);
	//$replaced_params: [if,_mipmap_function_,0,'YES',_mipmap_function_]
	for($i = 1; $i < count($parameters); $i++){
		$function = str_replace($parameters[$i],$replaced_params[$i],$function);
	}
  
	//$function: if(_mipmap_function_==0,'YES',_mipmap_function_)
	$array = preg_split('/[(,)]/', $function);
	//array: [if,_mipmap_function_==0,'YES',_mipmap_function_]
	return replaceFunctionText($functionName,$array);
  
	}

	function replaceVars($parameters){
		//Whenever parameters are non strings, replace the parameter with the placeholder
		for($i = 1; $i < count($parameters); $i++){
			if (strpos($parameters[$i], "'") === false) { //if the parameter is not a string
				if (!is_numeric($parameters[$i]) && $parameters[$i]!='true' && $parameters[$i]!='false') { 
					$parameters[$i] = "_mipmap_function_ "; //placeholder
				}
			}
		}		
		return $parameters;
	}
	
	function replaceFunctionText($functionName, array $parameters){
		/*Constants*/
		$POSTGRES_DATE_FUNCTION = "current_date";
		$POSTGRES_CURRENT_YEAR_FUNCTION = "extract(year from current_date)";
		$output = "";
		
		switch ($functionName) {
			case "abs":
				$output = "abs(cast(" .$parameters[1]. " as float))";
				break;
			case "aggregation":
				//adds | to all logical operators
				$op = "|"; 
				$parameters[1] = preg_replace_callback( '/(==|!=|<|>|<=|>=)/', 
					function($match) use ($op) { return (($op.$match[1])); }, $parameters[2]); 
				$output = "aggregation(".$parameters[1].",".$parameters[2].")";
				break;
			case "append":
				$output = $parameters[1] ."||". $parameters[2];
				break;
			case "acos":
				$output = "acos(cast(" .$parameters[1]. " as float))";
				break;
			case "asin":
				$output = "asin(cast(" .$parameters[1]. " as float))";
				break;
			case "atan":
				$output = "atan(cast(" .$parameters[1]. " as float))";
				break;
			case "atan2":
				$output = "atan2(cast(" .$parameters[1]. " as float), cast(" .$parameters[2]. " as float))";
				break;
			case "ceil":
				$output = "ceil(cast(" .$parameters[1]. " as float))";
				break;
			case "contains":
				$output = $parameters[1] ." like '%". str_replace("\'","",$parameters[2]). "%'";
				break;
			case "containCount":
				$output = "(length(" .$parameters[1]. ")-length(regexp_replace(" .$parameters[1].",".$parameters[2]."," ."''". "," ."'g'))) / length(" .$parameters[2]. ")";
				break; 
			case "cos":
				$output = "cos(cast(" .$parameters[1]. " as float))";
				break;
			case "cosh":
				$output = "(exp(cast(" .$parameters[1]. " as float))+exp(-cast(" .$parameters[2]. " as float)))/2";
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
				$output = "exp(cast(" .$parameters[1]. " as float))";
				break;
			case "floor":
				$output = "floor(cast(" .$parameters[1]. " as float))";
				break;
			case "if":
				if(strpos($parameters[1], '==')!== false){
					$parameters[1] = str_replace("==","=",$parameters[1]);
				}
				$output = "case when " .$parameters[1]. " then " .$parameters[2]. " else " .$parameters[3]. " end";                
				break;
			case "indexof":
				$output = "position(" .$parameters[2]. " in " .$parameters[1]. ")";
				break;
			case "isNull":
				$output = "".$parameters[1] ." is null";
				break;
			case "isNotNull":
				$output = "".$parameters[1] ." is not null";
				break;
			case "len":
				$output = "length(" .$parameters[1]. ")";
				break;
			case "log":
				$output = "log(cast(" .$parameters[1]. " as float))";
				break;
			case "ln":
				$output = "ln(cast(" .$parameters[1]. " as float))";
				break;
			case "mod":
				$output = "mod(round(cast(" .$parameters[1]. " as numeric)), round(cast(" .$parameters[2]. " as numeric)))";
				break;
			case "null":
				$output = "null";
				break;
			case "pow":
				$output = "power(cast(" .$parameters[1]. " as float), cast(" .$parameters[2]. " as float))";
				break;
			case "replace":
				$output = "replace(". $parameters[1] .",". " " .$parameters[2].", ".$parameters[3]. ")";
				break;                    
			case "round":
				//optional second parameter
				if ($parameters.length==2){
					$output = "round(cast(" .$parameters[1]. " as numeric),cast(cast(" .$parameters[2]. " as numeric) as integer))";
				}else{
					$output = "round(cast(" .$parameters[1]. " as float))";
				}
				break;
			case "sin":
				$output = "sin(cast(" .$parameters[1]. " as float))";
				break;
			case "sinh":
				$output = "(exp(cast(" .$parameters[1]. " as float))-exp(-cast(" .$parameters[1]. " as float)))/2";
				break;
			case "sqrt":
				$output = "sqrt(cast(" .$parameters[1]. " as float))";
				break;
			case "substring":
				//optional third parameter
				if (count($parameters)==3){
				   $output = "substring(" .$parameters[1]. " from " .$parameters[2]. "+1 for " .$parameters[3]. "-" .$parameters[2]. ")"; 
				}else{
					$output = "substring(" .$parameters[1]. " from " .$parameters[2]. "+ 1)"; 
				}
				break;
			case "tan":
				$output = "tan(cast(" .$parameters[1]. " as float))";
				break;
			case "tanh":
				$output = "(exp(cast(" .$parameters[1]. " as float))-exp(-cast(" .$parameters[1]. " as float)))/(exp(cast(" .$parameters[1]. " as float))+exp(-cast(" .$parameters[1]. " as float)))";
				break;
			case "todate":
				$output = "to_date(" .$parameters[1]. "," .$parameters[2]. ")";
				break;
			case "todouble":
				$output = "cast(" .$parameters[1]. " as float)";
				break;
			case "toint":
				$output = "round(cast(" .$parameters[1]. " as numeric))";
				break;
			case "tolower":
				$output = "lower(" .$parameters[1]. ")";
				break;
			case "tostring":
				$output = "cast(" .$parameters[1]. " as text)";
				break;
			case "toupper":
				$output = "upper(" .$parameters[1]. ")";
				break;
			case "isNumeric":
				$output = "".$parameters[1]. " ~ \'^[-]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$\'"; 
				break;
			default:
				break;
		}
		return $output;
	}
	
?>
<?php	
	$function = $_GET['func'];
	$pattern = '/(?<=[\)\d])[\+\-\/*]/';
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
			$csv = $csv . splitExpression($del[$i]);
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
		$functions = preg_split('/[\(,\)]/', $function);
		$functionName = $functions[0];
		
		$params = [];
		for($i = 1; $i < count($functions); $i++){
			$params[] = trim($functions[$i]);
		}		
		return replaceFunctionText($functionName,$params);
	}
	
	function replaceFunctionText($functionName, array $parameters){
		/*Constants*/
		$COMMA_REPLACEMENT = "#COMMA_CHAR#";
		$POSTGRES_DATE_FUNCTION = "current_date";
		$POSTGRES_CURRENT_YEAR_FUNCTION = "extract(year from current_date)";
		$output = "";
		switch ($functionName) {
			case "abs":
				$output = "abs(cast(" .$parameters[0]. " as float))";
				break;
			case "aggregation":
				$output = "aggregation(".$parameters[0].$COMMA_REPLACEMENT.$parameters[1].")";
				break;
			case "append":
				$output = $parameters[0] ."||". $parameters[1];
				break;
			case "acos":
				$output = "acos(cast(" .$parameters[0]. " as float))";
				break;
			case "asin":
				$output = "asin(cast(" .$parameters[0]. " as float))";
				break;
			case "atan":
				$output = "atan(cast(" .$parameters[0]. " as float))";
				break;
			case "atan2":
				$output = "atan2(cast(" .$parameters[0]. " as float)" .$COMMA_REPLACEMENT. " cast(" .$parameters[1]. " as float))";
				break;
			case "ceil":
				$output = "ceil(cast(" .$parameters[0]. " as float))";
				break;
			case "contains":
				$output = $parameters[0] ." like '%". str_replace("\'","",$parameters[1]). "%'";
				break;
			case "containCount":
				$output = "(length(" .$parameters[0]. ")-length(regexp_replace(" .$parameters[0].$COMMA_REPLACEMENT.$parameters[1].$COMMA_REPLACEMENT ."''". $COMMA_REPLACEMENT ."'g'))) / length(" .$parameters[1]. ")";
				break; 
			case "cos":
				$output = "cos(cast(" .$parameters[0]. " as float))";
				break;
			case "cosh":
				$output = "(exp(cast(" .$parameters[0]. " as float))+exp(-cast(" .$parameters[0]. " as float)))/2";
				break;
			case "currentYear":
				$output = $POSTGRES_CURRENT_YEAR_FUNCTION;
				break;
			case "date":
				$output = $POSTGRES_DATE_FUNCTION;
				break;
			case "datetime":
				$output = "date_trunc('second'" .$COMMA_REPLACEMENT. "localtimestamp)";
				break;
			case "exp":
				$output = "exp(cast(" .$parameters[0]. " as float))";
				break;
			case "floor":
				$output = "floor(cast(" .$parameters[0]. " as float))";
				break;
			case "if":
				if(strpos($parameters[0], '==')!== false){
					$parameters[0] = str_replace("==","=",$parameters[0]);
				}
				$output = "case when " .$parameters[0]. " then " .$parameters[1]. " else " .$parameters[2]. " end";                
				break;
			case "indexof":
				$output = "position(" .$parameters[1]. " in " .$parameters[0]. ")";
				break;
			case "isNull":
				$output = $parameters[0] ." is null";
				break;
			case "isNotNull":
				$output = $parameters[0] ." is not null";
				break;
			case "len":
				$output = "length(" .$parameters[0]. ")";
				break;
			case "log":
				$output = "log(cast(" .$parameters[0]. " as float))";
				break;
			case "ln":
				$output = "ln(cast(" .$parameters[0]. " as float))";
				break;
			case "mod":
				$output = "mod(round(cast(" .$parameters[0]. " as numeric))" .$COMMA_REPLACEMENT. " round(cast(" .$parameters[1]. " as numeric)))";
				break;
			case "null":
				$output = "null";
				break;
			case "pow":
				$output = "power(cast(" .$parameters[0]. " as float)" .$COMMA_REPLACEMENT. " cast(" .$parameters[1]. " as float))";
				break;
			case "replace":
				$output = "replace(". $parameters[0] .$COMMA_REPLACEMENT. " " .$parameters[1].$COMMA_REPLACEMENT. " " .$parameters[2]. ")";
				break;                    
			case "round":
				//optional second parameter
				if ($parameters.length==2){
					$output = "round(cast(" .$parameters[0]. " as numeric)" .$COMMA_REPLACEMENT. " cast(cast(" .$parameters[1]. " as numeric) as integer))";
				}else{
					$output = "round(cast(" .$parameters[0]. " as float))";
				}
				break;
			case "sin":
				$output = "sin(cast(" .$parameters[0]. " as float))";
				break;
			case "sinh":
				$output = "(exp(cast(" .$parameters[0]. " as float))-exp(-cast(" .$parameters[0]. " as float)))/2";
				break;
			case "sqrt":
				$output = "sqrt(cast(" .$parameters[0]. " as float))";
				break;
			case "substring":
				//optional third parameter
				if (count($parameters)==3){
				   $output = "substring(" .$parameters[0]. " from " .$parameters[1]. "+1 for " .$parameters[2]. "-" .$parameters[1]. ")"; 
				}else{
					$output = "substring(" .$parameters[0]. " from " .$parameters[1]. "+ 1)"; 
				}
				break;
			case "tan":
				$output = "tan(cast(" .$parameters[0]. " as float))";
				break;
			case "tanh":
				$output = "(exp(cast(" .$parameters[0]. " as float))-exp(-cast(" .$parameters[0]. " as float)))/(exp(cast(" .$parameters[0]. " as float))+exp(-cast(" .$parameters[0]. " as float)))";
				break;
			case "todate":
				$output = "to_date(" .$parameters[0]. $COMMA_REPLACEMENT .$parameters[1]. ")";
				break;
			case "todouble":
				$output = "cast(" .$parameters[0]. " as float)";
				break;
			case "toint":
				$output = "round(cast(" .$parameters[0]. " as numeric))";
				break;
			case "tolower":
				$output = "lower(" .$parameters[0]. ")";
				break;
			case "tostring":
				$output = "cast(" .$parameters[0]. " as text)";
				break;
			case "toupper":
				$output = "upper(" .$parameters[0]. ")";
				break;
			case "isNumeric":
				$output = $parameters[0]. " ~ \'^[-]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$\'"; 
				break;
			default:
				break;
		}
		return $output;
	}
	
?>
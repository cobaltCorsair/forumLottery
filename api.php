<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
	
	$secretKey = "MybbLottery";
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$input = json_decode(file_get_contents("php://input"), true);
		
		if (!isset($input["token"]) || $input["token"] != $secretKey) {
			echo json_encode(["error" => $input["token"]]);
			http_response_code(401);
			echo json_encode(["error" => "Unauthorized"]);
			exit();
		}
		
		$method = $input["method"];
		$key = $input["key"];
		$value = isset($input["value"]) ? $input["value"] : null;
		
		$filename = "storage.json";
		
		if (!file_exists($filename)) {
			file_put_contents($filename, json_encode([]));
		}
		
		$data = json_decode(file_get_contents($filename), true);
		
		if ($method == "storage.get") {
			if (array_key_exists($key, $data)) {
				echo json_encode(["response" => ["storage" => ["data" => [$key => $data[$key]]]]]);
				} else {
				echo json_encode(["response" => null]);
			}
			} elseif ($method == "storage.set") {
			$data[$key] = $value;
			file_put_contents($filename, json_encode($data));
			echo json_encode(["response" => "success"]);
			} else {
			http_response_code(400);
			echo json_encode(["error" => "Invalid method"]);
		}
		} else {
		http_response_code(405);
		echo json_encode(["error" => "Method not allowed"]);
	}
?>

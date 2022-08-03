<?php
//ini_set('display_errors',1);

class SampleController
{
    public $code = 200;
    public $url;
    public $request_body;

    function __construct()
    {
        $this->url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://').$_SERVER['HTTP_HOST'].mb_substr($_SERVER['SCRIPT_NAME'],0,-9).basename(__FILE__, ".php")."/";
        $this->request_body = json_decode(mb_convert_encoding(file_get_contents('php://input'),"UTF8","ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN"),true);
    }

    public function get()
    {
      $id = $_GET["id"]?$_GET["id"]:null;
      if($this->is_set($id)){
          return $this->getById($id);
      }else{
          return $this->getAll();
      }
    }

    private function getById($id)
    {
        return [$id."で一つ分呼び出された"];
    }
    private function getAll()
    {
        return ["全部","呼び出された"];
    }

    public function post()
    {
        $param = $this->request_body;
        if(!array_key_exists("id",$param) || !array_key_exists("name",$param) || !array_key_exists("age",$param)){
            $this->code = 400;
            return ["error" => [
                "type" => "invalid_param"
            ]];
        }
        return $param;

    }

    public function put($id=null)
    {
      if(!$this->is_set($id)){ //(null or 空白)であればエラー(400)
        $this->code = 400;
        return ["error" => [
            "type" => "invalid_url"
        ]];
      }
      return [$id, "上書きされた"];

    }

    public function delete($id=null)
    {
        if(!$this->is_set($id)){
            $this->code = 400;
            return ["error" => [
                "type" => "invalid_url"
            ]];
        }
        return [$id, "消された"];
    }

    public function options()
    {
        header("Access-Control-Allow-Methods: OPTIONS,GET,HEAD,POST,PUT,DELETE");
        header("Access-Control-Allow-Headers: Content-Type");
        return [];
    }

    private function is_set($value)
    {
        return !(is_null($value) || $value === "");
    }
}
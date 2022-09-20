<?php

/**
 * 教員にメール通知する
 * @param string $type 新規質問/メッセージ
 * @param string $messageText 本文
 * @param int $questionIndex 質問番号
 * @return bool 送信成功||失敗
 */
function sendEmailToInstructors($type, $messageText, $questionIndex){
  mb_language("Japanese");
  mb_internal_encoding("UTF-8");

  include(dirname( __FILE__)."/../../../envs/instructorsAddress.php"); //教員のメールアドレス
  $to = $instructorsAddress;
  
  if($type === "newQuestion"){
    $subject = "[SUSANbot] 新しい質問 が投稿されました";
  }else if($type === "message"){
    $subject = "[SUSANbot] メッセージ が投稿されました";
  }
  $message = $messageText."\r\n \r\n".
              "確認する↓\r\n".
              "https://liff.line.me/1657189212-Lwpmnpld/question/".$questionIndex."\r\n ";

  $headers = "From: noreply@susan.next.jp";

  return mb_send_mail($to, $subject, $message, $headers); 
}
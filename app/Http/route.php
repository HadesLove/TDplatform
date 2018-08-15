<?php

Route::get('/', function (\Illuminate\Http\Request $request) {
    return response('home page');
})->middleware(['web']);


// 错误监控
Route::get('logs','\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


Route::any('wechat', 'WechatController@serve');

Route::any('wechat/login','WechatController@wechatLogin');
Route::get('wechat/oauth/callback','WechatController@OauthCallback');
Route::any('auto/login','WechatController@AutoLogin');

// 用户信息
Route::get('personal/info','UserController@personalCenter');
// 绑定支付宝账号
Route::post('binding/alipay','UserController@bindingAliPay');

// 获取验证码
Route::post('send/message','Message\MessageController@getCode');
// 检验验证码
Route::post('check/code','Message\MessageController@checkCode');

// 应用列表
Route::get('app/list','ApplyController@appList');

Route::post('withdraw','WithdrawController@withdraw');
Route::get('withdraw/list','WithdrawController@withdrawList');
Route::get('income/list','WithdrawController@incomeList');
Route::post('income/receive','WithdrawController@incomeReceive');

Route::get('amWiki','UserController@amWiki');

Route::group(['middleware' => ['wechat.oauth']], function () {
  Route::get('/auth','LoginController@wechatAuth');
});

/*需要微信登录的接口*/
Route::group(['middleware' => 'WeChatToken','prefix' => 'auth'],function(){

});
//后台接口
Route::group(
    ['prefix' => 'admin', 'namespace'=>'Admin'], function(){
        Route::post('auth', 'LoginController@login'); //登录接口
    Route::group(['prefix' => 'app'], function(){
        Route::get('list', 'ApplyController@index'); //应用列表
        Route::get('add', 'ApplyController@add'); //添加应用
    });
    Route::group(['prefix' => 'user'], function(){
        Route::get('list', 'UserController@index'); //用户列表
        Route::get('update-status', 'UserController@updateStatus'); //更改用户状态
    });
    Route::get('withdraw/list', 'UserController@withdrawList'); //提现明细
    Route::get('list', 'AdminController@index'); //管理员列表
    Route::post('add', 'AdminController@add'); //管理员添加
    Route::post('update', 'AdminController@updateStatus'); //更改账户状态
});

Route::post('session/test','UserController@test');
Route::get('session/check','UserController@check');
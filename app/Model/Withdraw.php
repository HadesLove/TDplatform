<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    protected $table = 'withdraw';
    protected $primaryKey = 'withdraw_id';
    public  $timestamps = false;
    protected $fillable = array('user_id','money','status','note');

    protected $dates = ['created_at', 'updated_at'];

    public function getList($where){
        $withdrawModel = \DB::table($this->table)
            ->leftJoin('user', 'user.user_id', '=', 'withdraw.user_id')
            ->select('withdraw.withdraw_id as user_id', 'withdraw.money', 'withdraw.status', 'withdraw.admin_name', 'withdraw.created_at', 'withdraw.updated_at', 'user.mobile', 'user.nickname', 'user.alipay', 'user.alipay_name', 'user.status as us_status');
        if ($where){
            foreach ($where as $item){
                $withdrawModel->where($item[0], $item[1], $item[2]);
            }
        }
        return $withdrawModel->paginate(20)->toArray();
    }
}
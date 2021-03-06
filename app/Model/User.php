<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'user';
    protected $primaryKey = 'user_id';
    public  $timestamps = false;
    protected $fillable = array('openid', 'head_img','nickname','money','alipay','alipay_name','cumulative_amount','mobile','type');
}

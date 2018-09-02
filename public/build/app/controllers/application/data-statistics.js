/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('data-statistics', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            type:1,
            name:'',
            status:'',
            startTime:'',
            endTime:'',
            page:'1'
        },
        ajaxParams2 = {
            type:0,
            name:'',
            status:'',
            startTime:'',
            endTime:'',
            page:'1'
        },
        paginData = { // �洢��ҳ����
            currentPage :'',
            from:'',
            to:'',
            lastPage:'',
            perPage:10,
            total:0,
            inputCurPage:''
        },
        paginData2 = { // �洢��ҳ����
            currentPage :'',
            from:'',
            to:'',
            lastPage:'',
            perPage:10,
            total:0,
            inputCurPage:''
        };

    $scope.addAjaxParams = {
        type:'',
        name:'',
        logo:'',
        money:'',
        num:'',
        rank:'',
        note:'',
        packName:'',
        urlscheme:'',
    },
        $scope.state = {
            isShowAdd:'',//�Ƿ���ʾ
            isiOS:1,// Ӧ������ 0Ϊ��׿ 1ΪiOS
            iOSreword:0,//ios�ܽ�����
            androidreword:0,//��׿�ܽ�����
            iOSNum:0,//ios���û���
            androidNum:0,//��׿���û���
            file:'',

            // ��ҳios
            hasMoreData:false, //�Ƿ���ʣ���ҳ����
            showPagin:false, // �Ƿ���ʾ��ҳ
            currentPage:'', // ��ǰҳ��
            lastPage:'',// ���һҳ
            total:'',//��ҳ��
            dataNone: false,
            // ��ҳandroid
            hasMoreData2:false, //�Ƿ���ʣ���ҳ����
            showPagin2:false, // �Ƿ���ʾ��ҳ
            currentPage2:'', // ��ǰҳ��
            lastPage2:'',// ���һҳ
            total2:'',//��ҳ��
            dataNone2: false
        };

    // ��ȡ�б�����
    $scope.list = [];
    $scope.search = {
        name:'',
        page:'1',
        page2:'1',
        inputCurPage2:''
    };
    var getiOSApplicationList = function(opt, cb, cberr) {
            ApplicationService.getApplicationList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getiOSApplicationListHandler = function(data) {
            $scope.iOSlist = data.data;
            $scope.state.iOSreword = data.rewards;
            $scope.state.iOSNum = data.iosCount;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // �����ҳ����
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    var getApplicationList = function(opt, cb, cberr) {
        ApplicationService.getApplicationList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
        },
        getAndoridApplicationListHandler = function(data) {
            $scope.androidlist = data.data;
            $scope.state.androidreword = data.rewards;
            $scope.state.androidNum = data.androidCount;
            if(data.data.length == 0){
                $scope.state.dataNone2 = true;
            }else{
                $scope.state.dataNone2 = false;
            }

            comparePagin2(paginData2, data); // �����ҳ����
            $scope.state.showPagin2 = (data.lastPage > 1);
            $scope.state.hasMoreData2 = (data.currentPage < data.lastPage);
        };
    //ajaxParams.type = 0;
    getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
    //ajaxParams2.type = 1;
    getApplicationList(ajaxParams2, getAndoridApplicationListHandler);


    // ƥ��ģ���еĲ��� �� �������
    var matchAjaxParams = function(modelParams, reqParams) {
            var temp = '';
            for(var key in modelParams) {
                temp = modelParams[key] !== ''?modelParams[key]:'';
                reqParams[key] = temp;
            }
            return reqParams;
        },
    // �ԱȲ���ʾ��ҳ����
        comparePagin = function(target, source) {
            target.currentPage = parseInt(source.currentPage, 10);
            target.from = parseInt(source.from, 10);
            target.to = parseInt(source.to, 10);
            target.lastPage = parseInt(source.lastPage, 10);
            target.perPage = parseInt(source.perPage, 10);
            target.total = parseInt(source.total, 10);

            $scope.state.currentPage = target.currentPage;
            $scope.state.lastPage = target.lastPage;
            $scope.state.total = target.total;

            return target;
        },
    // �ԱȲ���ʾ��ҳ����
    comparePagin2 = function(target, source) {
        target.currentPage = parseInt(source.currentPage, 10);
        target.from = parseInt(source.from, 10);
        target.to = parseInt(source.to, 10);
        target.lastPage = parseInt(source.lastPage, 10);
        target.perPage = parseInt(source.perPage, 10);
        target.total = parseInt(source.total, 10);

        $scope.state.currentPage2 = target.currentPage;
        $scope.state.lastPage2 = target.lastPage;
        $scope.state.total2 = target.total;

        return target;
    };

    $scope.cb = {
        uploadImgBanner:function(data) {
            uploadImg({base64File:data} ,uploadBanner);
        }
    };

    $scope.act = {
        // ���ذ�ť�¼�
        doSearch: function() {
            $scope.search.page = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            ajaxParams.type = 1;
            getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            ajaxParams.type = 0;
            getApplicationList(ajaxParams, getAndoridApplicationListHandler);
        },
        goPrePage:function() { // ��һҳ
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            }
        },
        goNextPage:function() { // ��һҳ
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            }
        },
        goToPage:function() {
            var isNum = /^\d+$/gi,
                num = 0;
            if(isNum.test($.trim( $scope.search.inputCurPage ))) {
                num = parseInt($scope.search.inputCurPage, 10);
                if(num < 1) {
                    num = 1;
                }
                if(num > paginData.lastPage){
                    num = paginData.lastPage;
                }
                $scope.search.page = num;
            }else {
                $scope.search.page = 1;
            }
            ajaxParams.page = $scope.search.page;
            getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },

        goPrePage2:function() { // ��һҳ
            if(paginData2.currentPage > 1) {
                $scope.search.page = parseInt(paginData2.currentPage, 10) - 1;
                ajaxParams2.page = $scope.search.page;
                getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
            }
        },
        goNextPage2:function() { // ��һҳ
            if(paginData2.currentPage < paginData2.lastPage) {
                $scope.search.page = parseInt(paginData2.currentPage, 10) + 1;
                ajaxParams2.page = $scope.search.page;
                getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
            }
        },
        goToPage2:function() {
            var isNum = /^\d+$/gi,
                num = 0;
            if(isNum.test($.trim( $scope.search.inputCurPage2 ))) {
                num = parseInt($scope.search.inputCurPage2, 10);
                if(num < 1) {
                    num = 1;
                }
                if(num > paginData2.lastPage){
                    num = paginData2.lastPage;
                }
                $scope.search.page2 = num;
            }else {
                $scope.search.page2 = 1;
            }
            ajaxParams2.page = $scope.search.page2;
            getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
        },
        keyGoToPage2:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },

        addApplication: function () {
            $scope.state.isShowAdd = true;//��ʾ�����б�
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //����ʾ������
                    ,closeBtn: false
                    ,area: ['680px','auto']//��ʼ��Layer�߶�
                    ,shade: 0.8
                    ,btn: ['���', 'ȡ��']
                    ,content: $('#addApp')
                    ,yes: function(){
                        $scope.addAjaxParams.type = $scope.state.isiOS;

                        //function showResponse(data) {
                        //    console.log(data)
                        //}
                        //var options = {
                        //    url:'/admin/app/add',
                        //    beforeSubmit:  $scope.addAjaxParams,  //�ύǰ����
                        //    success:       showResponse,  //�������
                        //    resetForm: true,
                        //    dataType:  'json'
                        //};
                        //
                        //$('.index_form').submit(function() { //ע�������index_form
                        //    $(this).ajaxSubmit(options);
                        //    return false;//��ֹdialog �Զ��ر�
                        //});
                        //
                        //return false;

                        //var formdata = new FormData($$('form')[0]);
                        $.ajax({
                            url: '/admin/app/add',
                            type: 'GET  ',
                            datatype: 'json',
                            data: $scope.addAjaxParams,
                            cache:false,
                            traditional: true,
                            contentType: false,
                            processData: false,
                            success: function (data) {},
                            error: function () {}
                        });

                        //if(!_validate.isRequired(postData.weight)) {
                        //layer.alert('����дȨ��');
                        //return false;
                        //}

                        //getApplication($scope.addAjaxParams,addApplicationHandler);
                        $scope.state.showEditList = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        console.log($scope.state.number);
                        $scope.state.showEditList = false;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    ,success: function(layero){
                        layero.find('.layui-layer-btn').css('text-align', 'center');
                        $('.layui-layer-content').css({'height':'auto','overflow':'visible'});
                    }
                });
            },0);
        },
    };
});